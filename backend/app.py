import numpy as np
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import io
import pandas as pd
from model_utils import predict_cholera, predict_malaria, get_csv_data
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

import os
from datetime import datetime

REPORTS_DIR = os.path.join(os.path.dirname(__file__), 'reports')
os.makedirs(REPORTS_DIR, exist_ok=True)

# Utility to generate and save reports

def sanitize_filename(s):
    return s.replace('/', '_').replace('\\', '_')

def make_report_filename(report_type, period, extra_desc=None, ext='csv'):
    # Example: weekly_2024-11-18_2024-11-24_Baringo_and_Nairobi.csv
    base = f"{report_type}_{period}"
    if extra_desc:
        base += f"_{sanitize_filename(extra_desc)}"
    return f"{base}.{ext}"

def generate_and_save_reports():
    from model_utils import predict_cholera, predict_malaria
    df = get_csv_data()
    df['week'] = df['week'].astype(str)

    def add_predictions_and_summary(group):
        group = group.copy()
        # Add model predictions
        cholera_mask = group['disease'].str.lower() == 'cholera'
        malaria_mask = group['disease'].str.lower() == 'malaria'
        group['predicted_risk'] = None
        # Cholera predictions
        group.loc[cholera_mask, 'predicted_risk'] = group[cholera_mask].apply(
            lambda row: predict_cholera([
                row['unimproved_sanitation_rate'],
                row['avg_rainfall']
            ]), axis=1
        )
        # Malaria predictions
        group.loc[malaria_mask, 'predicted_risk'] = group[malaria_mask].apply(
            lambda row: predict_malaria([
                row['mean_ndvi'],
                row['avg_temp']
            ]), axis=1
        )
        # Summary statistics
        summary = {
            'total_cases': int(group['cases'].sum()),
            'total_outbreaks': int(group['outbreak'].sum()),
            'avg_temp': float(group['avg_temp'].mean()),
            'avg_rainfall': float(group['avg_rainfall'].mean()),
            'avg_sanitation_rate': float(group['unimproved_sanitation_rate'].mean()),
            'avg_ndvi': float(group['mean_ndvi'].mean()),
        }
        # Add per-disease summary
        for disease in group['disease'].unique():
            mask = group['disease'] == disease
            summary[f'{disease}_cases'] = int(group[mask]['cases'].sum())
            summary[f'{disease}_avg_predicted_risk'] = float(group[mask]['predicted_risk'].astype(float).mean())
        return group, summary

    # Generate weekly reports
    for week, group in df.groupby('week'):
        safe_week = sanitize_filename(week)
        counties = '_'.join(sorted(group['county'].unique()))
        period = safe_week
        fname = make_report_filename('weekly', period, counties, 'csv')
        group_with_pred, summary = add_predictions_and_summary(group)
        with open(os.path.join(REPORTS_DIR, fname), 'w', encoding='utf-8') as f:
            for k, v in summary.items():
                f.write(f'# {k}: {v}\n')
            group_with_pred.to_csv(f, index=False)

    # Generate monthly reports
    df['month'] = df['week'].str[:7]
    for month, group in df.groupby('month'):
        safe_month = sanitize_filename(month)
        counties = '_'.join(sorted(group['county'].unique()))
        period = safe_month
        fname = make_report_filename('monthly', period, counties, 'csv')
        group_with_pred, summary = add_predictions_and_summary(group)
        with open(os.path.join(REPORTS_DIR, fname), 'w', encoding='utf-8') as f:
            for k, v in summary.items():
                f.write(f'# {k}: {v}\n')
            group_with_pred.to_csv(f, index=False)

# Call this at startup (or expose as an endpoint for regeneration)
generate_and_save_reports()

app = Flask(__name__)
CORS(app)

@app.route('/data/outbreak', methods=['GET'])
def get_outbreak_data():
    try:
        df = get_csv_data()
        # Optionally, limit rows for performance
        data = df.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def index():
    return {'status': 'Flask backend running'}

