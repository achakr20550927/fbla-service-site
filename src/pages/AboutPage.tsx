import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send, ExternalLink, Award, Quote, Shield, Target, Activity } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const timeline = [
    { date: 'Nov 8, 2023', event: 'Two Centennial High School students robbed at gunpoint while walking home, sparking urgent community concern.' },
    { date: 'Early 2024', event: 'Howard County homicides doubled (100% increase), highlighting a critical gap in local prevention resources.' },
    { date: 'July 27, 2024', event: 'Angelo Little (17) killed at Mall in Columbia, further galvanizing student activists.' },
    { date: 'Feb 22, 2025', event: 'Michael Robertson (16) and Blake McCray (15) killed at bus stop. We launched this tool because we have had enough of gun violence in our county—it was time to turn our grief into a system of protection.' }
  ];

  const committees = [
    { name: 'Technology', count: 6, task: 'Engineered the Interactive Risk Index and resource directory.' },
    { name: 'Social Media', count: 10, task: 'Managed @silencetheviolenceec with 1,000+ followers.' },
    { name: 'Events', count: 8, task: 'Organized community meetings with 95+ attendees.' },
    { name: 'Communications', count: 4, task: 'Writes weekly newsletter with 847+ subscribers.' },
    { name: 'Research', count: 4, task: 'Verified all data from CDC and MDH sources.' }
  ];

  const impact = [
    { label: 'Intelligence Reach', value: '24/24', sub: 'Counties' },
    { label: 'Active Users', value: '920+', sub: 'Monthly' },
    { label: 'Sync Efficiency', value: '5:47', sub: 'Avg Session' },
    { label: 'System Adoption', value: '12+', sub: 'Institutions' }
  ];

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    type: 'General Intelligence',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Using Web3Forms for direct email delivery without popups
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: "1bc9a5dc-8855-4f8f-90f6-c09e269bcf91", // User needs to replace this with their actual key
          name: formData.name,
          email: formData.email,
          subject: `New Contact from ${formData.name} - ${formData.type}`,
          message: formData.message,
          to_email: 'silencetheviolenceec@gmail.com'
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', type: 'General Intelligence', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-morphism border text-orange-500 dark:text-orange-400 text-xs font-black uppercase tracking-[0.3em] mb-12 glow-text"
          >
            <Activity className="w-4 h-4 animate-pulse" />
            Operational Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-12"
          >
            Students Taking <br />
            <span className="text-orange-600 dark:text-orange-500 glow-text">Action.</span>
          </motion.h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {impact.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                <div className="text-[8px] font-black text-orange-500 uppercase tracking-[0.2em] mt-1">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Operational <span className="text-orange-600 dark:text-orange-500">Timeline</span></h2>
              <p className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest">Tracking the evolution of our initiative</p>
            </div>

            <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-300 dark:before:bg-white/10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.date}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="pl-16 relative group"
                >
                  <div className={`absolute left-0 top-1.5 w-12 h-12 rounded-2xl border flex items-center justify-center z-10 transition-colors ${item.date.includes('2025') ? 'bg-orange-600 border-orange-600' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 group-hover:border-orange-500'}`}>
                    <Calendar className={`w-5 h-5 ${item.date.includes('2025') ? 'text-white' : 'text-orange-600 dark:text-orange-500'}`} />
                  </div>
                  <div className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest mb-2">{item.date}</div>
                  <p className="text-slate-700 dark:text-slate-400 font-bold leading-relaxed">{item.event}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 glass-card rounded-[40px] border-orange-600/20 dark:border-orange-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-3xl"></div>
              <Quote className="w-12 h-12 text-orange-600 dark:text-orange-500 mb-6" />
              <p className="text-2xl font-black text-slate-900 dark:text-white italic leading-tight uppercase tracking-tight">
                "Enough is enough. We launched this tool to honor their memory—and ensure no more families suffer this pain."
              </p>
            </motion.div>
          </div>

          <div className="space-y-20">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Mission <span className="text-orange-600 dark:text-orange-500">Protocol</span></h2>
                <p className="text-slate-700 dark:text-slate-400 font-bold leading-relaxed">
                  Research shows that while Baltimore has established programs like Safe Streets, Howard County lacked formal violence intervention infrastructure. We democratized access to the data that saves lives.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 glass-card rounded-3xl space-y-4 group hover:border-orange-600/30 transition-all">
                  <Target className="w-8 h-8 text-rose-500" />
                  <div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">671</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Firearm Deaths (MD 2024)</div>
                  </div>
                </div>
                <div className="p-8 glass-card rounded-3xl space-y-4 group hover:border-orange-600/30 transition-all">
                  <Shield className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                  <div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">#1</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Youth Death Cause</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Unit <span className="text-orange-600 dark:text-orange-500">Structure</span></h2>
              <div className="grid grid-cols-1 gap-4">
                {committees.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 glass-card rounded-2xl flex items-center justify-between group hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all"
                  >
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{c.name}</h3>
                      <p className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest">{c.task}</p>
                    </div>
                    <div className="px-4 py-2 bg-orange-600/10 border border-orange-600/20 dark:border-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400 text-xs font-black">
                      {c.count} Members
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest">Lead Faculty: Kristin Taylor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Alliance */}
      <section className="py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-card p-16 md:p-24 rounded-[60px] border-orange-600/10 dark:border-orange-500/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-orange-600/20 border border-orange-600/30 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  Strategic Alliance
                </div>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Marylanders to <br />Prevent <span className="text-orange-600 dark:text-orange-500">Gun Violence</span></h2>
                <p className="text-slate-700 dark:text-slate-400 font-bold leading-relaxed text-lg">
                  Maryland's premier advocacy organization. Founded post-Sandy Hook to pioneer legislative safety protocols across the state.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['Firearm Safety Act 2013', 'Ghost Gun Ban 2022', '2024 Legislative Victories'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      <Award className="w-5 h-5 text-orange-600 dark:text-orange-500" /> {item}
                    </div>
                  ))}
                </div>
                <a href="https://mdpgv.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-orange-600 dark:text-orange-400 font-black uppercase tracking-[0.2em] text-xs hover:text-orange-700 dark:hover:text-white transition-colors">
                  Alliance Portal <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-8">
                <div className="p-12 glass-card rounded-[40px] text-center space-y-4 border-orange-600/20 dark:border-orange-500/20 shadow-[0_20px_50px_rgba(30,41,59,0.05)] dark:shadow-[0_20px_50px_rgba(234,88,12,0.1)]">
                  <div className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">1,000+</div>
                  <div className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.3em]">Network Intelligence Reach</div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-900 dark:text-white">847</div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Subscribed Nodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-900 dark:text-white">95</div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Direct Engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Interface */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="glass-card p-16 rounded-[50px] space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Communication <span className="text-orange-600 dark:text-orange-500">Interface</span></h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initiate direct contact protocol</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-4">Subject Identity</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-8 py-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-all font-bold placeholder:text-slate-400"
                  placeholder="NAME"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest ml-4">Node Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-8 py-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-all font-bold placeholder:text-slate-400"
                  placeholder="EMAIL@DOMAIN.COM"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Protocol Type</label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-8 py-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-all font-bold appearance-none"
                >
                  <option className="bg-white dark:bg-slate-900">General Intelligence</option>
                  <option className="bg-white dark:bg-slate-900">Media Access</option>
                  <option className="bg-white dark:bg-slate-900">Strategic Partnership</option>
                  <option className="bg-white dark:bg-slate-900">Replication Request</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Message Payload</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-8 py-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-all font-bold"
                placeholder="ENTER TRANSMISSION..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-6 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-orange-700 transition-all flex items-center justify-center gap-4 glow-border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Transmitting...' : status === 'success' ? 'Transmission Successful' : 'Transmit Data'}
              <Send className="w-5 h-5" />
            </button>
            {status === 'success' && (
              <p className="text-emerald-500 text-xs font-black uppercase tracking-widest text-center animate-pulse">
                Data packets received. We will respond shortly.
              </p>
            )}
            {status === 'error' && (
              <p className="text-rose-500 text-xs font-black uppercase tracking-widest text-center">
                Transmission failed. Please check your connection or try again.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};
