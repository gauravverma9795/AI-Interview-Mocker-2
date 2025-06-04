"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function NewQuizCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        h-40 w-full md:w-64 
        bg-gray-100 border-2 border-dashed border-gray-300 
        rounded-lg flex flex-col justify-center items-center 
        cursor-pointer hover:bg-gray-200 transition-colors
      "
    >
      <Plus className="w-8 h-8 text-gray-500" />
      <span className="mt-2 text-lg font-medium text-gray-600">
        Add New
      </span>
    </div>
  );
}
