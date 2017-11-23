module.exports = nestedTypeFilter = function (val, spec) {
    console.log('Initial data:', val, spec);

    if (typeof spec === 'function') {
        return checkType(val, spec);

    } else {
        if (val !== null && typeof spec === 'object') {
            let retObj = {};
            if (spec.length) {
                const aSpec = spec[0];
                const z = val.map((el, v) => {
                    const result = checkType(el, aSpec);
                    if (typeof result !== 'undefined') {
                        return result;
                    }
                }).filter((el) => {
                    return typeof el === 'undefined' ? false : true;
                });
                return z;
            }
            else {
                Object.keys(val).forEach((k, v) => {
                    const result = checkType(val[k], spec[k]);
                    if (typeof result !== 'undefined') {
                        retObj[k] = result;
                    }
                })
            }
            return retObj;

        }
    }
};

const checkType = function (val, spec) {
    const specType = spec.name.toLowerCase();
    if (val !== null) {
        if (typeof val === specType) {
            return spec(val);
        }
    }
}