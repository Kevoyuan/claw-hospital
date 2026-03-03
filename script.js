// Room Data
const rooms = [
    { name: 'LOBBY', dept: '综合科', doctor: 'Dr. Welcome', desc: '欢迎来到 CLAW HOSPITAL！请问有什么可以帮助？', color: '#5fc9f8' },
    { name: 'TRIAGE', dept: '分诊科', doctor: 'Dr. Triage', desc: '让我分析一下你的问题...', color: '#73eff7' },
    { name: 'EMERGENCY', dept: '急诊科', doctor: 'Dr. Urgent', desc: '紧急情况！立即处理中！', color: '#ff6b6b' },
    { name: 'NEURO', dept: '神经科', doctor: 'Dr. Brain', desc: '神经网络扫描中...', color: '#a29bfe' },
    { name: 'MEMORY', dept: '记忆科', doctor: 'Dr. Memory', desc: '记忆碎片重组中...', color: '#ff85c2' },
    { name: 'BEHAVIOR', dept: '行为科', doctor: 'Dr. Play', desc: '行为模式校准中...', color: '#7bed9f' },
    { name: 'WHATSAPP', dept: '连接科', doctor: 'Mr. Whats', desc: 'WhatsApp 连接修复中...', color: '#25D366' },
    { name: 'DISCORD', dept: '消息科', doctor: 'Ms. Chat', desc: 'Discord 消息处理中...', color: '#5865F2' },
    { name: 'BOSS', dept: '院长室', doctor: 'The Admin', desc: '最终 BOSS 战准备就绪！', color: '#ffd700' }
];

// Mock API Data
const apiData = {
    agent: {
        name: 'Claws',
        status: 'active',
        memory: 87,
        cpu: 42,
        health: 94,
        tasks: 3,
        uptime: '2d 14h',
        messages: 1247
    },
    connections: {
        feishu: { status: 'connected', latency: 23 },
        discord: { status: 'connected', latency: 45 },
        whatsapp: { status: 'pending', latency: null },
        github: { status: 'connected', latency: 67 }
    },
    logs: [
        { time: '07:52:31', msg: 'Heartbeat check completed', type: 'info' },
        { time: '07:52:15', msg: 'New message from Discord', type: 'info' },
        { time: '07:51:58', msg: 'Feishu API sync complete', type: 'info' },
        { time: '07:51:42', msg: 'Memory cleanup triggered', type: 'warn' },
        { time: '07:50:30', msg: 'Task queue: 3 pending', type: 'info' }
    ]
};

// Show Hospital
function showHospital() {
    document.getElementById('hospitalView').style.display = 'block';
    document.getElementById('roomScene').classList.remove('active');
    updateRoomButtons(-1);
}

// Show Room
function showRoom(index) {
    const room = rooms[index];
    
    document.getElementById('hospitalView').style.display = 'none';
    document.getElementById('roomScene').classList.add('active');
    
    document.getElementById('roomTitle').innerText = `${room.name} - ${room.dept}`;
    document.getElementById('roomTitle').style.color = room.color;
    document.getElementById('npcName').innerText = `DR. ${room.doctor.toUpperCase()}`;
    document.getElementById('dialogText').innerText = room.desc;
    document.getElementById('roomDept').innerText = room.dept;
    document.getElementById('roomDoctor').innerText = room.doctor;
    
    updateRoomButtons(index);
}

// Update Room Buttons
function updateRoomButtons(activeIndex) {
    const buttons = document.querySelectorAll('.room-nav .room-btn');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === activeIndex + 1);
    });
}

// Update Agent View with API data
async function updateAgentView() {
    // Update stats
    document.getElementById('memUsage').innerText = apiData.agent.memory + '%';
    document.getElementById('cpuUsage').innerText = apiData.agent.cpu + '%';
    document.getElementById('healthScore').innerText = apiData.agent.health;
    document.getElementById('activeTasks').innerText = apiData.agent.tasks;
    
    // Fetch visit count
    try {
        const resp = await fetch('/api/stats');
        const data = await resp.json();
        document.getElementById('visitCount').innerText = data.visits || 0;
    } catch(e) {}
    
    // Update logs
    const logContainer = document.getElementById('agentLogs');
    logContainer.innerHTML = apiData.logs.map(log => {
        const typeClass = log.type === 'warn' ? 'log-warn' : log.type === 'error' ? 'log-error' : 'log-msg';
        return `<div class="log-entry"><span class="log-time">[${log.time}]</span> <span class="${typeClass}">${log.msg}</span></div>`;
    }).join('');
    
    // Update API status
    updateApiStatus();
}

// Update API Connection Status
function updateApiStatus() {
    const connections = [
        { name: 'Feishu', data: apiData.connections.feishu },
        { name: 'Discord', data: apiData.connections.discord },
        { name: 'WhatsApp', data: apiData.connections.whatsapp }
    ];
    
    // Add simulated real-time update
    const randomLog = generateRandomLog();
    apiData.logs.unshift(randomLog);
    if (apiData.logs.length > 8) apiData.logs.pop();
    
    // Update random stats slightly
    apiData.agent.memory = Math.max(60, Math.min(95, apiData.agent.memory + Math.floor(Math.random() * 5) - 2));
    apiData.agent.cpu = Math.max(20, Math.min(80, apiData.agent.cpu + Math.floor(Math.random() * 10) - 5));
    apiData.agent.health = Math.max(70, Math.min(100, apiData.agent.health + Math.floor(Math.random() * 3) - 1));
}

// Generate Random Log
function generateRandomLog() {
    const msgs = [
        { msg: 'Heartbeat check completed', type: 'info' },
        { msg: 'Processing queue...', type: 'info' },
        { msg: 'API latency: ' + (20 + Math.floor(Math.random() * 50)) + 'ms', type: 'info' },
        { msg: 'Memory usage stable', type: 'info' },
        { msg: 'New notification received', type: 'warn' }
    ];
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    return { time, ...msgs[Math.floor(Math.random() * msgs.length)] };
}

// Initialize
showHospital();
updateAgentView();

// Simulate real-time updates
setInterval(() => {
    updateAgentView();
}, 3000);
