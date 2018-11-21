/**
 * module 和 exports 是两个独立的对象
 *
 * 但如果 在文件中 有重新指定 module.exports 文件中 exports.xxx 不会被 export
 *
 */

module.exports = {
  getFun : function() {
    console.log(' i am module fun')
  }
};


exports.getFun2 = function() {
    console.log(' here you go')
};


module.exports.getFun2 = function() {
    console.log(' here you go')
};

/**
 *
 * @type {{getFun2: module.exports.getFun2}}
 */
// module.exports = {
//     getFun2: function() {
//         console.log(' i am fun 2')
//     }
// }
