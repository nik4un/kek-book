'use strict';

(function () {
  /**
   * синхронизация двух полей формы
   * @param  {obj}    masterField          ключевое поле (по значению которого происходит синхронизация)
   * @param  {obj}    slaveField           подчиненное поле (которое необходимо синхронизировать)
   * @param  {array}   valuesOfMasterField массив значений для ключевого поля
   * @param  {array}   valuesOfSlaveField  массив значений для подчиненного поля, той же размерности
   * @param  {Function} callback            [description]
   */
  window.synchronizeFields = function (masterField, slaveField, valuesOfMasterField, valuesOfSlaveField, callback) {
    var index = masterField.selectedIndex;
    index = valuesOfMasterField.indexOf(masterField[index].value);
    callback(slaveField, valuesOfSlaveField[index]);

    var onChangeField = function (evt) {
      index = valuesOfMasterField.indexOf(evt.target.value);
      callback(slaveField, valuesOfSlaveField[index]);
    };
    masterField.addEventListener('change', onChangeField);
  };
})();
