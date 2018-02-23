'use strict';

(function () {

  //  значение поля element приводится к newValue
  var syncValues = function (element, newValue) {
    element.value = newValue;
  };

  //  минимальное значение поля element приводится к newValue
  var syncValueWithMin = function (element, newValue) {
    element.min = newValue;
    element.placeholder = element.min;
  };

  //  доступные значения поля element приводятся к значениям из массива newValues,
  //  где первый элемент массива - это значение поля по умолчанию
  var syncMultipleValues = function (element, newValues) {
    var options = Array.from(element.options);
    options.forEach(function (item) {
      item.disabled = !newValues.includes(item.value);
      item.selected = item.value === newValues[0];
    });
  };

  //  Синхронизация полей «время заезда» и «время выезда»
  window.synchronizeFields(window.elements.timeInField, window.elements.timeOutField,
      ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);
  window.synchronizeFields(window.elements.timeOutField, window.elements.timeInField,
      ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);

  //  синхронизация минимальнай цены с типом жилья
  window.synchronizeFields(window.elements.apartmentType, window.elements.apartmentPrice,
      ['flat', 'bungalo', 'house', 'palace'], [1000, 0, 5000, 1e4], syncValueWithMin);

  //  синхронизация количества комнат и количества гостей
  window.synchronizeFields(window.elements.roomNumber, window.elements.capacity,
      ['1', '2', '3', '100'], [['1', '2'], ['2', '1', '3'], ['3', '1', '2', '4'], ['0']], syncMultipleValues);
})();
