"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

import { CoreMessage } from "ai";
import { continueConversation } from "../actions";
import { readStreamableValue } from "ai/rsc";

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      (bottomRef.current as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m, i) => (
        <div
          key={i}
          className={cn(
            "self-start p-2 px-4 m-2 bg-gray-950 text-gray-50 rounded-md border-gray-700 border leading-relaxed selection:bg-gray-100 selection:text-gray-950",
            m.role === "user" &&
              "self-end bg-blue-700 text-pink-50 border-none selection:bg-pink-400 selection:text-pink-950"
          )}
        >
          {m.content as string}
        </div>
      ))}
      <div ref={bottomRef} />

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: "user" },
          ];

          setMessages(newMessages);
          setInput("");

          const result = await continueConversation(newMessages);

          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md bg-gray-900 p-2 text-gray-50 placeholder:text-gray-400 mb-8 border border-gray-700 rounded shadow-xl outline-none focus-visible:outline-gray-400 focus-visible:outline-offset-0"
          value={input}
          placeholder="What's on your mind?"
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
