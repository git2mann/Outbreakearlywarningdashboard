
  # Outbreak Early Warning Dashboard

  This is a code bundle for Outbreak Early Warning Dashboard.


## Backend (Flask API)

### Setup

1. Install Python dependencies:
   ```sh
   cd backend
   pip install -r requirements.txt
   ```
2. Ensure `cholera_model.pkl`, `malaria_model.pkl`, and `simulated_outbreak_data_v15.csv` are in the project root.
3. Start the Flask server:
   ```sh
   python app.py
   ```

### API Endpoints

- `GET /data/outbreak` — Returns all outbreak data as JSON (from `simulated_outbreak_data_v15.csv`).

- `POST /predict/cholera` — Predicts cholera outbreak. Expects JSON body:
  ```json
  { "features": [/* feature values as array */] }
  ```
  Returns: `{ "prediction": <value> }`

- `POST /predict/malaria` — Predicts malaria outbreak. Expects JSON body:
  ```json
  { "features": [/* feature values as array */] }
  ```
  Returns: `{ "prediction": <value> }`

---

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
  