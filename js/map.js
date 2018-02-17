'use strict';

(function () {
  var onMainMapPinMouseDown = function (evt) {
    evt.preventDefault();
    var hasShifted = false;
    var mousePositionInMainPin = {
      left: evt.clientX - window.elements.mapPinMain.offsetLeft,
      top: evt.clientY - window.elements.mapPinMain.offsetTop
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      hasShifted = true;

      // ограничение движения указателя mapPinMain
      var mapPinMainTop = moveEvt.clientY - mousePositionInMainPin.top;
      var minY = window.data.POINT_LOCATION.yMin + window.data.MAIN_PIN_LOCATION_OFFSET.y;
      var maxY = window.data.POINT_LOCATION.yMax + window.data.MAIN_PIN_LOCATION_OFFSET.y;
      if (mapPinMainTop < minY) {
        mapPinMainTop = minY;
      }
      if (mapPinMainTop > maxY) {
        mapPinMainTop = maxY;
      }
      window.elements.mapPinMain.style.top = mapPinMainTop + 'px';
      var mapPinMainLeft = moveEvt.clientX - mousePositionInMainPin.left;
      var minX = window.data.POINT_LOCATION.xMin + window.data.MAIN_PIN_LOCATION_OFFSET.x;
      var maxX = window.data.POINT_LOCATION.xMax + window.data.MAIN_PIN_LOCATION_OFFSET.x;
      if (mapPinMainLeft < minX) {
        mapPinMainLeft = minX;
      }
      if (mapPinMainLeft > maxX) {
        mapPinMainLeft = maxX;
      }
      window.elements.mapPinMain.style.left = mapPinMainLeft + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.elements.mapPinMain.removeEventListener('mousemove', onMouseMove);
      window.elements.mapPinMain.removeEventListener('mouseup', onMouseUp);

      if (!hasShifted) {
        window.elements.mapPinMain.click();
      } else {
        //  установка координат указателя mapPinMain
        setAddress(window.elements.mapPinMain);
      }
    };

    window.elements.mapPinMain.addEventListener('mousemove', onMouseMove);
    window.elements.mapPinMain.addEventListener('mouseup', onMouseUp);
  };

  //  обработчик для события нажатия кнопки клавиатуры на сфокусированном 'mapPinMain'
  var onMainMapPinPressEnter = function (evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      onMainMapPinMouseUpFirst();
    }
  };

  //  обработчик для отжатия кнопки мыши на 'mapPinMain'
  var onMainMapPinMouseUpFirst = function () {
    window.elements.map.classList.remove('map--faded');
    window.elements.mapPins.insertBefore(
        window.fragment,
        window.elements.mapPinMain
    );
    window.elements.noticeForm.classList.remove('notice__form--disabled');
    window.elements.mapPinMain.addEventListener(
        'mousedown',
        onMainMapPinMouseDown
    );
    window.elements.mapPinMain.removeEventListener(
        'mouseup',
        onMainMapPinMouseUpFirst
    );
    window.elements.mapPinMain.removeEventListener(
        'keydown',
        onMainMapPinPressEnter
    );

    //  установка координат объекта mapPinMain
    setAddress(window.elements.mapPinMain);
  };

  //  установка отслеживания событий на 'map__pin--main'
  window.elements.mapPinMain.addEventListener(
      'mouseup',
      onMainMapPinMouseUpFirst
  );
  window.elements.mapPinMain.addEventListener(
      'keydown',
      onMainMapPinPressEnter
  );

  //  установка координат объекта element в поле ввода адреса
  var setAddress = function (element) {
    var locationX =
      parseInt(getComputedStyle(element).getPropertyValue('left'), 10) -
      window.data.MAIN_PIN_LOCATION_OFFSET.x;
    var locationY =
      parseInt(getComputedStyle(element).getPropertyValue('top'), 10) -
      window.data.MAIN_PIN_LOCATION_OFFSET.y;
    window.elements.addressInput.value = locationX + ', ' + locationY;
  };
})();
