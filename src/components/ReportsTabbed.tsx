import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Download, Eye, Calendar, TrendingUp, FileBarChart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLoading } from '../contexts/LoadingContext';
import { ReportsSkeleton } from './skeletons/ReportsSkeleton';


export function Reports() {
  const { isLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('recent');
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  const [reportFiles, setReportFiles] = useState<string[]>([]);
  const [reportMeta, setReportMeta] = useState<Record<string, { cases: number; outbreaks: number }>>({});
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      try {
        const res = await fetch('http://localhost:5000/reports/list');
        const data = await res.json();
        setReportFiles(data.reports || []);
        // Fetch summary for each report
        const meta: Record<string, { cases: number; outbreaks: number }> = {};
        await Promise.all(
          (data.reports || []).map(async (filename: string) => {
            try {
              const resp = await fetch(`http://localhost:5000/reports/download/${filename}`);
              const text = await resp.text();
              const lines = text.split(/\r?\n/);
              let cases = 0, outbreaks = 0;
              for (const l of lines) {
                if (l.startsWith('# total_cases:')) cases = parseInt(l.split(':')[1]);
                if (l.startsWith('# total_outbreaks:')) outbreaks = parseInt(l.split(':')[1]);
              }
              meta[filename] = { cases, outbreaks };
            } catch {
              meta[filename] = { cases: 0, outbreaks: 0 };
            }
          })
        );
        setReportMeta(meta);
      } catch (e) {
        setReportFiles([]);
        setReportMeta({});
      }
      setLoadingReports(false);
    };
    fetchReports();
  }, []);

  const [viewOpen, setViewOpen] = useState(false);
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleDownload = async (filename: string, format: 'csv' | 'pdf') => {
    try {
      const url =
        format === 'pdf'
          ? `http://localhost:5000/reports/download/${filename}.pdf`
          : `http://localhost:5000/reports/download/${filename}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to download report');
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename + (format === 'pdf' ? '.pdf' : '');
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(a.href);
    } catch (err) {
      alert('Error downloading report');
    }
  };

  const handleView = async (filename: string) => {
    setCsvError(null);
    setCsvData(null);
    try {
      const response = await fetch(`http://localhost:5000/reports/download/${filename}`);
      if (!response.ok) throw new Error('Failed to fetch report');
      const text = await response.text();
      // Parse CSV (simple split, assumes no commas in values)
      const rows = text.trim().split(/\r?\n/).filter(row => !row.startsWith('#')).map(row => row.split(','));
      setCsvData(rows);
      setViewOpen(true);
    } catch (err) {
      setCsvError('Error loading report');
      setViewOpen(true);
    }
  };

  const renderReportCard = (filename: string) => {
    const isWeekly = filename.startsWith('weekly');
    const isMonthly = filename.startsWith('monthly');
    const meta = reportMeta[filename] || { cases: 0, outbreaks: 0 };
    const highlight = meta.cases > 0 || meta.outbreaks > 0;
    return (
      <Card
        key={filename}
        className={`relative dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow`}
      >
        {/* Green indicator dot (top right) */}
        {highlight && (
          <span className="absolute right-2 top-2 w-3 h-3 rounded-full bg-green-500 border-2 border-white z-10" title="Cases or outbreaks present"></span>
        )}
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-gray-900 dark:text-white">{filename}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {isWeekly ? 'Weekly' : isMonthly ? 'Monthly' : 'Other'}
                </Badge>
                <span className="ml-2">Cases: <b>{meta.cases}</b> | Outbreaks: <b>{meta.outbreaks}</b></span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700" onClick={() => handleView(filename)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700" onClick={() => handleDownload(filename, 'csv')}>
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700" onClick={() => handleDownload(filename, 'pdf')}>
                <Download className="h-4 w-4" /> PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Filtering logic
  const filterReports = (files: string[]) => {
    if (!showOnlyActive) return files;
    return files.filter(f => {
      const meta = reportMeta[f] || { cases: 0, outbreaks: 0 };
      return meta.cases > 0 || meta.outbreaks > 0;
    });
  };

  return (
    <>
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          {csvError && <div className="text-red-500">{csvError}</div>}
          {csvData ? (
            <div className="overflow-auto max-h-[60vh]">
              <table className="min-w-full text-xs border">
                <thead>
                  <tr>
                    {csvData[0].map((col, idx) => (
                      <th key={idx} className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border px-2 py-1">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !csvError && <div>Loading...</div>}
          <DialogClose asChild>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-end items-center max-w-6xl mx-auto mb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={e => setShowOnlyActive(e.target.checked)}
              className="accent-green-600 w-4 h-4"
            />
            Show only reports with cases/outbreaks
          </label>
        </div>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-gray-900 dark:text-white flex items-center gap-2">
                  <FileBarChart className="h-7 w-7" />
                  Reports & Publications
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Access epidemiological reports and analytics</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Generate New Report
              </Button>
            </div>
          </div>

          {/* Report Templates */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Weekly Reports</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">{reportFiles.filter(f => f.startsWith('weekly')).length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Monthly Reports</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">{reportFiles.filter(f => f.startsWith('monthly')).length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Special Reports</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">{reportFiles.filter(f => !f.startsWith('weekly') && !f.startsWith('monthly')).length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
              <TabsTrigger value="recent" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Monthly
              </TabsTrigger>
              <TabsTrigger value="special" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Special
              </TabsTrigger>
            </TabsList>

            {/* Weekly Tab */}
            <TabsContent value="recent" className="space-y-4">
              {loadingReports ? <div>Loading reports...</div> : filterReports(reportFiles.filter(f => f.startsWith('weekly'))).map(renderReportCard)}
            </TabsContent>

            {/* Monthly Tab */}
            <TabsContent value="monthly" className="space-y-4">
              {loadingReports ? <div>Loading reports...</div> : filterReports(reportFiles.filter(f => f.startsWith('monthly'))).map(renderReportCard)}
            </TabsContent>

            {/* Special Tab */}
            <TabsContent value="special" className="space-y-4">
              {loadingReports ? <div>Loading reports...</div> : filterReports(reportFiles.filter(f => !f.startsWith('weekly') && !f.startsWith('monthly'))).map(renderReportCard)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
