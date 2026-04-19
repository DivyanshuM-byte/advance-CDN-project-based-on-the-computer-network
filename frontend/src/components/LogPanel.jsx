import React, { useEffect, useRef } from 'react';

const LogPanel = ({ logs, onClearCache, showClearBtn }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ color: '#9ca3af', fontSize: '14px' }}>Network Event Logs</h3>
        {showClearBtn && (
          <button 
            onClick={onClearCache}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'none',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
          >
            Purge Edge Cache
          </button>
        )}
      </div>

      <div className="log-panel" ref={scrollRef}>
        {logs.map((L, i) => (
          <div key={i} className={`log-line ${L.type}`}>
            <span style={{ color: '#6b7280' }}>[{L.time}]</span> {L.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogPanel;
