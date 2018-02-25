'use strict';

(function () {
  // фрагмент для меток предложений на карте
  window.fragment = document.createDocumentFragment();

  //  обработчик для CLICK на 'popup__close'
  var onPopupCloseClicl = function () {
    var popupClose = document.querySelector('.popup__close');
    var activePin = document.querySelector('.map__pin--active');
    window.elements.map.removeChild(
        window.elements.map.querySelector('.map__card')
    );
    activePin.classList.remove('map__pin--active');
    popupClose.removeEventListener('click', onPopupCloseClicl);
    document.removeEventListener('keydown', onPressEsc);
    popupClose.addEventListener('keydown', onPopupClosePressEnter);
  };

  //  обработчик для нажатия ESC при открытом 'popup'
  var onPressEsc = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      onPopupCloseClicl();
    }
  };

  //  обработчик для нажатия ENTER на 'popup__close'
  var onPopupClosePressEnter = function (evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      onPopupCloseClicl();
    }
  };

  //  обработчик для воздействия на 'mapPin'
  var onMapPinClickAndPressEnter = function (offer) {
    return function (evt) {
      if (evt.keyCode === window.data.ENTER_KEYCODE || evt.type === 'click') {
        var activePin = document.querySelector('.map__pin--active');
        var mapCard = document.querySelector('.map__card');
        if (activePin) {
          activePin.classList.remove('map__pin--active');
        }
        evt.currentTarget.classList.add('map__pin--active');
        if (mapCard) {
          window.elements.map.removeChild(mapCard);
        }
        window.elements.map.insertBefore(
            window.showCard(offer),
            document.querySelector('map__filters-container')
        );
        var popupClose = document.querySelector('.popup__close');
        popupClose.addEventListener('click', onPopupCloseClicl);
        document.addEventListener('keydown', onPressEsc);
        popupClose.addEventListener('keydown', onPopupClosePressEnter);
      }
    };
  };

  //   функция, задающая расположение и аватар для метки
  window.getMapPinElement = function (offersItem) {
    var mapPinElement = window.elements.mapPin.cloneNode(true);
    //  Поправка, чтобы на координате находилось остриё указателя locationOffset
    var pointerLocationX =
      offersItem.location.x + window.data.PIN_LOCATION_OFFSET.x;
    var pointerLocationY =
      offersItem.location.y + window.data.PIN_LOCATION_OFFSET.y;
    mapPinElement.style.left = pointerLocationX + 'px';
    mapPinElement.style.top = pointerLocationY + 'px';
    mapPinElement.querySelector('img').src = offersItem.author.avatar;
    mapPinElement.addEventListener(
        'click',
        onMapPinClickAndPressEnter(offersItem)
    );
    window.fragment.appendChild(mapPinElement);
  };
})();
