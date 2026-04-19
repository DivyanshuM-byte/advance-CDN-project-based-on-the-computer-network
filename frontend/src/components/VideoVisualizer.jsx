import React, { useState, useEffect } from 'react';

const VideoVisualizer = ({ url, isVideoVisible, onBufferUpdate }) => {
  const [loadTime, setLoadTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (url) {
      setStartTime(Date.now());
      setLoadTime(0);
      setIsBuffering(true);
      if (onBufferUpdate) onBufferUpdate(0);
    }
  }, [url]);

  if (!isVideoVisible) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video 
        src={url} 
        controls 
        autoPlay 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => {
          if (loadTime === 0) {
            const bufferDuration = Date.now() - startTime;
            setLoadTime(bufferDuration);
            setIsBuffering(false);
            if (onBufferUpdate) onBufferUpdate(bufferDuration);
          }
        }}
      />
      
      {/* Overlay to show buffering state */}
      {isBuffering && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(239, 68, 68, 0.8)', padding: '5px 10px',
          borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold'
        }}>
          Buffering...
        </div>
      )}
    </div>
  );
};

export default VideoVisualizer;
