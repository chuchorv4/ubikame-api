import { UNAUTHORIZED, BAD_REQUEST } from 'http-status'
import CustomError from '../plugins/customError'
import { NextFunction, Request, Response } from 'express'
import { PersonModel } from '../models/person'
import { NotificationModel } from '../models/notification'
import { ReportModel } from '../models/report'

export default class Aux {
  constructor() {}
  
  notification = async (req: Request, res: Response, next: NextFunction) => {
    PersonModel.findOne({ _id: req.body.user })
    .then(async user => {
      if (!user) return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED))
      const attributes = ['user','location','message','audio', 'date']
      let input = attributes.reduce((obj, key) => {
        if (req.body[key]) obj[key] = req.body[key]
        return obj
      }, {})

      let obj = new NotificationModel(input)

      await obj.save()
        .then(value => {
          const io = req.app.get('socketio')
          io.emit( NotificationModel.modelName , { data: value })
          res.send({ user: value.user, location: value.location, date: value.date })
        })
        .catch(error => next(new CustomError(error, BAD_REQUEST)))
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  report = async (req: Request, res: Response, next: NextFunction) => {
    PersonModel.findOne({ _id: req.body.user })
    .then(async user => {
      if (!user) return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED))
      const attributes = ['user','message','message','audio', 'date']
      let input = attributes.reduce((obj, key) => {
        if (req.body[key]) obj[key] = req.body[key]
        return obj
      }, {})

      let obj = new ReportModel(input)

      await obj.save()
        .then(value => {
          const io = req.app.get('socketio')
          io.emit( NotificationModel.modelName , { data: value })
          res.send({ user: value.user, message: value.message, date: value.date })
        })
        .catch(error => next(new CustomError(error, BAD_REQUEST)))
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  status = async (req: Request, res: Response, next: NextFunction) => {
    PersonModel.findOne({ _id: req.body.user })
    .then(async user => {
      if (!user) return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED))
      res.send({ status: user.active })
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

}