import { UNAUTHORIZED, BAD_REQUEST } from 'http-status'
import CustomError from '../plugins/customError'
import { NextFunction, Request, Response } from 'express'
import { PersonModel } from '../models/person'
import { NotificationModel } from '../models/notification'
import { ReportModel } from '../models/report'
import { QuestionaryModel } from '../models/questionary'

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
          io.emit( ReportModel.modelName , { data: value })
          res.send({ user: value.user, message: value.message, date: value.date })
        })
        .catch(error => next(new CustomError(error, BAD_REQUEST)))
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  status = async (req: Request, res: Response, next: NextFunction) => {
    PersonModel.findOne({ _id: req.body.user })
      .then(async user => {
        if (!user) return next(new CustomError({ name: 'invalid_user', message: 'Invalid user.' }, UNAUTHORIZED))
        res.send({ status: user.active })
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }
  // recover account from app
  recover = async (req: Request, res: Response, next: NextFunction) => {
    PersonModel.findOne({ email: req.body.email })
    .then(async user => {
      if (!user) return next(new CustomError({name:'invalid_parameter', message:'Invalid name and password.'}, UNAUTHORIZED))
      if (user.password == req.body.password) {
        // tokenFireBase update
        Object.assign(user, { tokenFireBase: req.body.tokenFireBase })
        await user.save()
          .then(u => {
            const resp = (({questions, images, ... rest}) => ({... rest}))(u.toJSON())
            res.send(resp)
          })
          .catch(error => next(new CustomError(error, BAD_REQUEST)))
      } else {
        return next(new CustomError({name:'invalid_parameter', message:'Invalid name and password.'}, UNAUTHORIZED))
      }
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  checkEmail = async (req: Request, res: Response, next: NextFunction) => {
    PersonModel.findOne({ email: req.body.email })
    .then(async user => {
      if (user) {
        res.send({ success: true })
      } else {
        res.send({ success: false })
      }
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

  questionary = async (req: Request, res: Response, next: NextFunction) => {
    PersonModel.findOne({ _id: req.body.user })
    .then(async user => {
      if (!user) return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED))

      const attributes = ['questionOne', 'questionTwo', 'questionThree', 'questionFour', 'questionFive', 'questionSix', 'questionSeven']
      let input = attributes.reduce((obj, key) => {
        if (req.body[key]) obj[key] = req.body[key]
        return obj
      }, {})

      let obj = new QuestionaryModel(input)

      await obj.save()
        .then(async value => {
           Object.assign(user, { questions: value._id })
            await user.save()
              .then(v => {
                const io = req.app.get('socketio')
                io.emit( PersonModel.modelName , { data: user })
                res.send(v)
              })
            .catch(error => next(new CustomError(error, BAD_REQUEST)))
        })
        .catch(error => next(new CustomError(error, BAD_REQUEST)))
    })
    .catch(error => next(new CustomError(error, BAD_REQUEST)))
  }

}