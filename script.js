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

// Agent Demo - Auto diagnose a sample issue
function agentDemo() {
    const demoProblem = "OpenClaw WhatsApp not responding";
    fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: demoProblem })
    })
    .then(r => r.json())
    .then(data => {
        console.log('Agent Demo Result:', data);
        document.getElementById('agentResult').innerHTML = 
            '<pre style="color: #0f0; font-size: 9px;">' + JSON.stringify(data, null, 2) + '</pre>';
    })
    .catch(err => console.error('Demo error:', err));
}

// 一键修复 - 获取修复命令
function getFixCommands() {
    const dept = document.getElementById('fixDepartment').value.trim();
    if (!dept) {
        document.getElementById('fixResult').innerHTML = '<span style="color: #ff6b6b;">请输入科室名称</span>';
        return;
    }
    
    document.getElementById('fixResult').innerHTML = '<span style="color: #0f0;">诊断中...</span>';
    
    fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: dept })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            document.getElementById('fixResult').innerHTML = '<span style="color: #ff6b6b;">错误: ' + data.error + '</span>';
            return;
        }
        
        let html = '<div style="color: #0f0; margin-bottom: 10px;">';
        html += '科室: ' + data.departmentName + '<br>';
        html += '</div>';
        
        if (data.fixCommands && data.fixCommands.length > 0) {
            html += '<div style="color: #ffeb3b; margin-bottom: 5px;">修复命令:</div>';
            data.fixCommands.forEach((cmd, i) => {
                html += '<div style="margin: 5px 0; padding: 5px; background: #1a1a2e; border-left: 3px solid #0f0;">';
                html += '<span style="color: #888;">$</span> <span style="color: #0f0;">' + cmd + '</span>';
                html += '</div>';
            });
        } else {
            html += '<div style="color: #888;">暂无修复命令</div>';
        }
        
        document.getElementById('fixResult').innerHTML = html;
    })
    .catch(err => {
        document.getElementById('fixResult').innerHTML = '<span style="color: #ff6b6b;">请求失败: ' + err.message + '</span>';
    });
}

// Run demo after 2 seconds
setTimeout(agentDemo, 2000);

// ==================== EVOMAP FUNCTIONS ====================

// EvoMap data - department relationships
const evoNodes = [
    // System
    { id: 'runtime', name: 'RUNTIME', category: 'system', x: 400, y: 80, color: '#ff9800' },
    { id: 'crash', name: 'CRASH', category: 'system', x: 300, y: 150, color: '#f44336' },
    { id: 'config', name: 'CONFIG', category: 'system', x: 500, y: 150, color: '#9c27b0' },
    { id: 'model', name: 'MODEL', category: 'system', x: 400, y: 220, color: '#2196f3' },
    { id: 'memory', name: 'MEMORY', category: 'system', x: 250, y: 220, color: '#00bcd4' },
    { id: 'automation', name: 'AUTOMATION', category: 'system', x: 550, y: 220, color: '#607d8b' },
    { id: 'security', name: 'SECURITY', category: 'system', x: 400, y: 300, color: '#f44336' },
    
    // Core Channels
    { id: 'discord', name: 'DISCORD', category: 'core', x: 150, y: 350, color: '#5865F2' },
    { id: 'whatsapp', name: 'WHATSAPP', category: 'core', x: 280, y: 380, color: '#25D366' },
    { id: 'telegram', name: 'TELEGRAM', category: 'core', x: 400, y: 400, color: '#0088cc' },
    { id: 'signal', name: 'SIGNAL', category: 'core', x: 520, y: 380, color: '#3a76f0' },
    { id: 'slack', name: 'SLACK', category: 'core', x: 650, y: 350, color: '#4A154B' },
    
    // Extensions
    { id: 'feishu', name: 'FEISHU', category: 'ext', x: 150, y: 480, color: '#29a1f6' },
    { id: 'line', name: 'LINE', category: 'ext', x: 280, y: 500, color: '#00c300' },
    { id: 'matrix', name: 'MATRIX', category: 'ext', x: 400, y: 520, color: '#7faaff' },
    { id: 'teams', name: 'TEAMS', category: 'ext', x: 520, y: 500, color: '#6264a7' },
    { id: 'mattermost', name: 'MATTERMOST', category: 'ext', x: 650, y: 480, color: '#0052cc' }
];

