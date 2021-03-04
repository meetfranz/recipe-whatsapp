"use strict";

const {
  remote
} = require('electron');

const path = require('path');

const webContents = remote.getCurrentWebContents();
const {
  session
} = webContents;
setTimeout(() => {
  const elem = document.querySelector('.landing-title.version-title');

  if (elem && elem.innerText.toLowerCase().includes('google chrome')) {
    window.location.reload();
  }
}, 1000);

window.addEventListener('beforeunload', async () => {
  try {
    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb']
    });
    const registrations = await window.navigator.serviceWorker.getRegistrations();
    registrations.forEach(r => {
      r.unregister();
      console.log('ServiceWorker unregistered');
    });
  } catch (err) {
    console.err(err);
  }
});

module.exports = Franz => {
  const getMessages = function getMessages() {
    const ariaLabels = document.querySelectorAll("span[aria-label]");
    let count = 0;

    for (let i = 0; i < ariaLabels.length; i++) {
      const span = ariaLabels[i];
      const backgroundColor = window.getComputedStyle(span, null).getPropertyValue("background-color");

      if (backgroundColor == "rgb(0, 175, 156)" || backgroundColor == "rgb(6, 215, 85)") {
        if (span.ariaLabel == "") {
          count++;
          console.log("One item found as marked as unread. Count so far = " + count);
        } else {
          const unreadCount = parseInt(span.ariaLabel) || 0;

          if (span.ariaLabel.split(" ")[0] == unreadCount.toString()) {
            count += unreadCount;
            console.log("One item found as unread with counter. Count so far = " + count);
          }
        }
      }
    }

    Franz.setBadge(count);
  };

  Franz.injectCSS(path.join(__dirname, 'service.css'));
  Franz.loop(getMessages);
};
