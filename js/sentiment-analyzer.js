// ============ EXAMPLE TEXTS ============
const examples = [
  "Just tried the new update and it's absolutely incredible! The UI is so much smoother and faster. Best release yet, the team really outdid themselves 🔥",
  "Waited 45 minutes for customer support and got disconnected. This is the third time this month. Seriously considering switching to a competitor. Terrible experience.",
  "The quarterly earnings call is scheduled for next Tuesday at 4pm EST. Management will discuss the roadmap for Q2 2026.",
  "The camera quality is amazing but the battery life is disappointing. Great hardware let down by poor software optimization. Not sure if I'd recommend it.",
  "Oh wow another subscription price increase, what a surprise! Totally worth paying more for the same features that keep breaking. Love it! 🙃"
];

// ============ SENTIMENT ANALYSIS ============
const posWords = ['amazing','incredible','love','great','best','awesome','fantastic','beautiful','excellent','perfect','wonderful','brilliant','outstanding','smooth','fast','impressed','happy','delightful','superb','enjoy','recommend','stunning','solid','masterpiece','gem'];
const negWords = ['terrible','awful','worst','hate','horrible','disappointed','frustrated','broken','ugly','poor','useless','annoying','slow','expensive','bad','boring','waste','failure','pathetic','ridiculous','unacceptable','garbage','mediocre','overpriced','disconnect'];
const sarcasmHints = ['oh wow','what a surprise','love it','totally','sure','right','obviously','clearly','of course'];

function analyze() {
  const text = document.getElementById('textInput').value.trim();
  if (!text) return;

  const box = document.getElementById('resultBox');
  box.style.display = 'none';

  setTimeout(() => {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);

    let posScore = 0, negScore = 0;
    const posMatches = [], negMatches = [];

    words.forEach(w => {
      const clean = w.replace(/[^a-z]/g, '');
      if (posWords.includes(clean)) { posScore += 1; posMatches.push(clean); }
      if (negWords.includes(clean)) { negScore += 1; negMatches.push(clean); }
    });

    // Sarcasm detection
    let sarcasm = false;
    sarcasmHints.forEach(h => { if (lower.includes(h) && negScore > 0) sarcasm = true; });
    if (lower.includes('🙃') || lower.includes('/s')) sarcasm = true;
    if (sarcasm) { negScore += 2; posScore = Math.max(0, posScore - 1); }

    // Calculate probabilities
    const total = Math.max(1, posScore + negScore + 0.5);
    let pPos = posScore / total;
    let pNeg = negScore / total;
    let pNeu = 0.5 / total;

    // Normalize
    if (posScore === 0 && negScore === 0) { pPos = 0.15; pNeg = 0.15; pNeu = 0.7; }
    const sum = pPos + pNeg + pNeu;
    pPos /= sum; pNeg /= sum; pNeu /= sum;

    // Add some randomness for realism
    pPos += (Math.random() - 0.5) * 0.05;
    pNeg += (Math.random() - 0.5) * 0.05;
    pPos = Math.max(0.02, pPos);
    pNeg = Math.max(0.02, pNeg);
    pNeu = Math.max(0.02, 1 - pPos - pNeg);
    const s2 = pPos + pNeg + pNeu;
    pPos /= s2; pNeg /= s2; pNeu /= s2;

    // Determine sentiment
    let sentiment, color, confidence;
    if (pPos > pNeg && pPos > pNeu) { sentiment = 'Positive'; color = 'var(--grn)'; confidence = pPos; }
    else if (pNeg > pPos && pNeg > pNeu) { sentiment = 'Negative'; color = 'var(--red)'; confidence = pNeg; }
    else { sentiment = 'Neutral'; color = 'var(--t2)'; confidence = pNeu; }

    if (sarcasm) { sentiment = 'Negative (Sarcasm)'; color = 'var(--or)'; }

    // Update UI
    box.style.display = 'block';
    document.getElementById('resSent').textContent = sentiment;
    document.getElementById('resSent').style.color = color;
    document.getElementById('resConf').textContent = (confidence * 100).toFixed(1) + '%';
    document.getElementById('resConf').style.color = color;

    document.getElementById('barPos').style.width = (pPos * 100) + '%';
    document.getElementById('barNeg').style.width = (pNeg * 100) + '%';
    document.getElementById('barNeu').style.width = (pNeu * 100) + '%';
    document.getElementById('pctPos').textContent = (pPos * 100).toFixed(1) + '%';
    document.getElementById('pctNeg').textContent = (pNeg * 100).toFixed(1) + '%';
    document.getElementById('pctNeu').textContent = (pNeu * 100).toFixed(1) + '%';

    // Token highlighting
    const tokenBox = document.getElementById('tokenBox');
    tokenBox.innerHTML = '';
    text.split(/\s+/).forEach(word => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, '');
      let cls = 'tok-neu';
      if (posWords.includes(clean)) cls = 'tok-pos';
      if (negWords.includes(clean)) cls = 'tok-neg';
      if (sarcasmHints.some(h => clean.includes(h.replace(/\s/g,'')))) cls = 'tok-neg';
      tokenBox.innerHTML += `<span class="token ${cls}">${word}</span>`;
    });
  }, 300);
}

