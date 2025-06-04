// "use client"

// import { db } from '@/utils/db'
// import { UserAnswer } from '@/utils/schema'
// import { eq } from 'drizzle-orm'
// import React, { useEffect, useState } from 'react'

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { ChevronsUpDown } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'


// function Feedback({ params }) {

//   const [feedbackList, setFeedbackList] = useState([]);
//   const [score, setScore] = useState(0);

//   const router = useRouter();

//   useEffect(() => {
//     GetFeedback();

//   }, []);

//   const GetFeedback = async () => {
//     const result = await db.select()
//       .from(UserAnswer)
//       .where(eq(UserAnswer.mockIdRef, params.interviewId))
//       .orderBy(UserAnswer.id);

//     console.log(result);
//     setFeedbackList(result);

//     let tmp = 0;

//     for (let i = 0; i < result.length; i++) {
//       tmp += parseInt(result[i].rating)
//     }

//     console.log('sum ', tmp);

//     setScore(parseInt(tmp / result.length))
//   }

//   return (
//     <div className='p-10'>


//       {feedbackList?.length == 0 ?

//         <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
//         :
//         <>
//           <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>

//           <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>


//           <h2 className='text-primary text-xl my-3'>Your overall Interview rating: <strong>{score}/5</strong></h2>

//           <h2 className='text-sm text-gray-500'>Find below interview question with correct answer,
//             Your answer and feedback for improvement</h2>

//           {feedbackList && feedbackList.map((item, index) => (

//             <Collapsible key={index} className='mt-7'>
//               <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
//                 {item.question} <ChevronsUpDown className='h-5 w-5' />
//               </CollapsibleTrigger>
//               <CollapsibleContent>
//                 <div className='flex flex-col gap-2'>
//                   <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
//                   <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>

//                   <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>

//                   <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
//                 </div>
//               </CollapsibleContent>
//             </Collapsible>

//           ))}

//         </>}

//       <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>

//     </div>
//   )
// }

// export default Feedback


"use client"

import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Feedback({ params }) {

  const [feedbackList, setFeedbackList] = useState([]);
  const [score, setScore] = useState(0);

  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);

    let tmp = 0;

    for (let i = 0; i < result.length; i++) {
      tmp += parseInt(result[i].rating)
    }

    console.log('sum ', tmp);

    setScore(parseInt(tmp / result.length))
  }

  // Helper function to parse resources (handles array of URLs)
  const parseResources = (resourcesString) => {
    try {
      const parsed = JSON.parse(resourcesString || '[]');
      console.log('Parsed resources:', parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing resources:', error);
      return [];
    }
  }

  // Helper function to parse feedback (handles JSON string of array)
  const parseFeedback = (feedbackString) => {
    try {
      const parsed = JSON.parse(feedbackString || '[]');
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If it's a string, return as single item array
      return [parsed];
    } catch (error) {
      console.error('Error parsing feedback:', error);
      // If parsing fails, return the original string as array
      return [feedbackString];
    }
  }

  // Function to extract domain name from URL for display
  const getDomainName = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (error) {
      return url;
    }
  }

  // Function to get a clean title from URL
  const getResourceTitle = (url) => {
    const domain = getDomainName(url);
    
    // Custom titles for common domains
    if (domain.includes('reactjs.org')) {
      if (url.includes('tutorial')) return 'React Official Tutorial';
      if (url.includes('docs')) return 'React Documentation';
      return 'React Official Site';
    }
    if (domain.includes('freecodecamp.org')) return 'FreeCodeCamp React Course';
    if (domain.includes('youtube.com')) return 'YouTube Video';
    if (domain.includes('medium.com')) return 'Medium Article';
    if (domain.includes('stackoverflow.com')) return 'Stack Overflow';
    
    // Default to domain name
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  }

  return (
    <div className='p-10'>
      {feedbackList?.length == 0 ?
        <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
        :
        <>
          <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>

          <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>

          <h2 className='text-primary text-xl my-3'>Your overall Interview rating: <strong>{score}/10</strong></h2>

          <h2 className='text-sm text-gray-500'>Find below interview question with correct answer,
            Your answer, feedback for improvement, and recommended resources</h2>

          {feedbackList && feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
                {item.question} <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}/10</h2>
                  
                  <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'>
                    <strong>Your Answer: </strong>{item.userAns}
                  </h2>

                  <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'>
                    <strong>Correct Answer: </strong>{item.correctAns}
                  </h2>

                  {/* Enhanced Feedback Section */}
                  <div className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'>
                    <strong>Feedback: </strong>
                    <div className='mt-2 space-y-1'>
                      {parseFeedback(item.feedback).map((feedbackItem, feedbackIndex) => (
                        <div key={feedbackIndex} className='pl-2 border-l-2 border-blue-300'>
                          {feedbackItem}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Resources Section */}
                  {item.resources && parseResources(item.resources).length > 0 && (
                    <div className='p-3 border rounded-lg bg-purple-50'>
                      <h3 className='font-bold text-purple-900 mb-2'>📚 Recommended Resources:</h3>
                      <div className='space-y-2'>
                        {parseResources(item.resources).map((resourceUrl, resourceIndex) => (
                          <div key={resourceIndex} className='flex items-center gap-2 p-2 bg-white rounded border hover:shadow-sm transition-shadow'>
                            <ExternalLink className='h-4 w-4 text-purple-600' />
                            <div className='flex-1'>
                              <a 
                                href={resourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className='text-purple-700 hover:text-purple-900 underline text-sm font-medium'
                              >
                                {getResourceTitle(resourceUrl)}
                              </a>
                              <div className='text-xs text-gray-500 mt-1 break-all'>
                                {resourceUrl}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>}

      <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback
