import Validator from '../validators/person'
import People from '../controllers/people'
import { PersonModel } from '../models/person'
import { NextFunction, Request, Response } from 'express'
import CRUD from './crud'
import multer from 'multer'
import path from 'path'
import Middleware from '../middleware'
import crypto from 'crypto'

const m = new Middleware()
const v = new Validator()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/public/images/Personas/'))
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname.split('.')
    let fileExt = fileName[fileName.length - 1]
    let date = Date.now()
    let random = (Math.random() * 10000).toFixed().padStart(4,'0')
    let newname = crypto.createHash('sha1').update(date + random).digest('hex')

    cb(null, `${ newname }.${fileExt}`)
  }
})
const instance = multer({ storage: storage })

const controller = new People(PersonModel, [ 'name', 'lastname', 'active', 'images', 'address', 'phoneNumber', 'password', 'gender', 'email', 'questions', 'tokenFireBase' ])
const crud = new CRUD('people', controller, v, [ instance.array('img'), (req: Request, res: Response, next: NextFunction) => {
  if (typeof req.files != 'undefined') {
    let temp : Array<any> = []
    for (let file in req.files) {
      temp.push('/v1/images/Personas/'+req.files[file].filename)
    }
    req.body.images = temp
  }
  next()
} ])
const router = crud.getRouter()

export default router