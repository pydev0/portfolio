const projectFiles = {
  'sales-dashboard': 'sales-dashboard.html',
  'churn-predictor': 'churn-predictor.html',
  'web-scraper': 'web-scraper.html',
  'sentiment-analyzer': 'sentiment-analyzer.html'
};

function openModal(projectId) {
  const modal = document.getElementById('modal-' + projectId);
  const iframe = document.getElementById('iframe-' + projectId);
  if (!modal || !iframe) return;
  if (!iframe.src || iframe.src === window.location.href) {
    iframe.src = projectFiles[projectId];
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(projectId) {
  const modal = document.getElementById('modal-' + projectId);
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(function(modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }
});

document.querySelectorAll('.modal').forEach(function(modal) {
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
