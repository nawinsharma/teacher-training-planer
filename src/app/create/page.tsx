"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, FileText, Copy, Download } from "lucide-react";
import { generateTrainingPlan } from "@/lib/gemini";
import jsPDF from "jspdf";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedPlan = localStorage.getItem("trainingPlan");
    if (storedPlan) {
      setPlan(storedPlan);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan("");
    localStorage.removeItem("trainingPlan");

    try {
      const result = await generateTrainingPlan(prompt);
      setPlan(result);
      localStorage.setItem("trainingPlan", result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(plan);
    alert("Training plan copied to clipboard!");
  };

  const handleDownload = () => {
    if(!plan){
      toast.warning('plan is not there buddy')
    }
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Training Plan", 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yPos = 30;
    const maxWidth = 180;
    const lineHeight = 8;
    const textContent = plan.replace(/[#*_`>-]/g, "").replace(/\n{2,}/g, "\n");
    const lines = doc.splitTextToSize(textContent, maxWidth);

    lines.forEach((line: string | string[]) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 15, yPos);
      yPos += lineHeight;
    });

    doc.save("Training_Plan.pdf");
    toast.success("your pdf is downloaded")
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 p-8 flex flex-col mt-20 items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          📚 Create Your Training Plan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-700">
              Describe your training needs
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-4 rounded-lg border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Example: I need a training session on implementing project-based learning in science classes for high school teachers..."
            />
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !prompt}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Generating Plan...</span>
              </>
            ) : (
              "Generate Training Plan"
            )}
          </button>
        </form>
      </motion.div>

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
            <FileText className="w-6 h-6 mr-2 text-indigo-600" /> Your Training Plan
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
          <div className="mt-6 flex space-x-4">
            <button onClick={handleCopy} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
              <Copy className="w-5 h-5" />
              <span>Copy</span>
            </button>
            <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}