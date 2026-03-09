import { useEffect, useState } from 'react';

export function DataMetrics() {
    const [stats, setStats] = useState({
        totalConsults: 0,
        todayConsults: 0,
        totalApiCalls: 0,
        departmentCounts: {}
    });

    useEffect(() => {
        fetch('/api/stats')
            .then(r => r.json())
            .then(data => setStats(data))
            .catch(console.error);
    }, []);

    const topDept = Object.entries(stats.departmentCounts || {})
        .sort(([, a], [, b]) => b - a)
    [0]?.[0] || 'NONE';

    return (
        <div className="flex border-b border-white/5 bg-black/20 w-full shrink-0">
            <div className="grid grid-cols-2 text-xs font-mono w-full">
                <div className="p-4 border-r border-b border-white/5 flex flex-col gap-1">
                    <span className="text-white/30 uppercase tracking-widest text-[10px]">TOTAL_CON</span>
                    <span className="text-claw-cyan text-lg leading-none">{stats.totalConsults || 0}</span>
                </div>
                <div className="p-4 border-b border-white/5 flex flex-col gap-1">
                    <span className="text-white/30 uppercase tracking-widest text-[10px]">TODAY_CON</span>
                    <span className="text-claw-rose text-lg leading-none">{stats.todayConsults || 0}</span>
                </div>
                <div className="p-4 border-r border-white/5 flex flex-col gap-1">
                    <span className="text-white/30 uppercase tracking-widest text-[10px]">API_CALLS</span>
                    <span className="text-claw-green text-lg leading-none">{stats.totalApiCalls || 0}</span>
                </div>
                <div className="p-4 border-white/5 flex flex-col gap-1 overflow-hidden">
                    <span className="text-white/30 uppercase tracking-widest text-[10px]">TOP_DEPT</span>
                    <span className="text-white/90 text-sm truncate uppercase leading-none mt-1">{topDept}</span>
                </div>
            </div>
        </div>
    );
}
