const rooms = [
    { name: 'LOBBY', dept: 'GENERAL', doctor: 'Dr. Welcome', desc: 'Welcome to CLAW Hospital! How may I assist you today?', color: '#00f3ff', env: 'lobby' },
    { name: 'TRIAGE', dept: 'ASSESSMENT', doctor: 'Dr. Triage', desc: 'Let me evaluate your condition to direct you properly...', color: '#39ff14', env: 'triage' },
    { name: 'EMERGENCY', dept: 'URGENT CARE', doctor: 'Dr. Urgent', desc: 'Critical condition detected! Initiating emergency protocols!', color: '#ff003c', env: 'emergency' },
    { name: 'NEURO', dept: 'NEUROLOGY', doctor: 'Dr. Brain', desc: 'Scanning neural network pathways for anomalies...', color: '#b026ff', env: 'neuro' },
    { name: 'MEMORY', dept: 'DATA STORAGE', doctor: 'Dr. Memory', desc: 'Reconstructing fragmented memory blocks...', color: '#ff00e5', env: 'memory' },
    { name: 'BEHAVIOR', dept: 'PSYCHOLOGY', doctor: 'Dr. Play', desc: 'Calibrating behavioral models and response patterns...', color: '#fde047', env: 'behavior' },
    { name: 'WHATSAPP', dept: 'COMMS LINK', doctor: 'Mr. Whats', desc: 'Restoring end-to-end encrypted connection...', color: '#39ff14', env: 'whatsapp' },
    { name: 'DISCORD', dept: 'CHANNEL OPS', doctor: 'Ms. Chat', desc: 'Processing message queues in the mainframe...', color: '#5865F2', env: 'discord' },
    { name: 'BOSS', dept: 'ADMINISTRATION', doctor: 'The Admin', desc: 'Final boss encounter sequence initiated! Prepare yourself!', color: '#ff003c', env: 'boss' }
];

const apiData = {
    totalVisits: 0,
    todayVisits: 0,
    departmentStats: {
        emergency: 0,
        neuro: 0,
        memory: 0,
        behavior: 0,
        discord: 0,
        whatsapp: 0,
        config: 0,
        model: 0
    },
    recentCalls: []
};

function showHospital() {
    document.getElementById('hospitalView').style.display = 'block';
    document.getElementById('roomScene').classList.remove('active');
    updateRoomButtons(-1);
}

function renderEnvironment(envType) {
    const layers = document.querySelectorAll('.env-layer');
    layers.forEach(layer => {
        layer.style.display = 'none';
    });
    const activeLayer = document.getElementById('env-' + envType);
    if (activeLayer) {
        activeLayer.style.display = 'block';
    }
}

function showRoom(index) {
    const room = rooms[index];
    
    document.getElementById('hospitalView').style.display = 'none';
    document.getElementById('roomScene').classList.add('active');
    
    document.getElementById('roomTitle').innerText = `${room.name} - ${room.dept}`;
    document.getElementById('roomTitle').style.color = room.color;
    document.getElementById('npcName').innerText = `[ ${room.doctor.toUpperCase()} ]`;
    
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
    
    document.getElementById('doctorSprite').style.borderColor = room.color;
    document.getElementById('doctorSprite').style.color = room.color;
    document.getElementById('doctorSprite').style.boxShadow = `0 0 15px ${room.color}, inset 0 0 10px ${room.color}`;
    
    renderEnvironment(room.env);
    updateRoomButtons(index);
}

function updateRoomButtons(activeIndex) {
    const buttons = document.querySelectorAll('.room-nav .room-btn');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === activeIndex + 1);
        if (i === activeIndex + 1) {
            btn.style.color = rooms[activeIndex].color;
            btn.style.borderColor = rooms[activeIndex].color;
        } else {
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    });
}

function updateAgentView() {
    apiData.agent.memory = Math.max(60, Math.min(99, apiData.agent.memory + Math.floor(Math.random() * 5) - 2));
    apiData.agent.cpu = Math.max(10, Math.min(90, apiData.agent.cpu + Math.floor(Math.random() * 10) - 5));
    apiData.agent.health = Math.max(70, Math.min(100, apiData.agent.health + Math.floor(Math.random() * 3) - 1));
    
    document.getElementById('memUsage').innerText = apiData.totalVisits;
    document.getElementById('cpuUsage').innerText = apiData.todayVisits;
    
    // Calculate most common department
    let depts = Object.entries(apiData.departmentStats);
    depts.sort((a, b) => b[1] - a[1]);
    const topDept = depts[0][0];
    const topCount = depts[0][1];
    document.getElementById('healthScore').innerText = topDept.toUpperCase() + ' (' + topCount + ')';
    
    document.getElementById('activeTasks').innerText = apiData.recentCalls.length;
    
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

showHospital();
updateAgentView();

setInterval(() => {
    updateAgentView();
}, 2000);