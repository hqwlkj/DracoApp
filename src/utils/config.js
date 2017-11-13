'use strict';

// Settings configured here will be merged into the final config object.
let validateRegExp = {
  decmal: '^([+-]?)\\d*\\.\\d+$',
  // 浮点数
  decmal1: '^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$',
  // 正浮点数
  decmal2: '^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$',
  // 负浮点数
  decmal3: '^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$',
  // 浮点数
  decmal4: '^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$',
  // 非负浮点数（正浮点数 + 0）
  decmal5: '^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$',
  // 非正浮点数（负浮点数 + 0）
  intege: '^-?[1-9]\\d*$',
  // 整数
  intege1: '^[1-9]\\d*$',
  // 正整数
  intege2: '^-[1-9]\\d*$',
  // 负整数
  num: '^([+-]?)\\d*\\.?\\d+$',
  // 数字
  num1: '^[1-9]\\d*|0$',
  // 正数（正整数 + 0）
  num2: '^-[1-9]\\d*|0$',
  // 负数（负整数 + 0）
  ascii: '^[\\x00-\\xFF]+$',
  // 仅ACSII字符
  chinese: '^[\\u4e00-\\u9fa5]+$',
  // 仅中文
  color: '^#?[a-fA-F0-9]{6}$',
  // 颜色
  date: '^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$',
  // 日期
  datetime: '^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2} (?:[01]\\d|2[0-3])(?:[0-5]\\d){2}$',
  //年月日 时分秒
  email: '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$',
  // 邮件
  //idcard: '^(\\d{15}$|^\\d{18}$|^\\d{17}(\\d|X|x))$',
  idcard: '^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|(X|x))$',
  // 身份证
  ip4: '^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$',
  // ip地址
  letter: '^[A-Za-z]+$',
  // 字母
  letter_l: '^[a-z]+$',
  // 小写字母
  letter_u: '^[A-Z]+$',
  // 大写字母
  // mobile: '^0?(13|15|18|14|17)[0-9]{9}$',
  /**
   * 手机号码(支持一下号码开头的)
   * 移动：134,135,136,137,138,139,147,150,151,152,157,158,159,170,178,182,183,184,187,188
   * 联通：130,131,132,145,152,155,156,1709,171,176,185,186
   * 电信：133,134,153,170,177,180,181,189
   */
  mobile: '^0?(13[0-9]|14[57]|15[0-35-9]|17[01678]|18[0-9])\\d{8}',
  // 手机
  tel_mobile: '^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$|(^0?(((13|15|18|14|17)[0-9])|15[0|3|6|7|8|9]|18[8|9])\\d{8}$)',
  //手机和固定电话
  notempty: '^\\S+$',
  // 非空
  password: '^[\\w\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)]{6,18}$',
  // 密码
  fullNumber: '^[0-9]+$',
  // 数字
  picture: '(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$',
  // 图片
  qq: '^[1-9]*[1-9][0-9]*$',
  // QQ号码
  rar: '(.*)\\.(rar|zip|7zip|tgz)$',
  // 压缩文件
  tel: '^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$',//'^[0-9\-()（）]{7,18}$',
  // 电话号码的函数(包括验证国内区号,国际区号,分机号)
  url: '^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-]*)?$',
  // url
  username: '^[A-Za-z0-9_\\-\\u4e00-\\u9fa5]+$',
  // 户名
  deptname: '^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$',
  // 单位名
  zipcode: '^\\d{6}$',
  // 邮编
  realname: '^[a-zA-Z\\u4e00-\\u9fa5\\s\\-\\.]+$',
  // realname: '^[A-Za-z\\u4e00-\\u9fa5.]+$',
  // realname: '^\\S{1,10}$',
  // 真实姓名
  companyname: '^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$',
  //公司名称
  companyaddr: '^[A-Za-z0-9_()（）\\#\\-\\u4e00-\\u9fa5]+$',
  //公司地址
  // companysite: '^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&#=]*)?$'
  companysite: '^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-]*)?$'
  //公司网站
};

