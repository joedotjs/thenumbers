import _ from 'lodash';
import Promise from 'bluebird';
import db from '../db';
import getMatchupForUser from './user-specific';

const Song = db.model('song');

let rawSongs = null;
let groupedSongs = null;
let rawSongsWithoutBSides = null;
let groupedSongsWithoutBSides = null;
let keyedSongs = null;
let pendingFetch = null;

function groupAndKeySongs(songs) {
    const GROUP_SIZE = Math.ceil(158 / _.random(6, 9));
    rawSongs = songs;
    groupedSongs = _.chunk(rawSongs, GROUP_SIZE);
    keyedSongs = _.keyBy(rawSongs, 'id');
    rawSongsWithoutBSides = rawSongs.filter(s => s.album.title !== 'B-Sides');
    groupedSongsWithoutBSides = _.chunk(rawSongsWithoutBSides, GROUP_SIZE);
}

function getGroup(include) {
    return include ? groupedSongs : groupedSongsWithoutBSides;
}

function wrap(includeBSides) {
    if (!rawSongs) {
        if (pendingFetch) return pendingFetch;
        pendingFetch = Song.getRanked()
            .then(songsFromDB => {
                groupAndKeySongs(songsFromDB);
                pendingFetch = null;
                return getGroup(includeBSides);
            });
        return pendingFetch;
    } else {
        return Promise.resolve(getGroup(includeBSides));
    }
}

const inf = {

    getMatchup(userId, includeBSides) {

        const generalOrUser = Math.random();

        if (generalOrUser > 0.1) { // 90% user specific
            return wrap(includeBSides)
                .then(() => getMatchupForUser(userId, includeBSides))
                .then(matchupIds => {
                    return matchupIds.map(id => keyedSongs[id]);
                });
        } else { // 10%
            const chance = Math.random();
            if (chance < 0.08) { // 8%
                return this.getPolars(includeBSides);
            } else if (chance < 0.20) { // 12%
                return this.getTopContenders(includeBSides);
            } else if (chance < 0.50) { // 30%
                return this.getClose(includeBSides);
            } else { // 50%
                return this.getReasonable(includeBSides);
            }
        }

    },

    resetSongs() {
        rawSongs = groupedSongs = rawSongsWithoutBSides = groupedSongsWithoutBSides = null;
    },

    getTopContenders(includeBSides) {
        return wrap(includeBSides).then(songGroups => {
            return _.sampleSize(songGroups[_.random(2)], 2);
        });
    },

    getClose(includeBSides) {
        return wrap(includeBSides).then(songGroups => {
            const group = _.sample(songGroups);
            return _.sampleSize(group, 2);
        });
    },

    getPolars(includeBSides) {
        return wrap(includeBSides).then(songGroups => {
            const numGroups = songGroups.length;
            const lowGroupChoice = _.sample(songGroups[_.random(numGroups - 3, numGroups - 1)]);
            const highGroupChoice = _.sample(songGroups[_.random(0, 2)]);
            return [lowGroupChoice, highGroupChoice];
        });
    },

    getReasonable(includeBSides) {
        return wrap(includeBSides).then(songGroups => {
            const randomGroupNotBounds = _.random(1, songGroups.length - 2);
            const chosenGroups = songGroups.slice(randomGroupNotBounds - 1, randomGroupNotBounds + 2);
            return _.sampleSize(_.flatten(chosenGroups), 2);
        });
    }

};

export default inf;