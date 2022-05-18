function snakeToCamel(str) {
  return str
    .split("")
    .reduce(
      (s, c) =>
        s[s.length - 1] === "_" ? s.slice(0, -1) + c.toUpperCase() : s + c,
      ""
    );
}

function toCamelCaseFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseFields);
  } else {
    return Object.entries(obj).reduce(
      (res, [key, value]) => ({
        ...res,
        [snakeToCamel(key)]:
          typeof value === "object" ? toCamelCaseFields(value) : value
      }),
      {}
    );
  }
}

export { toCamelCaseFields };
