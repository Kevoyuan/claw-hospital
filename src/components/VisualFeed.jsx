import React, { useState } from 'react';

// Import all Digimon Pixel Art Assets
import clinicImg from '../assets/clinic-isometric-small.png';
import runtimeImg from '../assets/pixel_dept_runtime_1773083103391.png';
import crashImg from '../assets/pixel_dept_crash_1773083117753.png';
import webuiImg from '../assets/pixel_dept_webui_1773083131638.png';
import behaviorImg from '../assets/pixel_dept_behavior_1773083158932.png';
import bossImg from '../assets/pixel_dept_boss_1773083176006.png';
import securityImg from '../assets/pixel_dept_security_1773083193191.png';

const DEPARTMENTS = [
    { id: 'lobby', label: 'LOBBY', img: clinicImg },
    { id: 'runtime', label: 'RUNTIME', img: runtimeImg },
    { id: 'crash', label: 'CRASH', img: crashImg },
    { id: 'behavior', label: 'BEHAVIOR', img: behaviorImg },
    { id: 'webui', label: 'WEBUI', img: webuiImg },
    { id: 'security', label: 'SECURITY', img: securityImg },
    { id: 'boss', label: 'BOSS', img: bossImg },
];

export function VisualFeed({ latestEvent }) {
    const [activeDept, setActiveDept] = useState(DEPARTMENTS[0]);
    const [glitchMessage, setGlitchMessage] = useState(null);

    useEffect(() => {
        if (latestEvent) {
            const targetDept = DEPARTMENTS.find(d => d.id === (latestEvent.department || '').toLowerCase());
            if (targetDept) {
                setActiveDept(targetDept);
            }
            // Show telemetry overlay
            setGlitchMessage(latestEvent);

            // clear after 5s
            const timer = setTimeout(() => setGlitchMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [latestEvent]);

    // Generate random particles for atmospheric effect
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
        opacity: Math.random() * 0.5 + 0.2
    }));

    return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-[#09090b] relative">

            {/* Main Isometric Viewer */}
            <div
                className="relative rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.05)] border-2 border-cyan-900/30 transition-all duration-500 ease-in-out animate-crt-flicker"
                style={{ flex: 'none', width: '640px', height: '640px', minWidth: '640px', minHeight: '640px' }}
            >
                {/* Breathing Background Layer */}
                <div className="absolute inset-0 max-w-[640px] max-h-[640px] overflow-hidden">
                    <img
                        key={activeDept.id}
                        src={activeDept.img}
                        alt={`${activeDept.label} Digimon Clinic`}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'pixelated', width: '105%', height: '105%', transformOrigin: 'center' }}
                    />
                </div>

                {/* Floating Digital Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute bottom-0 w-1.5 h-1.5 bg-cyan-400/60 shadow-[0_0_8px_rgba(0,255,255,0.8)] rounded-sm"
                            style={{
                                left: p.left,
                                opacity: p.opacity,
                                animation: `floatUp ${p.animationDuration} ease-in infinite`,
                                animationDelay: p.animationDelay
                            }}
                        />
                    ))}
                </div>

                {/* CRT Scanline Overlay Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQIW2NkYGD4z8DAwMgAA0QAMyA1rE0AAAAASUVORK5CYII=')] mix-blend-overlay animate-scanline"></div>

                {/* Cybernetic UI Overlay layer */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase tracking-widest rounded-sm">
                        CAM.{activeDept.id.substring(0, 3)}
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-mono text-xs uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                        WARD // {activeDept.label}
                    </div>
                    <div className="px-2 py-1 bg-black/60 text-emerald-400/80 font-mono text-[10px] tracking-widest border border-emerald-900/50 rounded-sm">
                        [ SECURE ]
                    </div>
                </div>

                {/* Glitch Overlay for Telemetry Alerts */}
                {glitchMessage && (
                    <div className="absolute inset-0 z-20 pointer-events-none bg-red-900/20 mix-blend-color-dodge animate-pulse flex flex-col items-center justify-center p-8 backdrop-blur-[2px]">
                        <div className="bg-black/90 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] p-6 max-w-sm w-full font-mono">
                            <h3 className="text-red-500 text-lg font-bold tracking-widest uppercase animate-bounce mb-2">
                                !! INCOMING TELEMETRY !!
                            </h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-red-500/30 pb-1">
                                    <span className="text-red-500/60">AGENT_ID</span>
                                    <span className="text-white">{glitchMessage.agentId}</span>
                                </div>
                                <div className="flex justify-between border-b border-red-500/30 pb-1">
                                    <span className="text-red-500/60">STATUS</span>
                                    <span className="text-white">{glitchMessage.status}</span>
                                </div>
                                <div className="text-red-200 mt-2 bg-red-950/50 p-2 border-l-2 border-red-500">
                                    {glitchMessage.message || 'CRITICAL FAILURE DETECTED'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Bar */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-[640px]">
                {DEPARTMENTS.map((dept) => (
                    <button
                        key={dept.id}
                        onClick={() => setActiveDept(dept)}
                        className={`px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all duration-200 border-b-2 rounded-t-sm
                            ${activeDept.id === dept.id
                                ? 'bg-cyan-950/50 text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                : 'bg-transparent text-zinc-500 border-transparent hover:text-cyan-600 hover:bg-cyan-950/20'
                            }
                        `}
                    >
                        {dept.label}
                    </button>
                ))}
            </div>

        </div>
    );
}