// Connections between nodes
const evoConnections = [
    // System connections
    { from: 'runtime', to: 'crash' },
    { from: 'runtime', to: 'config' },
    { from: 'config', to: 'model' },
    { from: 'config', to: 'memory' },
    { from: 'model', to: 'automation' },
    { from: 'memory', to: 'security' },
    { from: 'crash', to: 'security' },
    
    // Channel connections to system
    { from: 'discord', to: 'config' },
    { from: 'whatsapp', to: 'config' },
    { from: 'telegram', to: 'config' },
    { from: 'signal', to: 'config' },
    { from: 'slack', to: 'config' },
    { from: 'feishu', to: 'config' },
    { from: 'line', to: 'config' },
    { from: 'matrix', to: 'config' },
    { from: 'teams', to: 'config' },
    { from: 'mattermost', to: 'config' },
    
    // Related channels
    { from: 'discord', to: 'whatsapp' },
    { from: 'telegram', to: 'signal' },
    { from: 'feishu', to: 'line' },
    { from: 'teams', to: 'mattermost' }
];

// Node information
const evoInfo = {
    'runtime': { issues: 1, desc: 'Gateway 启动/运行问题', cmds: 'openclaw gateway restart' },
    'crash': { issues: 1, desc: '系统崩溃/卡住', cmds: 'openclaw doctor\ntail -100 /tmp/openclaw/*.log' },
    'config': { issues: 2, desc: '配置错误/冲突', cmds: 'openclaw config get\nopenclaw doctor --fix' },
    'model': { issues: 2, desc: '模型选择/额度问题', cmds: 'openclaw status' },
    'memory': { issues: 2, desc: '记忆丢失/检索失败', cmds: 'openclaw memory search' },
    'automation': { issues: 3, desc: 'Cron/Heartbeat 不执行', cmds: 'openclaw cron status' },
    'security': { issues: 5, desc: '安全漏洞/CVE', cmds: 'openclaw security audit' },
    'discord': { issues: 7, desc: '消息不回复/离线', cmds: 'openclaw channels status discord' },
    'whatsapp': { issues: 11, desc: '连接失败/配对问题', cmds: 'openclaw whatsapp pair' },
    'telegram': { issues: 15, desc: 'Bot 无响应/网络问题', cmds: 'openclaw pairing pending' },
    'signal': { issues: 3, desc: 'Signal 连接问题', cmds: 'openclaw channels status signal' },
    'slack': { issues: 3, desc: 'Socket mode/权限问题', cmds: 'openclaw channels status slack' },
    'feishu': { issues: 2, desc: 'Group binding/权限', cmds: 'openclaw agents bindings' },
    'line': { issues: 2, desc: 'LINE Bot 配置问题', cmds: 'openclaw channels status line' },
    'matrix': { issues: 2, desc: 'Matrix 同步问题', cmds: 'openclaw channels status matrix' },
    'teams': { issues: 2, desc: 'Teams 集成问题', cmds: 'openclaw channels status teams' },
    'mattermost': { issues: 2, desc: '自托管实例问题', cmds: 'openclaw channels status mattermost' }
};

let evoMapDrawn = false;

function toggleEvoMap() {
    const evoView = document.getElementById('evoMapView');
    const hospitalView = document.getElementById('hospitalView');
    const roomScene = document.getElementById('roomScene');
    
    if (evoView.style.display === 'none') {
        evoView.style.display = 'block';
        hospitalView.style.display = 'none';
        roomScene.classList.remove('active');
        if (!evoMapDrawn) {
            drawEvoMap();
            evoMapDrawn = true;
        }
    } else {
        evoView.style.display = 'none';
        hospitalView.style.display = 'block';
    }
}

