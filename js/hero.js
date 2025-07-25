function setBackgroundBasedOnTime() {
  const hour = new Date().getHours();
  const body = document.body;

  let backgroundImage = "";

  if (hour >= 5 && hour < 12) {
    // Morning
    backgroundImage = "url('images/morning.jpg')";
  } else if (hour >= 12 && hour < 17) {
    // Afternoon
    backgroundImage = "url('images/afternoon.jpg')";
  } else if (hour >= 17 && hour < 20) {
    // Evening
    backgroundImage = "url('images/evening.jpg')";
  } else {
    // Night
    backgroundImage = "url('images/night.jpg')";
  }

  body.style.backgroundImage = backgroundImage;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "center";
  body.style.backgroundAttachment = "fixed";
}

setBackgroundBasedOnTime();