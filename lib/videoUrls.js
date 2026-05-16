export const isDirectVideoSource = (url = "") => {
  const cleanUrl = url.split("?")[0].toLowerCase();
  return /\.(mp4|webm|ogg|mov|m4v)$/.test(cleanUrl);
};

export const getPlayableVideoUrl = (url = "") => {
  if (!url) return "";

  if (url.includes("drive.google.com")) {
    const fileId = url.match(/[-\w]{25,}/);
    return fileId ? `https://drive.google.com/file/d/${fileId[0]}/preview` : url;
  }

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([^&?\s]+)/
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  }

  if (url.includes("vimeo.com")) {
    const videoId = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return videoId ? `https://player.vimeo.com/video/${videoId[1]}` : url;
  }

  return url;
};
