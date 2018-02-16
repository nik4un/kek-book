'use strict';

(function () {
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

  //  создание объявления на основе ноды в теге <template>
  var getOfferCard = function (offersItem) {
    var templateBody = document
        .querySelector('template')
        .content.querySelector('article.map__card');
    var offerCard = templateBody.cloneNode(true);
    var featureList = offerCard.querySelector('.popup__features');
    // var pictureList = offerCard.querySelector('.popup__pictures');
    offerCard.querySelector('img').src = offersItem.author.avatar;
    offerCard.querySelector('h3').textContent = offersItem.offer.title;
    offerCard.querySelector('small').textContent = offersItem.offer.address;
    offerCard.querySelector('p:nth-of-type(2)').textContent =
      offersItem.offer.price + ' ₽/ночь';
    offerCard.querySelector('h4').textContent =
      window.data.APARTMENT_TYPE_RU[offersItem.offer.type];
    offerCard.querySelector(
        'p:nth-of-type(3)'
    ).textContent = getStringForRoomsAndGuest(
        offersItem.offer.rooms,
        offersItem.offer.guests
    );
    offerCard.querySelector('p:nth-of-type(4)').textContent =
      'Заезд после ' +
      offersItem.offer.checkin +
      ', выезд до ' +
      offersItem.offer.checkout;
    clearList(featureList);
    featureList.appendChild(getFeatureItems(offersItem.offer.features));
    offerCard.querySelector('p:nth-of-type(5)').textContent =
      offersItem.offer.description;
    return offerCard;
  };

  window.card = {
    getOfferCard: getOfferCard,
  };
})();
