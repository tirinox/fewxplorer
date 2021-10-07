export function nowTS() {
    return Math.floor(Date.now() / 1000)
}

export function percentage(value, decimals) {
    if (!value) {
        value = 0;
    }

    if (!decimals) {
        decimals = 0;
    }

    value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    value = value + ' %';
    return value;
}

export function compare(x, y) {
    if (x > y) {
        return 1
    } else if (x < y) {
        return -1
    } else {
        return 0
    }
}