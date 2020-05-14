/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return { width, height, getArea() { return this.width * this.height; } };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(Proto, json) {
  const data = JSON.parse(json);
  const values = Object.values(data);
  return new Proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MyClass {
  constructor() {
    this.str = '';
    this.existsElement = false;
    this.existsId = false;
    this.existsPseudoElement = false;
    this.currentFunc = -1;
  }

  element(value) {
    if (this.existsElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.currentFunc > 1) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.currentFunc = 1;
    this.existsElement = true;
    this.str += `${value}`;
    return this;
  }

  id(value) {
    if (this.existsId) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');

    if (this.currentFunc > 2) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.currentFunc = 2;
    this.existsId = true;
    this.str += `#${value}`;
    return this;
  }

  class(value) {
    if (this.currentFunc > 3) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.currentFunc = 3;
    this.str += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.currentFunc > 4) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.currentFunc = 4;
    this.str += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.currentFunc > 5) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.currentFunc = 5;
    this.str += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.existsPseudoElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.currentFunc > 6) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.currentFunc = 6;
    this.existsPseudoElement = true;
    this.str += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.str += `${selector1.str} ${combinator} ${selector2.str}`;
    return this;
  }

  stringify() {
    const result = this.str;
    this.str = '';
    return result;
  }
}

const cssSelectorBuilder = {
  str: '',

  element(value) {
    return new MyClass().element(value);
  },

  id(value) {
    return new MyClass().id(value);
  },

  class(value) {
    return new MyClass().class(value);
  },

  attr(value) {
    return new MyClass().attr(value);
  },

  pseudoClass(value) {
    return new MyClass().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MyClass().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    // console.log(selector1);
    return new MyClass().combine(selector1, combinator, selector2);
    // throw new Error('Not implemented');
  },

  // stringify() {
  //   const result = this.str;
  //   this.str = '';
  //   return result;
  // },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
