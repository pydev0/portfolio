// ============ PRODUCT DATA ============
const products = [
  {name:'Sony WH-1000XM5',site:'Amazon',cat:'Electronics',cur:278.00,prev:349.99},
  {name:'MacBook Air M3',site:'Best Buy',cat:'Electronics',cur:1049.00,prev:1099.00},
  {name:'Nike Air Max 90',site:'eBay',cat:'Footwear',cur:120.00,prev:130.00},
  {name:'Dyson V15 Detect',site:'Walmart',cat:'Home',cur:549.99,prev:599.99},
  {name:'Kindle Paperwhite',site:'Amazon',cat:'Electronics',cur:139.99,prev:139.99},
  {name:'Instant Pot Duo 7-in-1',site:'Walmart',cat:'Kitchen',cur:89.95,prev:79.95},
  {name:'AirPods Pro 2',site:'Best Buy',cat:'Electronics',cur:189.99,prev:249.00},
  {name:'Levi\'s 501 Original',site:'eBay',cat:'Clothing',cur:59.50,prev:69.50},
  {name:'Samsung 55" QLED TV',site:'Amazon',cat:'Electronics',cur:697.99,prev:799.99},
  {name:'Stanley Tumbler 40oz',site:'Walmart',cat:'Kitchen',cur:45.00,prev:35.00},
  {name:'New Balance 574',site:'eBay',cat:'Footwear',cur:79.99,prev:89.99},
  {name:'Roomba i4+',site:'Amazon',cat:'Home',cur:299.99,prev:349.99},
  {name:'Bose QC Ultra',site:'Best Buy',cat:'Electronics',cur:329.00,prev:379.00},
  {name:'Lodge Cast Iron Skillet',site:'Walmart',cat:'Kitchen',cur:29.90,prev:34.90},
  {name:'Adidas Ultraboost 23',site:'eBay',cat:'Footwear',cur:112.00,prev:190.00},
];

// ============ TERMINAL LINES ============
const termLines = [
  {t:'$ python scraper.py --targets amazon,ebay,walmart,bestbuy --rotate-proxy',c:'var(--t1)',d:0},
  {t:'[INIT] Loading configuration...',c:'var(--t3)',d:300},
  {t:'[INIT] Proxy pool loaded: 1,247 residential proxies',c:'var(--bl)',d:600},
  {t:'[INIT] User-Agent rotation: 85 browser fingerprints',c:'var(--bl)',d:900},
  {t:'',c:'',d:1100},
  {t:'[AMAZON] Connecting via proxy 185.234.xx.42 (US-East)...',c:'var(--yl)',d:1200,site:'amazon'},
  {t:'[AMAZON] ✓ Connected (TLS 1.3, 142ms)',c:'var(--grn)',d:1600},
  {t:'[AMAZON] Scraping Electronics category...',c:'var(--bl)',d:2000},
  {t:'[AMAZON] Extracted 4 products, parsing prices...',c:'var(--acc)',d:2600,items:[0,1,8,11]},
  {t:'[AMAZON] ⚠ Rate limit detected — backing off 2s...',c:'var(--or)',d:3200},
  {t:'',c:'',d:3500},
  {t:'[EBAY] Rotating proxy → 92.118.xx.89 (EU-West)...',c:'var(--yl)',d:3700,site:'ebay'},
  {t:'[EBAY] ✓ Connected (204ms)',c:'var(--grn)',d:4100},
  {t:'[EBAY] Scraping Footwear + Clothing...',c:'var(--bl)',d:4500},
  {t:'[EBAY] Extracted 3 products',c:'var(--acc)',d:5100,items:[2,7,10,14]},
  {t:'',c:'',d:5400},
  {t:'[WALMART] Rotating proxy → 104.28.xx.115 (US-West)...',c:'var(--yl)',d:5600,site:'walmart'},
  {t:'[WALMART] ✓ Connected (118ms)',c:'var(--grn)',d:6000},
  {t:'[WALMART] CAPTCHA detected — solving via 2captcha API...',c:'var(--or)',d:6400},
  {t:'[WALMART] ✓ CAPTCHA solved in 2.8s',c:'var(--grn)',d:7200},
  {t:'[WALMART] Scraping Home + Kitchen...',c:'var(--bl)',d:7600},
  {t:'[WALMART] Extracted 4 products',c:'var(--acc)',d:8200,items:[3,5,9,13]},
  {t:'',c:'',d:8500},
  {t:'[BESTBUY] Rotating proxy → 198.51.xx.73 (US-Central)...',c:'var(--yl)',d:8700,site:'bestbuy'},
  {t:'[BESTBUY] ✓ Connected (156ms)',c:'var(--grn)',d:9100},
  {t:'[BESTBUY] Rendering JS with Selenium headless...',c:'var(--pu)',d:9500},
  {t:'[BESTBUY] Extracted 3 products',c:'var(--acc)',d:10100,items:[1,6,12]},
  {t:'',c:'',d:10400},
  {t:'[CLEAN] Validating 15 product records...',c:'var(--pu)',d:10600},
  {t:'[CLEAN] Deduplicating — 0 duplicates found',c:'var(--t3)',d:11000},
  {t:'[CLEAN] Normalizing prices to USD...',c:'var(--t3)',d:11300},
  {t:'[DB] Inserting 15 records into PostgreSQL...',c:'var(--bl)',d:11600},
  {t:'[DB] ✓ 15 rows written to products_prices table',c:'var(--grn)',d:12000},
  {t:'',c:'',d:12200},
  {t:'[ALERT] 🔔 8 price drops detected (>5%)',c:'var(--grn)',d:12400},
  {t:'[ALERT] ⚠ 2 price increases detected',c:'var(--or)',d:12700},
  {t:'[DONE] ✓ Pipeline complete — 15 products tracked across 4 sites',c:'var(--acc)',d:13000},
  {t:'[DONE] Total time: 13.2s | Success rate: 100% | Next run: 6h',c:'var(--t3)',d:13300},
];

