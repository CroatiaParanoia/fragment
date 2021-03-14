export function debounce(fn, wait) {
  let timer = null;

  return function (...args) {
    const context = this;

    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

// 计算数据类型
export function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

// 安全解析 JSON
export function jsonSafeParse(value, defaultValue) {
  if (typeOf(value) === "String") {
    try {
      const newValue = JSON.parse(value);

      if (typeOf(newValue) !== typeOf(defaultValue)) return defaultValue;

      return newValue;
    } catch {
      return defaultValue;
    }
  }
  return value ?? defaultValue;
}

// 将对象转为 枚举
export function toEnum(obj = {}) {
  if (typeOf(obj) !== "Object") return {};

  const newObj = { ...obj };
  for (let key in newObj) {
    const value = newObj[key];
    newObj[value] = key;
  }
  return newObj;
}
