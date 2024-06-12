import {Router} from "express";
import {registerUser,loginUser,logout,refreshAccessToken,changePassword,getCurrentUser,updateAvatar} from "../controllers/user.controller.js";
import {upload} from '../middleware/multer.js'
import verifyJWT from '../middleware/Auth.js'
import multer from "multer";
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
router.route('/changePassword').patch(verifyJWT,changePassword)
router.route('/getUser').get(verifyJWT,getCurrentUser)
router.route('/updateAvatar').patch(verifyJWT,
    upload.single('avatar'),updateAvatar
)
export default router;