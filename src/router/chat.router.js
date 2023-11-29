import { Router } from "express"
import { renderChatPage } from "../controller/chat.controller.js"
import authorize from "../middleware/userMiddleware.js"


const router = Router()
const userOnly = authorize(['user'])

router.get('/',userOnly,renderChatPage)

// router.get("/", (req, res) => {
//     res.render("chat", {})
// })

export default router