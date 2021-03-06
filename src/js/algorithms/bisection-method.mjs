/*
 * Copyright (c) 2019-2020 Tobias Briones. All rights reserved.
 *
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Example Project: Miscellaneous computations in JS.
 *
 * This source code is licensed under the MIT License found in the
 * LICENSE file in the root directory of this source tree or at
 * https://opensource.org/licenses/MIT.
 */

import { Monomial } from '../tools/monomial.mjs';
import { Polynomial } from '../tools/polynomial.mjs';

const DEF_ITERATIONS_NUMBER = 50;
const NO_ROOTS_MSG = `
There aren't roots in the interval or try to give an interval
in which only the root that you are looking for of the polynomial is enclosed in
it and with a change of signs!
`;

export function runBisectionMethodExample() {
  const f = new Polynomial();
  let bisectionMsg;

  console.log('');
  console.log('%cBisection method script', 'font-weight:bold;font-size:24px');

  // f(x) = x^6 - 3x - 1
  f.addMonomial(new Monomial(1, 6));
  f.addMonomial(new Monomial(-3, 1));
  f.addMonomial(new Monomial(-1));

  // Run the algorithm and print the result!
  console.log(
    'Running bisection method for %cf(x) = x^6 - 3x - 1 in [-1, 0] and default iterations (50)',
    'font-weight:bold'
  );
  bisectionMsg = bisect(f, [-1, 0]).msg;

  console.log(bisectionMsg);
  console.log('');
  console.log(
    'Running bisection method for %cf(x) = x^6 - 3x - 1 in [1, 2] and 8 iterations',
    'font-weight:bold'
  );
  bisectionMsg = bisect(f, [1, 2], 8).msg;

  console.log(bisectionMsg);

  console.log('');
  console.log('');
}

export function bisect(polynomial, interval, i = DEF_ITERATIONS_NUMBER) {
  const a = parseInt(interval[0]);
  const b = parseInt(interval[1]);
  const result = runBisectAlgorithm(polynomial, a, b, i);
  const msg = newBisectResultMsg(result);
  return {
    result: result,
    msg: msg
  };
}

function runBisectAlgorithm(polynomial, aValue, bValue, iterationsNumber) {
  let result = resultBuilder().setRootNotFound(polynomial).build();
  let a = aValue;
  let b = bValue;
  let c = 0;
  let error = 0;
  let i = iterationsNumber;
  let hasRoot = true;

  do {
    error = (Math.abs(a - b) / 2);
    c = (a + b) / 2;
    let fa = polynomial.evaluate(a);
    let fb = polynomial.evaluate(b);
    let fc = polynomial.evaluate(c);

    if (fc === 0) {
      break;
    }
    if (hasOppositeSigns(fa, fc)) {
      b = c;
    }
    else if (hasOppositeSigns(fc, fb)) {
      a = c;
    }
    else {
      hasRoot = false;
      break;
    }
    i--;
  }
  while (i !== 0);

  if (hasRoot) {
    result = resultBuilder().set(polynomial, c, error).build();
  }
  return result;
}

function result(found, c, image, error) {
  return {
    found: found,
    c: c,
    image: image,
    error: error
  };
}

function resultBuilder() {
  const self = {
    polynomial: null,
    c: 0,
    error: 0,
    set: (polynomial, c, error) => set.call(self, polynomial, c, error),
    setRootNotFound: (polynomial) => setRootNotFound.call(self, polynomial),
    build: () => build.call(self)
  };
  return self;

  function set(polynomial, c, error) {
    this.polynomial = polynomial;
    this.c = c;
    this.error = error;
    return this;
  }

  function setRootNotFound(polynomial) {
    return set.call(this, polynomial, 0, 0);
  }

  function build() {
    return result(
      true,
      this.c,
      this.polynomial.evaluate(this.c),
      this.error
    );
  }
}

function hasOppositeSigns(a, b) {
  const isNegativeAndNonNegative = (a, b) => {
    return a < 0 && b >= 0;
  };
  const isNonNegativeAndNegative = (a, b) => {
    return a >= 0 && b < 0;
  };
  return isNegativeAndNonNegative(a, b) || isNonNegativeAndNegative(a, b);
}

function newBisectResultMsg(result) {
  const { found, c, image, error } = result;
  let msg = NO_ROOTS_MSG;

  if (found) {
    msg = `Root found at c = ${ c }, F(c) = ${ image }, |a - b| / 2 = ${ error }`;
  }
  return msg;
}
