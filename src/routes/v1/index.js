import express from 'express'
import orgRouter from './organization.route.js'
import userRouter from './user.route.js'

const router = express.Router()

router.use("/organization",orgRouter)
router.use('/user',userRouter)

export default router