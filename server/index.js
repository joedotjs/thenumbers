import http from 'http';

import app from './app';
import db from './db';
import updateRankings from './elo/calculate-cron';

const server = http.createServer();
const PORT = process.env.PORT || 3001;

server.on('request', app);

db.sync()
    .then(() => {
        setInterval(updateRankings, 5 * 60 * 1000);
        server.listen(PORT, function () {
            console.log('Server listening on port', PORT);
        });
    })
    .catch(e => console.error(e.stack));