function tryExample(i) {
  document.getElementById('textInput').value = examples[i];
  analyze();
}

// ============ CHARTS ============

// Sentiment distribution donut
new Chart(document.getElementById('distChart'), {
  type: 'doughnut',
  data: {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      data: [52.3, 28.1, 19.6],
      backgroundColor: ['rgba(40,200,64,.7)', 'rgba(255,95,87,.7)', 'rgba(85,85,104,.5)'],
      borderWidth: 0, hoverOffset: 6
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, cutout: '62%',
    animation: { duration: 800 },
    plugins: { legend: { position: 'bottom', labels: { color: '#8888a0', font: { family: 'Sora', size: 10 }, boxWidth: 10, padding: 10 } } }
  }
});

// Hourly trend
const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
const genHourly = (base, amp) => hours.map((_, i) => +(base + Math.sin(i / 3.8) * amp + (Math.random() - 0.5) * 5).toFixed(1));
new Chart(document.getElementById('trendChart'), {
  type: 'line',
  data: {
    labels: hours,
    datasets: [
      { label: 'Positive', data: genHourly(52, 8), borderColor: '#28c840', borderWidth: 2, pointRadius: 0, tension: .4, fill: false },
      { label: 'Negative', data: genHourly(28, 6), borderColor: '#ff5f57', borderWidth: 2, pointRadius: 0, tension: .4, fill: false },
      { label: 'Neutral', data: genHourly(20, 4), borderColor: '#555568', borderWidth: 2, pointRadius: 0, tension: .4, fill: false }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: { legend: { labels: { color: '#8888a0', font: { family: 'Sora', size: 10 }, boxWidth: 10, padding: 8 } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#555568', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 8 } },
      y: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#555568', font: { family: 'JetBrains Mono', size: 9 }, callback: v => v + '%' } }
    }
  }
});

// Word cloud
const cloudWords = [
  { text: 'amazing', size: 1.5, color: 'var(--grn)', bg: 'rgba(40,200,64,.12)' },
  { text: 'terrible', size: 1.2, color: 'var(--red)', bg: 'rgba(255,95,87,.12)' },
  { text: 'product', size: 1.0, color: 'var(--t2)', bg: 'rgba(255,255,255,.04)' },
  { text: 'love', size: 1.6, color: 'var(--grn)', bg: 'rgba(40,200,64,.12)' },
  { text: 'update', size: .9, color: 'var(--t3)', bg: 'rgba(255,255,255,.03)' },
  { text: 'broken', size: 1.1, color: 'var(--red)', bg: 'rgba(255,95,87,.12)' },
  { text: 'fast', size: 1.3, color: 'var(--grn)', bg: 'rgba(40,200,64,.12)' },
  { text: 'expensive', size: 1.0, color: 'var(--red)', bg: 'rgba(255,95,87,.12)' },
  { text: 'recommend', size: 1.4, color: 'var(--grn)', bg: 'rgba(40,200,64,.12)' },
  { text: 'service', size: .85, color: 'var(--t2)', bg: 'rgba(255,255,255,.04)' },
  { text: 'support', size: .9, color: 'var(--t3)', bg: 'rgba(255,255,255,.03)' },
  { text: 'frustrated', size: 1.15, color: 'var(--red)', bg: 'rgba(255,95,87,.12)' },
  { text: 'brilliant', size: 1.25, color: 'var(--grn)', bg: 'rgba(40,200,64,.12)' },
  { text: 'slow', size: .95, color: 'var(--red)', bg: 'rgba(255,95,87,.12)' },
  { text: 'feature', size: .88, color: 'var(--t2)', bg: 'rgba(255,255,255,.04)' },
  { text: 'happy', size: 1.35, color: 'var(--grn)', bg: 'rgba(40,200,64,.12)' },
  { text: 'waste', size: 1.05, color: 'var(--red)', bg: 'rgba(255,95,87,.12)' },
  { text: 'price', size: .92, color: 'var(--yl)', bg: 'rgba(251,191,36,.1)' },
];
const cloud = document.getElementById('wordCloud');
cloudWords.forEach(w => {
  cloud.innerHTML += `<span class="cloud-word" style="font-size:${w.size}rem;color:${w.color};background:${w.bg};padding:.3rem .7rem;border-radius:5px">${w.text}</span>`;
});

// Confidence distribution
const confBins = ['50-55%','55-60%','60-65%','65-70%','70-75%','75-80%','80-85%','85-90%','90-95%','95-100%'];
const confData = [15, 28, 42, 68, 95, 185, 310, 425, 380, 299];
new Chart(document.getElementById('confChart'), {
  type: 'bar',
  data: {
    labels: confBins,
    datasets: [{
      data: confData,
      backgroundColor: confData.map((_, i) => {
        const t = i / 9;
        return `rgba(${Math.round(255 - t * 255)}, ${Math.round(95 + t * 105)}, ${Math.round(87 - t * 47)}, 0.6)`;
      }),
      borderRadius: 3
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#555568', font: { family: 'JetBrains Mono', size: 8 }, maxRotation: 45 } },
      y: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#555568', font: { family: 'JetBrains Mono', size: 9 } } }
    }
  }
});

// Topic breakdown
new Chart(document.getElementById('topicChart'), {
  type: 'bar',
  data: {
    labels: ['Product Quality', 'Customer Service', 'Pricing', 'UI/UX', 'Performance'],
    datasets: [
      { label: 'Positive', data: [320, 85, 110, 245, 205], backgroundColor: 'rgba(40,200,64,.6)', borderRadius: 4 },
      { label: 'Negative', data: [95, 280, 190, 60, 145], backgroundColor: 'rgba(255,95,87,.6)', borderRadius: 4 },
      { label: 'Neutral', data: [85, 55, 100, 45, 50], backgroundColor: 'rgba(85,85,104,.4)', borderRadius: 4 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: { legend: { labels: { color: '#8888a0', font: { family: 'Sora', size: 10 }, boxWidth: 10 } } },
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { color: '#8888a0', font: { family: 'Sora', size: 10 } } },
      y: { stacked: true, grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#555568', font: { family: 'JetBrains Mono', size: 9 } } }
    }
  }
});

// ============ FEED TABLE ============
const feed = [
  { text: 'This product has completely transformed my workflow. 10/10 would recommend to anyone!', src: 'Twitter', sent: 'positive', conf: 94.2, topic: 'Product Quality' },
  { text: 'Customer support took 3 days to respond and didn\'t even solve my issue. Unacceptable.', src: 'Reddit', sent: 'negative', conf: 91.7, topic: 'Customer Service' },
  { text: 'New pricing tiers announced for Q2. Enterprise plan starts at $299/month.', src: 'Twitter', sent: 'neutral', conf: 82.4, topic: 'Pricing' },
  { text: 'The redesigned dashboard is stunning! So much cleaner and easier to navigate now.', src: 'Twitter', sent: 'positive', conf: 89.8, topic: 'UI/UX' },
  { text: 'App crashes every time I try to export. Been like this for two weeks. Fix this please!', src: 'Reddit', sent: 'negative', conf: 93.1, topic: 'Performance' },
  { text: 'Compared v3 vs v4 side by side — the speed improvement is genuinely noticeable', src: 'Reddit', sent: 'positive', conf: 86.5, topic: 'Performance' },
  { text: 'Price increase was disappointing. Was already on the edge of switching to a competitor.', src: 'Twitter', sent: 'negative', conf: 78.9, topic: 'Pricing' },
  { text: 'Just onboarded my whole team. The collaboration features are exactly what we needed.', src: 'Reddit', sent: 'positive', conf: 91.3, topic: 'Product Quality' },
  { text: 'Version 4.2 release notes are out. Includes bug fixes and minor UI improvements.', src: 'Twitter', sent: 'neutral', conf: 75.6, topic: 'UI/UX' },
  { text: 'The AI suggestions are creepy accurate. Slightly unsettling but super useful lol', src: 'Reddit', sent: 'positive', conf: 68.4, topic: 'Product Quality' },
];

document.getElementById('feedTable').innerHTML = feed.map(f => {
  const cls = f.sent === 'positive' ? 'b-grn' : f.sent === 'negative' ? 'b-red' : 'b-yl';
  return `<tr>
    <td class="text-col">${f.text}</td>
    <td><span class="badge b-bl">${f.src}</span></td>
    <td><span class="badge ${cls}">${f.sent}</span></td>
    <td style="font-family:'JetBrains Mono',monospace;color:${f.conf > 85 ? 'var(--acc)' : f.conf > 70 ? 'var(--yl)' : 'var(--t3)'}">${f.conf}%</td>
    <td style="font-size:.72rem">${f.topic}</td>
  </tr>`;
}).join('');