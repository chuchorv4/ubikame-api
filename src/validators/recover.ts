import httpStatus from 'http-status'
import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../plugins/customError'
import Validator from './validator'

export default class Recover implements Validator {
  
 constructor() { }

  new = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      tokenFireBase: Joi.string().required(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string(),
      password: Joi.string(),
      tokenFireBase: Joi.string(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
}