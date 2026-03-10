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
        const eventSource = new EventSource('/api/stream');

        eventSource.onmessage = (event) => {
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
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return { stats, latestEvent };
}
