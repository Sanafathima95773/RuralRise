from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

# Load model

# Setup Flask
app = Flask(__name__)
CORS(app)  # Allow React frontend to call API

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array(data["features"]).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({"prediction": int(prediction[0])})

@app.route("/")
def home():
    return "Model API running"

if __name__ == "__main__":
    app.run(debug=True)