export default {
  APPLY_NAME: 'APPLY_NAME',
  USER_TOKEN: 'JWT_TOKEN',
  TOKEN_ID: 'JWT_TOKEN_ID',
  ORG_CODE: 'ORG_CODE',
  USER: 'USER',
  USER_ID: 'USER_ID',
  USER_COLUMN: 'USER_COLUMN',
  BASE_CODE: 'BASE_CODE',
  QINIU_UPLOAD: 'http://upload.qiniu.com/',
  QINIU_URL: 'http://ojiowy5mw.bkt.clouddn.com/',
  QINIU_TOKEN: ':9000/file/qiuniu/uploadToken',
  QINIU_SUFFIX: '?watermark/2/text/6IuR5Lic55Sf54mp/font/5a6L5L2T/fontsize/500/fill/I0ZDRkNGQw===/dissolve/86/gravity/SouthEast/dx/10/dy/10',
  LOGINOUT_MSG: 'LOGINOUT_MSG',
  RANDOM_STR: 'RANDOM_STR',
  phoneDateFormat: {
    formatMobile: (str) => {
      let phone = '' + str;
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
  },
  validateRegExp: validateRegExp,
  themColors: (function () {
    let temp = [
      '102,153,204',
      '204,204,102',
      '126,77,150',
      '48,210,204',
      '64,164,84',
      '72,172,201',
      '226,203,21',
    ];
    let colrs = [];

    //生成70个颜色
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < temp.length; j++) {
        colrs.push([
          'rgba(' + temp[j] + ',1)',
          'rgba(' + temp[j] + ',.7)',
        ])
      }
    }
    return colrs;
  })(),
  validateRules: {
    isNull: function (str) {
      return (str === "" || typeof str != "string" || str === undefined);
    },
    betweenLength: function (str, _min, _max) {
      return (str.length >= _min && str.length <= _max);
    },
    isUid: function (str) {
      return new RegExp(validateRegExp.username).test(str);
    },
    fullNumberName: function (str) {
      return new RegExp(validateRegExp.fullNumber).test(str);
    },
    isPwd: function (str) {
      return /^.*([\W_a-zA-z0-9-])+.*$/i.test(str);
    },
    isPwdRepeat: function (str1, str2) {
      return (str1 === str2);
    },
    isEmail: function (str) {
      return new RegExp(validateRegExp.email).test(str);
    },
    isTel: function (str) {
      return new RegExp(validateRegExp.tel).test(str);
    },
    isMobile: function (str) {
      return new RegExp(validateRegExp.mobile).test(str);
    },
    isTelOrMobile: function (str) {
      return new RegExp(validateRegExp.tel_mobile).test(str);
    },
    checkType: function (element) {
      return (element.attr("type") === "checkbox" || element.attr("type") === "radio" || element.attr("rel") === "select");
    },
    isRealName: function (str) {
      return new RegExp(validateRegExp.realname).test(str);
    },
    isCompanyname: function (str) {
      return new RegExp(validateRegExp.companyname).test(str);
    },
    isCompanyaddr: function (str) {
      return new RegExp(validateRegExp.companyaddr).test(str);
    },
    isCompanysite: function (str) {
      return new RegExp(validateRegExp.companysite).test(str);
    },
    simplePwd: function (str) {
      return this.pwdLevel(str) === 1;
    },
    weakPwd: function (str) {
      for (let i = 0; i < this.weakPwdArray.length; i++) {
        if (this.weakPwdArray[i] === str) {
          return true;
        }
      }
      return false;
    },
    pwdLevel: function (value) {
      let pattern_1 = /^.*([\W_])+.*$/i;
      let pattern_2 = /^.*([a-zA-Z])+.*$/i;
      let pattern_3 = /^.*([0-9])+.*$/i;
      let level = 0;
      if (value.length > 10) {
        level++;
      }
      if (pattern_1.test(value)) {
        level++;
      }
      if (pattern_2.test(value)) {
        level++;
      }
      if (pattern_3.test(value)) {
        level++;
      }
      if (level > 3) {
        level = 3;
      }
      return level;
    },
    weakPwdArray: ['123456', '123456789', '111111', '5201314', '12345678', '123123', 'password', '1314520', '123321', '7758521', '1234567', '5211314', '666666', '520520', 'woaini', '520131', '11111111', '111111111', '1111111111', '11111111111', '888888', 'hotmail.com', '112233', '123654', '654321', '1234567890', 'a123456', '88888888', '163.com', '000000', 'yahoo.com.cn', 'sohu.com', 'yahoo.cn', '111222tianya', '163.COM', 'tom.com', '139.com', 'wangyut2', 'pp.com', 'yahoo.com', '147258369', '123123123', '147258', '987654321', '100200', 'zxcvbnm', '123456a', '521521', '7758258', '111222', '110110', '1314521', '11111111', '12345678', 'a321654', '111111', '123123', '5201314', '00000000', 'q123456', '123123123', 'aaaaaa', 'a123456789', 'qq123456', '11112222', 'woaini1314', 'a123123', 'a111111', '123321', 'a5201314', 'z123456', 'liuchang', 'a000000', '1314520', 'asd123', '88888888', '1234567890', '7758521', '1234567', 'woaini520', '147258369', '123456789a', 'woaini123', 'q1q1q1q1', 'a12345678', 'qwe123', '123456q', '121212', 'asdasd', '999999', '1111111', '123698745', '137900', '159357', 'iloveyou', '222222', '31415926', '123456', '111111', '123456789', '123123', '9958123', 'woaini521', '5201314', '18n28n24a5', 'abc123', 'password', '123qwe', '123456789', '12345678', '11111111', 'dearbook', '00000000', '123123123', '1234567890', '88888888', '111111111', '147258369', '987654321', 'aaaaaaaa', '1111111111', '66666666', 'a123456789', '11223344', '1qaz2wsx', 'xiazhili', '789456123', 'password', '87654321', 'qqqqqqqq', '000000000', 'qwertyuiop', 'qq123456', 'iloveyou', '31415926', '12344321', '0000000000', 'asdfghjkl', '1q2w3e4r', '123456abc', '0123456789', '123654789', '12121212', 'qazwsxedc', 'abcd1234', '12341234', '110110110', 'asdasdasd', '123456', '22222222', '123321123', 'abc123456', 'a12345678', '123456123', 'a1234567', '1234qwer', 'qwertyui', '123456789a', 'qq.com', '369369', '163.com', 'ohwe1zvq', 'xiekai1121', '19860210', '1984130', '81251310', '502058', '162534', '690929', '601445', '1814325', 'as1230', 'zz123456', '280213676', '198773', '4861111', '328658', '19890608', '198428', '880126', '6516415', '111213', '195561', '780525', '6586123', 'caonima99', '168816', '123654987', 'qq776491', 'hahabaobao', '198541', '540707', 'leqing123', '5403693', '123456', '123456789', '111111', '5201314', '123123', '12345678', '1314520', '123321', '7758521', '1234567', '5211314', '520520', 'woaini', '520131', '666666', 'RAND#a#8', 'hotmail.com', '112233', '123654', '888888', '654321', '1234567890', 'a123456']
  }
}
