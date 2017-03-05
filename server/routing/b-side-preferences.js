import {Router} from 'express';
const router = Router();
export default router;

router.put('/', (req, res, next) => {
    req.session.includeBSides = req.body.include;
    res.sendStatus(204);
});