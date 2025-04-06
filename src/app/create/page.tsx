"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, FileText, Copy, Download } from "lucide-react";
import { generateTrainingPlan } from "@/lib/gemini";
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

 
     const handleDownload = useCallback(async () => {
         // PDF generation code remains the same
         if (!plan) return;
 
         try {
             const { default: jsPDF } = await import('jspdf');
 
             const doc = new jsPDF();
 
             // Add attribution at the top with clickable link
             doc.setFontSize(10);
             doc.setFont('helvetica', 'italic');
             doc.text('Created by nawin - ', 10, 10);
 
             // Add clickable link right after the text
             const textWidth =
                 (doc.getStringUnitWidth('Created by nawin - ') * 10) /
                 doc.internal.scaleFactor;
             doc.setTextColor(0, 0, 255); // Blue color for the link
             doc.textWithLink(
                 'https://nawin.xyz/',
                 10 + textWidth,
                 10,
                 {
                     url: 'https://nawin.xyz/',
                     target: '_blank',
                 }
             );
 
             // Reset text color for the rest of the document
             doc.setTextColor(0, 0, 0);
             doc.line(10, 12, 200, 12);
 
             // Set font size to 12 for main content
             doc.setFontSize(12);
 
             // Process markdown content to preserve formatting
             const boldSections = [];
             let match;
             const boldRegex = /\*\*(.*?)\*\*/g;
             while ((match = boldRegex.exec(plan)) !== null) {
                 boldSections.push(match[1]);
             }
 
             // Replace markdown syntax but preserve bold text for special handling
             const processedText = plan
                 .replace(/\n#/g, '\n')
                 .replace(/#{1,6}\s/g, '')
                 .replace(/\*/g, '');
 
 
             // Split text into lines with appropriate width for the font size
             const textLines = doc.splitTextToSize(processedText, 190);
 
             // Check if there's an answer key section
             const answerKeyIndex: number = textLines.findIndex(
                 (line: string) =>
                     line.includes('Answer Key for Teachers') ||
                     line.includes('Answer Key') ||
                     line.includes('Answers for Teachers')
             );
 
             // Add content to PDF, handling pagination automatically
             let yPosition = 20; // Start below the attribution
             const lineHeight = 6; // For normal text
 
             for (let i = 0; i < textLines.length; i++) {
                 // Check if this is the start of the answer key section
                 if (i === answerKeyIndex) {
                     // Force a new page for the answer key
                     doc.addPage();
                     yPosition = 15; // Reset position to top of new page
                 }
                 // Otherwise add a new page if the current position exceeds the page height
                 else if (yPosition > 280) {
                     doc.addPage();
                     yPosition = 15; // Start a bit higher on subsequent pages
                 }
 
                 const currentLine = textLines[i];
 
                 // Check if this line contains any bold sections
                 const containsBold = boldSections.some((section) =>
                     currentLine.includes(section)
                 );
 
                 if (containsBold) {
                     // If line contains bold text, need to render it with mixed formatting
                     let xPosition = 10;
                     let remainingLine = currentLine;
 
                     // For each bold section in this line
                     for (const boldText of boldSections) {
                         if (remainingLine.includes(boldText)) {
                             const parts = remainingLine.split(boldText);
 
                             // Render text before bold section
                             if (parts[0]) {
                                 doc.setFont('helvetica', 'normal');
                                 doc.text(parts[0], xPosition, yPosition);
                                 xPosition +=
                                     (doc.getStringUnitWidth(parts[0]) * 12) /
                                     doc.internal.scaleFactor;
                             }
 
                             // Render bold section
                             doc.setFont('helvetica', 'bold');
                             doc.text(boldText, xPosition, yPosition);
                             xPosition +=
                                 (doc.getStringUnitWidth(boldText) * 12) /
                                 doc.internal.scaleFactor;
 
                             // Update remaining line
                             remainingLine = parts.slice(1).join(boldText);
                         }
                     }
 
                     // Render any remaining text
                     if (remainingLine) {
                         doc.setFont('helvetica', 'normal');
                         doc.text(remainingLine, xPosition, yPosition);
                     }
                 } else {
                     // Normal line without bold text
                     doc.setFont('helvetica', 'normal');
                     doc.text(currentLine, 10, yPosition);
                 }
 
                 yPosition += lineHeight;
             }
 
             doc.save(`nawin.pdf`);
         } catch (error) {
             console.error('Error generating PDF:', error);
             toast.error('Failed to generate PDF. Please try again.');
         }
     }, [plan]);
 

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