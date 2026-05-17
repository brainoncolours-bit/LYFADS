import React from 'react';
import { X } from 'lucide-react';
import { getPlayableVideoUrl, isDirectVideoSource } from '@/lib/videoUrls';

const VideoPlayer = ({ video, onClose }) => {
  if (!video) return null;

  const embedUrl = getPlayableVideoUrl(video.video_url);
  const isDirectVideo = isDirectVideoSource(embedUrl);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white hover:text-black"
        aria-label="Close video"
      >
        <X size={24} />
      </button>

      {embedUrl ? (
        isDirectVideo ? (
          <video
            src={embedUrl}
            className="h-full w-full bg-black object-contain"
            controls
            autoPlay
            playsInline
            preload="metadata"
            title={video.title}
          />
        ) : (
          <iframe
            src={embedUrl}
            className="h-full w-full bg-black"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black">
          <p className="text-white/60">Unable to load video</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
