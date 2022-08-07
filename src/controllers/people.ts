import { Request, Response, NextFunction } from 'express'
import { UNAUTHORIZED, NOT_FOUND, BAD_REQUEST } from 'http-status'
import Generic from '.'
import CustomError from '../plugins/customError'
import { messaging } from 'firebase-admin'


export default class People extends Generic {
  update = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req != 'undefined' && typeof req.user != 'undefined') {
      return next(new CustomError({name:'invalid_user', message:'Invalid user.'}, UNAUTHORIZED)) 
    }
    await this.Model.findOne({ _id : req.params.id })
      .then(async (value) => {
        if (!value) return next(new CustomError({ name: 'not_found', message: 'The given ID was not found.' }, NOT_FOUND))
        Object.assign(value, req.body)
        await value.save()
          .then(value => {
            if (typeof req.body.active != 'undefined' && req.body.active) {
              console.log("validando usuario")
              messaging().sendToDevice(value.tokenFireBase, {
                notification: {
                  title: "Registro exitoso",
                  body: "Su cuenta a sido activada, ya puedes usar tu aplicacion",
                }
              })
            }
            res.send(value)
          })
          .catch(error => next(new CustomError(error, BAD_REQUEST)))
      })
      .catch(error => next(new CustomError(error, BAD_REQUEST)))
  };
}