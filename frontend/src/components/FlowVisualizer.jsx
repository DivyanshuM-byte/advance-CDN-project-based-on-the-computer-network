import React, { useEffect, useState } from 'react';
import { Server, Globe, Database } from 'lucide-react';

const FlowVisualizer = ({ mode, edgeId, fireTrigger }) => {
  const [animatingClientToEdge, setAnimatingClientToEdge] = useState(false);
  const [animatingEdgeToOrigin, setAnimatingEdgeToOrigin] = useState(false);

  useEffect(() => {
    if (fireTrigger > 0) {
      // Start flow
      setAnimatingClientToEdge(true);
      
      const clientToEdgeTime = 1000; // mapped to CSS animation
      
      setTimeout(() => {
        setAnimatingClientToEdge(false);
        // If it's origin or miss, it needs to hit the origin
        if (mode === 'origin' || fireTrigger === 2) { 
          // fireTrigger === 2 means cache miss
          setAnimatingEdgeToOrigin(true);
          setTimeout(() => setAnimatingEdgeToOrigin(false), 1000);
        }
      }, clientToEdgeTime);
    }
  }, [fireTrigger, mode]);

  return (
    <div className="glass-card" style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '10px' }}>Request Routing Topology</h3>
      <div className="flow-container">
        
        <div className="node active">
          <Globe size={32} color="#3b82f6" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Client User</div>
        </div>

        <div className="line">
          {animatingClientToEdge && <div className="data-packet animate"></div>}
        </div>

        <div className={`node ${mode === 'cdn' ? 'active' : ''}`} style={{ borderColor: mode === 'cdn' ? '#10b981' : '' }}>
          <Server size={32} color={mode === 'cdn' ? '#10b981' : '#6b7280'} style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Edge: {mode === 'cdn' ? edgeId : '(Bypassed)'}</div>
        </div>

        <div className="line">
          {animatingEdgeToOrigin && <div className="data-packet animate" style={{ background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></div>}
        </div>

        <div className="node" style={{ borderColor: (mode === 'origin' || fireTrigger === 2) ? '#ef4444' : 'rgba(255,255,255,0.1)' }}>
          <Database size={32} color={(mode === 'origin' || fireTrigger === 2) ? '#ef4444' : '#6b7280'} style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Origin Server</div>
        </div>

      </div>
    </div>
  );
};

export default FlowVisualizer;