// ============ STATE ============
let isRunning = false;
let tableRows = [];
let chartsBuilt = false;

// ============ SCRAPER SIMULATION ============
function startScrape() {
  if (isRunning) return;
  isRunning = true;
  const btn = document.getElementById('runBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="live"></span> Running...';

  // Reset
  const term = document.getElementById('terminal');
  term.innerHTML = '';
  document.getElementById('prodTable').innerHTML = '';
  document.getElementById('alertBox').innerHTML = '';
  document.getElementById('progWrap').style.display = 'block';
  tableRows = [];
  updateKPIs(0,0,0,0,'—');

  // Activate sites one by one
  document.querySelectorAll('.site').forEach(s => s.classList.remove('active'));

  let siteCount = 0;
  let totalProducts = 0;
  let drops = 0;
  let rises = 0;

  termLines.forEach((line, i) => {
    setTimeout(() => {
      // Add terminal line
      if (line.t) {
        const div = document.createElement('div');
        div.className = 'tln';
        div.innerHTML = `<span style="color:${line.c}">${line.t}</span>`;
        term.appendChild(div);
        term.scrollTop = term.scrollHeight;
      }

      // Activate site indicator
      if (line.site) {
        siteCount++;
        document.getElementById('s-' + line.site).classList.add('active');
      }

      // Add table rows
      if (line.items) {
        line.items.forEach((idx, j) => {
          setTimeout(() => {
            addProductRow(products[idx]);
            totalProducts++;
            const p = products[idx];
            const change = ((p.cur - p.prev) / p.prev) * 100;
            if (change < -5) drops++;
            if (change > 5) rises++;
            updateKPIs(totalProducts, drops, rises, siteCount, '100%');
          }, j * 250);
        });
      }

      // Update progress
      const pct = Math.min(100, Math.round(((i + 1) / termLines.length) * 100));
      document.getElementById('progFill').style.width = pct + '%';
      document.getElementById('progPct').textContent = pct + '%';
      document.getElementById('progText').textContent = line.site ? `Scraping ${line.site}...` : pct >= 90 ? 'Finalizing...' : 'Processing...';

      // Alerts at the end
      if (i === termLines.length - 1) {
        setTimeout(() => {
          buildAlerts();
          if (!chartsBuilt) { buildCharts(); chartsBuilt = true; }
          document.getElementById('tableStatus').textContent = `${totalProducts} products extracted · ${drops} price drops · ${rises} price increases`;
          btn.disabled = false;
          btn.innerHTML = '▶ Run Again';
          isRunning = false;
        }, 500);
      }
    }, line.d);
  });
}

function addProductRow(p) {
  const tbody = document.getElementById('prodTable');
  const change = ((p.cur - p.prev) / p.prev) * 100;
  const isUp = change > 0.5;
  const isDown = change < -0.5;
  const tr = document.createElement('tr');
  tr.className = 'new-row';
  tr.innerHTML = `
    <td style="color:var(--t1);font-weight:500">${p.name}</td>
    <td><span class="badge b-bl">${p.site}</span></td>
    <td>${p.cat}</td>
    <td style="font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--t1)">$${p.cur.toFixed(2)}</td>
    <td style="font-family:'JetBrains Mono',monospace" class="strike">$${p.prev.toFixed(2)}</td>
    <td style="font-family:'JetBrains Mono',monospace;color:${isDown?'var(--grn)':isUp?'var(--red)':'var(--t3)'}">${change > 0 ? '+' : ''}${change.toFixed(1)}%</td>
    <td><span class="badge ${isDown?'b-grn':isUp?'b-red':'b-yl'}">${isDown?'↓ Drop':isUp?'↑ Rise':'— Same'}</span></td>`;
  tbody.appendChild(tr);
}

function updateKPIs(total, drops, rises, sites, rate) {
  document.getElementById('kTotal').textContent = total;
  document.getElementById('kDrops').textContent = drops;
  document.getElementById('kRises').textContent = rises;
  document.getElementById('kSites').textContent = sites + '/4';
  document.getElementById('kRate').textContent = rate;
}

function buildAlerts() {
  const box = document.getElementById('alertBox');
  box.innerHTML = '';
  const alerts = [
    {type:'drop',name:'AirPods Pro 2',from:'$249.00',to:'$189.99',pct:'-23.7%',site:'Best Buy'},
    {type:'drop',name:'Adidas Ultraboost 23',from:'$190.00',to:'$112.00',pct:'-41.1%',site:'eBay'},
    {type:'drop',name:'Sony WH-1000XM5',from:'$349.99',to:'$278.00',pct:'-20.6%',site:'Amazon'},
    {type:'drop',name:'Samsung 55" QLED TV',from:'$799.99',to:'$697.99',pct:'-12.8%',site:'Amazon'},
    {type:'rise',name:'Stanley Tumbler 40oz',from:'$35.00',to:'$45.00',pct:'+28.6%',site:'Walmart'},
    {type:'rise',name:'Instant Pot Duo',from:'$79.95',to:'$89.95',pct:'+12.5%',site:'Walmart'},
  ];
  alerts.forEach((a, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = `alert alert-${a.type}`;
      div.innerHTML = `
        <div class="alert-icon">${a.type === 'drop' ? '📉' : '📈'}</div>
        <div class="alert-text">
          <strong>${a.name}</strong>
          <span>${a.site} · ${a.from} → ${a.to}</span>
        </div>
        <div class="alert-val" style="color:${a.type === 'drop' ? 'var(--grn)' : 'var(--red)'}">${a.pct}</div>`;
      box.appendChild(div);
    }, i * 200);
  });
}

