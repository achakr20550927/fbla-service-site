import React from 'react';

interface LineChartProps {
  data: { year: number; total: number; homicide: number; suicide: number }[];
  title: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const years = data.map(d => d.year);
  const maxRate = Math.max(...data.flatMap(d => [d.total, d.homicide, d.suicide])) * 1.2;

  const width = 800;
  const height = 400;
  const padding = 60;

  const xScale = (year: number) => padding + ((year - Math.min(...years)) / (Math.max(...years) - Math.min(...years))) * (width - 2 * padding);
  const yScale = (rate: number) => height - padding - (rate / maxRate) * (height - 2 * padding);

  const createPath = (key: 'total' | 'homicide' | 'suicide') => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d[key])}`).join(' ');
  };

  return (
    <div className="glass-card p-10 rounded-[40px] relative group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{title}</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Homicide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suicide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500/50 border border-slate-300 dark:border-slate-400/50" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(p => (
            <line
              key={p}
              x1={padding}
              y1={yScale(maxRate * p)}
              x2={width - padding}
              y2={yScale(maxRate * p)}
              stroke="currentColor"
              className="text-slate-900/[0.05] dark:text-white/[0.05]"
              strokeWidth="1"
            />
          ))}

          <path d={createPath('total')} fill="none" stroke="currentColor" className="text-slate-900/[0.1] dark:text-slate-400/30" strokeWidth="4" strokeDasharray="8,8" />
          <path d={createPath('homicide')} fill="none" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" className="transition-all duration-500" />
          <path d={createPath('suicide')} fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" className="transition-all duration-500" />

          {data.map((d, i) => (
            <rect
              key={i}
              x={xScale(d.year) - 20}
              y={padding}
              width="40"
              height={height - 2 * padding}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            />
          ))}

          {data.map((d, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={d.year} className="transition-all duration-300">
                {isHovered && (
                  <line
                    x1={xScale(d.year)}
                    y1={padding}
                    x2={xScale(d.year)}
                    y2={height - padding}
                    stroke="rgba(234, 88, 12, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                )}

                <circle cx={xScale(d.year)} cy={yScale(d.homicide)} r={isHovered ? 8 : 5} fill="#f43f5e" className="transition-all" />
                <circle cx={xScale(d.year)} cy={yScale(d.suicide)} r={isHovered ? 8 : 5} fill="#f59e0b" className="transition-all" />

                <text
                  x={xScale(d.year)}
                  y={height - 20}
                  textAnchor="middle"
                  className={`text-[12px] font-black transition-colors ${isHovered ? 'fill-slate-900 dark:fill-white' : 'fill-slate-400 dark:fill-slate-600'}`}
                >
                  {d.year}
                </text>

                {isHovered && (
                  <foreignObject x={xScale(d.year) - 100} y={yScale(d.total) - 140} width="200" height="120">
                    <div className="bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl shadow-2xl space-y-2">
                      <div className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">{d.year} Data Point</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500 uppercase tracking-tighter">Total Rate:</span>
                          <span className="text-slate-900 dark:text-white font-black">{d.total}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-rose-500 uppercase tracking-tighter">Homicide:</span>
                          <span className="text-slate-900 dark:text-white font-black">{d.homicide}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-amber-500 uppercase tracking-tighter">Suicide:</span>
                          <span className="text-slate-900 dark:text-white font-black">{d.suicide}</span>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-8 text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest italic">
        Analysis Source: MDH Firearm Violence Dashboard (Preliminary 2024 Data)
      </p>
    </div>
  );
};

interface BarChartProps {
  data: { label: string; count: number; percentage: number }[];
  title: string;
  colorType?: 'age' | 'race';
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, colorType = 'age' }) => {
  const maxCount = Math.max(...data.map(d => d.count));

  const getBarColor = (label: string) => {
    if (colorType === 'age') {
      const startAge = parseInt(label.split('-')[0]);
      if (isNaN(startAge)) return 'rgba(148, 163, 184, 0.3)';
      if (startAge < 15) return 'rgba(148, 163, 184, 0.3)';
      return '#f59e0b';
    }
    if (colorType === 'race') {
      if (label === 'NH Black') return '#ea580c';
      if (label === 'NH White') return '#f59e0b';
      if (label === 'Hispanic') return '#f43f5e';
      return 'rgba(148, 163, 184, 0.3)';
    }
    return '#ea580c';
  };

  return (
    <div className="glass-card p-10 rounded-[40px] h-full group">
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mb-10">{title}</h3>
      <div className="space-y-6">
        {data.map((d) => (
          <div key={d.label} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{d.label}</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{d.count} <span className="text-orange-600 dark:text-orange-400 text-xs ml-1">{d.percentage}%</span></span>
            </div>
            <div className="w-full bg-slate-900/5 dark:bg-white/5 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                style={{
                  width: `${(d.count / maxCount) * 100}%`,
                  backgroundColor: getBarColor(d.label)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DonutChartProps {
  data: { male: number; malePct: number; female: number; femalePct: number };
  title: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const radius = 90;
  const stroke = 25;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // const maleOffset = circumference - (data.malePct / 100) * circumference;
  const femaleOffset = circumference - (data.femalePct / 100) * circumference;

  return (
    <div className="glass-card p-10 rounded-[40px] h-full flex flex-col items-center group">
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mb-12 self-start">{title}</h3>

      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="currentColor"
            className="text-slate-900/5 dark:text-white/5"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#f59e0b"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset: femaleOffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
          <circle
            stroke="currentColor"
            cx={radius}
            cy={radius}
            className="text-slate-900/10 dark:text-slate-400/20 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">100%</span>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-12 w-full">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-700" />
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Male</span>
          </div>
          <p className="text-xl font-black text-slate-500">{data.malePct}%</p>
        </div>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Female</span>
          </div>
          <p className="text-xl font-black text-amber-600 dark:text-amber-500">{data.femalePct}%</p>
        </div>
      </div>

      <p className="mt-12 text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest text-center italic">
        Sex demographics provided by MDH Medical Examiner
      </p>
    </div>
  );
};
