import {Router} from "express";
import {registerUser,loginUser,logout,refreshAccessToken} from "../controllers/user.controller.js";
import {upload} from '../middleware/multer.js'
import verifyJWT from '../middleware/Auth.js'
const router=Router();
router.route('/register').post(
   upload.fields(
    [
        {
            name:'avatar'
        },
        {
            name:'coverImage'
        }
    ]
   )
    ,registerUser);


router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT,logout);
router.route('/refreshAccessToken').post(refreshAccessToken);

export default router;