'use strict';

(function () {
  //  диапозон цен в меню выбора цен
  var LOW_PRICE_LEVEL = 0;
  var MIDDLE_PRICE_LEVEL = 10000;
  var HIGH_PRICE_LEVEL = 50000;

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
  var getMapPinElement = function (offersItem) {
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

  /**
   * [функция выявления параметров фильтров, установленных пользователем]
   * @return {object} [объект с фильтрами и соответствующими им значениями]
   */
  var offerFilter = function () {
    var featuresElements = Array.from(window.elements.featuresFilter.elements).filter(function (item) {
      return item.checked;
    });
    return {
      housingType: window.elements.houseTypeFilter.value,
      housingPrice: window.elements.priceFilter.value,
      roomsNumber: window.elements.roomsNumberFilter.value,
      guestsNumber: window.elements.guestsNumberFilter.value,
      price: window.elements.priceFilter.value,
      features: featuresElements.map(function (item) {
        return item.value;
      }),
    };
  };

  /**
   * функция фильтрации списка предложений жилья
   * @return {Array} [список предложений жилья, удовлетворяющих выбранным фильтрам]
   */
  var updateOffers = function () {
    var filterCollect = offerFilter();
    return window.data.offers.filter(function (item) {
      var housingTypeCondition =
        filterCollect.housingType === 'any'
          ? true
          : filterCollect.housingType === item.offer.type;
      var housingPriceCondition = {
        'any': true,
        'low': item.offer.price >= LOW_PRICE_LEVEL && item.offer.price <= MIDDLE_PRICE_LEVEL,
        'middle': item.offer.price >= MIDDLE_PRICE_LEVEL && item.offer.price <= HIGH_PRICE_LEVEL,
        'high': item.offer.price >= HIGH_PRICE_LEVEL,
      };
      var housingRoomsCondition =
        filterCollect.roomsNumber === 'any'
          ? true
          : Number(filterCollect.roomsNumber) === item.offer.rooms;
      var housingGuestsCondition =
        filterCollect.guestsNumber === 'any'
          ? true
          : Number(filterCollect.guestsNumber) === item.offer.guests;
      var housingFeaturesCondition =
        filterCollect.features.length === 0
          ? true
          : filterCollect.features.every(function (element) {
            if (item.offer.features.length === 0) {
              return false;
            }
            return item.offer.features.includes(element);
          });
      return housingTypeCondition && housingPriceCondition[filterCollect.housingPrice] && housingRoomsCondition && housingGuestsCondition && housingFeaturesCondition;
    });
  };

  /**
   * функция отрисовки меток жилья на карте
   */
  window.showPins = function () {
    //  закрытие открытой карты жилья
    if (document.querySelector('.popup__close')) {
      onPopupCloseClicl();
    }
    var filteredOffers = updateOffers();
    if (filteredOffers.length > window.data.MAX_PIN_NUMBER) {
      filteredOffers = window.utils.getRandomFromArray(filteredOffers, window.data.MAX_PIN_NUMBER);
    }
    //  удаление предыдущих меток жилья
    while (window.elements.mapPins.children.length > 2) {
      window.elements.mapPins.removeChild(window.elements.mapPins.children[1]);
    }
    //  метки для массива предложений
    filteredOffers.forEach(function (elem) {
      getMapPinElement(elem);
    });
    window.elements.mapPins.insertBefore(
        window.fragment,
        window.elements.mapPinMain
    );
  };
})();
