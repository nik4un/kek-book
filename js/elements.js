'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPin = document
      .querySelector('template')
      .content.querySelector('.map__pin');
  var notice = document.querySelector('.notice');

  window.elements = {
    map: map,
    mapPin: mapPin,
    mapPins: map.querySelector('.map__pins'),
    mapPinMain: map.querySelector('.map__pin--main'),
    noticeForm: notice.querySelector('.notice__form'),
    addressInput: document.querySelector('#address'),
    popupClose: document.querySelector('.popup__close'),

  };
})();
