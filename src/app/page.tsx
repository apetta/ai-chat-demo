"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      (bottomRef.current as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            "self-start p-2 px-4 m-2 bg-gray-950 text-gray-50 rounded-md border-gray-700 border leading-relaxed",
            m.role === "user" && "self-end bg-blue-700 text-pink-50 border-none"
          )}
        >
          {m.content}
        </div>
      ))}
      <div ref={bottomRef} />

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md bg-gray-900 p-2 text-gray-50 placeholder:text-gray-400 mb-8 border border-gray-700 rounded shadow-xl outline-none focus-visible:outline-gray-400 focus-visible:outline-offset-0"
          value={input}
          placeholder="What's on your mind?"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
