"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"


export default function Header() {
  const router = useRouter()
  const path = usePathname()

  // Initialize darkMode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("theme")
    if (stored) return stored === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  // Whenever darkMode changes, update <html> class and localStorage
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  // Navigation helpers
  const go = (to) => router.push(to)

  return (
    <div className="flex items-center justify-between p-4 bg-secondary shadow-sm">
      <Image src="/logo.svg" width={160} height={100} alt="logo" />

      <div className="flex-1 flex justify-center">
       
      </div>

      <div className="flex items-center gap-6">
        <ul className="hidden md:flex gap-6">
          <li
            onClick={() => go("/dashboard")}
            className={`
              cursor-pointer hover:text-primary hover:font-bold transition
              ${path === "/dashboard" ? "text-primary font-bold" : ""}
            `}
          >
            Dashboard
          </li>
          <li
            onClick={() => go("/dashboard/questions")}
            className={`
              cursor-pointer hover:text-primary hover:font-bold transition
              ${path === "/dashboard/questions" ? "text-primary font-bold" : ""}
            `}
          >
            Quiz
          </li>
          <li
            onClick={() => go("/dashboard/upgrade")}
            className={`
              cursor-pointer hover:text-primary hover:font-bold transition
              ${path === "/dashboard/upgrade" ? "text-primary font-bold" : ""}
            `}
          >
            Upgrade
          </li>
          <li
             
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle Dark Mode"
          className="
            relative inline-flex items-center justify-between
            w-16 h-8 p-1 overflow-hidden rounded-full
            bg-gray-200 dark:bg-gray-800
            transition-colors duration-300 focus:outline-none
            cursor-pointer
          "
        >
          <SunIcon
            className={`
              w-6 h-6 text-yellow-500
              transform transition-transform duration-300
              ${darkMode ? "-translate-x-10 opacity-0" : "translate-x-0 opacity-100"}
            `}
          />
          <MoonIcon
            className={`
              w-6 h-6 text-indigo-200
              transform transition-transform duration-300
              ${darkMode ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
            `}
          />
          <span
            className={`
              absolute left-1 top-1
              w-6 h-6 bg-white rounded-full shadow-md
              transform transition-transform duration-300
              ${darkMode ? "translate-x-8" : "translate-x-0"}
            `}
          />
        
          </li>
        </ul>
        <UserButton />
      </div>
    </div>
  )
}
