// ============ DATA ============
const D = {
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  revenue: [42000,48000,45000,51000,53000,58000,62000,59000,67000,71000,68000,78000],
  orders: [320,385,340,410,425,460,490,472,530,560,538,615],
  customers: [180,210,195,230,245,265,280,270,305,320,310,350],
  newCust:  [110,130,115,145,150,160,170,155,185,195,180,215],
  retCust:  [70,80,80,85,95,105,110,115,120,125,130,135],
  categories: {
    labels: ['Electronics','Clothing','Home & Garden','Sports','Books','Food'],
    values: [35,22,18,12,8,5],
    colors: ['#4d8bff','#00d4aa','#a855f7','#ff6b35','#fbbf24','#f472b6']
  },
  products: [
    {name:'MacBook Air M3', sales:847, rev:'$98,200', trend:'up'},
    {name:'Nike Air Max 90', sales:1230, rev:'$73,800', trend:'up'},
    {name:'Dyson V15', sales:412, rev:'$61,400', trend:'dn'},
    {name:'Sony WH-1000XM5', sales:689, rev:'$55,120', trend:'up'},
    {name:'Instant Pot Duo', sales:935, rev:'$46,750', trend:'same'},
    {name:'Kindle Paperwhite', sales:1105, rev:'$44,200', trend:'up'},
  ]
};

// ============ CHARTS ============
let mainChart, donutChart, custChart;
const cOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 700, easing: 'easeOutQuart' },
  plugins: { legend: { labels: { color: '#8888a0', font: { family: 'Sora', size: 11 }, boxWidth: 12, padding: 15 } } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#555568', font: { family: 'JetBrains Mono', size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#555568', font: { family: 'JetBrains Mono', size: 10 } } }
  }
};

function makeMainChart(type, labels, rev, ord) {
  if (mainChart) mainChart.destroy();
  const ctx = document.getElementById('mainChart');
  mainChart = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: rev,
          borderColor: '#00d4aa',
          backgroundColor: type === 'bar' ? 'rgba(0,212,170,0.6)' : 'rgba(0,212,170,0.08)',
          fill: type === 'line',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: type === 'line' ? 4 : 0,
          pointBackgroundColor: '#00d4aa',
          borderRadius: type === 'bar' ? 6 : 0,
          yAxisID: 'y'
        },
        {
          label: 'Orders',
          data: ord,
          borderColor: '#4d8bff',
          backgroundColor: type === 'bar' ? 'rgba(77,139,255,0.6)' : 'transparent',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: type === 'line' ? 4 : 0,
          pointBackgroundColor: '#4d8bff',
          borderRadius: type === 'bar' ? 6 : 0,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      ...cOpts,
      scales: {
        ...cOpts.scales,
        y: { ...cOpts.scales.y, position: 'left', ticks: { ...cOpts.scales.y.ticks, callback: v => '$' + (v/1000) + 'K' } },
        y1: { ...cOpts.scales.y, position: 'right', grid: { display: false }, ticks: { ...cOpts.scales.y.ticks } }
      }
    }
  });
}

function makeDonut() {
  if (donutChart) donutChart.destroy();
  const ctx = document.getElementById('donutChart');
  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: D.categories.labels,
      datasets: [{ data: D.categories.values, backgroundColor: D.categories.colors, borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      animation: { duration: 800, easing: 'easeOutQuart' },
      plugins: { legend: { display: false } }
    }
  });
  // Legend
  const lg = document.getElementById('donutLegend');
  lg.innerHTML = D.categories.labels.map((l,i) =>
    `<div class="legend-item">
      <div class="legend-dot" style="background:${D.categories.colors[i]}"></div>
      <span class="legend-name">${l}</span>
      <span class="legend-val">${D.categories.values[i]}%</span>
    </div>`
  ).join('');
}

function makeCustChart(labels, nc, rc) {
  if (custChart) custChart.destroy();
  const ctx = document.getElementById('custChart');
  custChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'New Customers', data: nc, backgroundColor: 'rgba(0,212,170,0.65)', borderRadius: 4, barPercentage: 0.7 },
        { label: 'Returning', data: rc, backgroundColor: 'rgba(77,139,255,0.5)', borderRadius: 4, barPercentage: 0.7 }
      ]
    },
    options: {
      ...cOpts,
      plugins: { ...cOpts.plugins, legend: { ...cOpts.plugins.legend, labels: { ...cOpts.plugins.legend.labels, boxWidth: 10 } } },
      scales: {
        x: { ...cOpts.scales.x, stacked: true },
        y: { ...cOpts.scales.y, stacked: true }
      }
    }
  });
}

function populateTable() {
  const tb = document.getElementById('prodTable');
  tb.innerHTML = D.products.map(p => {
    const cls = p.trend === 'up' ? 'b-grn' : p.trend === 'dn' ? 'b-red' : 'b-yl';
    const txt = p.trend === 'up' ? '↑ Rising' : p.trend === 'dn' ? '↓ Falling' : '— Stable';
    return `<tr>
      <td style="color:var(--t1);font-weight:500">${p.name}</td>
      <td style="font-family:'JetBrains Mono',monospace">${p.sales.toLocaleString()}</td>
      <td style="font-family:'JetBrains Mono',monospace">${p.rev}</td>
      <td><span class="badge ${cls}">${txt}</span></td>
    </tr>`;
  }).join('');
}

// ============ INTERACTIONS ============
function switchChart(type, btn) {
  btn.parentElement.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const sl = getSlice();
  makeMainChart(type, sl.labels, sl.rev, sl.ord);
}

let currentRange = 'year';
function setRange(range, btn) {
  document.querySelector('.filters').querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  currentRange = range;
  const sl = getSlice();
  const chartType = document.querySelector('.controls-row .fbtn.on')?.textContent.toLowerCase() || 'line';
  makeMainChart(chartType, sl.labels, sl.rev, sl.ord);
  makeCustChart(sl.labels, sl.nc, sl.rc);
  updateKPIs(sl);
}

function getSlice() {
  let s = 0, e = 12;
  if (currentRange === 'h2') { s = 6; e = 12; }
  if (currentRange === 'q4') { s = 9; e = 12; }
  return {
    labels: D.months.slice(s, e),
    rev: D.revenue.slice(s, e),
    ord: D.orders.slice(s, e),
    nc: D.newCust.slice(s, e),
    rc: D.retCust.slice(s, e),
    totalRev: D.revenue.slice(s, e).reduce((a,b) => a+b, 0),
    totalOrd: D.orders.slice(s, e).reduce((a,b) => a+b, 0),
    totalCust: D.customers.slice(s, e).reduce((a,b) => a+b, 0),
  };
}

function updateKPIs(sl) {
  const fmt = n => n >= 1000 ? '$' + (n/1000).toFixed(0) + ',000' : '$' + n;
  document.getElementById('kpiRev').textContent = '$' + sl.totalRev.toLocaleString();
  document.getElementById('kpiOrd').textContent = sl.totalOrd.toLocaleString();
  document.getElementById('kpiAov').textContent = '$' + (sl.totalRev / sl.totalOrd).toFixed(2);
  document.getElementById('kpiCust').textContent = sl.totalCust.toLocaleString();
}

// ============ INIT ============
makeMainChart('line', D.months, D.revenue, D.orders);
makeDonut();
makeCustChart(D.months, D.newCust, D.retCust);
populateTable();