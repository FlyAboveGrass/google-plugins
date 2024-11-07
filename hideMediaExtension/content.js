function hideMedia() {
  const images = document.querySelectorAll('img');
  const videos = document.querySelectorAll('video');

  images.forEach(img => {
    img.style.display = 'none';
  });

  videos.forEach(video => {
    video.style.display = 'none';
  });
}

chrome.storage.sync.get(['blacklist', 'whitelist', 'hideImages', 'hideVideos', 'defaultExecute'], ({ blacklist, whitelist, hideImages, hideVideos, defaultExecute }) => {
  const url = window.location.hostname;
  if ((defaultExecute && !whitelist.includes(url)) || (!defaultExecute && blacklist.includes(url))) {
    if (hideImages) {
      document.querySelectorAll('img').forEach(img => img.style.display = 'none');
    }
    if (hideVideos) {
      document.querySelectorAll('video').forEach(video => video.style.display = 'none');
    }
  }
}); 