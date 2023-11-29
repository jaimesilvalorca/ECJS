import express from 'express';
import {renderAdminPage,updateRole,deleteUser} from '../controller/admin.controller.js';
import authorize from "../middleware/userMiddleware.js"

const userOnly = authorize(['admin'])

const router = express.Router();

router.get('/',userOnly, renderAdminPage);
router.post('/update-role/:userId', updateRole);
router.put('/change-role', updateRole);
router.post('/delete/:userId', deleteUser);
router.delete('/delete/:userId', deleteUser);

export default router;
