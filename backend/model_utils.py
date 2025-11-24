
import os
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CHOLERA_MODEL_PATH = os.path.join(BASE_DIR, 'cholera_model.pkl')
MALARIA_MODEL_PATH = os.path.join(BASE_DIR, 'malaria_model.pkl')

CSV_DATA_PATH = os.path.join(BASE_DIR, 'simulated_outbreak_data_v15.csv')
ADDED_CSV_DATA_PATH = os.path.join(BASE_DIR, 'added_county_data.csv')

_cholera_model = None
_malaria_model = None
_csv_data = None

def get_cholera_model():
	global _cholera_model
	if _cholera_model is None:
		_cholera_model = joblib.load(CHOLERA_MODEL_PATH)
	return _cholera_model

def get_malaria_model():
	global _malaria_model
	if _malaria_model is None:
		_malaria_model = joblib.load(MALARIA_MODEL_PATH)
	return _malaria_model

def get_csv_data():
	global _csv_data
	if _csv_data is None:
		# Load both CSVs and concatenate
		df_main = pd.read_csv(CSV_DATA_PATH)
		if os.path.exists(ADDED_CSV_DATA_PATH):
			df_added = pd.read_csv(ADDED_CSV_DATA_PATH)
			_csv_data = pd.concat([df_main, df_added], ignore_index=True)
		else:
			_csv_data = df_main
	return _csv_data

def predict_cholera(features):
	model = get_cholera_model()
	return model.predict([features])[0]

def predict_malaria(features):
	model = get_malaria_model()
	return model.predict([features])[0]
