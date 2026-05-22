from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

# 🔴 Make sure GROQ_API_KEY exists
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env")

client = Groq(api_key=api_key)

app = Flask(__name__)
CORS(app)


def extract_json(text):
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return json.loads(text)
    except Exception as e:
        print("JSON extract error:", e)
        return None


@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        domain = data.get('domain', 'Web development')
        language = data.get('language', 'English')
        difficulty = data.get('difficulty', 'Easy')
        num_questions = data.get('num_questions', 5)

        prompt = f"""
        Generate {num_questions} {difficulty} interview questions for {domain} in {language}.
        Return ONLY JSON like:
        {{"questions": ["q1", "q2", "q3"]}}
        """

        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant"
        )

        raw = completion.choices[0].message.content
        print("RAW RESPONSE:", raw)  # 🔍 debug

        result = extract_json(raw)

        if not result:
            return jsonify({"questions": ["Failed to parse AI response"]})

        return jsonify(result)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"questions": ["Server error occurred"]}), 500


@app.route('/evaluate-answer', methods=['POST'])
def evaluate_answer():
    try:
        data = request.get_json()

        question = data.get('question')
        answer = data.get('answer')

        prompt = f"""
        Evaluate this interview answer:

        Question: {question}
        Answer: {answer}

        Return ONLY JSON:
        {{
          "score": number,
          "feedback": "text"
        }}
        """

        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant"
        )

        raw = completion.choices[0].message.content
        print("EVAL RAW:", raw)

        result = extract_json(raw)

        if not result:
            result = {"score": 0, "feedback": "Could not evaluate"}

        return jsonify(result)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"score": 0, "feedback": "Server error"}), 500


if __name__ == '__main__':
    app.run(port=5002, debug=True)