import express from 'express';
import userPremium from '../middleware/userPremium.js';
import {getPremiumUserProfile,cambioRoleUsuario,uploadDocuments, updateUserToPremium,getAllUsers,deleteInactiveUsers} from '../controller/users.controller.js'
import multer from 'multer';


const router = express.Router()
const upload = multer({ dest: 'uploads/' });



router.use(userPremium)

router.get('/profile', getPremiumUserProfile)
router.put('/premium:email',cambioRoleUsuario)
router.post('/:uid/documents', upload.array('documents'), uploadDocuments);
router.put('/premium/:uid', updateUserToPremium);
router.get('/:uid', getAllUsers);
router.delete('/', deleteInactiveUsers);




export default router;