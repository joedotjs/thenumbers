import db from './_db';
import Sequelize from 'sequelize';
import Promise from 'bluebird';
import _ from 'lodash';
import calculateNewRankings from '../elo';

const Vote = db.model('vote');
const Song = db.model('song');

const User = db.define('user', {
    reddit_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reddit_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    classMethods: {
        getPersonalRankings: function (userId, includeBSides) {

            const gettingSongs = Song.findAll()
                .then(songs => {
                    songs.forEach(s => { s.rating = 1500 });
                    return songs;
                });

            const gettingUserVotes = Vote.findAll({
                include: [
                    {model: Song, as: 'chosen'},
                    {model: Song, as: 'choice1'},
                    {model: Song, as: 'choice2'}
                ],
                where: {
                    voterId: userId
                }
            });

            return Promise.all([
                    gettingUserVotes,
                    gettingSongs
                ])
                .spread((votes, songs) => {

                    if (!includeBSides) {
                        songs = songs.filter(s => s.album.title !== 'B-Sides');
                    }

                    if (votes.length < 50) return _.shuffle(songs);

                    const keyedSongs = _.keyBy(songs, 'id');

                    votes.forEach(v => {

                        const [song1, song2] = [keyedSongs[v.choice1Id], keyedSongs[v.choice2Id]];

                        if (!song1 || !song2) return;

                        const newRatings = calculateNewRankings(
                            song1.rating,
                            song2.rating,
                            v.chosenId === song1.id
                        );

                        song1.rating = newRatings[0];
                        song2.rating = newRatings[1];

                    });

                    return _.reverse(_.sortBy(songs, 'rating'));

                });

        }
    },
    instanceMethods: {
        undoLastVote() {
            return Vote.findOne({
                where: { voterId: this.id },
                order: 'id DESC'
            })
            .then(vote => {
                return Promise.all([
                    Song.findById(vote.choice1Id),
                    Song.findById(vote.choice2Id),
                    vote.destroy()
                ]);
            })
            .spread((song1, song2) => [song1, song2]);
        },
        addVote(info) {
            info.voterId = this.id;
            return Vote.create(info);
        }
    }
});

export default User;