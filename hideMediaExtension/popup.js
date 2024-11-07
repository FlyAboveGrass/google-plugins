document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['whitelist', 'blacklist', 'hideImages', 'hideVideos', 'defaultExecute'], (data) => {
    document.getElementById('whitelistInput').value = data.whitelist ? data.whitelist.join(', ') : '';
    document.getElementById('blacklistInput').value = data.blacklist ? data.blacklist.join(', ') : '';
    document.getElementById('hideImages').checked = data.hideImages || false;
    document.getElementById('hideVideos').checked = data.hideVideos || false;
    document.getElementById('defaultExecute').checked = data.defaultExecute || false;

    toggleWhitelistVisibility();
    toggleBlacklistVisibility();
  });

  const defaultExecuteCheckbox = document.getElementById('defaultExecute');
  const whitelistInput = document.getElementById('whitelistInput');
  const blacklistInput = document.getElementById('blacklistInput');

  function toggleWhitelistVisibility() {
    const whitelistLabel = document.querySelector('label[for="whitelistInput"]');
    if (defaultExecuteCheckbox.checked) {
      whitelistLabel.style.display = 'block';
      whitelistInput.style.display = 'block';
    } else {
      whitelistLabel.style.display = 'none';
      whitelistInput.style.display = 'none';
    }
  }

  function toggleBlacklistVisibility() {
    const blacklistLabel = document.querySelector('label[for="blacklistInput"]');
    if (!defaultExecuteCheckbox.checked) {
      blacklistLabel.style.display = 'block';
      blacklistInput.style.display = 'block';
    } else {
      blacklistLabel.style.display = 'none';
      blacklistInput.style.display = 'none';
    }
  }

  defaultExecuteCheckbox.addEventListener('change', () => {
    toggleWhitelistVisibility();
    toggleBlacklistVisibility();
    saveOptions();
  });

  whitelistInput.addEventListener('blur', saveOptions);
  blacklistInput.addEventListener('blur', saveOptions);

  function saveOptions() {
    const whitelist = document.getElementById('whitelistInput').value.split(',').map(item => item.trim());
    const blacklist = document.getElementById('blacklistInput').value.split(',').map(item => item.trim());
    const hideImages = document.getElementById('hideImages').checked;
    const hideVideos = document.getElementById('hideVideos').checked;
    const defaultExecute = document.getElementById('defaultExecute').checked;

    // 将所有配置写入缓存
    chrome.storage.sync.set({ whitelist, blacklist, hideImages, hideVideos, defaultExecute });
  }

  document.getElementById('forceHide').addEventListener('click', () => {
    saveOptions();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (hideImages, hideVideos) => {
          if (hideImages) {
            const images = document.querySelectorAll('img');
            images.forEach(img => img.style.display = 'none');
          }
          if (hideVideos) {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => video.style.display = 'none');
          }
        },
        args: [hideImages, hideVideos]
      });
    });
  });
}); 