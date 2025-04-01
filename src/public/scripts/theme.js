document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  
  // Check if there's a saved theme preference
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(currentTheme + '-theme');
  
  // Update button based on current theme
  updateThemeButton(currentTheme);
  
  // Add click event to theme toggle button
  themeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Toggle between dark and light themes
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('theme', 'light');
      updateThemeButton('light');
    } else {
      document.body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('theme', 'dark');
      updateThemeButton('dark');
    }
  });
  
  // Function to update the button based on theme
  function updateThemeButton(theme) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    if (theme === 'dark') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-lightbulb');
      text.textContent = 'Slate Mode';
    } else {
      icon.classList.remove('fa-lightbulb');
      icon.classList.add('fa-moon');
      text.textContent = 'Dark Mode';
    }
  }
}); 