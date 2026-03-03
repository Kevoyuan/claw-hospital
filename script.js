// Room Data
const rooms = [
    { name: 'LOBBY', dept: 'GENERAL', doctor: 'Dr. Welcome', desc: 'Welcome to CLAW Hospital! How may I assist you today?', color: '#60a5fa', env: 'lobby' },
    { name: 'TRIAGE', dept: 'ASSESSMENT', doctor: 'Dr. Triage', desc: 'Let me evaluate your condition to direct you properly...', color: '#33e5f4', env: 'triage' },
    { name: 'EMERGENCY', dept: 'URGENT CARE', doctor: 'Dr. Urgent', desc: 'Critical condition detected! Initiating emergency protocols!', color: '#f87171', env: 'emergency' },
    { name: 'NEURO', dept: 'NEUROLOGY', doctor: 'Dr. Brain', desc: 'Scanning neural network pathways for anomalies...', color: '#c084fc', env: 'neuro' },
    { name: 'MEMORY', dept: 'DATA STORAGE', doctor: 'Dr. Memory', desc: 'Reconstructing fragmented memory blocks...', color: '#f472b6', env: 'memory' },
    { name: 'BEHAVIOR', dept: 'PSYCHOLOGY', doctor: 'Dr. Play', desc: 'Calibrating behavioral models and response patterns...', color: '#4ade80', env: 'behavior' },
    { name: 'WHATSAPP', dept: 'COMMS LINK', doctor: 'Mr. Whats', desc: 'Restoring end-to-end encrypted connection...', color: '#22c55e', env: 'whatsapp' },
    { name: 'DISCORD', dept: 'CHANNEL OPS', doctor: 'Ms. Chat', desc: 'Processing message queues in the mainframe...', color: '#818cf8', env: 'discord' },
    { name: 'BOSS', dept: 'ADMINISTRATION', doctor: 'The Admin', desc: 'Final boss encounter sequence initiated! Prepare yourself!', color: '#facc15', env: 'boss' }
];

// Mock API Data
const apiData = {
    agent: {
        memory: 87,
        cpu: 42,
        health: 94,
        tasks: 3
    },
    logs: [
        { time: '07:52:31', msg: 'HEARTBEAT CHECK COMPLETED', type: 'info' },
        { time: '07:52:15', msg: 'NEW MESSAGE FROM DISCORD', type: 'info' },
        { time: '07:51:58', msg: 'FEISHU API SYNC COMPLETE', type: 'info' },
        { time: '07:51:42', msg: 'MEMORY CLEANUP TRIGGERED', type: 'warn' },
        { time: '07:50:30', msg: 'TASK QUEUE: 3 PENDING', type: 'info' }
    ]
};

// Show Hospital Exterior
function showHospital() {
    document.getElementById('hospitalView').style.display = 'block';
    document.getElementById('roomScene').classList.remove('active');
    updateRoomButtons(-1);
}

// Render Indoor Environment based on room
function renderEnvironment(envType) {
    const envContainer = document.getElementById('indoorEnvironment');
    let html = '';
    
    // Default floor
    html += '<div class="ground" style="height: 30px; background: #1e293b; border-color: #334155;"></div>';
    
    switch(envType) {
        case 'lobby':
            html += '<div class="env-prop env-desk"></div>';
            html += '<div class="env-prop env-monitor"></div>';
            break;
        case 'triage':
            html += '<div class="env-prop env-desk" style="width: 80px;"></div>';
            html += '<div class="env-prop env-monitor" style="background: #0f766e;"><div style="position:absolute;top:4px;left:4px;right:4px;bottom:4px;border-bottom:2px solid #4ade80;"></div></div>';
            break;
        case 'emergency':
            html += '<div class="env-prop env-bed"></div>';
            html += '<div class="env-prop" style="bottom: 70px; left: 30%; width: 40px; height: 10px; background: #fef08a;"></div>'; // light
            break;
        case 'neuro':
        case 'memory':
            html += '<div class="env-prop env-server"> <div class="env-server-light"></div> </div>';
            html += '<div class="env-prop env-server" style="right: 40%;"> <div class="env-server-light"></div> </div>';
            break;
        case 'behavior':
            html += '<div class="env-prop" style="bottom: 30px; left: 40%; width: 60px; height: 60px; border-radius: 50%; background: #f472b6;"></div>'; // toy ball
            break;
        case 'whatsapp':
        case 'discord':
            html += '<div class="env-prop env-server" style="background: ' + (envType === 'whatsapp' ? '#14532d' : '#312e81') + ';"> <div class="env-server-light"></div> </div>';
            html += '<div class="env-prop env-desk"></div><div class="env-prop env-monitor"></div>';
            break;
        case 'boss':
            html += '<div class="env-prop env-desk" style="width: 160px; background: #7f1d1d;"></div>';
            html += '<div class="env-prop" style="bottom: 60px; left: 50%; transform: translateX(-50%); width: 60px; height: 80px; background: #450a0a;"></div>'; // big chair
            break;
    }
    
    envContainer.innerHTML = html;
}

