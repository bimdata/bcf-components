const dateRegex = new RegExp(
  /^((([0]?[1-9]|1[0-9]|2[0-8])[./-](0[1-9]|1[012]))|((29|30|31))[./-]((0[13578]|1[02]))|((29|30))[./-](0[4,6,9]|11))[./-]((19|[2-9][0-9])\d\d$|(^29[./-]02[./-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$))/
);

/**
 * @param {String} date a date sgtring, format: DD/MM/YYYY
 * @returns {String} a date strting, format: YYYY-MM-DD
 */
function formatToISO(date) {
  return date.split("/").reverse().join("-")
}

/**
 * @param {string} date a date string, format: DD/MM/YYYY
 * @returns {Date} a date object
 */
function serialize(date) {
  return new Date(formatToISO(date));
}

/**
 * 
 * @param {Date} date a date object
 * @returns {string} a date string, format: DD/MM/YYYY
 */
function deserialize(date) {
  return date.toISOString().split('T')[0].split('-').reverse().join('/');
}

/**
 * @param {string} date a date string, format: DD/MM/YYYY
 * @returns {Boolean}
 */
function validate(date) {
  if (!date) {
    return true;
  }
  if (!date.match(dateRegex)) {
    return false;
  }
  const dateObj = serialize(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj.getTime() >= today.getTime();
}

export {
  dateRegex,
  formatToISO,
  deserialize,
  serialize,
  validate,
};
