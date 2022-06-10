import { Router } from 'express'
import Uploader from '../controllers/upload'
import Middleware from '../middleware'

const m = new Middleware()

const controller = new Uploader('image', '/public/images','/images')
const router = Router()

router.route('/')
  .post( controller.upload )

export default router