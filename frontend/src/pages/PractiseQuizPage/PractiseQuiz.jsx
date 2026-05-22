import React, { useState } from "react";
import axios from "axios";

const MockInterviewPage = () => {

  const [params, setParams] = useState({
    domain: "",
    language: "",
    interview_type: "",
    difficulty: "",
  });

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [step, setStep] = useState(0);

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Generate Questions
  // -----------------------------
  const generateQuestions = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5002/generate-questions",
        params
      );

      console.log("Questions:", res.data);

      setQuestions(res.data.questions || []);
      setStep(2);

    } catch (err) {
      console.error("Question generation error:", err);
    }

  };

  // -----------------------------
  // Handle Answer Change
  // -----------------------------
  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  // -----------------------------
  // Submit Answers
  // -----------------------------
  const submitAnswers = async () => {

    const results = [];

    try {

      for (let i = 0; i < questions.length; i++) {

        const res = await axios.post(
          "http://localhost:5002/evaluate-answer",
          {
            question: questions[i],
            answer: answers[i] || "",
            language: params.language
          }
        );

        console.log("Evaluation:", res.data);

        results.push({
          score: res.data.score ?? 0,
          feedback: res.data.feedback ?? "No feedback returned"
        });

      }

      setEvaluations(results);
      setStep(3);

    } catch (err) {
      console.error("Evaluation error:", err);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1A2A44] to-[#2C3E50] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8 space-y-6">

        <h2 className="text-3xl font-bold text-center text-blue-700">
          🧠 AI Mock Interview
        </h2>

        {/* STEP 0 */}

        {step === 0 && (
          <div className="text-center space-y-4">

            <p>
              Fill interview settings → Answer questions → Get AI evaluation
            </p>

            <button
              onClick={() => setStep(1)}
              className="bg-blue-700 text-white px-6 py-3 rounded"
            >
              Start Interview
            </button>

          </div>
        )}

        {/* STEP 1 */}

        {step === 1 && (
          <div className="grid gap-4">

            <input
              name="domain"
              placeholder="DOMAIN"
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <input
              name="language"
              placeholder="LANGUAGE"
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <input
              name="interview_type"
              placeholder="INTERVIEW TYPE"
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <input
              name="difficulty"
              placeholder="DIFFICULTY"
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <button
              onClick={generateQuestions}
              className="bg-blue-700 text-white py-3 rounded"
            >
              Generate Questions
            </button>

          </div>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <div className="space-y-6">

            {questions.map((q, i) => (
              <div key={i}>

                <p className="font-semibold">
                  Q{i + 1}: {q}
                </p>

                <textarea
                  rows="4"
                  value={answers[i] || ""}
                  onChange={(e) =>
                    handleAnswerChange(i, e.target.value)
                  }
                  placeholder="Type your answer..."
                  className="w-full p-3 border rounded mt-2"
                />

              </div>
            ))}

            <button
              onClick={submitAnswers}
              className="bg-green-600 text-white py-3 px-6 rounded"
            >
              Submit Answers
            </button>

          </div>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <div className="space-y-5">

            <h3 className="text-xl font-semibold text-green-700 text-center">
              ✅ Evaluation Results
            </h3>

            {evaluations.map((ev, i) => (

              <div
                key={i}
                className="bg-gray-100 p-4 rounded shadow"
              >

                <p className="font-semibold text-blue-700">
                  Q{i + 1} Score: {ev.score}/10
                </p>

                <p className="text-gray-700 mt-2">
                  <strong>Feedback:</strong> {ev.feedback}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default MockInterviewPage;

//