'use strict';

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
var APARTMENT_TYPE_RU = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
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
  xMin: 300,
  xMax: 1100,
  yMin: 200,
  yMax: 700
};
//  клавиатурные коды
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

/**
 * случайное целое число в диапазоне от min до max, включая min и max
 * @param  {number} min нижняя граница диапозона
 * @param  {number} max верхняя граница диапозона
 * @return {number}     случайное целое число
 */
var getRandomInteger = function (min, max) {
  return Math.floor(min + (Math.random() * (max + 1 - min)));
};

/**
 * получение мссива из  "num" случайных элементов массива "arr"
 * @param  {Array} arr исходный массив
 * @param  {number} num количество элементов результирующего массива (<= arr.length)
 * @return {Array}     массив из случайных элементов исходного массива
 */
var getRandomFromArray = function (arr, num) {
  num = num || arr.length;
  var inetrArr = Array.from(arr);
  var resultElements = [];
  for (var i = 0; i < num; i += 1) {
    resultElements[i] = inetrArr.splice(Math.floor(Math.random() * inetrArr.length), 1)[0];
  }
  return resultElements;
};

/**
 * Создание массива предложений недвижимости
 * @param  {number} num количество предложений
 * @return {Array}      массив объектов (каждый объект содержит все параметры предложения')
 */
