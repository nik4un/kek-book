'use strict';

(function () {
  //  Константы для создания прдложений жилья
  var OFFER_NUMS = 8;
  var AUTOR_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
  var OFFER_OBJECTS = [
    ['Большая уютная квартира', 'flat'],
    ['Маленькая неуютная квартира', 'flat'],
    ['Огромный прекрасный дворец', 'house'],
    ['Маленький ужасный дворец', 'house'],
    ['Красивый гостевой домик', 'house'],
    ['Некрасивый негостеприимный домик', 'house'],
    ['Уютное бунгало далеко от моря', 'bungalo'],
    ['Неуютное бунгало по колено в воде', 'bungalo']
  ];
  var PRICE = {
    min: 100,
    max: 1e6
  };

  var ROOMS = {
    min: 1,
    max: 5
  };
  var GUESTS = {
    min: 1,
    max: 15
  };
  var CHECKIN_TIME = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var POINT_LOCATION = {
    xMin: 100,
    xMax: 1100,
    yMin: 200,
    yMax: 700
  };

  /**
   * Создание массива предложений недвижимости
   * @param  {number} num количество предложений
   * @return {Array}      массив объектов (каждый объект содержит все параметры предложения')
   */
  var getOffers = function (num) {
    var resultArr = [];
    var randomAutors = window.utils.getRandomFromArray(AUTOR_NUMBERS, num);
    var randomObjects = window.utils.getRandomFromArray(OFFER_OBJECTS, num);
    var locationX;
    var locationY;
    for (var i = 0; i < num; i += 1) {
      locationX = window.utils.getRandomInteger(POINT_LOCATION.xMin, POINT_LOCATION.xMax);
      locationY = window.utils.getRandomInteger(POINT_LOCATION.yMin, POINT_LOCATION.yMax);
      resultArr[i] = {
        author: {
          avatar: 'img/avatars/user' + randomAutors[i] + '.png'
        },
        offer: {
          title: randomObjects[i][0],
          address: locationX + ', ' + locationY,
          price: window.utils.getRandomInteger(PRICE.min, PRICE.max),
          type: randomObjects[i][1],
          rooms: window.utils.getRandomInteger(ROOMS.min, ROOMS.max),
          guests: window.utils.getRandomInteger(GUESTS.min, GUESTS.max),
          checkin: CHECKIN_TIME[window.utils.getRandomInteger(0, CHECKIN_TIME.length - 1)],
          checkout: CHECKOUT_TIME[window.utils.getRandomInteger(0, CHECKOUT_TIME.length - 1)],
          features: window.utils.getRandomFromArray(
              OFFER_FEATURES,
              window.utils.getRandomInteger(1, OFFER_FEATURES.length)
          ),
          description: '',
          photos: '',
          location: {
            x: locationX,
            y: locationY
          }
        }
      };
    }
    return resultArr;
  };

  // массив из OFFER_NUMS предложений недвижимости
  var offers = getOffers(OFFER_NUMS);  // eslint-disable-line

  window.data = {
    OFFER_NUMS: OFFER_NUMS,
    offers: null,
    APARTMENT_TYPE_RU: {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    },
    //  минимальная цена для каждого типа апартаментов
    MIN_PRICES_BY_APARTMENT_TYPES: {
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 1e4
    },
    POINT_LOCATION: POINT_LOCATION,
    //  поправка для указателя MapPin
    PIN_LOCATION_OFFSET: {
      x: -5,
      y: -38
    },
    //  поправка для указателя MainMapPin
    MAIN_PIN_LOCATION_OFFSET: {
      x: 0,
      y: -50
    },
    NUMBER_OF_ROOMS_FOR_GUESTS: {
      '1': ['1'],
      '2': ['2', '1'],
      '3': ['2', '1', '3'],
      '100': ['0']
    },
    //  клавиатурные коды
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    //  максимальное количество меток на карте
    MAX_PIN_NUMBER: 5,
  };
})();
