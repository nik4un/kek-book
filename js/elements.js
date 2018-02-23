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
    noticeFormElements: notice.querySelectorAll('fieldset'),
    popupClose: document.querySelector('.popup__close'),
    addressInput: document.querySelector('#address'),
    timeInField: document.querySelector('#timein'),
    timeOutField: document.querySelector('#timeout'),
    apartmentType: document.querySelector('#type'),
    apartmentPrice: document.querySelector('#price'),
    roomNumber: document.querySelector('#room_number'),
    capacity: document.querySelector('#capacity'),
  };
})();