// Show Specific Room
function showRoom(index) {
    const room = rooms[index];
    
    document.getElementById('hospitalView').style.display = 'none';
    document.getElementById('roomScene').classList.add('active');
    
    document.getElementById('roomTitle').innerText = `${room.name} - ${room.dept}`;
    document.getElementById('roomTitle').style.color = room.color;
    document.getElementById('npcName').innerText = `[ ${room.doctor.toUpperCase()} ]`;
    
    // Typewriter effect
    const textElement = document.getElementById('dialogText');
    textElement.innerText = '';
    let charIndex = 0;
    clearInterval(window.typewriterInterval);
    window.typewriterInterval = setInterval(() => {
        if(charIndex < room.desc.length) {
            textElement.innerText += room.desc.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(window.typewriterInterval);
        }
    }, 30);
    
    document.getElementById('roomDept').innerText = room.dept;
    document.getElementById('roomDoctor').innerText = room.doctor;
    
    document.getElementById('doctorSprite').style.background = room.color;
    
    renderEnvironment(room.env);
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
function updateAgentView() {
    // Randomize stats slightly
    apiData.agent.memory = Math.max(60, Math.min(99, apiData.agent.memory + Math.floor(Math.random() * 5) - 2));
    apiData.agent.cpu = Math.max(10, Math.min(90, apiData.agent.cpu + Math.floor(Math.random() * 10) - 5));
    apiData.agent.health = Math.max(70, Math.min(100, apiData.agent.health + Math.floor(Math.random() * 3) - 1));
    
    document.getElementById('memUsage').innerText = apiData.agent.memory + '%';
    document.getElementById('cpuUsage').innerText = apiData.agent.cpu + '%';
    document.getElementById('healthScore').innerText = apiData.agent.health;
    document.getElementById('activeTasks').innerText = apiData.agent.tasks;
    
    // Random Logs
    const randomLog = generateRandomLog();
    if(Math.random() > 0.5) {
        apiData.logs.unshift(randomLog);
        if (apiData.logs.length > 8) apiData.logs.pop();
    }
    
    const logContainer = document.getElementById('agentLogs');
    logContainer.innerHTML = apiData.logs.map(log => {
        const typeClass = log.type === 'warn' ? 'log-warn' : log.type === 'error' ? 'log-error' : 'log-msg';
        return `<div class="log-entry"><span class="log-time">[${log.time}]</span><span class="${typeClass}">${log.msg}</span></div>`;
    }).join('');
}

// Generate Random Log
function generateRandomLog() {
    const msgs = [
        { msg: 'HEARTBEAT OK', type: 'info' },
        { msg: 'PROCESSING QUEUE...', type: 'info' },
        { msg: 'API LATENCY: ' + (20 + Math.floor(Math.random() * 50)) + 'MS', type: 'info' },
        { msg: 'MEMORY USAGE STABLE', type: 'info' },
        { msg: 'NEW NOTIFICATION RECEIVED', type: 'warn' },
        { msg: 'ROUTING REQUEST', type: 'info' }
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
}, 2000);