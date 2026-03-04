// All available rooms/departments
const rooms = [
    // LOBBY - Pokemon Clinic Reception
    { name: 'LOBBY', dept: 'RECEPTION', doctor: 'Dr. Welcome', desc: 'Welcome to CLAW Hospital! How may I assist you today?', color: '#ff3333', env: 'lobby' },
    // SYSTEM - index 1-5
    { name: 'RUNTIME', dept: 'SYSTEM', doctor: 'Dr. Runtime', desc: 'Agent runtime issues - let me check your tooling...', color: '#ff6b6b', env: 'runtime' },
    { name: 'CRASH', dept: 'SYSTEM', doctor: 'Dr. Crash', desc: 'Crash/hang issues - diagnosing the failure...', color: '#ff6b6b', env: 'crash' },
    { name: 'BEHAVIOR', dept: 'SYSTEM', doctor: 'Dr. Behavior', desc: 'Incorrect behavior detected - analyzing patterns...', color: '#ff6b6b', env: 'behavior' },
    { name: 'WEBUI', dept: 'SYSTEM', doctor: 'Dr. WebUI', desc: 'Web interface issues - checking the UI layer...', color: '#ff6b6b', env: 'webui' },
    { name: 'MOBILE', dept: 'SYSTEM', doctor: 'Dr. Mobile', desc: 'Mobile app issues - testing the client...', color: '#ff6b6b', env: 'mobile' },
    // CORE integrations - index 6-10
    { name: 'DISCORD', dept: 'CORE', doctor: 'Ms. Chat', desc: 'Discord integration - processing message queues...', color: '#5865F2', env: 'discord' },
    { name: 'WHATSAPP', dept: 'CORE', doctor: 'Mr. WA', desc: 'WhatsApp connection - restoring encrypted link...', color: '#25D366', env: 'whatsapp' },
    { name: 'TELEGRAM', dept: 'CORE', doctor: 'Mr. TG', desc: 'Telegram bot - checking API connection...', color: '#0088cc', env: 'telegram' },
    { name: 'SLACK', dept: 'CORE', doctor: 'Ms. Slack', desc: 'Slack workspace - analyzing channels...', color: '#4A154B', env: 'slack' },
    { name: 'SIGNAL', dept: 'CORE', doctor: 'Mr. Signal', desc: 'Signal messaging - securing the path...', color: '#3a76f0', env: 'signal' },
    // EXTENSIONS - index 11-15
    { name: 'FEISHU', dept: 'EXT', doctor: 'Mr. Feishu', desc: 'Feishu integration - connecting to workspace...', color: '#29a1f6', env: 'feishu' },
    { name: 'LINE', dept: 'EXT', doctor: 'Mr. LINE', desc: 'LINE bot - checking LINE API...', color: '#00c300', env: 'line' },
    { name: 'MATRIX', dept: 'EXT', doctor: 'Mr. Matrix', desc: 'Matrix protocol - syncing the matrix...', color: '#000000', env: 'matrix' },
    { name: 'TEAMS', dept: 'EXT', doctor: 'Ms. Teams', desc: 'Microsoft Teams - connecting to org...', color: '#6264a7', env: 'msteams' },
    { name: 'MATTERMOST', dept: 'EXT', doctor: 'Mr. Matter', desc: 'Mattermost - checking self-hosted...', color: '#0052cc', env: 'mattermost' },
    // BOSS - index 16
    { name: 'BOSS', dept: 'ADMIN', doctor: 'The Admin', desc: 'Final boss encounter! Prepare yourself!', color: '#ff003c', env: 'boss' }
];

