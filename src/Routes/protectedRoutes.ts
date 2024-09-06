import { Router } from 'express';
import passport from 'passport';
import { checkAuth } from '../Middleware/checkAuth';
import { getExperiment } from '../Controllers/Experiment';
import { getListUser, getSessions } from '../Controllers/Users';

const router = Router();

// Add passport middleware for JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// experimenting
// router.post("/exp", reportsMovingAveragePoPriceV2)

// router.get('/get-session', checkAuth(), (req, res) => {
//     res.json(req.user);
// });
router.get('/get-session', checkAuth(), getSessions);


// users
router.post("/users/list", getListUser)

// router.post("/report/moving-avg", reportsMovingAveragePoPriceV2);
// router.post("/report/moving-avg", reportsMovingAveragePriceV3);

export default router;