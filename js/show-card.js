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
    features.forEach(function (item) {
      listItem = document.createElement('li');
      listItem.className = 'feature feature--' + item;
      listFragment.appendChild(listItem);
    });
    return listFragment;
  };

  //  создание объявления на основе ноды в теге <template>
  window.showCard = function (offersItem) {
    var templateBody = document
        .querySelector('template')
        .content.querySelector('article.map__card');
    var offerCard = templateBody.cloneNode(true);
    var featureList = offerCard.querySelector('.popup__features');
    var pictureList = offerCard.querySelector('.popup__pictures');
    //  аватар
    offerCard.querySelector('img').src = offersItem.author.avatar;
    // зоголовок объявления
    offerCard.querySelector('h3').textContent = offersItem.offer.title;
    //  адрес
    offerCard.querySelector('small').textContent = offersItem.offer.address;
    //  цена
    offerCard.querySelector('p:nth-of-type(2)').textContent =
      offersItem.offer.price + ' ₽/ночь';
    //  тип жилья
    offerCard.querySelector('h4').textContent =
      window.data.APARTMENT_TYPE_RU[offersItem.offer.type];
    //  сколько комнат для скольких гостей
    offerCard.querySelector(
        'p:nth-of-type(3)'
    ).textContent = getStringForRoomsAndGuest(
        offersItem.offer.rooms,
        offersItem.offer.guests
    );
    //  заезд и выезд
    offerCard.querySelector('p:nth-of-type(4)').textContent =
      'Заезд после ' +
      offersItem.offer.checkin +
      ', выезд до ' +
      offersItem.offer.checkout;
    //  удобства
    clearList(featureList);
    featureList.appendChild(getFeatureItems(offersItem.offer.features));
    offerCard.querySelector('p:nth-of-type(5)').textContent =
      offersItem.offer.description;
    //  фото жилья
    offersItem.offer.photos.forEach(function (photoAdr, index) {
      if (index > 0) {
        pictureList.appendChild(pictureList.children[0].cloneNode(true));
      }

      var imgElement = pictureList.children[index].querySelector('img');
      imgElement.setAttribute('src', photoAdr);
      imgElement.setAttribute('style', 'width: 40px; height: 40px; margin-right: 2px;');
    });

    return offerCard;
  };
})();
