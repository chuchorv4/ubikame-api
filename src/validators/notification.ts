import httpStatus from 'http-status'
import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../plugins/customError'
import Validator from './validator'

const objectId = require('joi-objectid')(Joi)

export default class Notification implements Validator {
  
 constructor() { }

  new = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      user: objectId().required(),
      location: Joi.string().required(),
      message: Joi.string(),
      audio: Joi.string(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      user: objectId(),
      location: Joi.string(),
      message: Joi.string(),
      audio: Joi.string(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
}