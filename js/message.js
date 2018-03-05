'use strict';

// модуль отображения сообщений при обращениях к серверу
(function () {
  var color = {
    SUCCESS: '#1cb34d',
    ERROR: '#ee4830'
  };
  var DISPLAY_TIME = 3000;
  var POSITION = window.elements.notice;

  var showMessage = function (title, text, bgColor) {
    var messageBody = document.createElement('div');
    var messageText = document.createElement('p');

    messageBody.appendChild(messageText);
    messageText.textContent = text;

    messageBody.style.cssText = 'position: absolute; top: 750px; left: 0; width: 100%; z-index: 10;';
    messageBody.style.backgroundColor = bgColor;
    messageText.style.cssText = 'color: #fff; text-align: center; margin: 3px 11px';

    POSITION.appendChild(messageBody);
    setTimeout(function () {
      POSITION.removeChild(messageBody);
    }, DISPLAY_TIME);
  };

  window.message = {
    color: color,
    show: showMessage
  };
})();
