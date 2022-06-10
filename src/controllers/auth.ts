import { UNAUTHORIZED, BAD_REQUEST, NO_CONTENT } from 'http-status'
import CustomError from '../plugins/customError'
import { sign, SignOptions } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/user'
import { RoleModel } from '../models/role'

export default class Auth {
  constructor() {}
  
  login = async (req: Request, res: Response, next: NextFunction) => {
    UserModel.findOne(req.body)
    .then(async user => {
      if (!user) return next(new CustomError({name:'invalid_parameter', message:'Invalid name and password.'}, UNAUTHORIZED))
      RoleModel.findById(user.role)
        .then( role => {
          if (!role) return next(new CustomError({name:'invalid_parameter', message:'Invalid role.'}, UNAUTHORIZED))
          
          let userJSON = user.toJSON()

          let data = { ...userJSON, permissions: role['permissions']}

          const signInOptions: SignOptions = {
            algorithm: 'HS256',
            expiresIn: '1h'
          }

          const token = sign(data, process.env.SECRET || '', signInOptions)

          res.send({token: token})
        })
        .catch(error => next(new CustomError(error, BAD_REQUEST)))
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  user = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req['auth'] == 'undefined') {
      return next(new CustomError({name:'invalid_parameter', message:'Invalid token.'}, UNAUTHORIZED))
    }
    res.send({user: req['auth']})
  }

  logout = async (req: Request, res: Response) => {
    res.status( NO_CONTENT ).send({ status: 'OK' })
  }
}
