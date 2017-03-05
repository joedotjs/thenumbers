import { Router } from 'express';
const router = Router();
export default router;

import matchupMaker from '../matchup-maker';
import bSideRouter from './b-side-preferences';
import checkLoggedIn from './check-auth';

import db from '../db';
const Vote = db.model('vote');
const Song = db.model('song');
const User = db.model('user');

const lastVoteFromUser = {};
router.post('/vote', checkLoggedIn, (req, res, next) => {

    const now = Date.now();

    if (lastVoteFromUser[req.user.id]) {
        if (now - lastVoteFromUser[req.user.id] < 400) {
            lastVoteFromUser[req.user.id] = now;
            return res.status(403).send('Vote slower.');
        }
    }

    lastVoteFromUser[req.user.id] = now;

    let [song1, song2] = req.body.matchup;

    console.log('Vote from ', req.user.reddit_name, [song1, song2]);

    req.user.addVote({
            choice1Id: song1,
            choice2Id: song2,
            chosenId: req.body.chosenId
        })
        .then(() => matchupMaker.getMatchup(req.user.id, req.session.includeBSides))
        .then(matchup => res.send({matchup}))
        .catch(next);

});

router.get('/random', checkLoggedIn, (req, res, next) => {
    matchupMaker.getMatchup(req.user.id, req.session.includeBSides)
        .then(matchup => res.send({
            matchup,
            includeBSides: !!req.session.includeBSides
        }))
        .catch(next);
});

router.get('/rankings', (req, res, next) => {
    Song.getRanked()
        .then(songs => res.send(songs))
        .catch(next);
});

router.get('/rankings/wins', (req, res, next) => {
    Song.rankedByWins()
        .then(songs => songs.filter(s => s.album.title !== 'B-Sides'))
        .then(songs => res.send(songs))
        .catch(next);
});

router.get('/rankings/wins/b-sides', (req, res, next) => {
    Song.rankedByWins()
        .then(songs => songs.filter(s => s.album.title === 'B-Sides'))
        .then(songs => res.send(songs))
        .catch(next);
});

router.get('/rankings/personal', checkLoggedIn, (req, res, next) => {
    User.getPersonalRankings(req.user.id, true)
        .then(results => res.send(results))
        .catch(next);
});

router.get('/undo', checkLoggedIn, (req, res, next) => {
    req.user.undoLastVote()
        .then(lastMatchup => res.send({matchup: lastMatchup}))
        .catch(next);
});

router.use('/b-sides', checkLoggedIn, bSideRouter);
