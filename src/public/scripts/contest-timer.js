document.addEventListener('DOMContentLoaded', function() {
  const countdownElement = document.getElementById('contest-countdown');
  
  // Set the contest date (modify this to your actual contest date)
  // Format: Year, Month (0-11), Day, Hour, Minute, Second
  const contestDate = new Date();
  contestDate.setDate(contestDate.getDate() + 2); // Example: Contest 2 days from now
  contestDate.setHours(9, 0, 0); // Start at 9:00:00 AM
  
  function updateCountdown() {
    const now = new Date();
    const distance = contestDate - now;
    
    // If contest date has passed, show "Contest in progress"
    if (distance < 0) {
      countdownElement.innerHTML = "Contest in progress";
      countdownElement.classList.add('contest-live');
      return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the countdown
    countdownElement.innerHTML = 
      hours.toString().padStart(2, '0') + ":" +
      minutes.toString().padStart(2, '0') + ":" +
      seconds.toString().padStart(2, '0');
    
    // Make the timer flash when it's close to starting (less than 1 hour)
    if (hours < 1) {
      countdownElement.classList.add('countdown-urgent');
    } else {
      countdownElement.classList.remove('countdown-urgent');
    }
  }
  
  // Update the countdown immediately
  updateCountdown();
  
  // Update every second
  setInterval(updateCountdown, 1000);
}); 