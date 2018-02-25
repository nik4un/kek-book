'use strict';

(function () {
  //  три функции для реализации перемещения главной метки
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

      //  установка координат указателя mapPinMain
      window.setAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.elements.mapPinMain.removeEventListener('mousemove', onMouseMove);
      window.elements.mapPinMain.removeEventListener('mouseup', onMouseUp);

      if (!hasShifted) {
        window.elements.mapPinMain.click();
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

  //  запрет редактирования всех полей формы
  var noticeFormElements = Array.from(window.elements.noticeFormElements);
  noticeFormElements.forEach(function (item) {
    item.disabled = true;
  });


  //  обработчик для инициализации работы с сайтом
  var onMainMapPinMouseUpFirst = function () {
    window.elements.map.classList.remove('map--faded');
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
    window.setAddress();

    //  получение данных о предложениях жилья с сервера
    window.backend.load(onSuccessLoad, onErrorLoad);

    //  снятие запрета на редактирование полей формы
    noticeFormElements.forEach(function (item) {
      item.disabled = false;
    });
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

  //  установка координат главной метки в поле ввода адреса
  window.setAddress = function () {
    var locationX = window.elements.mapPinMain.offsetLeft - window.data.MAIN_PIN_LOCATION_OFFSET.x;
    var locationY = window.elements.mapPinMain.offsetTop - window.data.MAIN_PIN_LOCATION_OFFSET.y;
    window.elements.addressInput.value = 'x: ' + locationX + ', y: ' + locationY;
  };

  /**
  * обработчик на успешное получение данных с сервера
  * @param  {array} data [ массив объектов, описывающих предложение жилья ]
  */
  var onSuccessLoad = function (data) {
    window.data.offers = data;
    //  метки для всего массива предложений
    for (var i = 0; i < window.data.offers.length; i += 1) {
      window.getMapPinElement(window.data.offers[i]);
    }
    window.elements.mapPins.insertBefore(
        window.fragment,
        window.elements.mapPinMain
    );
    // window.elements.noticeForm.classList.remove('notice__form--disabled');
  };

  /**
  * обработчик на возникновение ошибки при получении данных с сервера
  * вывод сообщения в окне браузера
  * @param  {string} error [ описание ошибки ]
  */
  var onErrorLoad = function (error) {
    var messageError = error + ' Похожие предложения не могут быть отображены';
    window.message.show('Ошибка!', messageError, window.message.color.ERROR);
    // window.elements.noticeForm.classList.remove('notice__form--disabled');
  };
})();
