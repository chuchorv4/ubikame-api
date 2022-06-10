import Validator from '../validators/notification'
import Generic from '../controllers'
import { NotificationModel } from '../models/notification'
import { NextFunction, Request, Response } from 'express'
import CRUD from './crud'

const v = new Validator()

const controller = new Generic(NotificationModel, ['user','location','message','audio', 'date'])
const crud = new CRUD('notifications', controller, v, [], [(req: Request, res: Response, next: NextFunction) => {
  req.body.date = Date.now()
  next()
} ])
const router = crud.getRouter()

export default router