
import Validator from '../validators/user'
import Generic from '../controllers'
import Middleware from '../middleware'
import { UserModel } from '../models/user'
import CRUD from './crud'

const m = new Middleware()
const v = new Validator()

const controller = new Generic(UserModel, ['username','password','role'])
const crud = new CRUD('users', controller, v, [], [m.password])
const router = crud.getRouter()

export default router