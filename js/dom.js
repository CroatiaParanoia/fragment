import { debounce } from "./utils";

export function getStyleValue(el, key) {
  return getComputedStyle(el).getPropertyValue(key);
}

export function handleDomResize(el, handleResize = () => {}, time = 0) {
  const innerCallback = time ? debounce(handleResize, time) : handleResize;
  const observe = new ResizeObserver(function ([{ contentRect }]) {
    const { bottom, height, left, right, top, width, x, y } = contentRect;
    if (getStyleValue(el, "display") === "none") return;

    innerCallback({ bottom, height, left, right, top, width, x, y });
  });

  observe.observe(el);

  return observe;
}

export function batchUpdateStyle(els, style) {
  const innerEls = els instanceof HTMLCollection ? [...els] : [].concat(els);
  const displayMap = new WeakMap();
  // 隐藏
  innerEls.forEach((element) => {
    const rememberDisplayValue = getStyleValue(element, "display") || "";
    displayMap.set(element, rememberDisplayValue);
    element.style.setProperty("display", "none");
  });

  // 修改样式
  innerEls.forEach((element, elementIndex) => {
    let currentStyle = style;
    if (typeof style === "function") {
      currentStyle = style(element, elementIndex) || {};
    }

    Object.entries(currentStyle).forEach(([cssKey, cssValue]) => {
      element.style.setProperty(cssKey, cssValue);
    });

    element.style.setProperty(
      "display",
      currentStyle.display || displayMap.get(element)
    );
    displayMap.delete(element);
  });
}
