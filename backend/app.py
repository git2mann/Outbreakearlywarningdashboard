
from flask import Flask, request, jsonify
from flask_cors import CORS
from model_utils import predict_cholera, predict_malaria, get_csv_data

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
        # Only use the features expected by the model
        # ['unimproved_sanitation_rate', 'avg_rainfall']
        if isinstance(features, dict):
            input_features = [features['unimproved_sanitation_rate'], features['avg_rainfall']]
        else:
            # If array, assume order: [unimproved_sanitation_rate, avg_rainfall, mean_ndvi, avg_temp]
            input_features = [features[0], features[1]]
        prediction = predict_cholera(input_features)
        # Also get probability if available
        model = None
        from model_utils import get_cholera_model
        model = get_cholera_model()
        try:
            proba = model.predict_proba([input_features])[0]
            print('Prediction result:', prediction, 'Probabilities:', proba, flush=True)
            prob_1 = float(proba[1]) if len(proba) > 1 else float(proba[0])
        except Exception as e:
            print('Could not get predict_proba:', e, flush=True)
            prob_1 = None
        # Convert to native Python type for JSON serialization
        if hasattr(prediction, 'item'):
            prediction = prediction.item()
        # Use a lower threshold for outbreak warning
        outbreak = 1 if prob_1 is not None and prob_1 > 0.1 else 0
        return jsonify({'prediction': outbreak, 'probability': prob_1})
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
        # Only use the features expected by the model
        # ['mean_ndvi', 'avg_temp']
        if isinstance(features, dict):
            input_features = [features['mean_ndvi'], features['avg_temp']]
        else:
            # If array, assume order: [unimproved_sanitation_rate, avg_rainfall, mean_ndvi, avg_temp]
            input_features = [features[2], features[3]]
        prediction = predict_malaria(input_features)
        model = None
        from model_utils import get_malaria_model
        model = get_malaria_model()
        try:
            proba = model.predict_proba([input_features])[0]
            print('Prediction result:', prediction, 'Probabilities:', proba, flush=True)
            prob_1 = float(proba[1]) if len(proba) > 1 else float(proba[0])
        except Exception as e:
            print('Could not get predict_proba:', e, flush=True)
            prob_1 = None
        if hasattr(prediction, 'item'):
            prediction = prediction.item()
        outbreak = 1 if prob_1 is not None and prob_1 > 0.1 else 0
        return jsonify({'prediction': outbreak, 'probability': prob_1})
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print('Error in /predict/malaria:', tb, flush=True)
        return jsonify({'error': str(e), 'traceback': tb, 'features': features}), 500

if __name__ == '__main__':
    app.run(debug=True)