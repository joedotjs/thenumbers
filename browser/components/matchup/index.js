import React from 'react';
import { Link } from 'react-router';

import { getNewMatchup, includeBsides, voteSong, undo } from '../../actions/matchup';
import store from '../../store/createStore';

import Loader from '../loader';
import Song from './song';
import BSides from './b-sides';
import Undo from './undo';

const LEFT_CHOICE = 37;
const RIGHT_CHOICE = 39;
const SKIP = 40;
const KEY_EVENT = 'keyup';

export default class extends React.Component {

    constructor() {
        super();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.setBSideInclude = this.setBSideInclude.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.undoLastVote = this.undoLastVote.bind(this);
        this.state = {
            matchup: null,
            loading: true,
            includeBSides: true,
            canUndo: false
        };
    }

    componentDidMount() {
        this.unsubFromStore = store.subscribe(() => this.setState(store.getState()));
        document.body.addEventListener(KEY_EVENT, this.handleKeyPress);
        getNewMatchup();
    }

    componentWillUnmount() {
        this.unsubFromStore();
        document.body.removeEventListener(KEY_EVENT, this.handleKeyPress);
    }

    handleKeyPress(e) {

        const press = dir => {
            this.handleVote(this.state.matchup[dir === 'left' ? 0 : 1].id);
            this.setState({pressed: dir});
            setTimeout(() => this.setState({pressed: null}), 100);
        };

        switch (e.keyCode) {
            case LEFT_CHOICE:
                press('left');
                break;
            case RIGHT_CHOICE:
                press('right');
                break;
            case SKIP:
                this.skip();
                break;
            default:
                return;
        }

    }

    handleVote(chosenId) {
        voteSong(this.state.matchup, chosenId);
    }

    formSongs() {
        if (!this.state.matchup) return null;
        return this.state.matchup.map((song, i) => {
            return <Song
                key={song.id}
                {...song}
                vote={this.handleVote}
                pressed={i === 0 ? this.state.pressed === 'left' : this.state.pressed === 'right'}
            />;
        });
    }

    skip() {
        getNewMatchup();
    }

    getLoader() {
        return this.state.loading ? <Loader /> : null;
    }

    getUndoButton() {
        return this.state.canUndo
            ? <Undo undo={this.undoLastVote} />
            : null;
    }

    undoLastVote() {
        undo();
    }

    setBSideInclude(include) {
        includeBsides(include)
    }

    render() {
        return (
            <div id="matchup">
                <div id="helpful-bar">
                    <h2>
                        Click on the song you prefer, or press left and right arrow keys
                    </h2>
                    <h3><Link to="/rankings">See the Rankings</Link></h3>
                    <BSides include={this.state.includeBSides} set={this.setBSideInclude} />
                    <h3 id="skip-mobile" onClick={this.skip}>Skip this Match-up</h3>
                </div>
                {this.formSongs()}
                {this.getUndoButton()}
                {this.getLoader()}
                <button id="skip-button" onClick={this.skip}>Click to skip,<br />or press down arrow.</button>
            </div>
        );
    }

}