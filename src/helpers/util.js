import * as timeago from "timeago.js";

export function nowTS() {
    return Math.floor(Date.now() / 1000)
}

Date.prototype.getUTCTime = function(){
    return new Date(
        this.getUTCFullYear(),
        this.getUTCMonth(),
        this.getUTCDate(),
        this.getUTCHours(),
        this.getUTCMinutes(),
        this.getUTCSeconds()
    ).getTime();
}

export function nowTS_UTC() {
    return Math.floor((new Date()).getTime() / 1000)
}

export function agoTS(value) {
    if (value) {
        return timeago.format(new Date(value * 1000))
    } else {
        return 'N/A'
    }
}

export function isBottom() {
    return (document.documentElement.scrollTop + document.documentElement.clientHeight
        >=
        document.documentElement.scrollHeight)
}

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
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

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

const DAY_S = 60 * 60 * 24
const HOUR_S = 60 * 60

export function countdownFormat(distance) {
    const days = Math.floor(distance / DAY_S);
    const hours = Math.floor((distance % DAY_S) / HOUR_S);
    const minutes = Math.floor((distance % HOUR_S) / 60);
    const seconds = Math.floor(distance % 60);
    return `${days} days ${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`
}