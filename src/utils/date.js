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
 * @param {Date} date a date object
 * @param {string} format date format, either 'long' (default) or 'short'
 * @returns {string} a date string, format: DD/MM/YYYY (long) or DD/MM/YY (short)
 */
function deserialize(date, format = "long") {
  if (!date) return "";

  const d = date.toISOString().split('T')[0].split('-').reverse();
  if (format === "short") d[2] = d[2].slice(-2);

  return d.join("/");
}

/**
 * @param {string} date a date string, format: DD/MM/YYYY
 * @returns {Boolean}
 */
function validateDueDate(date) {
  return date.match(dateRegex) &&
    serialize(date).getTime() >= (new Date()).setHours(0, 0, 0, 0);
}

function validatePastDate(date) {
  return date.match(dateRegex) &&
    serialize(date).getTime() <= (new Date()).setHours(0, 0, 0, 0);
}

function validateInterval(start, end) {
  return start.match(dateRegex) && end.match(dateRegex) &&
    serialize(start).getTime() <= serialize(end).getTime();
}

export {
  formatToISO,
  deserialize,
  serialize,
  validateDueDate,
  validatePastDate,
  validateInterval,
};
