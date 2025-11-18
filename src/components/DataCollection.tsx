import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { WifiOff, Wifi, AlertCircle, CheckCircle, User, Save, Droplet, Cloud, Thermometer, Calendar, MapPin } from 'lucide-react';
import { UserRole } from '../App';
import { useLoading } from '../contexts/LoadingContext';
import { DataCollectionSkeleton } from './skeletons/DataCollectionSkeleton';

interface DataCollectionProps {
  userRole: UserRole;
}

export function DataCollection({ userRole }: DataCollectionProps) {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <DataCollectionSkeleton />;
  }

  const [isOnline, setIsOnline] = useState(true);
  const [formData, setFormData] = useState({
    patientAge: '',
    patientGender: '',
    symptoms: [] as string[],
    disease: '',
    county: '',
    subCounty: '',
    avgTemp: '',
    avgRainfall: '',
    meanNdvi: '',
    reportDate: new Date().toISOString().split('T')[0],
    cases: '1',
    notes: ''
  });
  const [savedOffline, setSavedOffline] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const symptoms = [
    'Fever', 'Diarrhea', 'Vomiting', 'Headache', 'Muscle Pain', 
    'Dehydration', 'Abdominal Pain', 'Chills', 'Fatigue'
  ];

  const diseases = ['Cholera', 'Malaria', 'Typhoid', 'Other'];

  const counties = ['Baringo', 'Turkana', 'Kisumu', 'Kilifi', 'Nairobi', 'Machakos', 'Mombasa', 'Kakamega'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isOnline) {
      // Simulate API submission
      console.log('Submitting to server:', formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        resetForm();
        setLoading(false);
      }, 3000);
    } else {
      // Save offline
      localStorage.setItem('offline_reports', JSON.stringify([
        ...(JSON.parse(localStorage.getItem('offline_reports') || '[]')),
        { ...formData, id: Date.now(), timestamp: new Date().toISOString() }
      ]));
      setSavedOffline(true);
      setTimeout(() => {
        setSavedOffline(false);
        resetForm();
        setLoading(false);
      }, 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      patientAge: '',
      patientGender: '',
      symptoms: [],
      disease: '',
      county: '',
      subCounty: '',
      avgTemp: '',
      avgRainfall: '',
      meanNdvi: '',
      reportDate: new Date().toISOString().split('T')[0],
      cases: '1',
      notes: ''
    });
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Case Report Submission</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {userRole === 'chv' ? 'Submit suspected disease cases from your community' : 'Submit case reports'}
            </p>
          </div>
          <Badge className={isOnline ? 'bg-green-600' : 'bg-orange-600'}>
            {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {isOnline ? 'Online' : 'Offline Mode'}
          </Badge>
        </div>

        {/* Success Messages */}
        {submitted && (
          <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-green-900 dark:text-green-100">Report submitted successfully!</p>
              <p className="text-sm text-green-700 dark:text-green-300">Thank you for your contribution to outbreak surveillance.</p>
            </div>
          </div>
        )}

        {savedOffline && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-orange-900 dark:text-orange-100">Report saved offline!</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">It will be automatically synced when you're back online.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Demographics */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Patient Age <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="number"
                    required
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter age in years"
                  />
                </div>
                <div>
                  <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Gender <span className="text-red-600">*</span>
                  </Label>
                  <select
                    required
                    value={formData.patientGender}
                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Disease Selection */}
              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Suspected Disease <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {diseases.map(disease => (
                    <button
                      key={disease}
                      type="button"
                      onClick={() => setFormData({ ...formData, disease })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.disease === disease
                          ? 'border-red-600 bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-100'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {disease}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Symptoms (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {symptoms.map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-2 rounded-lg border transition-colors text-sm ${
                        formData.symptoms.includes(symptom)
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Average Temperature (°C) <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    step="0.1"
                    required
                    value={formData.avgTemp}
                    onChange={(e) => setFormData({ ...formData, avgTemp: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="e.g., 27.5"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Weekly average temperature for your area</p>
              </div>

              {/* Rainfall */}
              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Average Rainfall (mm) <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Cloud className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    step="0.1"
                    required
                    value={formData.avgRainfall}
                    onChange={(e) => setFormData({ ...formData, avgRainfall: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="e.g., 45.2"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Weekly total rainfall in millimeters</p>
              </div>

              {/* NDVI */}
              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Vegetation Index (NDVI) <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    required
                    value={formData.meanNdvi}
                    onChange={(e) => setFormData({ ...formData, meanNdvi: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="e.g., 0.45"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Value between 0 and 1 (0 = no vegetation, 1 = dense vegetation)</p>
              </div>

              {/* Number of Cases */}
              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Number of Cases <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formData.cases}
                  onChange={(e) => setFormData({ ...formData, cases: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">How many cases are you reporting?</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    County <span className="text-red-600">*</span>
                  </Label>
                  <select
                    required
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select county</option>
                    {counties.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Sub-County <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="text"
                    required
                    value={formData.subCounty}
                    onChange={(e) => setFormData({ ...formData, subCounty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter sub-county"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Village/Location <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  required
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Enter village or specific location"
                />
              </div>

              <div>
                <Label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Report Date <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    required
                    value={formData.reportDate}
                    onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Any additional information about the case..."
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Submitting...' : (isOnline ? 'Submit Report' : 'Save Offline')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="dark:border-gray-600 dark:text-gray-300"
              disabled={loading}
            >
              Clear Form
            </Button>
          </div>
        </form>

        {/* Data Info Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-300 text-base">📊 Data Requirements</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200">
            <p className="mb-2"><strong>This data will be used by the AI model to predict outbreak risk.</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Temperature:</strong> Weekly average in your area (°C)</li>
              <li><strong>Rainfall:</strong> Total weekly rainfall (mm)</li>
              <li><strong>NDVI:</strong> Vegetation index from 0-1 (satellite data or local observation)</li>
              <li><strong>Sanitation:</strong> Automatically calculated for your county</li>
            </ul>
            <p className="mt-3 text-xs italic">Patient details (age, gender, symptoms) are optional and used for epidemiological tracking only.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}