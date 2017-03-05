import axios from 'axios';
import { browserHistory } from 'react-router';

import store from '../store/createStore';
import {loading} from './loading';

const { dispatch } = store;

export function getNewMatchup() {

    dispatch({type: 'GET_NEW_MATCHUP'});

    axios.get('/api/random')
        .then(response => {
            dispatch({
                type: 'NEW_MATCHUP',
                matchup: response.data.matchup,
                includeBSides: response.data.includeBSides,
                canUndo: false
            });
        })
        .catch(response => {
            if (response.status !== 401) console.error(response);
            browserHistory.push('/login');
        });

}

export function voteSong(matchup, chosenId) {

    const sendVote = axios.post('/api/vote', {
        matchup: matchup.map(s => s.id),
        chosenId
    });

    loading();

    sendVote
        .then(response => {
            dispatch({
                type: 'NEW_MATCHUP',
                matchup: response.data.matchup,
                canUndo: true
            });
        })
        .catch(e => console.error(e));

}

export function includeBsides(include) {
    loading();
    axios.put('/api/b-sides', {include})
        .then(() => getNewMatchup())
        .catch(e => console.error(e));
}

export function undo() {

    loading();

    axios.get('/api/undo')
        .then(response => {
            dispatch({
                type: 'NEW_MATCHUP',
                matchup: response.data.matchup,
                canUndo: false
            });
        })
        .catch(e => console.error(e));

}
