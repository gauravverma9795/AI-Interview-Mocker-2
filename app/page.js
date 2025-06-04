"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "./dashboard/_components/Header";


export default function Home() {

  const router = useRouter();
  const MoveInInterview = () => {

    router.push('/dashboard');
  }

  return (

    <div className="overflow-hidden h-screen">


      <Header />


      {/* <div className="flex justify-center items-center  relative  ">
        <img className="h-screen w-screen object-cover" src="/frontImg.jpg"/>

        <div className=" absolute flex flex-col  justify-center items-center">
      
        <h1 className="font-bold text-3xl text-green-400 flex justify-center my-10">Your Personal Al Interview Coach</h1>
        <Button  className="flex justify-center " onClick={MoveInInterview}>Get Start</Button>

        <p class="mt-4 font-bold leading-relaxed text-black">
          Developed an AI-powered interview simulation platform designed to help candidates prepare for job interviews.
          </p>

        </div>

        

    </div> */}

      <div className="flex relative  ">
        <img className="h-screen w-screen object-cover" src="/frontImg.jpg" />

        <div className="  absolute  ">

          <h1 className="px-5 font-bold italic text-5xl  text-red-900 flex justify-center my-10">Your Personal Al Interview Coach</h1>

          <div className="px-5 flex justify-center">
            <Button className="p-5 font-bold italic bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 hover-grow active-shrink" onClick={MoveInInterview}>Let's Start</Button>
          </div>

        </div>


      </div>






    </div>
  );
}