function drawEvoMap() {
    const svg = document.getElementById('evoMapSvg');
    const width = svg.clientWidth || 800;
    const height = svg.clientHeight || 600;
    
    let html = '';
    
    // Draw connections first (behind nodes)
    evoConnections.forEach(conn => {
        const fromNode = evoNodes.find(n => n.id === conn.from);
        const toNode = evoNodes.find(n => n.id === conn.to);
        if (fromNode && toNode) {
            html += `<line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" 
                     stroke="#333" stroke-width="2" opacity="0.5"/>`;
        }
    });
    
    // Draw nodes
    evoNodes.forEach(node => {
        const info = evoInfo[node.id] || { issues: 0, desc: '' };
        html += `
            <g class="evo-node" onclick="showEvoInfo('${node.id}')" 
               style="cursor: pointer;" 
               onmouseover="highlightNode('${node.id}', true)" 
               onmouseout="highlightNode('${node.id}', false)">
                <circle cx="${node.x}" cy="${node.y}" r="35" fill="${node.color}" opacity="0.8"/>
                <circle cx="${node.x}" cy="${node.y}" r="35" fill="none" stroke="${node.color}" stroke-width="3"/>
                <text x="${node.x}" y="${node.y}" text-anchor="middle" dominant-baseline="middle" 
                      fill="#fff" font-family="monospace" font-size="9" font-weight="bold">
                    ${node.name}
                </text>
                <circle cx="${node.x + 25}" cy="${node.y - 25}" r="10" fill="#f00"/>
                <text x="${node.x + 25}" y="${node.y - 25}" text-anchor="middle" dominant-baseline="middle" 
                      fill="#fff" font-family="monospace" font-size="8">${info.issues}</text>
            </g>
        `;
    });
    
    svg.innerHTML = html;
}

function showEvoInfo(nodeId) {
    const node = evoNodes.find(n => n.id === nodeId);
    const info = evoInfo[nodeId] || { issues: 0, desc: '无数据', cmds: '' };
    
    const infoDiv = document.getElementById('evoInfo');
    infoDiv.innerHTML = `
        <div style="color: ${node.color}; font-weight: bold; margin-bottom: 5px;">
            ${node.name} 科室
        </div>
        <div>问题数: ${info.issues}</div>
        <div>${info.desc}</div>
        <div style="margin-top: 5px; color: #0f0;">命令:</div>
        <pre style="margin: 5px 0; white-space: pre-wrap;">${info.cmds}</pre>
        <button onclick="navigateToRoom('${node.id}')" 
                style="padding: 5px 10px; background: #0f0; color: #000; border: none; cursor: pointer; font-family: monospace;">
            进入科室 →
        </button>
    `;
}

function navigateToRoom(nodeId) {
    const roomMap = {
        'runtime': 1, 'crash': 2, 'behavior': 3, 'webui': 4, 'mobile': 5,
        'discord': 6, 'whatsapp': 7, 'telegram': 8, 'slack': 9, 'signal': 10,
        'feishu': 11, 'line': 12, 'matrix': 13, 'teams': 14, 'mattermost': 15,
        'config': 16, 'model': 16, 'memory': 16, 'automation': 16, 'security': 16
    };
    
    const roomIndex = roomMap[nodeId] || 0;
    toggleEvoMap();
    showRoom(roomIndex);
}

function highlightNode(nodeId, highlight) {
    // Could add visual highlight effects here
}

function searchEvoMap(query) {
    if (!query) {
        drawEvoMap();
        return;
    }
    
    query = query.toLowerCase();
    const svg = document.getElementById('evoMapSvg');
    let html = '';
    
    // Draw connections (dimmed)
    evoConnections.forEach(conn => {
        const fromNode = evoNodes.find(n => n.id === conn.from);
        const toNode = evoNodes.find(n => n.id === conn.to);
        if (fromNode && toNode) {
            html += `<line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" 
                     stroke="#333" stroke-width="1" opacity="0.2"/>`;
        }
    });
    
    // Draw nodes (highlighted if matches)
    evoNodes.forEach(node => {
        const info = evoInfo[node.id] || { issues: 0, desc: '' };
        const matches = node.name.toLowerCase().includes(query) || 
                       node.id.includes(query) ||
                       info.desc.toLowerCase().includes(query);
        
        const opacity = matches ? 1 : 0.3;
        const strokeWidth = matches ? 4 : 2;
        
        html += `
            <g class="evo-node" onclick="showEvoInfo('${node.id}')" 
               style="cursor: pointer; opacity: ${opacity};">
                <circle cx="${node.x}" cy="${node.y}" r="35" fill="${node.color}" opacity="0.8"/>
                <circle cx="${node.x}" cy="${node.y}" r="35" fill="none" stroke="${node.color}" stroke-width="${strokeWidth}"/>
                <text x="${node.x}" y="${node.y}" text-anchor="middle" dominant-baseline="middle" 
                      fill="#fff" font-family="monospace" font-size="9" font-weight="bold">
                    ${node.name}
                </text>
            </g>
        `;
    });
    
    svg.innerHTML = html;
}
