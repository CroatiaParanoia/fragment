import { handleDomResize, batchUpdateStyle } from "./../js/dom";
export default class ResponseList {
  containerEl = null;
  childrenEls = [];
  config = null;
  observe = null;

  validateEl(el) {
    const isElement = (el) => el instanceof Element;
    const isSelector = (el) => typeof el === "string";

    return [isElement, isSelector].some((f) => f(el));
  }

  constructor(el, config) {
    if (!this.validateEl(el)) {
      throw new Error("the first parameter need an element or selector");
    }
    let {
      minWidth,
      maxWidth,
      minRowCount = 3,
      horizontalSpace = 0,
      verticalSpace = 0,
    } = config;

    this.containerEl = typeof el === "string" ? document.querySelector(el) : el;
    this.childrenEls = this.containerEl.children;

    if (this.childrenEls.length) {
      const childWidth = this.childrenEls[0].getBoundingClientRect().width;
      minWidth = minWidth || childWidth;
      maxWidth = maxWidth || childWidth;
    }

    this.config = {
      minWidth,
      maxWidth,
      minRowCount,
      horizontalSpace,
      verticalSpace,
    };

    this.reload();
  }

  initContainer() {
    const { horizontalSpace, verticalSpace } = this.config;
    batchUpdateStyle(this.containerEl, {
      display: "grid",
      "grid-template-columns": "repeat(3, auto)",
      "grid-row-gap": verticalSpace + "px",
      "grid-column-gap": horizontalSpace + "px",
    });
  }

  initChildren() {
    const { minWidth, maxWidth } = this.config;
    this.childrenEls = this.containerEl.children;

    batchUpdateStyle(this.childrenEls, {
      width: "initial",
      "min-width": minWidth + "px",
      "max-width": maxWidth + "px",
    });
  }

  updateConfig(config = {}) {
    this.config = { ...this.config, ...config };
  }

  reload() {
    this.initContainer();
    this.initChildren();
    this.createObserve();
  }

  createObserve() {
    this.destroyObserve();
    this.observe = handleDomResize(
      this.containerEl,
      (rect) => {
        const { width } = rect;
        const { maxWidth, minRowCount } = this.config;

        if (!maxWidth) return;

        const rowCount = Math.floor(width / maxWidth);

        const realRowCount = Math.max(rowCount, minRowCount);

        batchUpdateStyle(this.containerEl, {
          "grid-template-columns": `repeat(${realRowCount}, auto)`,
        });
      },
      16
    );
  }

  destroyObserve() {
    this.observe && this.observe.disconnect();
  }
}
