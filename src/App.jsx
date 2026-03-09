import { TerminalWindow } from '@phosphor-icons/react';
import { DataMetrics } from './components/DataMetrics';
import { TerminalCore } from './components/TerminalCore';
import { VisualFeed } from './components/VisualFeed';

function App() {
    return (
        <div className="min-h-[100dvh] w-full flex flex-col md:flex-row relative">
            <div className="scanlines"></div>

            {/* Visual Area (Pixel Hospital via Bento) */}
            <div className="flex-1 border-r border-white/10 bg-[#0a0a1a] relative overflow-hidden flex flex-col">
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/10 shrink-0">
                    <h1 className="pixel-font text-xl md:text-2xl text-claw-cyan tracking-widest flex items-center gap-3 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                        <TerminalWindow size={32} weight="duotone" />
                        CLAW_HOSPITAL
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-claw-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-claw-green"></span>
                        </span>
                        <span className="font-mono text-sm font-bold text-claw-green tracking-widest hidden sm:inline-block">ENV_ONLINE</span>
                    </div>
                </div>

                <div className="flex-1 relative bg-[#05050A] w-full overflow-hidden">
                    <VisualFeed />
                </div>
            </div>

            {/* Agent Terminal Area (Cockpit Density) */}
            <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col bg-claw-base shrink-0 z-10">
                <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="pixel-font text-xs text-claw-cyan">AGENT TERMINAL</h2>
                    <span className="font-mono text-[10px] text-white/30 uppercase">v_1.4.0</span>
                </div>
                <DataMetrics />
                <TerminalCore />
            </div>
        </div>
    )
}

export default App;
