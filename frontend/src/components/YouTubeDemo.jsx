import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import { AlertCircle, Play, Info } from 'lucide-react';

const YouTubeDemo = () => {
  const [urlInput, setUrlInput] = useState('https://www.youtube.com/watch?v=LXb3EKWsInQ');
  const [videoId, setVideoId] = useState('LXb3EKWsInQ');
  
  const [status, setStatus] = useState('Idle');
  const [iframeLoadTime, setIframeLoadTime] = useState(0);
  const [bufferDelay, setBufferDelay] = useState(0);
  const [playbackSmoothness, setPlaybackSmoothness] = useState('Neutral');

  const startMountTimeRef = useRef(0);
  const playTriggerTimeRef = useRef(0);
  const bufferingCountRef = useRef(0);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleLoad = (e) => {
    e.preventDefault();
    const id = extractVideoId(urlInput);
    if (id) {
      setVideoId(id);
      // Reset metrics
      setStatus('Loading Framework...');
      setIframeLoadTime(0);
      setBufferDelay(0);
      setPlaybackSmoothness('Evaluating...');
      startMountTimeRef.current = performance.now();
      bufferingCountRef.current = 0;
    } else {
      setStatus('Invalid YouTube URL');
    }
  };

  const onReady = (event) => {
    setStatus('Ready to Play');
    if (startMountTimeRef.current > 0) {
      setIframeLoadTime(performance.now() - startMountTimeRef.current);
    }
  };

  const onPlay = (event) => {
    // When the user actually hits play, start the clock if not already playing
    if (playTriggerTimeRef.current === 0) {
      playTriggerTimeRef.current = performance.now();
      setStatus('Buffering Stream...');
    }
  };

  const onStateChange = (event) => {
    // Player modes: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === 3) {
      // Buffering
      bufferingCountRef.current += 1;
      setStatus('Buffering...');
    }
    
    if (event.data === 1) {
      setStatus('Playing');
      
      // Calculate start delay natively
      if (bufferDelay === 0 && playTriggerTimeRef.current > 0) {
        setBufferDelay(performance.now() - playTriggerTimeRef.current);
      }
      
      // Calculate smoothness
      if (bufferingCountRef.current === 1) {
        setPlaybackSmoothness('Very Smooth (Instant)');
      } else if (bufferingCountRef.current === 2) {
        setPlaybackSmoothness('Smooth (Slight Start Delay)');
      } else if (bufferingCountRef.current > 2) {
        setPlaybackSmoothness('Heavy Buffering (Stalling)');
      }
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1
    },
  };

  return (
    <div className="youtube-demo-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '13px' }}>
          <AlertCircle size={16} /> 
          <b>Note:</b> Internal CDN metrics like cache hit/miss, edge server, and exact geographical TTFB cannot be forcibly accessed for third-party YouTube videos due to Cross-Origin platform restrictions. This module performs frontend visual approximations exclusively.
        </p>
      </div>

      <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '20px' }}>
        <input 
          type="text" 
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="auth-input"
          style={{ marginBottom: 0, flexGrow: 1 }}
        />
        <button className="primary-btn" onClick={handleLoad} style={{ width: '150px', background: 'var(--accent-red)' }}>
          Load Video
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', height: '400px' }}>
        
        {/* PLAYER WRAPPER */}
        <div className="media-preview-box" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
          {videoId ? (
            <div style={{ width: '100%', height: '100%' }}>
              <YouTube 
                videoId={videoId} 
                opts={opts} 
                onReady={onReady} 
                onPlay={onPlay}
                onStateChange={onStateChange}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ) : (
             <div style={{ color: '#6b7280' }}>Waiting for valid video...</div>
          )}
        </div>

        {/* EXTERNAL METRICS BAR */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '14px', color: '#9ca3af', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Info size={16} /> Real-World Evaluation
          </h3>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', flexGrow: 1 }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Current Status</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: status === 'Playing' ? '#10b981' : '#f59e0b' }}>{status}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Iframe Load Time</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{iframeLoadTime > 0 ? `${iframeLoadTime.toFixed(0)} ms` : '-'}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Buffer Delay (Wait)</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{bufferDelay > 0 ? `${bufferDelay.toFixed(0)} ms` : '-'}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Playback Smoothness</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', marginTop: '5px' }}>
                {playbackSmoothness}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default YouTubeDemo;
