'use client';

import { useState } from 'react';
import { BiUpload, BiFile } from 'react-icons/bi';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Check file type
    const validTypes = ['.pdf', '.docx', '.txt', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const isValidType = validTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // In a real application, we would upload the file to a server here
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to question generation page
      window.location.href = '/generate';
    } catch (err) {
      setError('An error occurred while uploading the file. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Document</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700'
            } ${file ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="py-8">
                <BiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-lg mb-2">Drag and drop your file here, or click to browse</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Supported formats: PDF, DOCX, TXT (Max 10MB)
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="btn btn-primary cursor-pointer inline-block"
                >
                  Select File
                </label>
              </div>
            ) : (
              <div className="py-4 flex items-center justify-center">
                <BiFile className="h-10 w-10 text-primary-500 mr-3" />
                <div className="text-left">
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button 
                  type="button"
                  className="ml-6 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => setFile(null)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload and Generate Questions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 