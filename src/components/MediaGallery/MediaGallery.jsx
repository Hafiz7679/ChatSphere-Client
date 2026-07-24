import { useState, useEffect, useCallback, useRef } from "react";
import { getChatMedia } from "../../api/api";
import Loader from "../Loader/Loader";
import ImageViewer from "../ImageViewer/ImageViewer";
import { X, Image, Play, FileText, Download } from "lucide-react";

const MediaGallery = ({ chatId, onClose }) => {
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const sentinelRef = useRef(null);

  const loadMedia = useCallback(async (p) => {
    try {
      const res = await getChatMedia(chatId, { page: p, limit: 30 });
      const items = res.data.data || [];
      if (p === 1) {
        setMedia(items);
      } else {
        setMedia((prev) => [...prev, ...items]);
      }
      if (items.length < 30) setHasMore(false);
    } catch {
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [chatId]);

  useEffect(() => {
    setLoading(true);
    loadMedia(1);
  }, [loadMedia]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading]);

  useEffect(() => {
    if (page > 1) {
      loadMedia(page);
    }
  }, [page, loadMedia]);

  const isImage = (type) => type?.startsWith("image/");
  const isVideo = (type) => type?.startsWith("video/");

  const images = media.filter((m) => isImage(m.type));
  const videos = media.filter((m) => isVideo(m.type));
  const files = media.filter((m) => !isImage(m.type) && !isVideo(m.type));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-surface-900 border border-surface-700/30 rounded-2xl w-full max-w-3xl max-h-[85vh] mx-4 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700/30 shrink-0">
          <h2 className="text-lg font-semibold text-white">Media Gallery</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader size="md" /></div>
          ) : media.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-surface-500" />
              </div>
              <p className="text-surface-400 text-sm">No media shared yet</p>
            </div>
          ) : (
            <div className="space-y-8">
              {images.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Photos ({images.length})</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => setPreviewUrl(item.url)}
                        className="aspect-square rounded-xl overflow-hidden bg-surface-800 group relative"
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white truncate">{item.sender?.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {videos.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Videos ({videos.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {videos.map((item) => (
                      <div key={item._id} className="aspect-video rounded-xl overflow-hidden bg-surface-800 group relative">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {files.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Files ({files.length})</h3>
                  <div className="space-y-2">
                    {files.map((item) => (
                      <a
                        key={item._id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-800 hover:bg-surface-700 transition group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-surface-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-surface-200 truncate group-hover:text-white transition">{item.name}</p>
                          <p className="text-xs text-surface-500">{item.sender?.name}</p>
                        </div>
                        <Download className="w-4 h-4 text-surface-500 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div ref={sentinelRef} className="h-4" />
              {loadingMore && (
                <div className="flex justify-center py-4"><Loader size="sm" /></div>
              )}
            </div>
          )}
        </div>
      </div>

      {previewUrl && (
        <ImageViewer src={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </div>
  );
};

export default MediaGallery;
