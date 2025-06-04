"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { QuizAnswer } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/GeminiAIModel";

export default function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // 1) Build AI prompt
    const prompt = [
      `Topic: ${jobPosition}`,
      `Difficulty Level: ${jobDesc}`,
      `Number of Questions: ${jobExperience}`,
      `Generate ${jobExperience} multiple-choice questions (MCQs) in JSON format.`,
      `Each MCQ must include: question, options A–D, correctAnswer, explanation.`,
    ].join("\n");

    // 2) Send to AI
    const result = await chatSession.sendMessage(prompt);

    // 3) Read raw text
    const rawText = await result.response.text();

    // 4) Strip out any ```
    const cleaned = rawText.replaceAll('```', '').trim();

    // 5) Extract JSON array from the cleaned string
    let jsonArrayString = '';
    const match = cleaned.match(/\[[\s\S]*\]/); // matches the first [...] block
    if (match) {
      jsonArrayString = match[0];
    } else {
      // fallback: try to parse the whole cleaned string
      jsonArrayString = cleaned;
    }

    // 6) Parse JSON
    let questions;
    try {
      questions = JSON.parse(jsonArrayString);
    } catch (err) {
      console.error("Failed to parse AI JSON:", err, jsonArrayString);
      setLoading(false);
      alert("Failed to parse questions. Please try again.");
      return;
    }

    // 7) Insert into DB
    const [inserted] = await db
      .insert(QuizAnswer)
      .values({
        mockID: uuidv4(),
        jsonMockResp: jsonArrayString,
        jobPosition,
        jobDesc,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress || "",
        createdAt: moment().format("DD-MM-yyyy"),
      })
      .returning({ mockID: QuizAnswer.mockID });

    setLoading(false);
    setOpenDialog(false);

    if (inserted?.mockID) {
      router.push(`/dashboard/quiz/${inserted.mockID}`);
    }
  };

  return (
    <div className="p-10">
      {/* Card to open the dialog */}
      <div
        onClick={() => setOpenDialog(true)}
        className="
          p-10 border rounded-lg bg-secondary
          hover:scale-105 hover:shadow-md
          cursor-pointer transition-all
        "
      >
        <h2 className="text-lg text-center">Start a new Quiz</h2>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Challenge Yourself: Quiz Awaits!
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="font-semibold block mb-1">Topic</label>
                  <Input
                    required
                    placeholder="e.g. React.js"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">
                    Difficulty Level
                  </label>
                  <Textarea
                    required
                    placeholder="e.g. Easy, Medium, Hard"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">
                    Number of Questions
                  </label>
                  <Input
                    required
                    type="number"
                    placeholder="e.g. 5"
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating…
                      </>
                    ) : (
                      "Start Quiz"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}