// // app/dashboard/questions/QuizItemCard.jsx
// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import { Trash } from "lucide-react";
// import { db } from "@/utils/db";
// import { QuizAnswer } from "@/utils/schema";
// import { and, eq } from "drizzle-orm";
// import { toast } from "sonner";

// export default function QuizItemCard({ quiz, refreshData }) {
//   const router = useRouter();
//   const { user } = useUser();

//   const onRetake = () => {
//     router.push(`/dashboard/quiz/${quiz.mockID}`);
//   };

//   const onFeedback = () => {
//     router.push(`/dashboard/questions/feedback/${quiz.mockID}`);
//   };

//   const onDelete = async () => {
//     const result = await db
//       .delete(QuizAnswer)
//       .where(
//         and(
//           eq(QuizAnswer.mockID, quiz.mockID),
//           eq(QuizAnswer.createdBy, user?.primaryEmailAddress?.emailAddress)
//         )
//       );

//     if (result) {
//       toast.success("Quiz deleted");
//       refreshData();
//     } else {
//       toast.error("Failed to delete quiz");
//     }
//   };

//   return (
//     <div className="border shadow-sm rounded-lg p-4 flex flex-col justify-between">
//       <div className="flex justify-between items-start">
//         <h2 className="font-bold text-primary">{quiz.jobPosition}</h2>

//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <Trash className="h-5 w-5 text-red-600 cursor-pointer hover:scale-105 transition-all" />
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Delete this quiz?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={onDelete}>
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>

//       <p className="text-sm text-gray-600">{quiz.jobExperience} Questions</p>
//       <p className="text-xs text-gray-400">Created At: {quiz.createdAt}</p>

//       <div className="flex justify-between gap-5 mt-4">
//         <Button size="sm" variant="outline" className="flex-1" onClick={onFeedback}>
//           Feedback
//         </Button>
//         <Button size="sm" className="flex-1" onClick={onRetake}>
//           Start Again
//         </Button>
//       </div>
//     </div>
//   );
// }


// app/dashboard/questions/QuizItemCard.jsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { db } from "@/utils/db";
import { QuizAnswer } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";

export default function QuizItemCard({ quiz, refreshData }) {
  const router = useRouter();
  const { user } = useUser();

  const onRetake = () => {
    router.push(`/dashboard/quiz/${quiz.mockID}`);
  };

  const onFeedback = () => {
    router.push(`/dashboard/questions/feedback/${quiz.mockID}`);
  };

  const onDelete = async () => {
    const result = await db.delete(QuizAnswer)
      .where(
        and(
          eq(QuizAnswer.mockID, quiz.mockID),
          eq(QuizAnswer.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );

    if (result) {
      toast.success("Quiz deleted");
      refreshData();
    } else {
      toast.error("Failed to delete quiz");
    }
  };

  return (
    <div
      className="
        bg-white dark:bg-gray-800
        border border-transparent rounded-lg
        p-6 flex flex-col justify-between
        transform transition-all duration-300
        hover:scale-105 hover:shadow-2xl hover:border-primary
        cursor-pointer group
      "
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-primary transition-colors duration-200 group-hover:text-secondary">
          {quiz.jobPosition}
        </h2>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash className="h-5 w-5 text-red-600 hover:text-red-800 transition-colors" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this quiz?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {quiz.jobExperience} Questions
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Created: {quiz.createdAt}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onFeedback}
        >
          Feedback
        </Button>
        <Button size="sm" className="flex-1" onClick={onRetake}>
          Start Again
        </Button>
      </div>
    </div>
  );
}
