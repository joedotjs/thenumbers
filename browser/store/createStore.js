import { createStore } from 'redux';
import { cloneDeep } from 'lodash';

const ifProvided = (newVal, currVal) => typeof newVal !== 'undefined' ? newVal : currVal;

export default createStore((currentState, action) => {

    const newState = cloneDeep(currentState);

    switch (action.type) {

        case 'GET_NEW_MATCHUP':
            newState.matchup = null;
            newState.loading = true;
            break;

        case 'NEW_MATCHUP':

            newState.matchup = action.matchup;

            newState.loading = false;

            newState.includeBSides = ifProvided(
                action.includeBSides,
                newState.includeBSides
            );

            newState.canUndo = ifProvided(
                action.canUndo,
                newState.canUndo
            );

            break;

        case 'RANKED_SONGS':
            newState.rankedSongs = action.songs;
            newState.loading = false;
            break;

        case 'SWITCH_RANKING_FILTER':
            newState.rankingFilter = action.filter;
            break;

        case 'SWITCH_RANKING_ORDER':
            newState.rankingOrder = action.order;
            break;

        case 'SET_IS_LOADING':
            newState.loading = true;
            newState.rankedSongs = null;
            break;

        default:
            break;

    }

    return newState;

}, {
    matchup: null,
    rankedSongs: null,
    rankingFilter: null,
    rankingOrder: 'Wins',
    loading: false,
    canUndo: false
});