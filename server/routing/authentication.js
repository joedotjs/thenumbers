/* eslint camelcase: 0 */
import session from 'express-session';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import passport from 'passport';
import { Strategy } from 'passport-reddit';

import db from '../db';
const User = db.model('user');

import env from '../env';

import connectRedis from 'connect-redis';
const RedisStore = connectRedis(session);
const redisConfig = env.redis;

const redditAppConfig = {
    clientID: env.reddit.id,
    clientSecret: env.reddit.secret,
    callbackURL: env.reddit.callbackUrl
};

export default function (app) {

    passport.use(new Strategy(redditAppConfig, function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({
                where: {
                    reddit_id: profile.id,
                    reddit_name: profile.name
                }
            })
            .spread(user => done(null, user))
            .catch(done);
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.reddit_id);
    });

    passport.deserializeUser(function (reddit_id, done) {
        User.findOne({ where: { reddit_id } })
            .then(user => done(null, user))
            .catch(done);
    });

    app.use(cookieParser());

    app.use(session({
        store: new RedisStore(redisConfig),
        secret: env.sessionSecret,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (typeof req.session.includeBSides === 'undefined') {
            req.session.includeBSides = true;
        }
        next();
    });

    app.get('/auth/reddit', function (req, res, next) {
        req.session.state = crypto.randomBytes(32).toString('hex');
        passport.authenticate('reddit', {
            state: req.session.state,
            duration: 'permanent'
        })(req, res, next);
    });

    app.get('/auth/reddit/callback', function (req, res, next) {
        // Check for origin via state token
        if (req.query.state === req.session.state) {
            passport.authenticate('reddit', {
                successRedirect: '/',
                failureRedirect: '/login'
            })(req, res, next);
        } else {
            next(new Error(403));
        }
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

}