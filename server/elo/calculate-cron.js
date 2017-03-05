import _ from 'lodash';
import Promise from 'bluebird';
import calculateNewRankings from './';
import matchupMaker from '../matchup-maker';

import db from '../db';
const Vote = db.model('vote');
const Song = db.model('song');

const updateRankings = () => {

    return Promise.all([Vote.getUncounted(), Song.findAll()])
        .spread((votes, songs) => {

            if (!votes.length) return;

            const keyedSongs = _.keyBy(songs, 'id');
            const updatedSongs = new Set();

            votes.forEach(v => {

                const [song1, song2] = [keyedSongs[v.choice1Id], keyedSongs[v.choice2Id]];

                const newRatings = calculateNewRankings(
                    song1.rating,
                    song2.rating,
                    v.chosenId === song1.id
                );

                updatedSongs.add(song1).add(song2);

                song1.rating = newRatings[0];
                song2.rating = newRatings[1];

            });

            const songsUpdating = Array.from(updatedSongs).map(song => song.save());

            const settingVotesCounted = Vote.setCountedBeforeId(
                _.last(votes).id
            );

            return Promise.all(settingVotesCounted, songsUpdating)
                .then(() => matchupMaker.resetSongs());

        })
        .catch(e => {
            console.error(e.stack);
        });

};

export default updateRankings;