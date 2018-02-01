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
  var resultElements = [];
  for (var i = 0; i < num; i += 1) {
    resultElements[i] = arr.splice((Math.floor(Math.random() * arr.length)), 1);
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
        title: randomObjects[i][0][0],
        address: locationX + ', ' + locationY,
        price: getRandomInteger(PRICE.min, PRICE.max),
        type: randomObjects[i][0][1],
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
  if (roomsNum > 4) {
    roomsStr = roomsNum + ' комнат';
  } else {
    roomsStr = roomsNum === 1 ? roomsNum + ' комната' : roomsNum + ' комнаты';
    guestsStr = guestsNum === 1 ? guestsNum + ' гостя' : guestsNum + ' гостей';
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

//  Создание меток предложений жилья на карте
var map = document.querySelector('.map');
var mapPin = map.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
//   функция, задающая расположение и аватар для метки
var getMapElement = function (offersItem) {
  var mapElement = mapPin.cloneNode(true);
  //  Поправка, чтобы на координате находилось остриё указателя
  var pointerLocationX = offersItem.offer.location.x;
  var pointerLocationY = offersItem.offer.location.y - 50;
  mapElement.style.left = pointerLocationX + 'px';
  mapElement.style.top = pointerLocationY + 'px';
  mapElement.querySelector('img').src = offersItem.author.avatar;
  fragment.appendChild(mapElement);
};
//  метки для всего массива предложений
for (var i = 0; i < OFFER_NUMS; i += 1) {
  getMapElement(offers[i]);
}

//  создание объявления на основе ноды в теге <template>
var getOfferCard = function (offersItem) {
  var templateBody = document.querySelector('template').content.querySelector('article.map__card');
  var cardOffer = templateBody.cloneNode(true);
  var featureList = cardOffer.querySelector('.popup__features');
  // var pictureList = cardOffer.querySelector('.popup__pictures');
  cardOffer.querySelector('img').src = offersItem.author.avatar;
  cardOffer.querySelector('h3').textContent = offersItem.offer.title;
  cardOffer.querySelector('small').textContent = offersItem.offer.address;
  cardOffer.querySelector('p:nth-of-type(2)').textContent = offersItem.offer.price + ' ₽/ночь';
  cardOffer.querySelector('h4').textContent = APARTMENT_TYPE_RU[offersItem.offer.type];
  cardOffer.querySelector('p:nth-of-type(3)').textContent =
    getStringForRoomsAndGuest(offersItem.offer.rooms, offersItem.offer.guests);
  cardOffer.querySelector('p:nth-of-type(4)').textContent =
    'Заезд после ' + offersItem.offer.checkin + ', выезд до ' + offersItem.offer.checkout;
  clearList(featureList);
  featureList.appendChild(getFeatureItems(offersItem.offer.features));
  cardOffer.querySelector('p:nth-of-type(5)').textContent = offersItem.offer.description;
  return cardOffer;
};

map.classList.remove('map--faded');
map.appendChild(fragment);
map.insertBefore(getOfferCard(offers[0]), document.querySelector('map__filters-container'));
