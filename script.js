document.addEventListener('DOMContentLoaded',function(){
  // year footnote
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fm = new FormData(form);
      const name = fm.get('name')||'Friend';
      status.textContent = 'Thanks, ' + name + '! Your message was received locally.';
      form.reset();
      setTimeout(()=>{status.textContent=''},5000);
    });
  }

  // Theme handling: apply persisted theme or default
  const themeSelect = document.getElementById('themeSelect');
  const saved = localStorage.getItem('siteTheme') || 'default';
  function applyTheme(name){
    document.body.classList.remove('theme-default','theme-ocean','theme-sunset','theme-aurora','theme-pastel');
    const cls = 'theme-' + (name || 'default');
    document.body.classList.add(cls);
    if(themeSelect) themeSelect.value = name;
    // adjust text color for pastel theme
    if(name === 'pastel') document.body.style.color = '#072033'; else document.body.style.color = '';
  }

  applyTheme(saved);

  if(themeSelect){
    themeSelect.addEventListener('change', function(){
      const t = themeSelect.value || 'default';
      applyTheme(t);
      try{ localStorage.setItem('siteTheme', t); }catch(e){}
    });
  }

  // Smooth anchor scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });

  // IntersectionObserver for reveal elements
  const reveals = document.querySelectorAll('.reveal');
  if(reveals.length && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          ent.target.classList.add('visible');
          obs.unobserve(ent.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(el=>io.observe(el));
  } else {
    reveals.forEach(el=>el.classList.add('visible'));
  }
});
