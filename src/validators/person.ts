import httpStatus from 'http-status'
import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../plugins/customError'
import Validator from './validator'

const PasswordComplexity = require('joi-password-complexity')

export default class Person implements Validator {
  
 constructor() { }

  new = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      lastname: Joi.string().required(),
      images: Joi.array(),
      address: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      active: Joi.boolean(),
      password: PasswordComplexity(),
      gender: Joi.string().required(),
      email: Joi.string().required(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    console.log(error);
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      name: Joi.string(),
      lastname: Joi.string(),
      images: Joi.array(),
      address: Joi.string(),
      phoneNumber: Joi.string(),
      active: Joi.boolean(),
      password: PasswordComplexity(),
      gender: Joi.string(),
      email: Joi.string(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    console.log(error);
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
}