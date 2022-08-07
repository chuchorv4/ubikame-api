import httpStatus from 'http-status'
import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../plugins/customError'
import Validator from './validator'

const objectId = require('joi-objectid')(Joi)

export default class Questionary implements Validator {
  
 constructor() { }

  new = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      user: objectId().required(),
      questionOne: Joi.boolean().required(),
      questionTwo: Joi.boolean().required(),
      questionThree: Joi.boolean().required(),
      questionFour: Joi.boolean().required(),
      questionFive: Joi.boolean().required(),
      questionSix: Joi.boolean().required(),
      questionSeven: Joi.boolean().required(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      user: objectId(),
      questionOne: Joi.boolean(),
      questionTwo: Joi.boolean(),
      questionThree: Joi.boolean(),
      questionFour: Joi.boolean(),
      questionFive: Joi.boolean(),
      questionSix: Joi.boolean(),
      questionSeven: Joi.boolean(),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    (error) ? next(new CustomError(error, httpStatus.BAD_REQUEST)) : next()
  }
}