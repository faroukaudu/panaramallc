document.querySelectorAll('.button-approve').forEach(button =>
   button.innerHTML = '<div><span>' + button.textContent.trim()
   .split('').join('</span><span>') + '</span></div>');
