document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.about-video').forEach(aboutVideo => {
    const playButton = aboutVideo.querySelector('.about-video__icon');
    const video = aboutVideo.querySelector('.about-video__control');

    playButton.addEventListener('click', () => {
      playButton.remove();
      video.controls = true;
      video.play();
    });
  });
});
