import React from 'react';
import { X } from 'lucide-react';

const VideoPlayer = ({ video, onClose }) => {
  if (!video) return null;

  // Function to determine the video embed URL based on the video URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1];
        const ampersandIndex = videoId.indexOf('&');
        if (ampersandIndex !== -1) {
          videoId = videoId.substring(0, ampersandIndex);
        }
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
        const questionMarkIndex = videoId.indexOf('?');
        if (questionMarkIndex !== -1) {
          videoId = videoId.substring(0, questionMarkIndex);
        }
      }
      
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1].split('/')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // For direct video file URLs (mp4, webm, etc.), return the URL directly
    if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
      return url;
    }
    
    // Return the original URL if it doesn't match known patterns
    return url;
  };

  const embedUrl = getEmbedUrl(video.video_url);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800 truncate max-w-[80%]">{video.title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="relative pt-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            ></iframe>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Unable to load video</p>
            </div>
          )}
        </div>
        
        {video.thumbnail_url && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <img 
                src={video.thumbnail_url} 
                alt={video.title} 
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-gray-800">{video.title}</p>
                <p className="text-sm text-gray-500">Thumbnail</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;