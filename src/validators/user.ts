import httpStatus from 'http-status'
import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../plugins/customError'
import Validator from './validator'

const objectId = require('joi-objectid')(Joi)
const PasswordComplexity = require('joi-password-complexity')

export default class User implements Validator {
  constructor() {
  }

  new = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().required().token().min(4),
      password: PasswordComplexity(),
      role: objectId().required(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
  
  update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().token().min(4),
      password: PasswordComplexity(),
      role: objectId(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
  
  login = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().required().token(),
      password: Joi.string().strip().required()
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
}