// ============ CHARTS ============
function buildCharts() {
  // Price history - 30 day fake trend
  const days = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
  const genTrend = (start, end, noise) => days.map((_, i) => {
    const base = start + (end - start) * (i / 29);
    return +(base + (Math.random() - 0.5) * noise).toFixed(2);
  });

  new Chart(document.getElementById('historyChart'), {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {label:'AirPods Pro 2', data:genTrend(249,190,8), borderColor:'#00d4aa', borderWidth:2, pointRadius:0, tension:.3},
        {label:'Sony WH-1000XM5', data:genTrend(350,278,12), borderColor:'#4d8bff', borderWidth:2, pointRadius:0, tension:.3},
        {label:'Stanley Tumbler', data:genTrend(35,45,3), borderColor:'#ff6b35', borderWidth:2, pointRadius:0, tension:.3},
        {label:'Dyson V15', data:genTrend(600,550,15), borderColor:'#a855f7', borderWidth:2, pointRadius:0, tension:.3},
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      animation:{duration:1000},
      plugins:{legend:{labels:{color:'#8888a0',font:{family:'Sora',size:10},boxWidth:10,padding:12}}},
      scales:{
        x:{display:false},
        y:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#555568',font:{family:'JetBrains Mono',size:10},callback:v=>'$'+v}}
      }
    }
  });

  // Category breakdown
  const cats = ['Electronics','Footwear','Kitchen','Home','Clothing'];
  const catCounts = [6,3,3,2,1];
  new Chart(document.getElementById('catChart'), {
    type: 'doughnut',
    data: {
      labels: cats,
      datasets: [{
        data: catCounts,
        backgroundColor: ['#4d8bff','#00d4aa','#ff6b35','#a855f7','#fbbf24'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:false, cutout:'60%',
      animation:{duration:800},
      plugins:{legend:{position:'bottom',labels:{color:'#8888a0',font:{family:'Sora',size:10},boxWidth:10,padding:12}}}
    }
  });
}