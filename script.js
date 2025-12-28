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
});
