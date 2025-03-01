const supportedExtensions = ['png', 'jpg', 'gif', 'webp', 'jpeg',];
let lastLoadedSrc = ''; // Store the last loaded image

async function loadAvatar() {
  const messageText = document.getElementById('message3').value;
  let imageFound = false;

  const loadImage = (ext) => {
    return new Promise((resolve, reject) => {
      const imagePath = `pfp/${messageText}.${ext}`;
      const img = new Image();
      img.src = imagePath + `?t=${Date.now()}`; // Cache-busting

      img.onload = function () {
        resolve(img.src);
      };

      img.onerror = function () {
        reject();
      };
    });
  };

  for (let ext of supportedExtensions) {
    try {
      const loadedImageSrc = await loadImage(ext);
      if (loadedImageSrc !== lastLoadedSrc) { // Only update if changed
        document.getElementById('pfp').src = loadedImageSrc;
        lastLoadedSrc = loadedImageSrc;
      }
      imageFound = true;
      break;
    } catch (error) {
      continue;
    }
  }

  if (!imageFound && lastLoadedSrc !== 'pfp/user1name.png') {
    document.getElementById('pfp').src = 'pfp/user1name.png';
    lastLoadedSrc = 'pfp/user1name.png';
  }
}

// Initial load
loadAvatar();

// Check for updates every second
setInterval(loadAvatar, 1000);
