import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WarningCircle, CheckCircle, CircleNotch } from '@phosphor-icons/react';

export function TerminalCore() {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [result, setResult] = useState(null);

    const handleFix = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setStatus('loading');
        setResult(null);

        try {
            const res = await fetch('/api/diagnose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: query })
            });
            const data = await res.json();

            if (data.solution) {
                setStatus('success');
                setResult(data);
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
                    {'// AGENT_API.POST("/api/diagnose")'}
                </div>
                <form onSubmit={handleFix} className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="System issue description..."
                        className="flex-1 bg-black/40 border border-white/10 text-white font-mono text-sm px-4 py-3 outline-none focus:border-claw-cyan transition-colors"
                    />
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-claw-cyan/10 text-claw-cyan border border-claw-cyan/30 px-6 font-mono font-bold text-xs uppercase tracking-wider hover:bg-claw-cyan/20 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                    >
                        {status === 'loading' ? <CircleNotch weight="bold" className="animate-spin" size={16} /> : 'ANALYZE'}
                    </motion.button>
                </form>
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
                            [ AWAITING INPUT STREAM ]
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
                                <span>Interfacing with core diagnostics...</span>
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

                    {status === 'success' && result && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 font-mono text-sm max-w-[65ch]"
                        >
                            <div className="flex items-center gap-2 text-claw-green border-b border-claw-green/20 pb-2">
                                <CheckCircle weight="fill" size={18} />
                                <span className="font-bold tracking-widest text-xs">DIAGNOSTIC_COMPLETE</span>
                            </div>

                            <div className="space-y-1">
                                <div className="text-[10px] text-white/40 uppercase tracking-widest">Department_Match</div>
                                <div className="text-claw-cyan">{result.matched_department?.toUpperCase()}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-[10px] text-white/40 uppercase tracking-widest">Proposed_Solution</div>
                                <div className="text-white/80 leading-relaxed text-xs p-4 bg-black/40 border-l-2 border-claw-cyan whitespace-pre-wrap">
                                    {result.solution}
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
                                <div className="font-bold tracking-widest mb-1">ERR_DIAGNOSTICS_FAILED</div>
                                <div className="text-claw-rose/70">Unable to resolve coordinate space or match skill definition.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
