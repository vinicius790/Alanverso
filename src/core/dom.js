/**
 * ALANVERSO v5.0.0 - UTILITÁRIOS SEGUROS DE DOM (ZERO SINK DE HTML / ANTI-XSS)
 * Fornece fábrica declarativa de elementos e analisador seguro de marcação inline.
 */

const ALLOWED_INLINE_TAGS = new Set(['span', 'strong', 'em', 'b', 'i', 'br', 'small']);
const ALLOWED_INLINE_ATTRS = new Set(['class', 'title', 'aria-hidden']);

/**
 * Cria um elemento HTML de forma declarativa e estritamente segura contra XSS.
 * Strings nos filhos viram nós de texto (`document.createTextNode`).
 */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props || {})) {
    if (value === undefined || value === null || value === false) continue;

    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'className' || key === 'class') {
      el.className = String(value);
    } else if (key === 'textContent') {
      el.textContent = String(value);
    } else if (key === 'dataset' && typeof value === 'object') {
      for (const [dKey, dVal] of Object.entries(value)) {
        if (dVal !== undefined && dVal !== null) {
          el.dataset[dKey] = String(dVal);
        }
      }
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }

  appendChildren(el, children);
  return el;
}

/** Anexa recursivamente filhos válidos (nós, strings, números, arrays) ao elemento alvo. */
export function appendChildren(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      parent.appendChild(child);
    }
  }
}

/** Limpa os filhos de um container sem recorrer a atribuição direta de marcação HTML. */
export function clearElement(el) {
  if (!el) return;
  if (typeof el.replaceChildren === 'function') {
    el.replaceChildren();
  } else {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
}

/**
 * Converte texto rico restrito (com tags inline permitidas como <span> ou <strong>)
 * em um DocumentFragment seguro usando apenas nós DOM nativos, bloqueando scripts e atributos perigosos.
 */
export function buildSafeRichFragment(input, doc = document) {
  const fragment = doc.createDocumentFragment();
  if (typeof input !== 'string' || input === '') return fragment;

  // Remove quaisquer tags perigosas junto com seu conteúdo (script/style/iframe)
  const cleaned = input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');

  const stack = [fragment];
  const tokenRegex = /<\/?([a-zA-Z][\w-]*)([^>]*)>|([^<]+)/g;
  let match;

  while ((match = tokenRegex.exec(cleaned)) !== null) {
    const [, rawTag, rawAttrs, textPart] = match;
    if (textPart !== undefined) {
      stack[stack.length - 1].appendChild(doc.createTextNode(textPart));
      continue;
    }

    const fullTag = match[0];
    const tag = rawTag.toLowerCase();
    const isClosing = fullTag.startsWith('</');

    if (!ALLOWED_INLINE_TAGS.has(tag)) {
      continue;
    }

    if (isClosing) {
      if (stack.length > 1 && stack[stack.length - 1].tagName?.toLowerCase() === tag) {
        stack.pop();
      }
      continue;
    }

    const node = doc.createElement(tag);
    if (rawAttrs) {
      const attrRegex = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2] ?? attrMatch[3] ?? '';
        if (ALLOWED_INLINE_ATTRS.has(attrName)) {
          node.setAttribute(attrName, attrValue);
        }
      }
    }

    stack[stack.length - 1].appendChild(node);
    if (tag !== 'br' && !fullTag.endsWith('/>')) {
      stack.push(node);
    }
  }

  return fragment;
}
