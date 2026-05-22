"""
Compatibility shim.
from google import genai
The actual Flask API lives at: server/mock_interview_api.py

This file exists so running:
  python mock_interview_api.py
from the repo root works (as some instructions/scripts may assume).

It imports the Flask app and runs it.
"""

from server.mock_interview_api import app

if __name__ == "__main__":
    # Keep behavior consistent with server/mock_interview_api.py
    app.run(host="0.0.0.0", port=5002, debug=True)
