'use strict';

(function () {
  //  доступное расширение загружаемых файлов
  var FILE_TYPE = ['gif', 'jpg', 'jpeg', 'png'];

  //  загрузка аватарки в форму
  window.elements.featuresAvatar.addEventListener('change', function () {
    var file = window.elements.featuresAvatar.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPE.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.elements.noticePreview.src = reader.result;
        window.elements.mapPinMainImage.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  //  множественная загрузка фотографий жилья:
  /**
   * создание DOM-элемента, содержащего изображение
   * @param  {DOMObject} parentImg [DOM-элемент, в который вставляется изображение]
   * @return {DOMObject}           [вставленное изображение]
   */
  var createImg = function (parentImg) {
    var image = document.createElement('img');
    image.style.height = '150px';
    image.style.width = 'auto';
    parentImg.appendChild(image);
    return image;
  };

  //  обработчик на изменение поля загрузки файла
  var onInputFileChange = function () {
    var loadFile = function (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPE.some(function (item) {
        return fileName.endsWith(item);
      });

      //  обработчик на загрузку файла
      var onLoadFile = function () {
        var image = createImg(window.elements.noticePhotoContainer);
        image.src = reader.result;
      };

      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', onLoadFile);
        reader.readAsDataURL(file);
      }
    };

    Array.from(window.elements.housingImages.files).forEach(loadFile);
  };

  //  удаление вставленных изображений
  var clearFormPhoto = function (photoField) {
    var images = photoField.querySelectorAll('img');
    Array.from(images).forEach(function (image) {
      photoField.removeChild(image);
    });
  };

  window.loadImages = {
    clear: clearFormPhoto,
  };

  //  разрешение множественной загрузки изображений
  window.elements.housingImages.setAttribute('multiple', '');

  window.elements.housingImages.addEventListener('change', onInputFileChange);
})();
