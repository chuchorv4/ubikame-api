import Validator from '../validators/report'
import Generic from '../controllers'
import { ReportModel } from '../models/report'
import { NextFunction, Request, Response } from 'express'
import CRUD from './crud'

const v = new Validator()

const controller = new Generic(ReportModel, ['user','message','audio', 'date'])
const crud = new CRUD('reports', controller, v, [], [(req: Request, res: Response, next: NextFunction) => {
  req.body.date = Date.now()
  next()
} ])
const router = crud.getRouter()

export default router