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

// State variables removed as we pull from backend

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

showHospital();
fetchBackendStats();

setInterval(() => {
    fetchBackendStats();
}, 2000);