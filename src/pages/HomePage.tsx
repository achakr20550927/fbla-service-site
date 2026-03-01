import React from 'react';
import { motion } from 'framer-motion';
import { Search, Map as MapIcon, BookOpen, ArrowRight, ShieldCheck, TrendingDown, Zap, Globe, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/map?query=${encodeURIComponent(search)}`);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: "1bc9a5dc-8855-4f8f-90f6-c09e269bcf91",
          email: newsletterEmail,
          subject: "New Newsletter Subscriber",
          message: `New subscriber email: ${newsletterEmail}`,
          to_email: 'silencetheviolenceec@gmail.com'
        })
      });
      const result = await response.json();
      if (result.success) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
      }
    } catch (err) {
      setNewsletterStatus('error');
    }
  };

  const stats = [
    { label: 'U.S. Children Killed by Guns', value: '2,526', icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Howard County Surge', value: '100%', icon: TrendingDown, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Verified Resources', value: '147+', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Secure Storage Impact', value: '85%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 dark:bg-orange-600/5 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/5 dark:bg-amber-600/2 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-morphism border text-orange-500 dark:text-orange-400 text-xs font-black uppercase tracking-[0.3em] glow-text"
            >
              <Zap className="w-4 h-4 animate-pulse" />
              Live Data Integration Active
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] uppercase italic"
            >
              Know Your <span className="text-orange-600 dark:text-orange-500 glow-text">Area.</span> <br />
              Stay <span className="text-slate-600 dark:text-slate-500">Protected.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto text-lg md:text-xl text-slate-700 dark:text-slate-400 leading-relaxed font-semibold italic"
            >
              Maryland's first AI-driven gun violence prevention portal. Access real-time risk assessments, localized data, and life-saving resources.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center gap-8"
            >
              <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                <div className="absolute -inset-1 bg-orange-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter county name or ZIP code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-8 py-6 rounded-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 backdrop-blur-2xl text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-all text-lg font-bold pr-20"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3 bottom-3 px-6 bg-orange-600 rounded-full hover:bg-orange-500 transition-all flex items-center justify-center glow-border"
                  >
                    <Search className="w-6 h-6 text-white" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/map"
                  className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(30,41,59,0.3)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Launch Risk Map <MapIcon className="w-5 h-5" />
                </Link>
                <Link
                  to="/resources"
                  className="px-10 py-5 glass-card text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  Directory <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-orange-600 to-transparent"></div>
          <span className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card p-10 rounded-[40px] group hover:-translate-y-2 transition-all relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <stat.icon className={`w-12 h-12 ${stat.color} mb-8 group-hover:scale-110 transition-transform`} />
                <div className="text-5xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter">{stat.value}</div>
                <div className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-relaxed">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Futuristic Cards */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 section-alt relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">System <span className="text-orange-600 dark:text-orange-500">Architecture</span></h2>
              <p className="text-slate-600 dark:text-slate-400 font-black max-w-md uppercase text-xs tracking-[0.2em]">Our three-tier approach to community safety</p>
            </div>
            <div className="h-[1px] flex-1 bg-slate-900/10 dark:bg-white/10 mb-6 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { title: "Risk Intelligence", desc: "Real-time analysis of firearm incidents per 100,000 residents across Maryland.", icon: Globe },
              { title: "Personalized Protocol", desc: "Dynamic safety recommendations generated based on localized incident profiles.", icon: ShieldCheck },
              { title: "Direct Intervention", desc: "Instant connection to 147+ verified crisis and prevention organizations.", icon: Zap }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="p-12 glass-card rounded-[40px] space-y-8 group border-orange-500/0 hover:border-orange-600/50 transition-all"
              >
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                  <feature.icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase italic tracking-tight">{feature.title}</h3>
                  <p className="text-slate-700 dark:text-slate-400 font-bold leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-48 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-16 md:p-24 rounded-[60px] text-center space-y-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-600/10 to-amber-600/10 opacity-30 dark:opacity-50"></div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Stay <span className="text-orange-600 dark:text-orange-500">Synchronized</span></h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">Join 847+ Marylanders receiving weekly data updates and safety alerts.</p>

              <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-8 py-5 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-all font-bold"
                />
                <button
                  disabled={newsletterStatus === 'sending'}
                  className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all glow-border disabled:opacity-50"
                >
                  {newsletterStatus === 'sending' ? '...' : newsletterStatus === 'success' ? 'Joined' : 'Connect'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
