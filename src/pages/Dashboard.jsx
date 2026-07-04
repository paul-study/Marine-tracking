import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PHASES = [
  {
    id: 1,
    title: 'Video Upload',
    description: 'Upload marine camera footage from your devices or field deployments.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    status: 'active',
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'Automated detection and identification of fish species using computer vision.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Fish Counting',
    description: 'Accurate fish counts per frame with species-level breakdown and statistics.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Size Estimation',
    description: 'Measure fish length and estimated biomass using reference scaling techniques.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    status: 'upcoming',
  },
  {
    id: 5,
    title: 'Reports & Insights',
    description: 'Export detailed reports, trend analyses, and population health metrics.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    status: 'upcoming',
  },
];

const STATS = [
  { label: 'Videos Processed', value: '0', unit: '', icon: '🎥' },
  { label: 'Fish Counted', value: '0', unit: '', icon: '🐟' },
  { label: 'Species Identified', value: '0', unit: '', icon: '🔬' },
  { label: 'Avg. Fish Length', value: '—', unit: 'cm', icon: '📏' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploads, setUploads] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const addFiles = (files) => {
    const videoFiles = Array.from(files).filter((f) => f.type.startsWith('video/'));
    const newUploads = videoFiles.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1),
      status: 'queued',
    }));
    setUploads((prev) => [...prev, ...newUploads]);
  };

  const handleFileChange = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeUpload = (id) => setUploads((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-white">Marine Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">
              Welcome, <span className="text-cyan-400">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload footage, analyse populations, and generate marine biodiversity reports.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 border border-white/5 rounded-xl p-4"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">
                {stat.value}
                {stat.unit && <span className="text-base font-normal text-slate-400 ml-1">{stat.unit}</span>}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upload section */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upload Video Footage</h2>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
              dragging
                ? 'border-cyan-400 bg-cyan-500/5'
                : 'border-white/10 hover:border-cyan-400/50 hover:bg-white/2'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Drop videos here or click to browse</p>
              <p className="text-slate-400 text-sm mt-1">MP4, MOV, AVI up to 4 GB each</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Upload queue */}
          {uploads.length > 0 && (
            <ul className="mt-4 space-y-2">
              {uploads.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5"
                >
                  <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.size} MB · {u.status}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize">
                    {u.status}
                  </span>
                  <button
                    onClick={() => removeUpload(u.id)}
                    className="text-slate-500 hover:text-slate-300 transition ml-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 5-Phase pipeline */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Analysis Pipeline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PHASES.map((phase, idx) => (
              <div
                key={phase.id}
                className={`relative bg-slate-900 border rounded-xl p-5 flex flex-col gap-3 ${
                  phase.status === 'active'
                    ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : 'border-white/5'
                }`}
              >
                {/* Connector line (desktop) */}
                {idx < PHASES.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-white/10 z-10" />
                )}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    phase.status === 'active'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {phase.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">Phase {phase.id}</span>
                    {phase.status === 'active' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-white text-sm">{phase.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No footage uploaded yet</p>
            <p className="text-slate-500 text-xs max-w-xs">
              Upload your first marine camera video to begin the AI-powered fish counting and sizing workflow.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
