// Feature importance
const features = ['Contract Type','Monthly Charges','Tenure','Tech Support','Payment Method','Internet Service','Online Security','Total Charges','Senior Citizen','Partner Status'];
const importance = [0.182,0.154,0.143,0.112,0.089,0.078,0.072,0.063,0.058,0.049];

new Chart(document.getElementById('featChart'), {
  type:'bar',
  data:{
    labels: features.slice().reverse(),
    datasets:[{
      data: importance.slice().reverse(),
      backgroundColor: importance.slice().reverse().map((_,i) => ['#00d4aa','#4d8bff','#a855f7','#ff6b35','#fbbf24','#f472b6','#00d4aa','#4d8bff','#a855f7','#ff6b35'][i] + '88'),
      borderRadius:4
    }]
  },
  options:{
    indexAxis:'y',responsive:true,maintainAspectRatio:false,
    animation:{duration:1000,easing:'easeOutQuart'},
    plugins:{legend:{display:false}},
    scales:{
      x:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#555568',font:{family:'JetBrains Mono',size:10}}},
      y:{grid:{display:false},ticks:{color:'#8888a0',font:{family:'Sora',size:11}}}
    }
  }
});

// Distribution
const bins = ['0-10%','10-20%','20-30%','30-40%','40-50%','50-60%','60-70%','70-80%','80-90%','90-100%'];
const dist = [385,290,180,125,95,88,110,195,280,252];
new Chart(document.getElementById('distChart'),{
  type:'bar',
  data:{labels:bins,datasets:[{data:dist,backgroundColor:dist.map((_,i)=>i<5?'rgba(40,200,64,.55)':'rgba(255,95,87,.55)'),borderRadius:3}]},
  options:{responsive:true,maintainAspectRatio:false,animation:{duration:800},plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:'#555568',font:{family:'JetBrains Mono',size:8},maxRotation:45}},y:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#555568',font:{family:'JetBrains Mono',size:9}}}}}
});

// ROC Curve
const rocX = [0,0.01,0.02,0.04,0.06,0.08,0.1,0.15,0.2,0.3,0.4,0.5,0.6,0.8,1.0];
const rocY = [0,0.35,0.52,0.68,0.76,0.82,0.86,0.91,0.94,0.965,0.978,0.986,0.992,0.998,1.0];
new Chart(document.getElementById('rocChart'),{
  type:'line',
  data:{
    labels:rocX,
    datasets:[
      {label:'Model (AUC=0.964)',data:rocY,borderColor:'#00d4aa',backgroundColor:'rgba(0,212,170,.1)',fill:true,tension:.3,borderWidth:2,pointRadius:3,pointBackgroundColor:'#00d4aa'},
      {label:'Random',data:rocX,borderColor:'#555568',borderDash:[5,5],borderWidth:1,pointRadius:0,fill:false}
    ]
  },
  options:{
    responsive:true,maintainAspectRatio:false,
    plugins:{legend:{labels:{color:'#8888a0',font:{family:'Sora',size:10},boxWidth:10}}},
    scales:{
      x:{title:{display:true,text:'False Positive Rate',color:'#555568',font:{family:'Sora',size:10}},grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#555568',font:{family:'JetBrains Mono',size:9}}},
      y:{title:{display:true,text:'True Positive Rate',color:'#555568',font:{family:'Sora',size:10}},grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#555568',font:{family:'JetBrains Mono',size:9}}}
    }
  }
});

// Predictor logic (simulated model)
function predict() {
  const contract = +document.getElementById('fContract').value;
  const charges = +document.getElementById('fCharges').value;
  const tenure = +document.getElementById('fTenure').value;
  const tech = +document.getElementById('fTech').value;
  const net = +document.getElementById('fNet').value;
  const pay = +document.getElementById('fPay').value;

  // Simulate model scoring (weighted features matching real patterns)
  let score = 0.3;
  // Contract: month-to-month = highest churn
  score += (contract === 0) ? 0.25 : (contract === 1) ? 0.05 : -0.15;
  // Higher charges = more churn
  score += (charges - 50) * 0.004;
  // Lower tenure = more churn
  score += Math.max(0, (30 - tenure)) * 0.008;
  // No tech support = more churn
  if (tech === 0) score += 0.1;
  // Fiber optic = more churn (real pattern in Telco dataset)
  if (net === 1) score += 0.12;
  // Electronic check = more churn
  if (pay === 0) score += 0.08;
  // Add slight randomness
  score += (Math.random() - 0.5) * 0.05;
  // Clamp
  score = Math.max(0.02, Math.min(0.98, score));

  const box = document.getElementById('resultBox');
  box.style.display = 'block';
  const isChurn = score > 0.5;
  document.getElementById('resPred').textContent = isChurn ? 'CHURN' : 'STAY';
  document.getElementById('resPred').style.color = isChurn ? 'var(--red)' : 'var(--grn)';
  document.getElementById('resProb').textContent = (score * 100).toFixed(1) + '%';
  document.getElementById('resProb').style.color = isChurn ? 'var(--red)' : 'var(--grn)';
  const bar = document.getElementById('resBar');
  bar.style.width = (score * 100) + '%';
  bar.style.background = score > 0.7 ? 'var(--red)' : score > 0.4 ? 'var(--yl)' : 'var(--grn)';
}

// Sample table
const samples = [
  {id:'CUST-7821',contract:'Month-to-month',tenure:2,charges:89.50,prob:.91,churn:true},
  {id:'CUST-3456',contract:'Two year',tenure:58,charges:45.20,prob:.08,churn:false},
  {id:'CUST-1290',contract:'Month-to-month',tenure:8,charges:75.00,prob:.78,churn:true},
  {id:'CUST-5543',contract:'One year',tenure:34,charges:62.30,prob:.22,churn:false},
  {id:'CUST-9012',contract:'Month-to-month',tenure:1,charges:105.40,prob:.95,churn:true},
  {id:'CUST-2287',contract:'Two year',tenure:45,charges:38.90,prob:.05,churn:false},
  {id:'CUST-6634',contract:'Month-to-month',tenure:15,charges:71.80,prob:.52,churn:true},
  {id:'CUST-4401',contract:'One year',tenure:28,charges:55.60,prob:.18,churn:false},
];
document.getElementById('predTable').innerHTML = samples.map(s => {
  const cls = s.churn ? 'b-red' : 'b-grn';
  const txt = s.churn ? 'Churn' : 'Stay';
  return `<tr>
    <td style="color:var(--t1);font-family:'JetBrains Mono',monospace">${s.id}</td>
    <td>${s.contract}</td>
    <td style="font-family:'JetBrains Mono',monospace">${s.tenure} mo</td>
    <td style="font-family:'JetBrains Mono',monospace">$${s.charges.toFixed(2)}</td>
    <td style="font-family:'JetBrains Mono',monospace;color:${s.prob>.5?'var(--red)':'var(--grn)'}">${(s.prob*100).toFixed(1)}%</td>
    <td><span class="badge ${cls}">${txt}</span></td>
  </tr>`;
}).join('');