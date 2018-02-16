'use strict';

(function () {
  //  обработчик для нажатия кнопки мыши на 'mapPinMain'
  var onMainMapPinMouseUp = function () {
    window.elements.map.classList.remove('map--faded');
    window.elements.mapPins.insertBefore(window.fragment, window.elements.mapPinMain);
    window.elements.noticeForm.classList.remove('notice__form--disabled');
    window.elements.mapPinMain.removeEventListener(
        'mouseup',
        onMainMapPinMouseUp
    );
    window.elements.mapPinMain.removeEventListener(
        'keydown',
        onMainMapPinPressEnter
    );

    //  установка координат объекта mapPinMain
    setAddress(window.elements.mapPinMain);
  };

  //  обработчик для события нажатия кнопки клавиатуры на сфокусированном 'mapPinMain'
  var onMainMapPinPressEnter = function (evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      onMainMapPinMouseUp();
    }
  };

  //  установка отслеживания событий на 'map__pin--main'
  window.elements.mapPinMain.addEventListener('mouseup', onMainMapPinMouseUp);
  window.elements.mapPinMain.addEventListener(
      'keydown',
      onMainMapPinPressEnter
  );

  //  установка координат объекта element в поле ввода адреса
  var setAddress = function (element) {
    var locationX =
      parseInt(getComputedStyle(element).getPropertyValue('left'), 10) -
      window.data.LOCATION_OFFSET.x;
    var locationY =
      parseInt(getComputedStyle(element).getPropertyValue('top'), 10) -
      window.data.LOCATION_OFFSET.y;
    window.elements.addressInput.value = locationX + ', ' + locationY;
  };
})();
