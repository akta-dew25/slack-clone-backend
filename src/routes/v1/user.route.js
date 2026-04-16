import express from 'express'
import createUserController from '../../controllers/v1/user.controller.js'

const userRouter = express.Router()

userRouter.post("/register",createUserController)


export default userRouter