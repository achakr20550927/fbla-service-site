import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { countyData, resources } from '../lib/data';
import { LineChart, BarChart, DonutChart } from '../components/Charts';
import { ChevronLeft, Shield, TrendingUp, TrendingDown, Minus, Download, Share2, Phone, ArrowRight, Zap, MapPin, Activity, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CountyReportPage: React.FC = () => {
  const { countyId } = useParams();
  const data = countyId ? countyData[countyId] : null;

  const [showToast, setShowToast] = React.useState(false);

  const handleExport = () => {
    window.print();
  };

  const handleBroadcast = async () => {
    if (!data) return;
    const reportUrl = window.location.href;
    const title = `${data.name} Gun Violence Intelligence Report`;
    const text = `Reviewing critical gun violence data for ${data.name}. Stay informed.`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: reportUrl });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(reportUrl);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">County not found</h2>
        <Link to="/map" className="text-orange-600 font-bold flex items-center gap-2">
          <ChevronLeft /> Back to Map
        </Link>
      </div>
    );
  }

  const countyResources = resources.filter(r => data.resources.includes(r.id) || r.location === data.name || r.location === 'Statewide');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="pb-32 relative">
      <div className="no-print">
        {/* Header Section */}
        <section className="relative pt-32 pb-48 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12"
            >
              <Link to="/map" className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-slate-900 dark:hover:text-white transition-all font-black uppercase text-xs tracking-[0.2em]">
                <ChevronLeft className="w-4 h-4" /> Back to Intelligence Map
              </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">{data.name}</h1>
                  <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] ${data.riskLevel === 'High' ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]' :
                    data.riskLevel === 'Moderate' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)]' :
                      'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]'
                    }`}>
                    {data.riskLevel} Risk Protocol
                  </div>
                </div>
                <div className="flex items-center gap-6 text-slate-600 dark:text-slate-500 text-xs font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-orange-600 dark:text-orange-500" /> System Analysis: 2026.1.0</span>
                  <span className="hidden sm:block">|</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-600 dark:text-slate-500" /> Maryland Region Code: MD-{data.id.substring(0, 3).toUpperCase()}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-4"
              >
                <button
                  onClick={handleExport}
                  className="px-8 py-5 glass-card rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Export Data
                </button>
                <button
                  onClick={handleBroadcast}
                  className="px-8 py-5 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all text-white shadow-xl shadow-orange-600/20 active:scale-95"
                >
                  <Share2 className="w-4 h-4" /> Broadcast
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20"
        >
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Annual Incidents', value: data.totalIncidents2024, trend: data.trend, trendVal: data.trendValue, icon: Activity },
              { label: 'Density Coefficient', value: data.incidentsPer100k, sub: 'Per 100k Residents', icon: Zap },
              { label: 'Resource Coverage', value: countyResources.length, sub: 'Verified Programs', icon: Shield },
              { label: 'Risk Factors', value: data.riskFactors.length, sub: 'Critical Indicators', icon: TrendingUp },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="glass-card p-10 rounded-[40px] relative group hover:-translate-y-2 transition-all"
              >
                <stat.icon className="absolute top-8 right-8 w-12 h-12 text-orange-600/5 dark:text-orange-500/10 group-hover:text-orange-600/10 dark:group-hover:text-orange-500/20 transition-colors" />
                <div className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</div>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 text-xs font-black mb-2 ${stat.trend === 'Improving' ? 'text-emerald-600 dark:text-emerald-500' :
                      stat.trend === 'Worsening' ? 'text-rose-600 dark:text-rose-500' : 'text-slate-600 dark:text-slate-500'
                      }`}>
                      {stat.trend === 'Improving' ? <TrendingDown className="w-4 h-4" /> :
                        stat.trend === 'Worsening' ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      {stat.trendVal}%
                    </div>
                  )}
                </div>
                {stat.sub && <div className="text-[10px] font-black text-slate-600 dark:text-slate-600 mt-2 uppercase tracking-widest">{stat.sub}</div>}
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Intelligence Column */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div variants={itemVariants}>
                <LineChart data={data.historicTrends} title={`Temporal Death Rate Analysis: 2020-2024`} />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                  <BarChart data={data.demographics.age.map(a => ({ label: a.group, count: a.count, percentage: a.percentage }))} title="Demographics: Age Spectrum" colorType="age" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <BarChart data={data.demographics.race} title="Demographics: Ethnic Profile" colorType="race" />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                  <DonutChart data={data.demographics.sex} title="Demographics: Gender Distribution" />
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card p-10 rounded-[40px] group">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mb-10">Incident Type Vectors</h3>
                  <div className="space-y-8">
                    {[
                      { label: 'Homicides', value: data.breakdown.homicides, color: 'bg-rose-500', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]' },
                      { label: 'Suicides', value: data.breakdown.suicides, color: 'bg-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]' },
                      { label: 'Accidental', value: data.breakdown.accidents, color: 'bg-orange-600', glow: 'shadow-[0_0_15px_rgba(234,88,12,0.4)]' },
                      { label: 'Police-Involved', value: data.breakdown.police, color: 'bg-slate-400', glow: 'shadow-[0_0_15px_rgba(148,163,184,0.4)]' },
                    ].map(type => {
                      const total = Object.values(data.breakdown).reduce((a, b) => a + b, 0);
                      const pct = Math.round((type.value / total) * 100);
                      return (
                        <div key={type.label} className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-600 dark:text-slate-500">{type.label}</span>
                            <span className="text-slate-950 dark:text-white font-black">{type.value} <span className="text-orange-600 dark:text-orange-400 ml-1">({pct}%)</span></span>
                          </div>
                          <div className="w-full bg-slate-900/5 dark:bg-white/5 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${type.color} ${type.glow}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Sidebar: Protocols & Resources */}
            <div className="space-y-8">
              <motion.div
                variants={itemVariants}
                className="bg-orange-600 rounded-[40px] p-12 text-white shadow-[0_20px_50px_rgba(234,88,12,0.3)] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <Shield className="w-16 h-16 text-orange-200 mb-8 relative z-10" />
                <h3 className="text-3xl font-black mb-8 uppercase italic tracking-tighter relative z-10 leading-tight">Safety <br />Protocols</h3>
                <div className="space-y-8 relative z-10">
                  {data.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-6 group/item">
                      <div className="shrink-0 w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xs font-black group-hover/item:bg-white group-hover/item:text-orange-600 transition-all">{i + 1}</div>
                      <p className="text-sm text-orange-50/90 leading-relaxed font-bold">{rec}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="glass-card rounded-[40px] p-10"
              >
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mb-8">Intervention Nodes</h3>
                <div className="space-y-6">
                  {countyResources.slice(0, 4).map(res => (
                    <div key={res.id} className="p-6 rounded-3xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-orange-600/30 dark:hover:border-orange-500/50 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-sm uppercase italic">{res.name}</h4>
                        <div className="px-2 py-0.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[8px] font-black rounded uppercase tracking-widest border border-orange-600/20 dark:border-orange-500/30">
                          {res.type[0]}
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-slate-600 dark:text-slate-500 line-clamp-2 mb-6 leading-relaxed uppercase tracking-wider">{res.description}</p>
                      <div className="flex items-center justify-between">
                        <a href={`tel:${res.phone}`} className="text-[10px] font-black text-slate-900 dark:text-white flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 uppercase tracking-widest">
                          <Phone className="w-3 h-3 text-orange-600 dark:text-orange-500" /> {res.phone}
                        </a>
                        <Link to="/resources" className="text-[10px] font-black text-orange-600 dark:text-orange-400 flex items-center gap-1 uppercase tracking-widest group-hover:gap-2 transition-all">
                          Node Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                  <Link to="/resources" className="block w-full py-5 text-center text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-orange-600 hover:text-white transition-all mt-8">
                    Access Full Directory
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100]"
            >
              <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 dark:border-slate-900/10">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-black uppercase tracking-widest">Protocol URL Copied to Clipboard</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- WORLD-CLASS COMPACT SUMMARY REPORT (SINGLE PAGE) --- */}
      <div className="hidden print:block print-report-container bg-white">
        <div className="print-page border-[1px] border-slate-200 p-8 space-y-8">
          {/* Header & Identification */}
          <div className="flex justify-between items-start border-b-[2px] border-orange-600 pb-4">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Intelligence Summary</div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">{data.name} // REPORT</h1>
            </div>
            <div className="text-right">
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">MD-INTEL-{data.id.toUpperCase()}</div>
              <div className="text-[8px] font-bold text-slate-500">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Section 1: Executive Briefing & Key Metrics */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-7 space-y-4">
              <div className="space-y-2">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic font-serif">Quick Analysis</h3>
                <p className="text-sm leading-snug text-slate-800 font-medium">
                  {data.name} currently maintains a <span className="font-black text-orange-600 uppercase italic">{data.riskLevel}</span> risk profile.
                  This classification is derived from a density coefficient of <span className="font-black">{data.incidentsPer100k}</span> incidents per 100k residents.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[8px] font-black uppercase tracking-widest text-orange-600 block mb-1">What this means:</span>
                  <p className="text-[9px] font-bold text-slate-500 leading-tight uppercase tracking-wide">
                    The {data.riskLevel} classification indicates {data.riskLevel === 'High' ? 'an urgent need' : 'a moderate requirement'} for community violence intervention. This score factors in both incident volume and population density to ensure accurate severity assessment.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Cases', value: data.totalIncidents2024, icon: Activity },
                  { label: 'Density', value: data.incidentsPer100k, icon: Zap },
                  { label: 'Trend', value: `${data.trendValue}%`, sub: data.trend, icon: TrendingDown },
                ].map((stat, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-white space-y-1">
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 block">{stat.label}</span>
                    <div className="text-2xl font-black text-slate-950 tracking-tighter leading-none">{stat.value}</div>
                    {stat.sub && <span className="text-[7px] font-black uppercase text-orange-600">{stat.sub}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-5">
              <div className="p-6 bg-slate-950 rounded-[32px] text-white space-y-4">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 italic">Demographic Vectors</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[7px] font-bold text-white/40 uppercase tracking-widest">Primary Risk Age</div>
                    <div className="text-lg font-black italic">{data.demographics.age.sort((a, b) => b.count - a.count)[0].group} Years</div>
                  </div>
                  <div>
                    <div className="text-[7px] font-bold text-white/40 uppercase tracking-widest">Predominant Ethnic Group</div>
                    <div className="text-lg font-black italic">{data.demographics.race.sort((a, b) => b.count - a.count)[0].label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Visual Exhibits (Consolidated) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-lg">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-800">01 // Data Visualization</h3>
              <span className="text-[8px] font-medium text-slate-500 uppercase tracking-widest italic">Source: MDH verified archives (2020-2024)</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Temporal Trends</div>
                <div className="p-4 border border-slate-100 bg-white rounded-2xl h-[240px]">
                  <LineChart data={data.historicTrends} title="" />
                </div>
                <p className="text-[8px] font-bold text-slate-500 leading-tight">
                  * Trends represent the aggregate homicide and suicide rates over the last 5 years.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Incident Breakdown</div>
                <div className="p-6 border border-slate-100 bg-slate-950 text-white rounded-3xl h-[240px] flex flex-col justify-center gap-6">
                  {[
                    { label: 'Homicides', value: data.breakdown.homicides, color: 'bg-rose-500' },
                    { label: 'Suicides', value: data.breakdown.suicides, color: 'bg-amber-500' },
                    { label: 'Accidental', value: data.breakdown.accidents, color: 'bg-orange-600' },
                  ].map(type => {
                    const total = Object.values(data.breakdown).reduce((a, b) => a + b, 0);
                    const pct = Math.round((type.value / total) * 100);
                    return (
                      <div key={type.label} className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/60">
                          <span>{type.label}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full ${type.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Remediation & Appendix */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            <div className="space-y-4">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-600">Action Protocols</h3>
              <div className="space-y-2">
                {data.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-2 text-[10px] items-start">
                    <span className="font-black text-orange-600 shrink-0">0{i + 1}.</span>
                    <p className="font-bold text-slate-700 leading-tight uppercase tracking-tighter">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 bg-slate-50 p-6 rounded-[24px]">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-200 pb-2">Terminology Appendix</h3>
              <div className="space-y-3">
                {[
                  { term: 'Density Coefficient', def: 'Incidents per 100k residents. This balances data against population size for fair comparison.' },
                  { term: 'Risk Profile', def: 'Categorical ranking (Low, Moderate, High) determined by historic frequency and trend trajectory.' },
                  { term: 'Temporal Vector', def: 'The direction of violence rates over time (Improving, Stable, or Worsening).' }
                ].map((item, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-950">{item.term}</div>
                    <div className="text-[8px] font-bold text-slate-500 leading-tight italic">{item.def}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-8 border-t border-slate-900 text-center space-y-2">
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.5em]">
              Confidential Analysis // silencetheviolenceec@gmail.com
            </div>
            <div className="text-[7px] text-slate-400 font-serif italic max-w-lg mx-auto uppercase tracking-widest">
              This report is a data-driven summary intended for community awareness and prevention strategy planning. Not for legal or medical diagnosis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