@app.route('/predict/cholera', methods=['POST'])
def predict_cholera_endpoint():
    data = request.json
    features = data.get('features')
    print('Received /predict/cholera request with features:', features, flush=True)
    if not features:
        print('Missing features!', flush=True)
        return jsonify({'error': 'Missing features'}), 400
    try:
        if isinstance(features, dict):
            input_features = [features['unimproved_sanitation_rate'], features['avg_rainfall']]
        else:
            input_features = [features[0], features[1]]
        # Get probability of outbreak (P(1))
        model = predict_cholera.__globals__['get_cholera_model']()
        proba = model.predict_proba([input_features])[0][1]
        print(f'Cholera prediction: features={input_features}, risk_score(P(1))={proba}', flush=True)
        return jsonify({'probability': float(proba)})
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print('Error in /predict/cholera:', tb, flush=True)
        return jsonify({'error': str(e), 'traceback': tb, 'features': features}), 500

@app.route('/predict/malaria', methods=['POST'])
def predict_malaria_endpoint():
    data = request.json
    features = data.get('features')
    print('Received /predict/malaria request with features:', features, flush=True)
    if not features:
        print('Missing features!', flush=True)
        return jsonify({'error': 'Missing features'}), 400
    try:
        if isinstance(features, dict):
            input_features = [features['mean_ndvi'], features['avg_temp']]
        else:
            input_features = [features[2], features[3]]
        model = predict_malaria.__globals__['get_malaria_model']()
        proba = model.predict_proba([input_features])[0][1]
        print(f'Malaria prediction: features={input_features}, risk_score(P(1))={proba}', flush=True)
        return jsonify({'probability': float(proba)})
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print('Error in /predict/malaria:', tb, flush=True)
        return jsonify({'error': str(e), 'traceback': tb, 'features': features}), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Expects JSON array of items, each with:
      - disease: 'cholera' or 'malaria'
      - features: array or dict of features
    Returns array of probabilities (risk scores) in the same order.
    """
    try:
        items = request.json
        if not isinstance(items, list):
            return jsonify({'error': 'Request body must be a JSON array'}), 400
        results = []
        for item in items:
            disease = item.get('disease')
            features = item.get('features')
            if not disease or not features:
                results.append({'error': 'Missing disease or features', 'input': item})
                continue
            try:
                if disease.lower() == 'cholera':
                    if isinstance(features, dict):
                        input_features = [features['unimproved_sanitation_rate'], features['avg_rainfall']]
                    else:
                        input_features = [features[0], features[1]]
                    model = predict_cholera.__globals__['get_cholera_model']()
                    proba = model.predict_proba([input_features])[0][1]
                    print(f'Batch cholera prediction: features={input_features}, risk_score(P(1))={proba}', flush=True)
                    results.append({'probability': float(proba)})
                elif disease.lower() == 'malaria':
                    if isinstance(features, dict):
                        input_features = [features['mean_ndvi'], features['avg_temp']]
                    else:
                        input_features = [features[2], features[3]]
                    model = predict_malaria.__globals__['get_malaria_model']()
                    proba = model.predict_proba([input_features])[0][1]
                    print(f'Batch malaria prediction: features={input_features}, risk_score(P(1))={proba}', flush=True)
                    results.append({'probability': float(proba)})
                else:
                    results.append({'error': f'Unknown disease: {disease}', 'input': item})
            except Exception as e:
                import traceback
                tb = traceback.format_exc()
                results.append({'error': str(e), 'traceback': tb, 'input': item})
        return jsonify(results)
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        return jsonify({'error': str(e), 'traceback': tb}), 500

# --- Analytics API Endpoints ---
@app.route('/data/monthly_comparison', methods=['GET'])
def get_monthly_comparison():
    try:
        df = get_csv_data()
        # Group by month (parse from week string if needed)
        df['month'] = df['week'].str.slice(0, 7)  # e.g., '2023-01'
        grouped = df.groupby('month')
        result = []
        for month, rows in grouped:
            cholera = rows[rows['disease'].str.lower() == 'cholera']['cases'].sum()
            malaria = rows[rows['disease'].str.lower() == 'malaria']['cases'].sum()
            outbreaks = rows['outbreak'].sum()
            result.append({
                'month': month,
                'cholera': int(cholera),
                'malaria': int(malaria),
                'outbreaks': int(outbreaks)
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data/county_data', methods=['GET'])
def get_county_data():
    try:
        df = get_csv_data()
        grouped = df.groupby('county')
        palette = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#94a3b8', '#3b82f6', '#f97316', '#f59e0b']
        result = []
        for i, (county, rows) in enumerate(grouped):
            cases = rows['cases'].sum()
            result.append({
                'name': county,
                'cases': int(cases),
                'color': palette[i % len(palette)]
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data/environmental', methods=['GET'])
def get_environmental():
    try:
        df = get_csv_data()
        # Example: average by disease
        cholera_rows = df[df['disease'].str.lower() == 'cholera']
        malaria_rows = df[df['disease'].str.lower() == 'malaria']
        def safe_mean(series):
            return float(np.nanmean(series)) if len(series) > 0 else 0
        data = [
            {
                'factor': 'High Temp',
                'cholera': safe_mean(cholera_rows['avg_temp']),
                'malaria': safe_mean(malaria_rows['avg_temp'])
            },
            {
                'factor': 'Heavy Rain',
                'cholera': safe_mean(cholera_rows['avg_rainfall']),
                'malaria': safe_mean(malaria_rows['avg_rainfall'])
            },
            {
                'factor': 'Poor Sanitation',
                'cholera': safe_mean(cholera_rows['unimproved_sanitation_rate']),
                'malaria': safe_mean(malaria_rows['unimproved_sanitation_rate'])
            },
            {
                'factor': 'High NDVI',
                'cholera': safe_mean(cholera_rows['mean_ndvi']),
                'malaria': safe_mean(malaria_rows['mean_ndvi'])
            },
        ]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to list available reports
@app.route('/reports/list', methods=['GET'])
def list_reports():
    try:
        files = [f for f in os.listdir(REPORTS_DIR) if f.endswith('.csv') or f.endswith('.pdf')]
        # Optionally, add metadata extraction here
        return jsonify({'reports': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to download a specific report by filename

# Download report in CSV or PDF
@app.route('/reports/download/<filename>', methods=['GET'])
def download_specific_report(filename):
    try:
        safe_filename = os.path.basename(filename)
        file_path = os.path.join(REPORTS_DIR, safe_filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'Report not found'}), 404
        ext = os.path.splitext(safe_filename)[1].lower()
        if ext == '.pdf':
            return send_file(file_path, mimetype='application/pdf', as_attachment=True, download_name=safe_filename)
        else:
            return send_file(file_path, mimetype='text/csv', as_attachment=True, download_name=safe_filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Generate PDF on demand from CSV with professional formatting
@app.route('/reports/download/<filename>.pdf', methods=['GET'])
def download_report_pdf(filename):
    import traceback
    try:
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
        from reportlab.lib.units import inch
        from reportlab.graphics.shapes import Drawing
        from reportlab.graphics.charts.barcharts import VerticalBarChart
        from reportlab.graphics.charts.linecharts import HorizontalLineChart
        from reportlab.graphics.charts.textlabels import Label
        import tempfile
        import matplotlib.pyplot as plt
        import numpy as np

        safe_filename = os.path.basename(filename)
        csv_path = os.path.join(REPORTS_DIR, safe_filename)
        if not os.path.exists(csv_path):
            return jsonify({'error': 'CSV report not found'}), 404
        # Read summary and data
        with open(csv_path, encoding='utf-8') as f:
            lines = f.readlines()
        summary_lines = [l.strip() for l in lines if l.startswith('#')]
        data_lines = [l for l in lines if not l.startswith('#')]
        # Prepare summary as key-value pairs
        summary = [l[2:].split(':', 1) for l in summary_lines if ':' in l]
        # Prepare data table
        if not data_lines:
            data_table = []
        else:
            data_table = [row.strip().split(',') for row in data_lines]

        # Convert data table to DataFrame for analytics/graphs
        import pandas as pd
        # Clean and convert numeric columns for plotting
        df = pd.DataFrame(data_table[1:], columns=data_table[0]) if data_table else pd.DataFrame()
        if not df.empty:
            for col in ['cases', 'outbreak', 'predicted_risk']:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

        # PDF generation
        pdf_buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=letter,
            rightMargin=60,
            leftMargin=60,
            topMargin=70,
            bottomMargin=50
        )
        elements = []
        styles = getSampleStyleSheet()
        title_style = styles['Title']
        subtitle_style = styles['Heading2']
        normal_style = styles['Normal']
        summary_style = ParagraphStyle('Summary', parent=normal_style, fontSize=10, spaceAfter=6)

        # Branding and title
        elements.append(Paragraph("Outbreak Early Warning System", title_style))
        elements.append(Paragraph("Epidemiological Report", subtitle_style))
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(Paragraph(f"<b>Report File:</b> {safe_filename}", normal_style))
        elements.append(Spacer(1, 0.1 * inch))

        # Summary section
        if summary:
            # Check for all-zero cases and outbreaks
            summary_dict = {k.strip(): v.strip() for k, v in summary}
            zero_cases = summary_dict.get('total_cases', '0') in ['0', '0.0']
            zero_outbreaks = summary_dict.get('total_outbreaks', '0') in ['0', '0.0']
            if zero_cases and zero_outbreaks:
                warning_style = ParagraphStyle('Warning', parent=styles['Normal'], fontSize=12, textColor=colors.red, spaceAfter=12, alignment=1)
                elements.append(Paragraph("<b>Notice:</b> No cases or outbreaks were reported for this period. All values are zero.", warning_style))
            elements.append(Paragraph("<b>Summary Statistics</b>", styles['Heading3']))
            for k, v in summary:
                elements.append(Paragraph(f"<b>{k.strip()}:</b> {v.strip()}", summary_style))
            elements.append(Spacer(1, 0.2 * inch))

        # Analytics and Graphs
        if not df.empty:
            # Cases by Disease Bar Chart
            if 'disease' in df.columns and 'cases' in df.columns:
                cases_by_disease = df.groupby('disease')['cases'].sum()
                if not cases_by_disease.empty and cases_by_disease.sum() > 0:
                    plt.figure(figsize=(4, 2.2))
                    plt.bar(cases_by_disease.index, cases_by_disease.values, color=['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][:len(cases_by_disease)])
                    plt.title('Cases by Disease')
                    plt.ylabel('Cases')
                    plt.tight_layout()
                    tmpfile = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
                    plt.savefig(tmpfile.name, dpi=120)
                    plt.close()
                    elements.append(Paragraph("<b>Cases by Disease</b>", styles['Heading4']))
                    elements.append(Image(tmpfile.name, width=3.5*inch, height=2*inch))
            # Outbreaks by County
            if 'county' in df.columns and 'outbreak' in df.columns:
                outbreaks_by_county = df.groupby('county')['outbreak'].sum()
                if not outbreaks_by_county.empty and outbreaks_by_county.sum() > 0:
                    plt.figure(figsize=(4, 2.2))
                    plt.bar(outbreaks_by_county.index, outbreaks_by_county.values, color='#f97316')
                    plt.title('Outbreaks by County')
                    plt.ylabel('Outbreaks')
                    plt.xticks(rotation=30, ha='right', fontsize=7)
                    plt.tight_layout()
                    tmpfile2 = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
                    plt.savefig(tmpfile2.name, dpi=120)
                    plt.close()
                    elements.append(Paragraph("<b>Outbreaks by County</b>", styles['Heading4']))
                    elements.append(Image(tmpfile2.name, width=3.5*inch, height=2*inch))
            elements.append(Spacer(1, 0.2 * inch))

        # Prediction section for special reports
        if 'special' in safe_filename.lower() or 'assessment' in safe_filename.lower():
            elements.append(Paragraph("<b>Prediction Analysis</b>", styles['Heading3']))
            if 'predicted_risk' in df.columns and 'disease' in df.columns:
                pred_summary = df.groupby('disease')['predicted_risk'].apply(lambda x: np.mean([float(i) for i in x if i not in [None, '', 'nan']])).to_dict()
                for disease, risk in pred_summary.items():
                    elements.append(Paragraph(f"<b>{disease} Avg Predicted Risk:</b> {risk:.3f}", summary_style))
            elements.append(Spacer(1, 0.2 * inch))

        # Data table
        if data_table:
            elements.append(Paragraph("<b>Detailed Data</b>", styles['Heading3']))
            from reportlab.platypus import Paragraph as RLParagraph
            from reportlab.pdfbase.ttfonts import TTFont
            from reportlab.pdfbase import pdfmetrics
            # Use system-wide font (Noto Serif JP if available, else fallback)
            try:
                pdfmetrics.registerFont(TTFont('NotoSerifJP', os.path.join(os.path.dirname(__file__), '../src/fonts/NotoSerifJP-Regular.ttf')))
                font_name = 'NotoSerifJP'
            except Exception:
                font_name = 'Helvetica'
            # Pad all rows to header length
            header_len = len(data_table[0])
            padded_table = [row + [''] * (header_len - len(row)) if len(row) < header_len else row[:header_len] for row in data_table]
            # Use a smaller font and wrap text for long values
            def format_cell(val):
                sval = str(val)
                # Always wrap text for long values
                if len(sval) > 15 or any(c in sval for c in [',', ' ', '\n']):
                    return RLParagraph(sval.replace('\n', '<br/>'), ParagraphStyle('tablecell', fontName=font_name, fontSize=7, leading=8))
                else:
                    return RLParagraph(sval, ParagraphStyle('tablecell', fontName=font_name, fontSize=7, leading=8))
            formatted_table = [[format_cell(cell) for cell in row] for row in padded_table]
            # Auto-size columns based on max content width, but cap at 1.2 inch
            max_table_width = doc.width
            num_cols = header_len
            col_widths = []
            for col in range(num_cols):
                maxlen = max([len(str(row[col])) for row in padded_table])
                width = min(0.11 * inch * maxlen + 0.25 * inch, 1.2 * inch)
                col_widths.append(width)
            # If total width exceeds page, scale down proportionally
            total_width = sum(col_widths)
            if total_width > max_table_width:
                scale = max_table_width / total_width
                col_widths = [w * scale for w in col_widths]
            table = Table(formatted_table, repeatRows=1, hAlign='LEFT', colWidths=col_widths)
            # Alternating row background color for readability, highlight outbreak rows
            table_style = [
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e3e3e3')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#222222')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), font_name),
                ('FONTSIZE', (0, 0), (-1, 0), 8),
                ('FONTSIZE', (0, 1), (-1, -1), 7),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
                ('TOPPADDING', (0, 0), (-1, 0), 5),
                ('LEFTPADDING', (0, 0), (-1, -1), 1),
                ('RIGHTPADDING', (0, 0), (-1, -1), 1),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bbbbbb')),
            ]
            # Find outbreak column index
            outbreak_col = None
            for idx, col in enumerate(data_table[0]):
                if col.strip().lower() == 'outbreak':
                    outbreak_col = idx
                    break
            for i in range(1, len(formatted_table)):
                # Highlight outbreak rows
                if outbreak_col is not None:
                    val = str(padded_table[i][outbreak_col]).strip()
                    if val == '1' or val.lower() == 'true':
                        table_style.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#fef3c7')))
                        table_style.append(('TEXTCOLOR', (0, i), (-1, i), colors.HexColor('#b45309')))
                elif i % 2 == 1:
                    table_style.append(('BACKGROUND', (0, i), (-1, i), colors.whitesmoke))
            table.setStyle(TableStyle(table_style))
            table._argW = col_widths
            table.repeatRows = 1
            table.splitByRow = 1
            elements.append(table)

        # Footer with page number
        def add_footer(canvas, doc):
            canvas.saveState()
            footer_text = f"Generated by Outbreak Early Warning System | Page {doc.page}"
            canvas.setFont('Helvetica', 8)
            canvas.setFillColor(colors.HexColor('#888888'))
            canvas.drawString(60, 35, footer_text)
            canvas.restoreState()

        doc.build(elements, onFirstPage=add_footer, onLaterPages=add_footer)
        pdf_buffer.seek(0)
        pdf_name = safe_filename.replace('.csv', '.pdf')
        return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name=pdf_name)
    except Exception as e:
        tb = traceback.format_exc()
        print(f"Error generating PDF for {filename}: {e}\n{tb}")
        return jsonify({'error': str(e), 'traceback': tb}), 500

    
# --- Reports Download Endpoint ---
@app.route('/reports/download', methods=['GET'])
def download_report():
    """
    Generates a CSV report from outbreak data and serves it as a downloadable file.
    """
    try:
        df = get_csv_data()
        # You can filter or aggregate df here as needed for the report
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='outbreak_report.csv'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

