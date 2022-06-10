import { Router, NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import Generic from '../../controllers'
import Aux from '../../controllers/aux'
import { PersonModel } from '../../models/person'
import Notification from '../../validators/notification'
import Person from '../../validators/person'
import Report from '../../validators/report'
import Status from '../../validators/status'
import crypto from 'crypto'
import Middleware from '../../middleware'

const vNotification = new Notification()
const vPerson = new Person()
const vReport = new Report()
const vStatus = new Status()
const cAux = new Aux()
const m = new Middleware();
const controllerMain = new Generic(PersonModel, [ 'name', 'lastname', 'active', 'images', 'address', 'phoneNumber', 'password', 'gender', 'email' ])
const router = Router()

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

router.route('/notification')
  .post([vNotification.new, (req: Request, res: Response, next: NextFunction) => {
    req.body.date = Date.now()
    next()
  }], cAux.notification)

router.route('/report')
  .post([vReport.new, (req: Request, res: Response, next: NextFunction) => {
    req.body.date = Date.now()
    next()
  }], cAux.report)
  
router.route('/register')
  .post([ instance.array('ine'), (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.files != 'undefined') {
      let temp : Array<any> = []
      for (let file in req.files) {
        temp.push('/v1/images/Personas/'+req.files[file].filename)
      }
      req.body.images = temp
    }
    next()
  }, vPerson.new, m.password], controllerMain.create)
  
router.route('/status')
  .post([vStatus.new], cAux.status)

export default router