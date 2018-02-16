'use strict';

(function () {
  //  Синхронизация полей «время заезда» и «время выезда»
  var timeInField = document.querySelector('#timein');
  var timeOutField = document.querySelector('#timeout');

  var onChangeTimeIn = function () {
    timeOutField.value = timeInField.value;
  };
  var onChangeTimeOut = function () {
    timeInField.value = timeOutField.value;
  };

  timeInField.addEventListener('change', onChangeTimeIn);
  timeOutField.addEventListener('change', onChangeTimeOut);

  //  синхронизация минимальнай цены с типом жилья
  var apartmentType = document.querySelector('#type');
  var apartmentPrice = document.querySelector('#price');

  var onChangeApartmentType = function () {
    apartmentPrice.min =
      window.data.MIN_PRICES_BY_APARTMENT_TYPES[apartmentType.value];
  };

  apartmentType.addEventListener('change', onChangeApartmentType);

  //  синхронизация количества комнат и количества гостей
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var capacityOptions = capacity.querySelectorAll('option');

  var onChangeRoomNumber = function () {
    var availableValues =
      window.data.NUMBER_OF_ROOMS_FOR_GUESTS[roomNumber.value];
    capacityOptions.forEach(function (item) {
      item.disabled = !availableValues.includes(item.value);
      item.selected = item.value === availableValues[0];
    });
  };

  roomNumber.addEventListener('change', onChangeRoomNumber);
})();
