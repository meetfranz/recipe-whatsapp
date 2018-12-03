module.exports = Franz => class Messenger extends Franz {
  overrideUserAgent() {
    // return window.navigator.userAgent.replace(/(Franz|Electron)([^\s]+\s)/g, '');
    // Hotfix: Temporarily tell whatsapp that I'm a macOS Mojave Safari
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15';
  }
};
