"use client";

import React, { useCallback, useState } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  isProcessing?: boolean;
}

export default function UploadZone({
  onFileSelect,
  accept = ".pdf,.png,.jpg,.jpeg",
  maxSize = 10 * 1024 * 1024, // 10MB
  isProcessing = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSelect = (file: File) => {
    setError(null);
    if (file.size > maxSize) {
      setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
      return;
    }
    // Simple extension check
    // const ext = file.name.split('.').pop()?.toLowerCase();
    // if (!accept.includes(ext || '')) { ... }
    
    onFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSelect(file);
      }
    },
    [onFileSelect, maxSize]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
        isDragging
          ? "border-[#00F5FF] bg-[#00F5FF]/5"
          : "border-white/10 hover:border-white/20 bg-[#0D1117]"
      } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5FF]/10 to-[#8A2BE2]/10 flex items-center justify-center mb-2 ${isDragging ? "animate-bounce" : ""}`}>
          <svg className="w-8 h-8 text-[#00F5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {isDragging ? "Drop file here" : "Upload Document"}
          </h3>
          <p className="text-[#8B9AB5] text-sm">
            Drag & drop or click to browse
          </p>
        </div>

        <div className="flex gap-2 text-xs text-[#4A5568] font-mono mt-2">
          <span>PDF, PNG, JPG</span>
          <span>•</span>
          <span>Max 10MB</span>
        </div>

        {error && (
          <div className="text-red-400 text-xs mt-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
