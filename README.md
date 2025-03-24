# RAF-DB Emotion Detection API
A FastAPI app to predict emotions from images using a CNN trained on RAF-DB.

## Setup
1. Clone the repo: `git clone https://github.com/yourusername/rafdb-emotion-api.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Download `rafdb_model.h5` from https://drive.google.com/file/d/1-4EB65NUyQ1vkhv57Ln9xyfYl3IvgXh9/view?usp=sharing and place it in the root folder.
4. Run: `uvicorn app:app --reload`
5. Visit `http://127.0.0.1:8000/` to use the app.

## Structure
- `app.py`: FastAPI application
- `train.ipynb`: Model training code
- `templates/`: HTML templates
- `static/`: CSS and JS files

## Endpoints
- GET `/`: Frontend page
- POST `/predict`: Predict emotion from an image
- GET `/health`: API status check