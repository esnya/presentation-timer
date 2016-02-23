/**
 * Bell action module.
 * @module actions/bell
 */

/// Add
export const ADD = 'BELL_ADD';
/// Add action creator
export function add() {
    return {
        type: ADD,
    };
}

/// Delete
export const DEL = 'BELL_DEL';
/// Delete action creator
export function del() {
    return {
        type: DELETE,
    };
}

/// Update
export const UPDATE = 'BELL_UPDATE';
/// Update action creator
export function update() {
    return {
        type: UPDATE,
    };
}