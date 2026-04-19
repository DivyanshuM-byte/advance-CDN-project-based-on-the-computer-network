import React, { useState, useEffect } from 'react';
import { Activity, Image as ImageIcon, Video, LogOut, Zap, RefreshCw, Database, MonitorPlay } from 'lucide-react';
import MetricsGraph from './MetricsGraph';
import FlowVisualizer from './FlowVisualizer';
import LogPanel from './LogPanel';
import VideoVisualizer from './VideoVisualizer';
import YouTubeDemo from './YouTubeDemo';

const ASSETS = {
  image1: '/images/test1.png',
  image2: '/images/test2.png',
  video: '/video/test.mp4'
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Dashboard = ({ onLogout }) => {
  const [activeModule, setActiveModule] = useState('simulator'); // 'simulator' | 'youtube'
  const [mode, setMode] = useState('cdn'); 
  const [edgeId, setEdgeId] = useState('edge-frankfurt');
  const [assetType, setAssetType] = useState('image1');
  
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({ ttfb: 0, loadTime: 0, status: '-', source: '-', bufferTime: null });
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(null);
  
  const [flowTrigger, setFlowTrigger] = useState(0); 

  const addLog = (msg, type) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const clearCache = async () => {
    try {
      await fetch(`${BASE_URL}/cdn/cache`, { method: 'DELETE' });
      addLog('CDN Cache Cleared Manually', 'route');
    } catch (e) {
      addLog('Failed to clear cache', 'miss');
    }
  };

  const loadAsset = async (isManual = false) => {
    setLoading(true);
    setFlowTrigger(0);
    setMetrics({ ttfb: 0, loadTime: 0, status: '-', source: '-', bufferTime: null });

    const resourcePath = ASSETS[assetType];
    const fetchMode = mode;
    
    let url = '';
    if (fetchMode === 'origin') {
      url = `${BASE_URL}/origin${resourcePath}`;
    } else {
      url = `${BASE_URL}/cdn/${edgeId}${resourcePath}`;
    }

    addLog(`Requesting ${assetType} via ${fetchMode.toUpperCase()}...`, 'route');

    if (assetType === 'video') {
      const videoDirectUrl = `${url}?cb=${new Date().getTime()}`;
      setCurrentMedia(videoDirectUrl);
      setLoading(false);
      setFlowTrigger(fetchMode === 'cdn' ? 1 : 2);
      
      setMetrics(prev => ({
        ...prev,
        status: fetchMode === 'cdn' ? 'Checking Edge...' : 'Origin Direct',
        source: fetchMode === 'cdn' ? edgeId : 'Origin Server'
      }));
      return;
    }

    setCurrentMedia(null);
    const startTime = performance.now();
    try {
      const fetchUrl = `${url}?cb=${new Date().getTime()}`;
      const response = await fetch(fetchUrl);
      
      const ttfbTime = performance.now();
      const ttfbNum = (ttfbTime - startTime).toFixed(0);
      
      const cacheStatus = response.headers.get('x-cache-status');
      const headerEdge = response.headers.get('x-edge-server');
      const source = response.headers.get('source');
      
      const isHit = cacheStatus === 'HIT';

      if (fetchMode === 'cdn') {
        if (isHit) {
          addLog(`Cache Hit ✅ → Served from ${headerEdge}`, 'hit');
          setFlowTrigger(1); 
        } else {
          addLog(`Cache Miss ❌ → Fetching from Origin via ${headerEdge}`, 'miss');
          setFlowTrigger(2); 
        }
      } else {
        addLog(`Served from Origin Server (${ttfbNum}ms)`, 'miss');
        setFlowTrigger(2); 
      }

      const blob = await response.blob();
      const endTime = performance.now();
      const totalLoadTime = (endTime - startTime).toFixed(0);

      setMetrics({
        ttfb: ttfbNum,
        loadTime: totalLoadTime,
        status: cacheStatus ? (isHit ? 'HIT ✅' : 'MISS ❌') : 'N/A',
        source: headerEdge ? `Edge Server (${headerEdge})` : 'Origin Server',
        bufferTime: null
      });

      const newChartData = [...chartData, { time: new Date().toLocaleTimeString(), latency: Math.max(0, parseInt(ttfbNum)) }];
      if (newChartData.length > 15) newChartData.shift();
      setChartData(newChartData);

      const objectUrl = URL.createObjectURL(blob);
      setCurrentMedia(objectUrl);
      
    } catch (err) {
      addLog(`Error fetching asset: ${err.message}`, 'miss');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    addLog('System Initialized', 'hit');
  }, []);

  const handleBufferUpdate = (bufferDuration) => {
    setMetrics(prev => ({
      ...prev,
      bufferTime: bufferDuration > 0 ? (bufferDuration / 1000).toFixed(2) : prev.bufferTime,
      loadTime: bufferDuration > 0 ? bufferDuration : prev.loadTime
    }));
  };

  const themeClass = mode === 'cdn' ? 'theme-cdn' : 'theme-origin';

  return (
    <div className={`dashboard-layout ${themeClass}`}>
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap className="icon-theme" /> Velocity Edge
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '5px' }}>Performance Monitoring</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '10px' }}>Module View</h4>
          <button 
             className="mode-btn"
             onClick={() => setActiveModule('simulator')}
             style={{ width: '100%', marginBottom: '10px', background: activeModule === 'simulator' ? 'rgba(255,255,255,0.1)' : '', border: activeModule === 'simulator' ? '1px solid rgba(255,255,255,0.3)' : '' }}
          >
             <Activity size={18}/> Edge Simulator
          </button>
          <button 
             className="mode-btn"
             onClick={() => setActiveModule('youtube')}
             style={{ width: '100%', background: activeModule === 'youtube' ? 'rgba(239, 68, 68, 0.2)' : '', border: activeModule === 'youtube' ? '1px solid #ef4444' : '' }}
          >
             <MonitorPlay size={18} color={activeModule === 'youtube' ? '#ef4444' : 'white'} /> External YouTube Demo
          </button>
        </div>

        {activeModule === 'simulator' && (
          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <h4 style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '10px' }}>Network Mode</h4>
            <button 
              className={`mode-btn cdn-selector ${mode === 'cdn' ? 'active-cdn' : ''}`}
              onClick={() => { setMode('cdn'); addLog('Switched to CDN Edge Network', 'route'); }}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              <Activity size={18}/> With CDN 🚀
            </button>
            <button 
              className={`mode-btn origin-selector ${mode === 'origin' ? 'active-origin' : ''}`}
              onClick={() => { setMode('origin'); addLog('Switched to Direct Origin (No CDN)', 'route'); }}
              style={{ width: '100%' }}
            >
              <Database size={18}/> Without CDN 🐌
            </button>
          </div>
        )}

        {(activeModule === 'simulator' && mode === 'cdn') && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '10px' }}>Routing Options</h4>
            <select 
              value={edgeId} 
              onChange={(e) => { setEdgeId(e.target.value); addLog(`Routed to ${e.target.value}`, 'route'); }}
              style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', outline: 'none' }}
            >
              <option value="edge-frankfurt">Edge N1 - Frankfurt</option>
              <option value="edge-newyork">Edge N2 - New York</option>
              <option value="edge-tokyo">Edge N3 - Tokyo</option>
            </select>
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'none' }}>
            <LogOut size={16}/> End Session
          </button>
        </div>
      </div>

      {activeModule === 'youtube' ? (
         <div className="main-content" style={{ gridColumn: '2 / 4' }}>
            <div style={{ marginBottom: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Real-World Streaming Demo (YouTube)</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Evaluating third-party stream buffer loading delays directly on the frontend browser plane.</p>
            </div>
            <YouTubeDemo />
         </div>
      ) : (
        <>
          {/* MAIN CONTENT CENTER (SIMULATOR) */}
          <div className="main-content">
            <FlowVisualizer mode={mode} edgeId={edgeId} fireTrigger={flowTrigger} />

            <div className="glass-card" style={{ display: 'flex', gap: '15px', padding: '15px' }}>
               <button className={`mode-btn ${assetType === 'image1' ? (mode==='cdn'?'active-cdn':'active-origin') : ''}`} onClick={() => setAssetType('image1')}>
                 <ImageIcon size={16}/> Image 1
               </button>
               <button className={`mode-btn ${assetType === 'image2' ? (mode==='cdn'?'active-cdn':'active-origin') : ''}`} onClick={() => setAssetType('image2')}>
                 <ImageIcon size={16}/> Image 2
               </button>
               <button className={`mode-btn ${assetType === 'video' ? (mode==='cdn'?'active-cdn':'active-origin') : ''}`} onClick={() => setAssetType('video')}>
                 <Video size={16}/> Video Stream
               </button>
               
               <button 
                 className="mode-btn theme-sync-btn" 
                 style={{ marginLeft: 'auto', fontWeight: 'bold' }} 
                 onClick={() => loadAsset(true)}
               >
                 <RefreshCw size={16} /> Fetch Asset
               </button>
            </div>

            <div className="media-preview-box">
               {loading && <div className="loading-overlay">Requesting Content...</div>}
               
               {!loading && currentMedia && assetType !== 'video' && (
                 <img src={currentMedia} alt="Rendered Preview" />
               )}

               <VideoVisualizer 
                 url={assetType === 'video' ? currentMedia : null} 
                 isVideoVisible={assetType === 'video' && currentMedia} 
                 onBufferUpdate={handleBufferUpdate}
               />
            </div>
          </div>

          {/* RIGHT SIDEBAR - METRICS */}
          <div className="right-panel">
            
            <div className="metric-card metrics-summary">
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '10px' }}>
                 <h3 style={{ fontSize: '1rem', color: '#fff' }}>Mode: {mode === 'cdn' ? 'With CDN 🚀' : 'Without CDN 🐌'}</h3>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li><strong>TTFB:</strong> {metrics.ttfb > 0 ? `${metrics.ttfb} ms` : '-'}</li>
                <li><strong>Load Time:</strong> {metrics.loadTime > 0 ? `${(metrics.loadTime / 1000).toFixed(2)} s` : '-'}</li>
                <li><strong>Cache:</strong> 
                  <span style={{ 
                    color: metrics.status.includes('HIT') ? '#10b981' : (metrics.status.includes('MISS') ? '#ef4444' : '#fff'),
                    marginLeft: '5px', fontWeight: 'bold'
                  }}>
                    {metrics.status}
                  </span>
                </li>
                <li><strong>Source:</strong> {metrics.source}</li>
                {assetType === 'video' && (
                  <li><strong>Buffer Time:</strong> {metrics.bufferTime ? `${metrics.bufferTime} s` : 'Waiting...'}</li>
                )}
              </ul>
            </div>

            <MetricsGraph data={chartData} />

            <div style={{ flexGrow: 1, marginTop: '20px' }}>
              <LogPanel logs={logs} showClearBtn={mode === 'cdn'} onClearCache={clearCache} />
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;
