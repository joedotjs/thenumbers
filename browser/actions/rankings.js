import axios from 'axios';

import store from '../store/createStore';
import { loading } from './loading';

const { dispatch } = store;

function requestForSongs(url) {
    return axios.get(url)
        .then(response => response.data);
}

function getRankings() {
    dispatch({
        type: 'SWITCH_RANKING_ORDER',
        order: 'ELO'
    });
    loading();
    requestForSongs('/api/rankings')
        .then(songs => dispatch({type: 'RANKED_SONGS', songs}))
        .catch(e => console.error(e));
}

function getWinRankingsBSides() {
    dispatch({
        type: 'SWITCH_RANKING_ORDER',
        order: 'Wins B-Sides'
    });
    loading();
    requestForSongs('/api/rankings/wins/b-sides')
        .then(songs => dispatch({type: 'RANKED_SONGS', songs}))
        .catch(e => console.error(e));
}

function getPersonalRankings() {
    dispatch({
        type: 'SWITCH_RANKING_ORDER',
        order: 'Personal'
    });
    loading();
    requestForSongs('/api/rankings/personal')
        .then(songs => dispatch({type: 'RANKED_SONGS', songs}))
        .catch(e => console.error(e));
}

export function getWinRankings() {
    dispatch({
        type: 'SWITCH_RANKING_ORDER',
        order: 'Wins'
    });
    loading();
    requestForSongs('/api/rankings/wins')
        .then(songs => dispatch({type: 'RANKED_SONGS', songs}))
        .catch(e => console.error(e));
}

export function switchOrder(order) {

    switch (order) {

        case 'ELO':
            getRankings();
            break;

        case 'Wins':
            getWinRankings();
            break;

        case 'Wins B-Sides':
            getWinRankingsBSides();
            break;

        case 'Personal':
            getPersonalRankings();
            break;

        default:
            break;

    }

}

export function switchFilter(filter) {
    if (filter === 'All') filter = null;
    dispatch({
        type: 'SWITCH_RANKING_FILTER',
        filter
    });
}