var getOffers = function (num) {
  var resultArr = [];
  var randomAutors = getRandomFromArray(AUTOR_NUMBERS, num);
  var randomObjects = getRandomFromArray(OFFER_OBJECTS, num);
  var locationX;
  var locationY;
  for (var i = 0; i < num; i += 1) {
    locationX = getRandomInteger(POINT_LOCATION.xMin, POINT_LOCATION.xMax);
    locationY = getRandomInteger(POINT_LOCATION.yMin, POINT_LOCATION.yMax);
    resultArr[i] = {
      author: {
        avatar: 'img/avatars/user' + randomAutors[i] + '.png'},
      offer: {
        title: randomObjects[i][0],
        address: locationX + ', ' + locationY,
        price: getRandomInteger(PRICE.min, PRICE.max),
        type: randomObjects[i][1],
        rooms: getRandomInteger(ROOMS.min, ROOMS.max),
        guests: getRandomInteger(GUESTS.min, GUESTS.max),
        checkin: CHECKIN_TIME[getRandomInteger(0, CHECKIN_TIME.length - 1)],
        checkout: CHECKOUT_TIME[getRandomInteger(0, CHECKOUT_TIME.length - 1)],
        features: getRandomFromArray(
            OFFER_FEATURES,
            getRandomInteger(1, OFFER_FEATURES.length)
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

/**
 * создание грамматически правильной строки: "roomsNum комнат для guestsNum гостей"
 * @param  {number} roomsNum  колличество комнат
 * @param  {number} guestsNum количество гостей
 * @return {string}           результирующая строка
 */
var getStringForRoomsAndGuest = function (roomsNum, guestsNum) {
  var roomsStr;
  var guestsStr;
  guestsStr = guestsNum === 1 ? guestsNum + ' гостя' : guestsNum + ' гостей';
  if (roomsNum > 4) {
    roomsStr = roomsNum + ' комнат';
  } else {
    roomsStr = roomsNum === 1 ? roomsNum + ' комната' : roomsNum + ' комнаты';
  }
  return roomsStr + ' для ' + guestsStr;
};

/**
 * удаляет все дочерние элементы из элемента DOM
 * @param  {object} nodeItself элемент DOM, из которого будут удалены дочерние элементы
 * @return {object}            элемент DOM, с удалеными дочерними элементами
 */
var clearList = function (nodeItself) {
  while (nodeItself.firstChild) {
    nodeItself.removeChild(nodeItself.firstChild);
  }
  return nodeItself;
};

/**
 * создание фрагмента с иконками, которые соответствуют названию удобства
 * @param  {Array} features массив из названий удобств
 * @return {object}         фрагмент DOM
 */
var getFeatureItems = function (features) {
  var listFragment = document.createDocumentFragment();
  var listItem;
  for (var j = 0; j < features.length; j += 1) {
    listItem = document.createElement('li');
    listItem.className = 'feature feature--' + features[j];
    listFragment.appendChild(listItem);
  }
  return listFragment;
};

// Создание массива из OFFER_NUMS предложений недвижимости
var offers = getOffers(OFFER_NUMS);

var map = document.querySelector('.map');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapPins = map.querySelector('.map__pins');
var fragment = document.createDocumentFragment();
var mapPinMain = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');

//  обработчик для CLICK на 'popup__close'
var onPopupCloseClicl = function () {
  var popupClose = document.querySelector('.popup__close');
  var activePin = document.querySelector('.map__pin--active');
  map.removeChild(map.querySelector('.map__card'));
  activePin.classList.remove('map__pin--active');
  popupClose.removeEventListener('click', onPopupCloseClicl);
  document.removeEventListener('keydown', onPressEsc);
  popupClose.addEventListener('keydown', onPopupPressEnter);
};

//  обработчик для нажатия ESC при открытом 'popup'
var onPressEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onPopupCloseClicl();
  }
};

//  обработчик для нажатия ENTER на 'popup__close'
var onPopupPressEnter = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onPopupCloseClicl();
  }
};

//  обработчик для воздействия на 'mapPin'
var onMapPinClickAndPressEnter = function (offer) {
  return function (evt) {
    if (evt.keyCode === ENTER_KEYCODE || evt.type === 'click') {
      var activePin = document.querySelector('.map__pin--active');
      var mapCard = document.querySelector('.map__card');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      evt.currentTarget.classList.add('map__pin--active');
      if (mapCard) {
        map.removeChild(mapCard);
      }
      map.insertBefore(getOfferCard(offer), document.querySelector('map__filters-container'));
      var popupClose = document.querySelector('.popup__close');
      popupClose.addEventListener('click', onPopupCloseClicl);
      document.addEventListener('keydown', onPressEsc);
      popupClose.addEventListener('keydown', onPopupPressEnter);
    }
  };
};

//   функция, задающая расположение и аватар для метки
var getMapPinElement = function (offersItem) {
  var mapPinElement = mapPin.cloneNode(true);
  //  Поправка, чтобы на координате находилось остриё указателя
  var pointerLocationX = offersItem.offer.location.x;
  var pointerLocationY = offersItem.offer.location.y - 50;
  mapPinElement.style.left = pointerLocationX + 'px';
  mapPinElement.style.top = pointerLocationY + 'px';
  mapPinElement.querySelector('img').src = offersItem.author.avatar;
  mapPinElement.addEventListener('click', onMapPinClickAndPressEnter(offersItem));
  fragment.appendChild(mapPinElement);
};
//  метки для всего массива предложений
for (var i = 0; i < OFFER_NUMS; i += 1) {
  getMapPinElement(offers[i]);
}

//  создание объявления на основе ноды в теге <template>
var getOfferCard = function (offersItem) {
  var templateBody = document.querySelector('template').content.querySelector('article.map__card');
  var offerCard = templateBody.cloneNode(true);
  var featureList = offerCard.querySelector('.popup__features');
  // var pictureList = offerCard.querySelector('.popup__pictures');
  offerCard.querySelector('img').src = offersItem.author.avatar;
  offerCard.querySelector('h3').textContent = offersItem.offer.title;
  offerCard.querySelector('small').textContent = offersItem.offer.address;
  offerCard.querySelector('p:nth-of-type(2)').textContent = offersItem.offer.price + ' ₽/ночь';
  offerCard.querySelector('h4').textContent = APARTMENT_TYPE_RU[offersItem.offer.type];
  offerCard.querySelector('p:nth-of-type(3)').textContent =
    getStringForRoomsAndGuest(offersItem.offer.rooms, offersItem.offer.guests);
  offerCard.querySelector('p:nth-of-type(4)').textContent =
    'Заезд после ' + offersItem.offer.checkin + ', выезд до ' + offersItem.offer.checkout;
  clearList(featureList);
  featureList.appendChild(getFeatureItems(offersItem.offer.features));
  offerCard.querySelector('p:nth-of-type(5)').textContent = offersItem.offer.description;
  return offerCard;
};

//  обработчик для нажатия кнопки мыши на 'mapPinMain'
var onMainMapPinMouseUp = function () {
  map.classList.remove('map--faded');
  mapPins.insertBefore(fragment, mapPinMain);
  noticeForm.classList.remove('notice__form--disabled');
  mapPinMain.removeEventListener('mouseup', onMainMapPinMouseUp);
  mapPinMain.removeEventListener('keydown', onMainMapPinPressEnter);
};

//  обработчик для события нажатия кнопки клавиатуры на сфокусированном 'mapPinMain'
var onMainMapPinPressEnter = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    map.classList.remove('map--faded');
    mapPins.insertBefore(fragment, mapPinMain);
    noticeForm.classList.remove('notice__form--disabled');
    mapPinMain.removeEventListener('mouseup', onMainMapPinMouseUp);
    mapPinMain.removeEventListener('keydown', onMainMapPinPressEnter);
  }
};

//  установка отслеживания событий на 'map__pin--main'
mapPinMain.addEventListener('mouseup', onMainMapPinMouseUp);
mapPinMain.addEventListener('keydown', onMainMapPinPressEnter);
