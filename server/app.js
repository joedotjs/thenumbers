import express from 'express';
import { json } from 'body-parser';
import { join } from 'path';
import serveFavicon from 'serve-favicon';

const app = express();
export default app;

import attachWebpack from './routing/webpack';
if (process.env.NODE_ENV !== 'production') {
    attachWebpack(app);
}

app.use(serveFavicon(join(__dirname, './favicon.ico')));
app.use(express.static(join(__dirname, '../public')));
app.use(json());

import configureAuth from './routing/authentication';
configureAuth(app);

import apiRouter from './routing/api';
import shareRouter from './routing/share';
app.use('/api', apiRouter);
app.use('/share', shareRouter);

app.get('/*', function (req, res) {
    res.sendFile(join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('There was a problem with the server. Sorry!');
});