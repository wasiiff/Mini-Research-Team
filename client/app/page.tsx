"use client";

import React, { useState } from "react";
import { Search, Upload, Eye, Loader2, FileText } from "lucide-react";
import { useAskQuestionMutation, useGetTraceQuery } from "./services/api";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AskResponse, WorkflowStep } from "./types/types";

export default function Home() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  // RTK Query hooks
  const [askQuestion, { isLoading }] = useAskQuestionMutation();
  const { data: traceData } = useGetTraceQuery(traceId!, {
    skip: !traceId,
  });

  const handleAsk = async () => {
    if (!q.trim()) return;
    try {
      const data = await askQuestion({ question: q }).unwrap();
      setResult(data);
      setTraceId(data.id);
    } catch (err) {
      console.error("Error asking question:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAsk();
    }
  };

  const handleViewTrace = () => {
    if (traceData) {
      alert(JSON.stringify(traceData, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mini Research Team
              </h1>
              <p className="text-sm text-gray-500">
                AI-powered research workflow
              </p>
            </div>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Question Input */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            What would you like to research?
          </label>
          <div className="space-y-4">
            <textarea
              id="question"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question (e.g., 'Compare SQL vs NoSQL databases')"
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Press Cmd/Ctrl + Enter to submit
              </p>
              <button
                onClick={handleAsk}
                disabled={isLoading || !q.trim()}
                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running workflow...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Ask Question
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Final Answer */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-green-800">
                      Final Answer
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-1 rounded">
                    ID: {result.id}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.trace.finalAnswer}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Trace */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Workflow Trace
                  </h3>
                  <button
                    onClick={handleViewTrace}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors duration-200 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View JSON
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {result.trace.steps.map((step: WorkflowStep, index: number) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {step.name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {step.description}
                        </p>
                        {step.data && (
                          <details className="group">
                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                              View step data
                            </summary>
                            <div className="mt-2 p-3 rounded-lg border bg-gray-900 text-gray-100 overflow-x-auto">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {typeof step.data === "string"
                                  ? step.data
                                  : "```json\n" +
                                    JSON.stringify(step.data, null, 2) +
                                    "\n```"}
                              </ReactMarkdown>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to Research
            </h3>
            <p className="text-gray-500">
              Enter your question above to start the AI research workflow
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
