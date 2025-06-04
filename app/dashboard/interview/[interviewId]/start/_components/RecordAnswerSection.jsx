"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'

import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

import { chatSession } from '@/utils/GeminiAIModel'

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {

  const[userAnswer,setUserAnswer]=useState('');
  const {user}=useUser();
  const[loading,setLoading]=useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=>{
    results.map((result)=>(
      setUserAnswer(prevAns=>prevAns+result?.transcript)
    ))
  },[results]);
   
  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10){
      UpdateUserAnswer();
    }
  },[userAnswer])  

  const StartStopRecording=async()=>{
    if(isRecording){ 
      stopSpeechToText()
    }
    else{
      startSpeechToText();
    }
  }

  const UpdateUserAnswer=async()=>{

    console.log(userAnswer)
    setLoading(true);
    const feedbackPrompt="Question: " + mockInterviewQuestion[activeQuestionIndex]?.question + 
", User Answer: " + userAnswer + 
". Based on the given question and user answer, please provide a JSON output with the following fields: " + 
"1. rating (out of 10), " + 
"2. feedback (3 to 5 lines explaining areas of improvement), " + 
"3. resources (array of 2-3 useful links to improve the answer for this question). " + 
"Respond strictly in JSON format with fields: rating, feedback, resources."; 



      
    const result=await chatSession.sendMessage(feedbackPrompt);


    console.log(result.response.text());
    console.log("Response received from Gemini AI");

    const mockJsonResp=(result.response.text()).replace('```json','').replace('```','');
    console.log(mockJsonResp);
    const JsonFeedbackResp=JSON.parse(mockJsonResp);

    const resp=await db.insert(UserAnswer)
    .values({
      mockIdRef:interviewData?.mockID,
      question:mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns:userAnswer,
      feedback:JsonFeedbackResp?.feedback,
      rating:JsonFeedbackResp?.rating,
      resources:JSON.stringify(JsonFeedbackResp?.resources || []), 
      userEmail:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD-MM-yyyy')
    })

    if(resp){
      toast('User Answer recorded successfully')
      setUserAnswer('');
      setResults([]);
    }
    setResults([]);
    
    setLoading(false);
  }


  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
      <Image src={'/webCam.png'} width={200} height={200} className='absolute'/>
          <Webcam mirrored={true} 
          style={{
            height:300,
            width:'100%',
            zIndex:10
          
          }}/>
      </div>
      <Button
      disabled={loading}
       variant="outline" className="my-10"
      onClick={StartStopRecording}
      >
      {isRecording? 
      <h2 className='text-red-600 flex gap-2 animate-pulse items-center'>
      <StopCircle/>Stop Recording
      </h2>
      :
      <h2 className='text-primary flex gap-2 items-center'><Mic/>Record Answer </h2>}</Button> 
      
    </div>
  )
}

export default RecordAnswerSection