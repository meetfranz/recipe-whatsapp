const path = require('path');
const performTextSubstitutions = require('electron-text-substitutions').default;

// Hackfix to avoid Chrome 36+ message
(async () => {
  try {
    const registrations = await window.navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
      console.log('ServiceWorker unregistered');
    }
  } catch (err) {
    console.error(err);
  }
})();


module.exports = (Franz) => {
  const getMessages = function getMessages() {
    const elements = document.querySelectorAll('.CxUIE, .unread');
    let count = 0;

    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0) {
        count += 1;
      }
    }

    // set Franz badge
    Franz.setBadge(count);
  };

  this.lastTextInput = null;

  const attachTextSubstitutions = function attachTextSubstitutions() {
    const textInput = document.querySelector('.copyable-text.selectable-text[contenteditable="true"]');

    if (textInput && !this.lastTextInput !== textInput) {
      performTextSubstitutions(textInput);
      this.lastTextInput = textInput;
    }
  };

  // inject franz.css stylesheet
  Franz.injectCSS(path.join(__dirname, 'service.css'));

  // check for new messages every second and update Franz badge
  Franz.loop(getMessages);

  // check for new text input to attach text substitutions
  Franz.loop(attachTextSubstitutions);
};
