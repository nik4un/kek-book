'use strict';

(function () {
  window.utils = {
    /**
     * случайное целое число в диапазоне от min до max, включая min и max
     * @param  {number} min нижняя граница диапозона
     * @param  {number} max верхняя граница диапозона
     * @return {number}     случайное целое число
     */
    getRandomInteger: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    /**
     * получение мссива из num случайных элементов массива arr
     * @param  {Array} arr  исходный массив
     * @param  {number} num количество элементов результирующего массива (<= arr.length)
     * @return {Array}      массив из случайных элементов исходного массива
     */
    getRandomFromArray: function (arr, num) {
      var inetrArr = (arr === 'undefined') ? [] : Array.from(arr);
      var resultElements = [];
      for (var i = 0; i < num; i += 1) {
        resultElements[i] = inetrArr.splice(
            Math.floor(Math.random() * inetrArr.length),
            1
        )[0];
      }
      return resultElements;
    },
  };
})();
