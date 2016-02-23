/**
 * Timer action module.
 * @module actions/timer
 */

/// Start timer
export const START = 'TIMER_START';
/// Start timer action creator
export function start() {
    return {
        type: START,
    };
}

/// Stop timer
export const STOP = 'TIMER_STOP';
/// Stop timer action creator
export function stop() {
    return {
        type: STOP,
    };
}

/// Clear timer
export const CLEAR = 'TIMER_CLEAR';
/// Clear timer action creator
export function clear() {
    return {
        type: CLEAR,
    };
}

/// Timer tick
export const TICK = 'TIMER_TICK';
/// Timer tick action creator
export function tick() {
    return {
        type: TICK,
    };
}