"use client"

import { useEffect, useState } from "react"

export function Win2kClock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="px-2 py-0.5 font-bold text-white"
      style={{
        border: "1px solid",
        borderColor: "#888 #fff #fff #888",
        background: "#1e5caa",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11px",
      }}
    >
      {time}
    </div>
  )
}
