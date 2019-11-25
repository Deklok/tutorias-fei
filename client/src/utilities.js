
function splitCookie(str) {
    str = str.split(';');
    var result = {};
    for (var i = 0; i < str.length; i++) {
        var cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result;
}

function stringToBoolean(str) {
    if (str == 'true') {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    splitCookie: splitCookie,
    stringToBoolean: stringToBoolean
}