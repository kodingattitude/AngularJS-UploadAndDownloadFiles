app.directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
}]);

/**
 * extends string prototype object to get a string with a number of characters from a string.
 *
 * @type {Function|*}
 */
//// to truncate the given string
String.prototype.trunc = String.prototype.trunc ||
function (n) {

    // this will return a substring and 
    // if its larger than 'n' then truncate and append '...' to the string and return it.
    // if its less than 'n' then return the 'string'
    return this.length > n ? this.substr(0, n - 1) + '...' : this.toString();
};

//// checking whether the string contains the given 'word' or not
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}