// Simulação mínima do DOM para testar módulos UI em Node.js puro sem jsdom.

export class FakeNode {
  constructor() {
    this.children = [];
  }

  appendChild(node) {
    this.children.push(node);
    return node;
  }

  replaceChildren(...nodes) {
    this.children = nodes;
  }

  get textContent() {
    return this.children
      .map((child) => (typeof child === 'string' ? child : child.textContent))
      .join('');
  }
}

export class FakeTextNode extends FakeNode {
  constructor(text) {
    super();
    this.data = String(text);
  }

  get textContent() {
    return this.data;
  }
}

export class FakeElement extends FakeNode {
  constructor(tagName) {
    super();
    this.tagName = String(tagName).toLowerCase();
    this.attributes = new Map();
    this.listeners = new Map();
    this.dataset = {};
    this._className = '';
  }

  set className(val) {
    this._className = String(val);
    this.attributes.set('class', this._className);
  }

  get className() {
    return this._className;
  }

  set textContent(val) {
    this.children = [new FakeTextNode(val)];
  }

  get textContent() {
    return super.textContent;
  }

  setAttribute(name, value) {
    if (name === 'class') this._className = String(value);
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  findAll(tagName) {
    const target = tagName.toLowerCase();
    const found = this.tagName === target ? [this] : [];
    for (const child of this.children) {
      if (child instanceof FakeElement) {
        found.push(...child.findAll(target));
      }
    }
    return found;
  }
}

export function installFakeDom() {
  globalThis.Node = FakeNode;
  globalThis.document = {
    createElement: (tagName) => new FakeElement(tagName),
    createTextNode: (text) => new FakeTextNode(text),
    createDocumentFragment: () => new FakeNode(),
  };
}
