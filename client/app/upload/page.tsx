"use client";
import React, { useState } from 'react';
import { Upload, FileText, ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useUploadDocMutation } from '../services/api';
import Link from 'next/link';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [uploadDoc, { isLoading }] = useUploadDocMutation();

  const upload = async () => {
    if (!title.trim() || !topic.trim() || !content.trim()) {
      setMsg('Please fill in all fields');
      return;
    }

    try {
      await uploadDoc({ title, topic, content }).unwrap();
      setSuccess(true);
      setMsg('Document uploaded successfully!');
      setTimeout(() => {
        setTitle('');
        setTopic('');
        setContent('');
        setSuccess(false);
        setMsg('');
      }, 2000);
    } catch (err: any) {
      setMsg(err?.data?.error || 'Upload failed');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      upload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
              <p className="text-sm text-gray-500">Add knowledge to your research team</p>
            </div>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Research
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Document Details</h2>
          </div>

          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter a descriptive title for your document"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic/Category
              </label>
              <input
                id="topic"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="e.g., Technology, Business, Research, etc."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Document Content
              </label>
              <textarea
                id="content"
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Paste or type your document content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <p className="mt-1 text-sm text-gray-500">
                {content.length} characters • Press Cmd/Ctrl + Enter to upload
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                All fields are required
              </div>
              <button 
                onClick={upload} 
                disabled={isLoading || !title.trim() || !topic.trim() || !content.trim()}
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {msg && (
          <div className={`mt-6 rounded-xl border p-4 ${
            success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {success ? (
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${
                  success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {success ? 'Success!' : 'Error'}
                </h3>
                <div className={`mt-1 text-sm ${
                  success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {success ? (
                    msg
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {msg}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Upload Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Choose a clear, descriptive title that summarizes the document</li>
            <li>• Use specific topics/categories to help with research organization</li>
            <li>• Include complete content - this will be used by the AI research team</li>
            <li>• The document will be processed and added to the knowledge base</li>
          </ul>
        </div>
      </div>
    </div>
  );
}