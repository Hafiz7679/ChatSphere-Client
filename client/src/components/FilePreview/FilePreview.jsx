import { formatFileSize, getFileIcon } from "../../utils/helpers";

const FilePreview = ({ file, onRemove }) => {
  const isImage = file.type?.startsWith("image/");
  const isVideo = file.type?.startsWith("video/");

  return (
    <div className="flex items-center gap-3 bg-surface-800/50 rounded-xl p-3 border border-surface-700/30 animate-slide-up">
      {isImage ? (
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
        </div>
      ) : isVideo ? (
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-navy-900 shrink-0 flex items-center justify-center">
          <video src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-50" />
          <span className="absolute text-white text-lg">▶️</span>
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-surface-700/50 shrink-0 flex items-center justify-center text-xl">{getFileIcon(file.type)}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{file.name}</p>
        <p className="text-xs text-surface-500">{formatFileSize(file.size)}</p>
      </div>
      <button type="button" onClick={onRemove} className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-red-400 hover:bg-surface-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FilePreview;
