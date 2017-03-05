import {Router} from 'express';
import {template} from 'lodash';
import {readFileSync} from 'fs';
import {join} from 'path';
import db from '../../db';

const router = Router();
export default router;

const templateFile = readFileSync(join(__dirname, './share.html')).toString();
const makePage = template(templateFile);

const User = db.model('user');

import checkLoggedIn from '../check-auth';

router.get('/mine', checkLoggedIn, (req, res, next) => {
    res.redirect('/share/' + req.user.id);
});

router.get('/:userId', (req, res, next) => {
    User.getPersonalRankings(req.params.userId, true)
        .then(songs => {
            res.send(
                makePage({songs})
            );
        });
});