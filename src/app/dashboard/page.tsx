'use client';

import React, { useState, useRef } from 'react';
import { Upload, Plus, Mic, Video, Search, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/api';
import { ActionCard } from '@/components/dashboard/ActionCard';
import { DocumentRow } from '@/components/dashboard/DocumentRow';
import { useAuthStore } from '@/store/useAuthStore';

type DocType = 'pdf' | 'docx' | 'pptx';

interface Document {
  id: string;
  title: string;
  type: DocType;
  lastOpened: string;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: 'AP Art History', type: 'pdf', lastOpened: '2 hours ago' },
    { id: '2', title: 'Electrical Foundations', type: 'docx', lastOpened: '5 hours ago' },
  ]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() as DocType;
    setIsUploading(true);
    
    try {
      const response = await uploadFile(file);
      const newDoc: Document = {
        id: response.file_id || Math.random().toString(),
        title: file.name,
        type: extension,
        lastOpened: 'Just now'
      };
      setDocuments(prev => [newDoc, ...prev]);
    } catch (err) {
      alert("Upload failed. Verify backend connection.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.pptx" />

      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-white">
            HELLO, {user?.firstName?.toUpperCase() || 'SCHOLAR'}
          </h1>
          <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mt-2">Neural Engine Active</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text" 
            placeholder="Search your knowledge base..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
          />
        </div>
      </div>

      {/* Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        <ActionCard title="Blank doc" description="Start scratch" icon={Plus} iconBg="bg-indigo-500/20" onClick={() => {}} />
        <ActionCard title="Audio" description="Voice-to-Notes" icon={Mic} iconBg="bg-purple-500/20" onClick={() => {}} />
        <ActionCard title="Upload" description="PDF, DOCX, PPTX" icon={Upload} iconBg="bg-blue-500/20" onClick={() => fileInputRef.current?.click()} />
        <ActionCard title="YouTube" description="URL to Notes" icon={Video} iconBg="bg-red-500/20" onClick={() => {}} />
      </div>

      {/* List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Recent Materials</h3>
          <span className="text-[10px] text-purple-500 font-bold">{filteredDocs.length} Documents</span>
        </div>

        <div className="bg-[#111111]/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
          {isUploading && (
            <div className="p-6 flex items-center gap-4 border-b border-white/5 bg-purple-500/5 animate-pulse">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              <p className="text-sm font-bold text-purple-400">Ingesting document into neural core...</p>
            </div>
          )}
          
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <DocumentRow key={doc.id} title={doc.title} type={doc.type} lastOpened={doc.lastOpened} onAction={() => {}} />
            ))
          ) : (
            <div className="p-20 text-center text-gray-600 italic text-sm">No neural matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
}