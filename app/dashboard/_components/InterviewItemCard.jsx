// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'
// import React from 'react'
// import { useUser } from '@clerk/nextjs'

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Trash } from 'lucide-react';
// import { db } from '@/utils/db'
// import { MockInterview } from '@/utils/schema'
// import { and, eq } from 'drizzle-orm'
// import { toast } from 'sonner'


// function InterviewItemCard({ interview, refreshData }) {
//   const router = useRouter();

//   const onStart = () => {
//     router.push('/dashboard/interview/' + interview?.mockID)

//   }

//   const onFeedbackPress = () => {
//     router.push('/dashboard/interview/' + interview?.mockID + "/feedback")
//   }

//   const { user } = useUser();

//   const onDeleteForm = async () => {

//     const result = await db.delete(MockInterview)
//       .where(and(eq(MockInterview.id, interview.id), eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)))

//     if (result) {
//       toast('Form Deleted!!!');
//       refreshData()
//     }
//   }



//   return (
//     <div className='border shadow-sm rounded-lg p-3'>

//       <div className='flex justify-between'>

//         <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>

//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <Trash className=' h-5 w-5 text-red-600 cursor-pointer hover:scale-105 transition-all'

//             />

//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete your account
//                 and remove your data from our servers.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={() => onDeleteForm()}
//               >Continue</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>


//       </div>


//       <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
//       <h2 className='text-xs text-gray-400'>Created At:      {interview?.createdAt}</h2>

//       <div className='flex justify-between mt-2 gap-5'>


//         <Button size="sm" variant="outline" className="w-full"
//           onClick={onFeedbackPress}
//         >Feedback</Button>
//         <Button size="sm" className="w-full"
//           onClick={onStart}
//         >Start Again</Button>
//       </div>

//     </div>
//   )
// }

// export default InterviewItemCard




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
import { MockInterview } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";

export default function InterviewItemCard({ interview, refreshData }) {
  const router = useRouter();
  const { user } = useUser();

  const onStart = () => {
    router.push(`/dashboard/interview/${interview.mockID}`);
  };

  const onFeedbackPress = () => {
    router.push(`/dashboard/interview/${interview.mockID}/feedback`);
  };

  const onDeleteForm = async () => {
    const result = await db
      .delete(MockInterview)
      .where(
        and(
          eq(MockInterview.id, interview.id),
          eq(
            MockInterview.createdBy,
            user?.primaryEmailAddress?.emailAddress
          )
        )
      );

    if (result) {
      toast.success("Form Deleted!");
      refreshData();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className="
        bg-white dark:bg-gray-800
        border border-transparent rounded-lg
        p-4 flex flex-col justify-between
        transform transition-all duration-300
        hover:scale-105 hover:shadow-xl
        hover:border-primary
        cursor-pointer
      "
    >
      <div className="flex justify-between items-start">
        <h2 className="font-bold text-lg text-primary transition-colors duration-200 group-hover:text-secondary">
          {interview.jobPosition}
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash className="h-5 w-5 text-red-600 hover:text-red-800 transition-colors" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this interview.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteForm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-600">
          {interview.jobExperience} Years of Experience
        </p>
        <p className="text-xs text-gray-400">
          Created At: {interview.createdAt}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>
        <Button size="sm" className="flex-1" onClick={onStart}>
          Start Again
        </Button>
      </div>
    </div>
  );
}
