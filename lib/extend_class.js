module.exports = function(klass, obj) {
    for(prop in obj) {
        klass.prototype[prop] = obj[prop];
    }

    return klass;
}