# Outbreak Early Warning Dashboard Backend

This Flask backend serves outbreak data and provides prediction endpoints for Cholera and Malaria using pre-trained models.

## Setup

1. Install dependencies:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

2. Run the server:
   ```powershell
   python app.py
   ```

## Endpoints

- `/data` (GET): Returns outbreak data (first 100 rows for demo).
- `/predict/cholera` (POST): Returns Cholera outbreak prediction. Send JSON `{ "features": [...] }`.
- `/predict/malaria` (POST): Returns Malaria outbreak prediction. Send JSON `{ "features": [...] }`.

## Notes
- The backend loads models from `../cholera_model.pkl` and `../malaria_model.pkl`.
- The CSV data is loaded from `../simulated_outbreak_data_v15.csv`.
- Adjust feature order and preprocessing as needed to match your model requirements.
