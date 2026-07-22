import { useState, useEffect, useCallback } from "react";

const ImageViewer = ({ src, onClose }) => {
  const [zoom, setZoom] = useState(1);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = src.split("/").pop() || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-surface-800/80 backdrop-blur-md rounded-xl px-2 py-1.5 border border-surface-700/30">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.25, z - 0.25)); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-700 transition text-lg"
          >
            −
          </button>
          <span className="text-xs text-surface-400 w-10 text-center font-medium">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(5, z + 0.25)); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-700 transition text-lg"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-700/80 transition bg-surface-800/80 backdrop-blur-md border border-surface-700/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-700/80 transition bg-surface-800/80 backdrop-blur-md border border-surface-700/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <img
        src={src}
        alt="Preview"
        className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out animate-scale-in cursor-default"
        style={{ transform: `scale(${zoom})` }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageViewer;
