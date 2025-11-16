from flask import Flask, request, jsonify
import pandas as pd
import pickle
import os

app = Flask(__name__)

# Paths to model and data files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHOLERA_MODEL_PATH = os.path.join(BASE_DIR, '../cholera_model.pkl')
MALARIA_MODEL_PATH = os.path.join(BASE_DIR, '../malaria_model.pkl')
DATA_PATH = os.path.join(BASE_DIR, '../simulated_outbreak_data_v15.csv')

# Load models
with open(CHOLERA_MODEL_PATH, 'rb') as f:
    cholera_model = pickle.load(f)
with open(MALARIA_MODEL_PATH, 'rb') as f:
    malaria_model = pickle.load(f)

# Load data
outbreak_data = pd.read_csv(DATA_PATH)

@app.route('/data', methods=['GET'])
def get_data():
    # Return the first 100 rows for demo purposes
    return outbreak_data.head(100).to_json(orient='records')

@app.route('/predict/cholera', methods=['POST'])
def predict_cholera():
    features = request.json['features']
    prediction = cholera_model.predict([features])
    return jsonify({'prediction': int(prediction[0])})

@app.route('/predict/malaria', methods=['POST'])
def predict_malaria():
    features = request.json['features']
    prediction = malaria_model.predict([features])
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
