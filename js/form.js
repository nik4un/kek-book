'use strict';

(function () {
  //  кнопка «reset» в форме ввода
  var resetFormButton = window.elements.noticeForm.querySelector('.form__reset');

  //  начальные координаты главной метки
  var formInitialValue = {
    x: window.elements.mapPinMain.offsetLeft,
    y: window.elements.mapPinMain.offsetTop,
  };

  //  начальные изображения аватара
  var avatarInitialImage = {
    avatarImage: window.elements.noticePreview.src,
    mapPinMainImage: window.elements.mapPinMainImage.src,
  };

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

  //  синхронизация минимальнай цены с типом жилья
  var setMinPrice = function () {
    window.synchronizeFields(
        window.elements.apartmentType,
        window.elements.apartmentPrice,
        ['flat', 'bungalo', 'house', 'palace'],
        [1000, 0, 5000, 10000],
        syncValueWithMin
    );
  };

  //  установка поля «время выезда» в зависимосити от значения поля «время заезда»
  var setCheckOutTime = function () {
    window.synchronizeFields(
        window.elements.timeInField,
        window.elements.timeOutField,
        ['12:00', '13:00', '14:00'],
        ['12:00', '13:00', '14:00'],
        syncValues
    );
  };

  //  установка поля «время заезда» в зависимосити от значения поля «время выезда»
  var setCheckInTime = function () {
    window.synchronizeFields(
        window.elements.timeOutField,
        window.elements.timeInField,
        ['12:00', '13:00', '14:00'],
        ['12:00', '13:00', '14:00'],
        syncValues
    );
  };

  //  синхронизация количества комнат и количества гостей
  var setGuestsAmount = function () {
    window.synchronizeFields(
        window.elements.roomNumber,
        window.elements.capacity,
        ['1', '2', '3', '100'],
        [['1', '2'], ['2', '1'], ['3', '1', '2'], ['0']],
        syncMultipleValues
    );
  };

  //  обработчик на отправку формы
  var onSubmitForm = function (evt) {
    window.backend.save(
        new FormData(window.elements.noticeForm),
        onSuccessSubmit,
        onErrorSubmit
    );
    evt.preventDefault();
  };

  //  обработчик на изменение формы
  var selectedField = {
    'timein': setCheckOutTime,
    'timeout': setCheckInTime,
    'type': setMinPrice,
    'rooms': setGuestsAmount
  };
  var onChangeForm = function (evt) {
    if (evt.target.name in selectedField) {
      selectedField[evt.target.name]();
    }
  };

  //  синхронизация всех полей формы
  var synchronizeForm = function () {
    setCheckOutTime();
    setMinPrice();
    setGuestsAmount();
  };

  //  установка главной метки в начальное положение
  var resetMainPin = function () {
    window.elements.noticeForm.reset();
    window.elements.mapPinMain.style.left = formInitialValue.x + 'px';
    window.elements.mapPinMain.style.top = formInitialValue.y + 'px';
    window.setAddress();
  };

  //  установка данных формы на значения по умолчанию
  var onResetFormClick = function (evt) {
    evt.preventDefault();
    resetMainPin();
    synchronizeForm();
    window.elements.noticePreview.src = avatarInitialImage.avatarImage;
    window.elements.mapPinMainImage.src = avatarInitialImage.mapPinMainImage;
    window.loadImages.clear(window.elements.noticePhotoContainer);
  };

  //  обработчик на нажатие «Enter» на сфокусированной кнопке «Reset»
  var onResetFormPressEnter = function (evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      onResetFormClick();
    }
  };

  //  callback на успешную отправку данных формы
  var onSuccessSubmit = function () {
    window.message.show(
        'Успех',
        'Ваш вариант успешно добавлен в базу',
        window.message.color.SUCCESS
    );
    window.elements.noticeForm.reset();
    window.elements.mapPinMain.style.left = formInitialValue.x + 'px';
    window.elements.mapPinMain.style.top = formInitialValue.y + 'px';
    window.setAddress();
    synchronizeForm();
  };

  //  callback на возникновение ошибки при отправке данных формы
  var onErrorSubmit = function (error) {
    window.message.show('Ошибка!', error, window.message.color.ERROR);
  };

  //  синхронизация всех полей формы при загрузке страницы
  synchronizeForm();

  //  установка отслеживания на взаимодействие с формой
  window.elements.noticeForm.addEventListener('change', onChangeForm);
  window.elements.noticeForm.addEventListener('submit', onSubmitForm);
  resetFormButton.addEventListener('click', onResetFormClick);
  resetFormButton.addEventListener('keydown', onResetFormPressEnter);
})();
