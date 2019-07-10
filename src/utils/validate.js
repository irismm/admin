// 手机号码正则
export let mPattern = {
  phone: /\d{3}-\d{8}|\d{4}-\{7,8}/,
  cellPhone: /^1[34578]\d{9}$/,
  fax: /^(\d{3,4}-)?\d{7,8}$/
}

// Email正则
export let ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// 数字正则 可以是整数也可以是浮点数
export let sNumber = {
  // 正数正则
  posPattern: /^\d*\.?\d+$/,
  // 负数正则
  negPattern: /^-\d*\.?\d+$/,
  // 数字正则
  numPattern: /^-?\d*\.?\d+$/
}
// password 正则 只能包含数字字母下划线，长度在6-18位
export let pwd = /^\w{6,18}$/

// 身份证正则
export let card = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

// 网址正则
export let urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

