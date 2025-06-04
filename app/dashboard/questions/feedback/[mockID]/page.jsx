import { db } from "@/utils/db";
import { QuizAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export default async function FeedbackPage({ params }) {
  // Load the quiz JSON blob
  const [record] = await db
    .select({ jsonMockResp: QuizAnswer.jsonMockResp })
    .from(QuizAnswer)
    .where(eq(QuizAnswer.mockID, params.mockID));

  if (!record) {
    return <p className="p-10 text-center">Quiz not found.</p>;
  }

  const questions = JSON.parse(record.jsonMockResp);

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-8">
      <h2 className="text-2xl font-bold">Quiz Feedback</h2>
      {questions.map((q, idx) => (
        <div key={idx} className="border-b pb-4">
          <p className="font-semibold mb-2">
            {idx + 1}. {q.question}
          </p>
          <ul className="list-disc ml-6 space-y-1">
            {Object.entries(q.options).map(([key, txt]) => (
              <li
                key={key}
                className={
                  key === q.correctAnswer
                    ? "text-green-600 font-medium"
                    : ""
                }
              >
                {key}. {txt}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-700">
            <strong>Explanation:</strong> {q.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}
