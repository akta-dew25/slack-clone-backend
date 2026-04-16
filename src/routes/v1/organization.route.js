import express from 'express'
import createOrgController from '../../controllers/v1/organization.controller.js'

const orgRouter = express.Router()

orgRouter.post("/register",createOrgController)


export default orgRouter