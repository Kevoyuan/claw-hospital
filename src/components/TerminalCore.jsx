import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WarningCircle, CheckCircle, CircleNotch, ListDashes, TerminalWindow, FileCode, ArrowLeft } from '@phosphor-icons/react';

export function TerminalCore() {
    const [status, setStatus] = useState('idle'); // idle | loading | catalog | payload | error
    const [catalog, setCatalog] = useState(null);
    const [activeSkill, setActiveSkill] = useState(null);

    const fetchCatalog = async () => {
        setStatus('loading');
        setCatalog(null);
        setActiveSkill(null);

        try {
            const res = await fetch('/api/v1/skills');
            const data = await res.json();

            if (data.status === 'success') {
                setStatus('catalog');
                setCatalog(data.catalog);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const fetchSkill = async (skillName) => {
        setStatus('loading');
        try {
            const res = await fetch(`/api/v1/skills/${encodeURIComponent(skillName)}`);
            const data = await res.json();

            if (data.status === 'success') {
                setStatus('payload');
                setActiveSkill(data.skill);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-white/5 shrink-0 bg-black/10">
                <div className="text-[10px] text-claw-green font-mono uppercase tracking-widest mb-4">
                    {'// A2A_GATEWAY.DISCOVERY'}
                </div>
                <div className="flex gap-2">
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={fetchCatalog}
                        disabled={status === 'loading'}
                        className="flex-1 bg-claw-cyan/10 text-claw-cyan border border-claw-cyan/30 px-6 py-3 font-mono font-bold text-xs uppercase tracking-wider hover:bg-claw-cyan/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? <CircleNotch weight="bold" className="animate-spin" size={16} /> : <ListDashes size={16} />}
                        {status === 'loading' ? 'SYNCING CATALOG...' : 'FETCH SKILL REGISTRY'}
                    </motion.button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-black/5 relative">
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-white/20 font-mono text-xs uppercase tracking-widest"
                        >
                            <TerminalWindow size={32} className="mb-2 opacity-50" />
                            [ AWAITING AGENT DISCOVERY ]
                        </motion.div>
                    )}

                    {status === 'loading' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-mono text-xs text-white/50 space-y-4 max-w-sm"
                        >
                            <div className="flex items-center gap-2">
                                <CircleNotch weight="bold" className="animate-spin text-claw-cyan" size={14} />
                                <span>Interfacing with medical library...</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                    className="h-full w-1/3 bg-claw-cyan"
                                />
                            </div>
                        </motion.div>
                    )}

                    {status === 'catalog' && catalog && (
                        <motion.div
                            key="catalog"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 font-mono text-sm max-w-[65ch]"
                        >
                            <div className="flex items-center gap-2 text-claw-green border-b border-claw-green/20 pb-2">
                                <CheckCircle weight="fill" size={18} />
                                <span className="font-bold tracking-widest text-xs">REGISTRY_SYNC_COMPLETE ({catalog.length} SKILLS)</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 mt-4">
                                {catalog.map(skill => (
                                    <motion.button
                                        key={skill.name}
                                        whileHover={{ x: 4 }}
                                        onClick={() => fetchSkill(skill.name)}
                                        className="text-left flex items-start gap-3 p-3 bg-black/40 border border-white/5 hover:border-claw-cyan/50 hover:bg-claw-cyan/5 group transition-colors"
                                    >
                                        <FileCode size={16} className="text-claw-cyan mt-0.5 opacity-70 group-hover:opacity-100" />
                                        <div className="flex-1 overflow-hidden">
                                            <div className="text-claw-cyan text-xs font-bold tracking-wide">{skill.name}</div>
                                            <div className="text-white/40 text-[10px] mt-1 line-clamp-1">{skill.endpoint}</div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {status === 'payload' && activeSkill && (
                        <motion.div
                            key="payload"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4 font-mono text-sm max-w-[65ch]"
                        >
                            <div className="flex items-center justify-between border-b border-claw-green/20 pb-2">
                                <div className="flex items-center gap-2 text-claw-green">
                                    <CheckCircle weight="fill" size={18} />
                                    <span className="font-bold tracking-widest text-xs">PAYLOAD_DOWNLOADED</span>
                                </div>
                                <button onClick={() => setStatus('catalog')} className="text-white/40 hover:text-white flex items-center gap-1 text-[10px] uppercase tracking-wider">
                                    <ArrowLeft size={12} /> BACK
                                </button>
                            </div>

                            <div className="space-y-1">
                                <div className="text-[10px] text-white/40 uppercase tracking-widest">Skill_Core_Name</div>
                                <div className="text-claw-cyan">{activeSkill.name}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-[10px] text-white/40 uppercase tracking-widest">Decrypted_Markdown</div>
                                <div className="text-white/80 leading-relaxed text-xs p-4 bg-black/40 border-l-2 border-claw-cyan whitespace-pre-wrap max-h-[300px] overflow-y-auto overflow-x-hidden">
                                    {activeSkill.payload}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 text-claw-rose p-4 bg-claw-rose/5 border border-claw-rose/20 font-mono text-xs"
                        >
                            <WarningCircle weight="fill" size={16} className="mt-0.5 shrink-0" />
                            <div>
                                <div className="font-bold tracking-widest mb-1">ERR_GATEWAY_TIMEOUT</div>
                                <div className="text-claw-rose/70">Unable to establish handshake with local medical library.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
