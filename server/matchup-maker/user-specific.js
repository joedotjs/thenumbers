import db from '../db';
const User = db.model('user');

import redback from 'redback';
import Promise from 'bluebird';
import _ from 'lodash';

import env from '../env';
const redbackClient = redback.createClient(`redis://${env.redis.host}:${env.redis.port}`);

const userQueues = {};
const userWantsBSides = {};

function createSongOrder(songs) { // songs come in ranked order for user

    const songIds = _(songs)
        .map(s => s.id)
        .chunk(_.random(10, 12)) // place songs in groups
        .thru(chunks => { // copy top songs for more votes
            const firstTwo = _.cloneDeep(chunks.slice(0, 2)); // top 2 groups
            const firstFour = _.cloneDeep(chunks.slice(0, 4)); // top 4 groups
            return chunks.concat(firstTwo).concat(firstFour);
        })
        .map(chunk => _.shuffle(chunk)) // take each group and shuffle up
        .flatten()
        .value();

    const pairs = songIds.reduce((acc, song, i) => { // put songs into pairs
        if (i % 2 === 1) {
            _.last(acc).push(song);
        } else {
            acc.push([song]);
        }
        return acc;
    }, []);

    // shuffle pairs and then flatten into single queue
    return _.flatten(_.shuffle(pairs));
}

function shouldGenerateNewQueue(songs, userId, includeBSides) {
    return songs.length < 2 ||
        typeof userWantsBSides[userId] === 'undefined' ||
        userWantsBSides[userId] !== includeBSides;
}

export default function getUserMatchup(userId, includeBSides) {

    let queue = userQueues[userId];

    if (!queue) {
        queue = Promise.promisifyAll(redbackClient.createQueue(`matchupQueue:${userId}`));
        Promise.promisifyAll(queue.list);
        userQueues[userId] = queue;
    }

    return queue.list.valuesAsync()
        .then(songs => {
            if (shouldGenerateNewQueue(songs, userId, includeBSides)) {
                userWantsBSides[userId] = includeBSides;
                return queue.list.trimAsync(0, 0)
                    .then(() => User.getPersonalRankings(userId, includeBSides))
                    .then(songs => {
                        songs = createSongOrder(songs);
                        return queue.enqueueAsync(songs)
                            .then(() => songs);
                    });
            }
            return songs;
        })
        .then(songs => {
            const matchupIds = songs.slice(0, 2).map(Number);
            return Promise.all([
                queue.dequeueAsync(0),
                queue.dequeueAsync(0)
            ]).then(() => matchupIds);
        });
};