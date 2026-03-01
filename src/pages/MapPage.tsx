import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { countyData } from '../lib/data';
import { Search, ChevronRight, Compass, ArrowUpRight, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Realistic SVG Paths for Maryland Counties
const countyPaths: Record<string, string> = {
  'garrett': 'M 10,120 L 80,120 L 80,180 L 10,180 Z',
  'allegany': 'M 80,120 L 150,120 L 150,150 L 170,160 L 170,180 L 80,180 Z',
  'washington': 'M 150,120 L 220,120 L 220,150 L 210,170 L 170,180 L 170,160 L 150,150 Z',
  'frederick': 'M 220,120 L 280,120 L 300,160 L 270,200 L 220,180 L 220,150 Z',
  'montgomery': 'M 270,200 L 300,160 L 350,190 L 370,230 L 340,260 L 310,250 Z',
  'carroll': 'M 280,120 L 340,120 L 360,160 L 300,160 Z',
  'howard': 'M 300,160 L 360,160 L 380,190 L 350,190 Z',
  'baltimore-county': 'M 340,120 L 410,120 L 410,170 L 360,160 Z',
  'baltimore-city': 'M 370,165 L 395,165 L 395,185 L 370,185 Z',
  'harford': 'M 410,120 L 460,120 L 480,160 L 410,170 Z',
  'cecil': 'M 460,120 L 520,120 L 520,160 L 480,160 Z',
  'kent': 'M 480,160 L 520,160 L 540,200 L 490,200 Z',
  'queen-annes': 'M 490,200 L 540,200 L 550,240 L 500,240 Z',
  'caroline': 'M 540,200 L 580,200 L 580,260 L 550,240 Z',
  'talbot': 'M 500,240 L 550,240 L 540,280 L 510,280 Z',
  'dorchester': 'M 510,280 L 580,260 L 600,320 L 530,340 Z',
  'wicomico': 'M 580,260 L 640,260 L 640,300 L 600,320 Z',
  'somerset': 'M 600,320 L 640,300 L 640,360 L 580,360 Z',
  'worcester': 'M 640,260 L 700,260 L 700,360 L 640,360 Z',
  'anne-arundel': 'M 360,160 L 410,170 L 440,230 L 390,240 L 380,190 Z',
  'prince-georges': 'M 340,260 L 370,230 L 390,240 L 420,300 L 380,340 Z',
  'calvert': 'M 420,300 L 440,230 L 460,260 L 450,320 Z',
  'charles': 'M 310,250 L 340,260 L 380,340 L 330,360 L 300,320 Z',
  'st-marys': 'M 380,340 L 450,320 L 460,360 L 410,380 Z'
};

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState(searchParams.get('query') || '');
  const [hoveredCounty, setHoveredCounty] = React.useState<string | null>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const filteredCounties = Object.values(countyData).filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getRiskColor = (level: string) => {
    if (level === 'High') return 'fill-rose-500 hover:fill-rose-600';
    if (level === 'Moderate') return 'fill-amber-500 hover:fill-amber-600';
    return 'fill-emerald-500 hover:fill-emerald-600';
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col pt-12">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none"></div>

      {/* Header */}
      <section className="relative z-20 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-morphism border text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 glow-text"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              Strategic Risk Analysis
            </motion.div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Intelligence <span className="text-orange-600 dark:text-orange-500">Map</span></h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl font-medium">Select a regional node to access localized firearm incident protocols and risk assessments.</p>
          </div>

          <div className="w-full md:w-96 relative group">
            <div className="absolute -inset-1 bg-orange-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search node identifier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 backdrop-blur-xl transition-all font-bold shadow-lg shadow-slate-900/5 dark:shadow-none"
              />
            </div>

            {/* Autocomplete */}
            <AnimatePresence>
              {searchTerm && filteredCounties.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden z-50"
                >
                  {filteredCounties.slice(0, 5).map(c => (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/report/${c.id}`)}
                      className="w-full px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-black uppercase italic text-sm">{c.name}</span>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{c.riskLevel} Risk Profile</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Map Container */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden min-h-[600px]">
        {/* Compass Rose */}
        <div className="absolute top-8 right-8 text-slate-300 dark:text-slate-800 hidden lg:flex flex-col items-center">
          <Compass className="w-24 h-24 mb-2 opacity-50" />
          <span className="text-[10px] font-black tracking-widest uppercase opacity-30">MD Grid Coordinate 0.0</span>
        </div>

        <motion.svg
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewBox="0 0 800 450"
          className="w-full h-full max-w-5xl drop-shadow-[0_20px_60px_rgba(30,41,59,0.1)] dark:drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
          onMouseMove={handleMouseMove}
        >
          {/* Chesapeake Bay */}
          <path
            d="M 440,230 L 460,260 L 480,280 L 510,280 L 530,340 L 580,360 L 580,450 L 440,450 Z"
            fill="url(#bayGradient)"
            className="opacity-30 dark:opacity-20"
          />
          <defs>
            <linearGradient id="bayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

          {/* State Border Outline */}
          <path
            d="M 10,120 L 520,120 L 520,160 L 700,160 L 700,360 L 580,360 L 580,450 L 10,450 Z"
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800/50"
            strokeWidth="4"
            strokeDasharray="12,12"
          />

          {/* Counties */}
          {Object.entries(countyPaths).map(([id, path]) => {
            const data = countyData[id];
            if (!data) return null;
            const isHovered = hoveredCounty === id;

            return (
              <g
                key={id}
                onMouseEnter={() => setHoveredCounty(id)}
                onMouseLeave={() => setHoveredCounty(null)}
                onClick={() => navigate(`/report/${id}`)}
                className="cursor-pointer transition-all duration-300"
              >
                <motion.path
                  initial={false}
                  animate={{
                    strokeWidth: isHovered ? 2 : 0.5,
                    stroke: isHovered ? "rgba(255,255,255,0.8)" : "rgba(15, 23, 42, 0.2)",
                    scale: isHovered ? 1.02 : 1
                  }}
                  d={path}
                  className={`transition-all duration-300 ${getRiskColor(data.riskLevel)}`}
                  style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                />
              </g>
            );
          })}
        </motion.svg>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 space-y-4 glass-card p-8 rounded-[32px] shadow-2xl">
          <div className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-4">Risk Classification</div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-lg bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
            <span className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest">High Impact Zone</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-lg bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
            <span className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest">Moderate Zone</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            <span className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest">Low Impact Zone</span>
          </div>
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredCounty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              style={{
                position: 'fixed',
                left: mousePos.x + 20,
                top: mousePos.y + 20,
              }}
              className="z-50 pointer-events-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] min-w-[240px]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-900 dark:text-white font-black text-xl uppercase italic tracking-tight">{countyData[hoveredCounty].name}</span>
                <Zap className={`w-4 h-4 ${countyData[hoveredCounty].riskLevel === 'High' ? 'text-rose-500' :
                  countyData[hoveredCounty].riskLevel === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'
                  } animate-pulse`} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-600 dark:text-slate-500">Risk Profile</span>
                  <span className={`px-2 py-0.5 rounded text-white ${countyData[hoveredCounty].riskLevel === 'High' ? 'bg-rose-500' :
                    countyData[hoveredCounty].riskLevel === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>{countyData[hoveredCounty].riskLevel}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-600 dark:text-slate-500">Density Coeff</span>
                  <span className="text-slate-950 dark:text-white font-black">{countyData[hoveredCounty].incidentsPer100k}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-3 text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] animate-pulse">
                Initiate Data Stream <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats Overlay */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl border-t border-slate-200 dark:border-white/5 py-8 px-12 flex flex-wrap justify-center gap-12 lg:gap-24 z-30 shadow-2xl">
        <div className="flex items-center gap-6 group">
          <div className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors uppercase">24</div>
          <div className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight">Regional<br />Intelligence Nodes</div>
        </div>
        <div className="flex items-center gap-6 group">
          <div className="text-5xl font-black text-rose-600 tracking-tighter uppercase">02</div>
          <div className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight">Critical Impact<br />Zones Active</div>
        </div>
        <div className="flex items-center gap-6 group">
          <div className="text-5xl font-black text-amber-600 tracking-tighter uppercase">10</div>
          <div className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight">Moderate Risk<br />Sectors</div>
        </div>
        <div className="flex items-center gap-6 group">
          <div className="text-5xl font-black text-emerald-600 tracking-tighter uppercase">12</div>
          <div className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight">Low Risk<br />Sectors</div>
        </div>
      </div>
    </div>
  );
};
