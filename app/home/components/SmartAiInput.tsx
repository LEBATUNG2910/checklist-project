"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";

type Status = "idle" | "loading" | "success" | "error";

export default function SmartAiInput() {
  const { columns, addTask } = useTaskStore();

  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!input.trim() || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: input.trim(),
          columns: columns.map((c) => ({ id: c.id, title: c.title })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unknown error");
      }

      addTask({
        title: data.title,
        description: data.description,
        platformName: data.platformName,
        columnId: data.columnId,
      });

      setStatus("success");
      setInput("");

      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGenerate();
    if (e.key === "Escape") {
      setInput("");
      setStatus("idle");
    }
  };

  const ringColor = {
    idle: "focus-within:ring-blue-400",
    loading: "ring-2 ring-blue-300",
    success: "ring-2 ring-emerald-400",
    error: "ring-2 ring-red-300",
  }[status];

  return (
    <div className="px-4 md:px-8 pb-4 md:pb-6 shrink-0 z-10">
      <motion.div
        className={`bg-white/60 backdrop-blur-md border border-white rounded-2xl p-2.5 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:ring-2 ${ringColor} focus-within:bg-white transition-all`}
      >
        <div className="flex items-center gap-3 flex-1 w-full">
          {/* Icon */}
          <div
            className={`p-2.5 rounded-xl text-white shadow-md ml-1 shrink-0 transition-all ${
              status === "success"
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-200"
                : status === "error"
                ? "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-200"
                : "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-200"
            }`}
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : status === "error" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === "loading"}
            placeholder="Describe your task..."
            className="flex-1 bg-transparent border-none outline-none h-12 text-sm md:text-base text-slate-700 placeholder:text-slate-400 px-2 disabled:opacity-50 min-w-0"
          />

          {/* Status message */}
          <AnimatePresence mode="wait">
            {status === "error" && errorMsg && (
              <motion.span
                key="error"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="hidden md:inline-block text-xs text-red-500 font-medium max-w-[140px] text-right shrink-0"
              >
                {errorMsg}
              </motion.span>
            )}
            {status === "success" && (
              <motion.span
                key="success"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="hidden md:inline-block text-xs text-emerald-600 font-semibold shrink-0"
              >
                Card created!
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Button */}
        <Button
          onClick={handleGenerate}
          disabled={!input.trim() || status === "loading"}
          className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white h-11 px-6 rounded-xl shadow-md disabled:opacity-40 transition-all shrink-0 md:mr-1"
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          ) : (
            "AI Card Create"
          )}
        </Button>
      </motion.div>
    </div>
  );
}