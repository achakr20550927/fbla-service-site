import React from 'react';
import { resources } from '../lib/data';
import { Search, Filter, MapPin, Globe, Mail, ChevronRight, X, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCounty, setSelectedCounty] = React.useState('All Counties');
  const [selectedType, setSelectedType] = React.useState('All Types');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const counties = ['All Counties', ...Array.from(new Set(resources.map(r => r.location).filter(l => l !== 'Statewide'))).sort()];
  const types = ['All Types', ...Array.from(new Set(resources.flatMap(r => r.type))).sort()];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.org.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = selectedCounty === 'All Counties' || r.location === selectedCounty || r.location === 'Statewide';
    const matchesType = selectedType === 'All Types' || r.type.includes(selectedType);
    return matchesSearch && matchesCounty && matchesType;
  });

  return (
    <div className="relative">
      {/* Sidebar Layout */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">

        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-80 lg:fixed lg:h-screen p-6 lg:p-8 border-r border-slate-200 dark:border-white/5 section-alt backdrop-blur-xl z-30 space-y-12 pt-32">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Directory <span className="text-orange-600 dark:text-orange-500">Filter</span></h2>
            <p className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest">Refine search parameters</p>
          </div>

          <div className="space-y-8">
            {/* Search */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Search className="w-3 h-3" /> Keyword Search
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Program name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-all font-bold placeholder:text-slate-500 dark:placeholder:text-slate-600"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* County Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Location / Region
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {counties.map(county => (
                  <button
                    key={county}
                    onClick={() => setSelectedCounty(county)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${selectedCounty === county
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-300'
                      }`}
                  >
                    {county}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-3 h-3" /> Service Category
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${selectedType === type
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-300'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-80 p-6 lg:p-12 lg:pt-32 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 animate-pulse" />
                <span className="text-orange-600 dark:text-orange-500 text-[10px] font-black uppercase tracking-widest">Database Sync Complete</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Verified <span className="text-orange-600 dark:text-slate-500">Resources</span></h1>
            </div>
            <div className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest">
              Found {filteredResources.length} matching protocols
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="glass-card rounded-3xl overflow-hidden group"
                >
                  <div
                    className="p-8 cursor-pointer flex flex-col md:flex-row justify-between gap-8"
                    onClick={() => setExpandedId(expandedId === resource.id ? null : resource.id)}
                  >
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {resource.type.map(t => (
                          <button
                            key={t}
                            onClick={(e) => { e.stopPropagation(); setSelectedType(t); }}
                            className="px-3 py-1 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-orange-600/20 dark:border-orange-500/20 hover:bg-orange-600 hover:text-white transition-all overflow-hidden relative"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase italic tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors uppercase">{resource.name}</h3>
                      <div className="flex items-center gap-4 text-xs font-black text-slate-600 dark:text-slate-500">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {resource.location}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>{resource.org}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <a
                        href={`tel:${resource.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full sm:w-auto px-6 py-4 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest hover:bg-slate-900/10 dark:hover:bg-white/10 transition-all group/btn"
                      >
                        <PhoneCall className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover/btn:scale-110 transition-transform" />
                        {resource.phone}
                      </a>
                      <div className="p-4 rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
                        <ChevronRight className={`w-6 h-6 transition-transform ${expandedId === resource.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === resource.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 backdrop-blur-3xl"
                      >
                        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
                          <div className="lg:col-span-2 space-y-10">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">Program Overview</h4>
                              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-lg">{resource.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              {resource.eligibility && (
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Eligibility Criteria</h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{resource.eligibility}</p>
                                </div>
                              )}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Core Services</h4>
                                <ul className="space-y-2">
                                  {resource.services.map(s => (
                                    <li key={s} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-500" />
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {resource.evidence && (
                              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4">
                                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-500 shrink-0 mt-1" />
                                <div className="space-y-1">
                                  <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em]">Verified Impact</h4>
                                  <p className="text-sm text-emerald-900/80 dark:text-emerald-100/80 font-medium leading-relaxed">{resource.evidence}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-8">
                            <div className="p-8 rounded-3xl space-y-6 bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
                              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Access Information</h4>
                              <div className="space-y-4">
                                <a
                                  href={`https://${resource.website}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-orange-600 dark:hover:bg-orange-600 transition-all text-slate-900 dark:text-white group/link"
                                >
                                  <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover/link:text-white" />
                                  <div className="flex-1">
                                    <div className="text-[10px] font-black uppercase text-slate-500 group-hover/link:text-orange-100">Official Website</div>
                                    <div className="text-sm font-bold truncate">Visit Portal</div>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover/link:text-white" />
                                </a>

                                {resource.email && (
                                  <a
                                    href={`mailto:${resource.email}`}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-900 dark:text-white"
                                  >
                                    <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    <div className="flex-1">
                                      <div className="text-[10px] font-black uppercase text-slate-500">Email Support</div>
                                      <div className="text-sm font-bold truncate">Send Inquiry</div>
                                    </div>
                                  </a>
                                )}
                              </div>

                              <div className="pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-slate-500 uppercase tracking-widest">Protocol Cost</span>
                                  <span className="text-orange-600 dark:text-orange-400 uppercase tracking-tighter">{resource.cost}</span>
                                </div>
                                {resource.hours && (
                                  <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest">Availability</span>
                                    <span className="text-slate-900 dark:text-white uppercase tracking-tighter">{resource.hours}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredResources.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center space-y-6"
              >
                <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto border border-slate-200 dark:border-white/10">
                  <Search className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">No Matches Found</h3>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Adjust your search parameters or location</p>
                </div>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCounty('All Counties'); setSelectedType('All Types'); }}
                  className="px-8 py-4 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
