import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentPreviewProps {
  src: string;
  alt: string;
  fileName?: string;
  className?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ src, alt, fileName, className = '' }) => {
  const isImage = src.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg)(?:[?#]|$)/i.test(src);

  return (
    <a href={src} target="_blank" rel="noreferrer" aria-label={`Open ${alt}`} className={`block ${className}`}>
      {isImage ? (
        <img src={src} alt={alt} className="w-full h-full object-cover rounded-xl" />
      ) : (
        <div className="w-full h-full min-h-0 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 p-3 text-center">
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="text-[10px] font-bold text-blue-700">Open uploaded document</span>
          {fileName && <span className="max-w-full truncate text-[9px] text-gray-500">{fileName}</span>}
        </div>
      )}
    </a>
  );
};

export default DocumentPreview;
