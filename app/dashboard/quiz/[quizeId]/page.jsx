"use client";

import { db } from "@/utils/db";
import { QuizAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Quiz({ params }) {
  const { quizeId } = params;      // pull mockID from params
  const [interviewData, setInterviewData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const router = useRouter();

  // Load quiz questions on mount
  useEffect(() => {
    async function load() {
      const result = await db
        .select()
        .from(QuizAnswer)
        .where(eq(QuizAnswer.mockID, quizeId));

      if (result.length > 0) {
        setInterviewData(JSON.parse(result[0].jsonMockResp));
      }
    }
    load();
  }, [quizeId]);

  const handleAnswerChange = (option) => {
    setSelectedAnswer(option);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((i) => i + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  // After final question is answered, redirect to feedback
  useEffect(() => {
    if (
      interviewData.length > 0 &&
      currentQuestionIndex === interviewData.length - 1 &&
      showAnswer
    ) {
      const timer = setTimeout(() => {
        router.push(`/dashboard/questions/feedback/${quizeId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, showAnswer, interviewData.length, quizeId, router]);

  if (interviewData.length === 0) {
    return <p className="p-10 text-center">Loading quiz…</p>;
  }

  const current = interviewData[currentQuestionIndex];

  return (
    <div className="mx-auto my-10 max-w-2xl p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="mb-4 text-2xl font-bold">Quiz</h2>

      <div className="mb-6">
        <p className="mb-2 text-lg font-semibold">
          {currentQuestionIndex + 1}. {current.question}
        </p>

        <div className="space-y-2">
          {Object.entries(current.options).map(([key, txt]) => (
            <label
              key={key}
              className="block p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <input
                type="radio"
                name={`q-${currentQuestionIndex}`}
                value={key}
                className="mr-2"
                onChange={() => handleAnswerChange(key)}
                checked={selectedAnswer === key}
                disabled={showAnswer}
              />
              {key}. {txt}
            </label>
          ))}
        </div>

        {showAnswer && (
          <p
            className={`mt-2 text-sm font-semibold ${
              selectedAnswer === current.correctAnswer
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {selectedAnswer === current.correctAnswer
              ? "✅ Correct!"
              : `❌ Incorrect. Correct answer: ${current.correctAnswer} – ${
                  current.options[current.correctAnswer]
                }`}
          </p>
        )}
      </div>

      {currentQuestionIndex < interviewData.length - 1 && (
        <button
          onClick={handleNextQuestion}
          disabled={!showAnswer}
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Next Question →
        </button>
      )}

      {currentQuestionIndex === interviewData.length - 1 && showAnswer && (
        <p className="mt-4 text-center text-lg font-bold text-green-700">
          🎉 Quiz Completed! Redirecting to feedback...
        </p>
      )}
    </div>
  );
}
