'use client';
import React, { useState, useRef } from 'react';
import { FileUp, Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { uploadFile } from '@/lib/api';

interface FileUploadZoneProps {
  onSuccess: (file: File, fileId: string) => void;
}

export default function FileUploadZone({ onSuccess }: FileUploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadFile(file);
      onSuccess(file, res.file_id);
    } catch (err) {
      alert("Upload failed. Try a smaller PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-[2rem] bg-[#0f0f0f] border border-white/5 text-center">
      <input 
        type="file" ref={fileInputRef} className="hidden" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer py-12 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 transition-all mb-6"
      >
        <FileUp className="mx-auto w-10 h-10 text-gray-500 mb-4" />
        <p className="text-gray-400">{file ? file.name : "Select Study Material (PDF)"}</p>
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-white/5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
        {loading ? "Analyzing..." : "Initialize Neural Scan"}
      </button>
    </div>
  );
}