// Department theme colors for Pokemon decorations
const deptThemes = {
    'discord': { primary: '#5865F2', secondary: '#3b82f6', name: 'DISCORD' },
    'whatsapp': { primary: '#25D366', secondary: '#128c7e', name: 'WHATSAPP' },
    'telegram': { primary: '#0088cc', secondary: '#24a1da', name: 'TELEGRAM' },
    'slack': { primary: '#4A154B', secondary: '#611f69', name: 'SLACK' },
    'signal': { primary: '#3a76f0', secondary: '#5a8a40', name: 'SIGNAL' },
    'feishu': { primary: '#29a1f6', secondary: '#1e90ff', name: 'FEISHU' },
    'line': { primary: '#00c300', secondary: '#7bec4d', name: 'LINE' },
    'matrix': { primary: '#7faaff', secondary: '#000000', name: 'MATRIX' },
    'msteams': { primary: '#6264a7', secondary: '#7b83eb', name: 'TEAMS' },
    'mattermost': { primary: '#0052cc', secondary: '#3db3e8', name: 'MATTERMOST' },
    'boss': { primary: '#ff003c', secondary: '#ff4444', name: 'BOSS' },
    'lobby': { primary: '#c94c4c', secondary: '#a85c5c', name: 'LOBBY' },
    'runtime': { primary: '#ff9800', secondary: '#ffb74d', name: 'RUNTIME' },
    'crash': { primary: '#f44336', secondary: '#ef5350', name: 'CRASH' },
    'behavior': { primary: '#ffeb3b', secondary: '#fff176', name: 'BEHAVIOR' },
    'webui': { primary: '#2196f3', secondary: '#64b5f6', name: 'WEBUI' },
    'mobile': { primary: '#4caf50', secondary: '#81c784', name: 'MOBILE' }
};

function showHospital() {
    document.getElementById('hospitalView').style.display = 'block';
    document.getElementById('roomScene').classList.remove('active');
    updateRoomButtons(-1);
}

// Show lobby by default on page load
function showLobby() {
    showRoom(0);
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
    
    // Apply department theme colors to the Pokemon clinic interior
    const theme = deptThemes[envType] || deptThemes['lobby'];
    const clinic = document.getElementById('indoorEnvironment');
    if (clinic) {
        clinic.style.setProperty('--dept-primary', theme.primary);
        clinic.style.setProperty('--dept-secondary', theme.secondary);
    }
}

function showRoom(index) {
    const room = rooms[index];
    if (!room) return;

    document.getElementById('hospitalView').style.display = 'none';
    document.getElementById('roomScene').classList.add('active');

    document.getElementById('roomTitle').innerText = `${room.name} - ${room.dept}`;
    document.getElementById('roomTitle').style.color = room.color;
    document.getElementById('npcName').innerText = `[ ${room.doctor.toUpperCase()} ]`;

    const textElement = document.getElementById('dialogText');
    textElement.textContent = '';
    let charIndex = 0;
    clearInterval(window.typewriterInterval);
    window.typewriterInterval = setInterval(() => {
        if (charIndex < room.desc.length) {
            textElement.textContent = room.desc.substring(0, charIndex + 1);
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
        btn.classList.toggle('active', i === activeIndex);
        if (i === activeIndex && rooms[activeIndex]) {
            btn.style.color = rooms[activeIndex].color;
            btn.style.borderColor = rooms[activeIndex].color;
        } else {
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    });
}

function fetchBackendStats() {
    fetch('/api/stats')
        .then(r => r.json())
        .then(data => {
            document.getElementById('statTotal').innerText = data.totalConsults || 0;
            document.getElementById('statToday').innerText = data.todayConsults || 0;
            document.getElementById('statCalls').innerText = data.totalApiCalls || 0;

            if (data.departmentCounts) {
                let depts = Object.entries(data.departmentCounts);
                depts.sort((a, b) => b[1] - a[1]);

                if (data.totalConsults > 0 && depts[0][1] > 0) {
                    document.getElementById('statTopDept').innerText = depts[0][0].toUpperCase() + ' (' + depts[0][1] + ')';

                    let statsHtml = '';
                    depts.forEach(([dept, count]) => {
                        if (count > 0) {
                            let pct = Math.round((count / data.totalConsults) * 100);
                            statsHtml += `<div class="api-row" style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 10px;">
                                <span style="color: #00f3ff;">${dept.toUpperCase()}</span>
                                <span>${pct}% <span style="opacity: 0.5;">(${count})</span></span>
                            </div>`;
                        }
                    });
                    document.getElementById('statsContainer').innerHTML = statsHtml;
                } else {
                    document.getElementById('statTopDept').innerText = 'NONE';
                    document.getElementById('statsContainer').innerHTML = '<div style="opacity: 0.5;">NO DATA</div>';
                }
            }
        })
        .catch(err => console.error('Error fetching stats:', err));
}

showLobby();
fetchBackendStats();

setInterval(() => {
    fetchBackendStats();
}, 2000);
