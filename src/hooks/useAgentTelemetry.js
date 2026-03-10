import { useState, useEffect } from 'react';

export function useAgentTelemetry() {
    const [stats, setStats] = useState({
        totalConsults: 0,
        todayConsults: 0,
        totalApiCalls: 0,
        departmentCounts: {}
    });

    // holds { agentId, status, department, message, timestamp }
    const [latestEvent, setLatestEvent] = useState(null);

    useEffect(() => {
        let eventSource;
        let mounted = true;

        const connectSSE = () => {
            eventSource = new EventSource('/api/stream');

            eventSource.onmessage = (event) => {
                if (!mounted) return;
                try {
                    const payload = JSON.parse(event.data);

                    if (payload.stats) {
                        setStats(payload.stats);
                    }

                    if (payload.type === 'telemetry') {
                        setLatestEvent(payload.data);
                    }
                } catch (err) {
                    console.error("Failed to parse SSE data", err);
                }
            };

            eventSource.onerror = (error) => {
                console.error("SSE Connection Error", error);
                // Retry connection after 5 seconds
                if (mounted) {
                    setTimeout(connectSSE, 5000);
                }
            };
        };

        connectSSE();

        return () => {
            mounted = false;
            if (eventSource) {
                eventSource.close();
            }
        };
    }, []);

    return { stats, latestEvent };
}
