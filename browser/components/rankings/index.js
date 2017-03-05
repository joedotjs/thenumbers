import store from '../../store/createStore';
import { switchFilter, switchOrder, getWinRankings } from '../../actions/rankings';
import OptionButtons from './options';
import Loader from '../loader';
import React from 'react';
import {Link} from 'react-router';

export default class extends React.Component {

    constructor() {
        super();
        this.state = {
            songs: null,
            filter: null,
            order: 'Wins',
            loading: true
        };
    }

    componentDidMount() {
        this.unsubFromStore = store.subscribe(() => {
            const newState = store.getState();
            this.setState({
                songs: newState.rankedSongs,
                filter: newState.rankingFilter,
                order: newState.rankingOrder,
                loading: newState.loading
            });
        });
        getWinRankings();
    }

    componentWillUnmount() {
        this.unsubFromStore();
    }

    getBackgroundStyle(s) {
        return {backgroundImage: `url(${s.album.cover})`};
    }

    getTableRows() {

        let songsForRows = this.state.songs;

        if (this.state.filter !== null) {
            if (this.state.filter === 'No B-Sides') {
                songsForRows = songsForRows.filter(s => s.album.title !== 'B-Sides');
            } else {
                songsForRows = songsForRows.filter(s => s.album.title === this.state.filter);
            }
        }

        return songsForRows.map((s, i) => {
            return (
                <tr key={s.id} style={this.getBackgroundStyle(s)}>
                    <td>{i + 1}</td>
                    <td>{s.title}</td>
                    <td>{s.album.title}</td>
                    <td>{s.rating}</td>
                </tr>
            );
        });

    }

    showSongsTable() {
        if (this.isLoading()) return null;
        return (
            <table>
                <thead>
                <tr>
                    <td>Rank</td>
                    <td>Title</td>
                    <td>Album</td>
                    <td>Rating</td>
                </tr>
                </thead>
                <tbody>
                {this.getTableRows()}
                </tbody>
            </table>
        );

    }

    isLoading() {
        return this.state.loading && !this.state.songs;
    }

    loadingOpacity() {
        if (this.isLoading()) {
            return {opacity: 0.2};
        }
        return null;
    }

    render() {

        const loader = this.isLoading() ? <Loader /> : null;

        return (
            <div>
                {loader}
                <Link to="/"><h4 id="back-to-voting">&larr; Go to Voting</h4></Link>
                <a id="share-link" target="_self" href="/share/mine">Click here for a shareable personal ranking
                    page!</a>
                <div id="rankings" style={this.loadingOpacity()}>
                    <OptionButtons
                        setFilter={switchFilter}
                        currentFilter={this.state.filter}
                        setOrder={switchOrder}
                        currentOrder={this.state.order}
                    />
                    {this.showSongsTable()}
                </div>
            </div>
        );
    }

}