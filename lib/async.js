/*
 * Copyright (c) 2015-present, Vitaly Tomilov
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

'use strict';

/**
 * ES6 generators
 * @module async
 * @author Vitaly Tomilov
 * @private
 */
module.exports = config => {

    /////////////////////////////////
    // Generator-to-Promise adapter;
    //
    // Based on: https://www.promisejs.org/generators/#both
    return generator => {
        const $p = config.promise;
        return function () {
            const g = generator.apply(this, arguments);

            const handle = result => {
                if (result.done) {
                    return $p.resolve(result.value);
                }
                return $p.resolve(result.value)
                    .then(data => handle(g.next(data)))
                    .catch(err => handle(g.throw(err)));
            };

            return handle(g.next());
        };
    };

};
