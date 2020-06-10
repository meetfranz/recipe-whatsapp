const { remote } = require('electron');
const path = require('path');

const webContents = remote.getCurrentWebContents();
const { session } = webContents;

setTimeout(() => {
  const elem = document.querySelector('.landing-title.version-title');
  if (elem && elem.innerText.toLowerCase().includes('google chrome')) {
    window.location.reload();
  }
}, 1000);

const isMutedIcon = element => element.parentElement.parentElement.querySelectorAll('*[data-icon="muted"]').length !== 0;

const isPinnedIcon = element => element.classList.contains('_1EFSv');

window.addEventListener('beforeunload', async () => {
  try {
    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });

    const registrations = await window.navigator.serviceWorker.getRegistrations();

    registrations.forEach((r) => {
      r.unregister();
      console.log('ServiceWorker unregistered');
    });
  } catch (err) {
    console.err(err);
  }
});

module.exports = (Franz) => {
  const getMessages = function getMessages() {
    const elements = document.querySelectorAll('.CxUIE, .unread, ._0LqQ, .m61XR .ZKn2B ');
    let count = 0;

    for (let i = 0; i < elements.length; i += 1) {
      try {
      // originalLog(isMutedIcon(elements[i]), isPinnedIcon(elements[i]));
        if (!isMutedIcon(elements[i]) && !isPinnedIcon(elements[i])) {
          count += 1;
        }
      } catch (err) {
        // nope;
      }
    }

    Franz.setBadge(count);
  };

  Franz.injectCSS(path.join(__dirname, 'service.css'));
  Franz.loop(getMessages);
};
