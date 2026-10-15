import React, { useRef, useState, useCallback } from "react";
import { Upload, X, CheckCircle2, ImageIcon, AlertCircle, Sparkles } from "lucide-react";
import { processUploadedFile, ProcessedFile } from "../utils/fileUpload";

export interface UploadedDocumentState {
  dataUrl: string;
  name: string;
  sizeFormatted: string;
  type: string;
}

interface DocumentUploadWidgetProps {
  label: string;
  description?: string;
  acceptedTypes?: string;
  required?: boolean;
  value: UploadedDocumentState | null;
  onChange: (file: UploadedDocumentState | null) => void;
  sampleUrl?: string;
  sampleLabel?: string;
  sampleFileName?: string;
  accentColor?: string;
  maxFileSizeMB?: number;
  id?: string;
}

const DocumentUploadWidget: React.FC<DocumentUploadWidgetProps> = ({
  label,
  description,
  acceptedTypes = "image/*",
  required = false,
  value,
  onChange,
  sampleUrl,
  sampleLabel = "Use Sample Image",
  sampleFileName = "sample-image.jpg",
  accentColor = "#701525",
  maxFileSizeMB = 5,
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const acceptsImages = acceptedTypes.includes("image/*");
    const acceptsPdf = acceptedTypes.includes(".pdf") || acceptedTypes.includes("application/pdf");
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if ((!acceptsImages || !isImage) && (!acceptsPdf || !isPdf)) {
      setError(acceptsPdf ? "Unsupported file type. Choose an image or PDF." : "Unsupported file type. Choose an image.");
      return;
    }
    if (file.size > maxFileSizeBytes) {
      setError(`File too large. Max allowed: ${maxFileSizeMB}MB.`);
      return;
    }
    if (file.size === 0) {
      setError("The selected file is empty. Choose a file with content.");
      return;
    }
    setIsProcessing(true);
    try {
      const result: ProcessedFile = await processUploadedFile(file);
      onChange({ dataUrl: result.dataUrl, name: result.name, sizeFormatted: result.sizeFormatted, type: result.type });
    } catch {
      setError("Failed to process file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [acceptedTypes, maxFileSizeBytes, maxFileSizeMB, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleUseSample = async () => {
    if (!sampleUrl) return;
    setError(null);
    setIsProcessing(true);
    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const sampleFile = new File([blob], sampleFileName, { type: blob.type });
      const result = await processUploadedFile(sampleFile);
      onChange({ dataUrl: result.dataUrl, name: sampleFileName, sizeFormatted: result.sizeFormatted, type: result.type });
    } catch {
      onChange({ dataUrl: sampleUrl, name: sampleFileName, sizeFormatted: "Sample", type: "image/jpeg" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => { onChange(null); setError(null); };
  const isImage = value && (value.type.startsWith("image/") || value.dataUrl.startsWith("data:image"));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {sampleUrl && !value && (
          <button type="button" onClick={handleUseSample} disabled={isProcessing}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors disabled:opacity-50">
            <Sparkles className="w-3 h-3" />{sampleLabel}
          </button>
        )}
      </div>
      {description && <p className="text-[10px] text-gray-500">{description}</p>}

      {!value ? (
        <div id={id} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-8 px-4 text-center ${isDragging ? "border-[#701525] bg-[#701525]/5 scale-[1.01]" : "border-gray-300 bg-gray-50 hover:border-[#701525] hover:bg-gray-100"} ${isProcessing ? "opacity-60 pointer-events-none" : ""}`}>
          <input ref={fileInputRef} type="file" accept={acceptedTypes} onChange={handleInputChange} className="hidden" />
          {isProcessing ? (
            <><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: accentColor, borderTopColor: "transparent" }} /><span className="text-xs font-semibold text-gray-500">Processing…</span></>
          ) : (
            <><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}><Upload className="w-6 h-6" style={{ color: accentColor }} /></div>
            <div><p className="text-xs font-bold text-gray-700">Drag &amp; drop or <span style={{ color: accentColor }}>click to browse</span></p><p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP, PDF · Max {maxFileSizeMB}MB</p></div></>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
          {isImage && (
            <div className="relative cursor-pointer group" onClick={() => setShowPreviewModal(true)}>
              <img src={value.dataUrl} alt={value.name} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full">Click to Preview Full Size</span>
              </div>
            </div>
          )}
          {!isImage && (
            <div className="flex items-center justify-center h-24 bg-blue-50">
              <div className="text-center"><ImageIcon className="w-8 h-8 text-blue-400 mx-auto" /><span className="text-xs font-semibold text-blue-600 mt-1 block">Document Uploaded</span></div>
            </div>
          )}
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0"><p className="text-[11px] font-bold text-gray-800 truncate">{value.name}</p><p className="text-[10px] text-gray-400">{value.sizeFormatted}</p></div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {sampleUrl && <button type="button" onClick={handleUseSample} className="text-[10px] font-bold px-2 py-1 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors">Sample</button>}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">Replace</button>
              <button type="button" onClick={handleRemove} className="p-1 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Remove"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept={acceptedTypes} onChange={handleInputChange} className="hidden" />
        </div>
      )}

      {error && <div className="flex items-center gap-1.5 text-[11px] text-red-600"><AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{error}</span></div>}

      {showPreviewModal && value && isImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowPreviewModal(false)}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setShowPreviewModal(false)} className="absolute -top-10 right-0 text-white font-bold text-sm flex items-center gap-1 hover:text-gray-300"><X className="w-5 h-5" />Close Preview</button>
            <img src={value.dataUrl} alt={value.name} className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]" />
            <p className="text-white text-xs text-center mt-3 opacity-70">{value.name} · {value.sizeFormatted}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadWidget;
