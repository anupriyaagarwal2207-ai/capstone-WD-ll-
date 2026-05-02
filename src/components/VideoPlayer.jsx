import { useState } from 'react';

export default function VideoPlayer({ url }) {
  const [error, setError] = useState(false);

  // Extract video ID for YouTube
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(url);

  if (error || !videoId) {
    return (
      <div className="w-full aspect-video bg-slate-900 flex items-center justify-center rounded-xl overflow-hidden">
        <p className="text-white">Video unavailable</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onError={() => setError(true)}
      ></iframe>
    </div>
  );
}
