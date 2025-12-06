document.addEventListener('DOMContentLoaded', function() {
   
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Navigating to: ' + this.href);
            
        });
    });

   
    const voiceBtn = document.querySelector('.voice-btn');
    voiceBtn.addEventListener('click', function() {
        alert('Voice button clicked! (Play audio here)');
    });

    
    const viewMoreBtn = document.querySelector('.btn-view-more');
    viewMoreBtn.addEventListener('click', function() {
        alert('View More clicked! (Expand content here)');
    });

    
    const rightIcons = document.querySelectorAll('.right-icons button');
    rightIcons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Icon clicked: ' + this.title);
        });
    });

    
    const downloadBtn = document.querySelector('.btn-download');
    downloadBtn.addEventListener('click', function() {
        window.location.href = 'https://www.hoyoplay.com/'; 
    });
});
