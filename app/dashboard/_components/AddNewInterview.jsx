// 


"use client";

import { useState } from "react";
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
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/GeminiAIModel";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  // Function to extract clean JSON from AI response
  const cleanJsonResponse = (responseText) => {
    // Remove markdown code blocks
    let cleaned = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find the JSON array - look for [ and ]
    const startIndex = cleaned.indexOf("[");
    const endIndex = cleaned.lastIndexOf("]");

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      cleaned = cleaned.substring(startIndex, endIndex + 1);
    }

    return cleaned;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log(jobPosition, jobDesc, jobExperience);

      const InputPrompt =
        "Job Position: " +
        jobPosition +
        ", Job Description: " +
        jobDesc +
        ", Years of Experience: " +
        jobExperience +
        ", Depends on Job Position, Job Description & Years of Experience give us " +
        process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
        " Interview questions along with Answers in JSON format. Give us question and answer field in JSON. Return ONLY the JSON array, no additional text.";

      const result = await chatSession.sendMessage(InputPrompt);
      const responseText = result.response.text();
      
      console.log("Raw AI Response:", responseText);

      // Clean the response to extract only JSON
      const MockJsonResp = cleanJsonResponse(responseText);
      
      console.log("Cleaned JSON:", MockJsonResp);

      // Parse to validate
      const parsedJson = JSON.parse(MockJsonResp);
      console.log("Parsed JSON:", parsedJson);

      setJsonResponse(MockJsonResp);

      if (MockJsonResp) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockID: uuidv4(),
            jsonMockResp: MockJsonResp,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ mockID: MockInterview.mockID });

        console.log("Inserted ID:", resp);

        if (resp) {
          setOpenDialog(false);
          router.push("/dashboard/interview/" + resp[0]?.mockID);
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add new</h2>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about your job position/role, job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-3 space-y-2">
                    <label className="text-black font-semibold">
                      Job Role/Job Position
                    </label>
                    <Input
                      className="text-black"
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>

                  <div className="my-3 space-y-2">
                    <label className="text-black font-semibold">
                      Job Description/ Tech Stack (In Short)
                    </label>
                    <Textarea
                      className="text-black"
                      placeholder="Ex. React, Angular, NodeJs, MySQL etc"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>

                  <div className="my-3 space-y-2">
                    <label className="text-black font-semibold">
                      Years of experience
                    </label>
                    <Input
                      className="text-black"
                      placeholder="Ex. 5"
                      max="100"
                      type="number"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
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
                        <LoaderCircle className="animate-spin" />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
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

export default AddNewInterview;