import Validator from '../validators/role'
import Generic from '../controllers'
import { RoleModel } from '../models/role'
import CRUD from './crud'

const v = new Validator()

const controller = new Generic(RoleModel, ['name','permissions'])
const crud = new CRUD('roles', controller, v)
const router = crud.getRouter()

export default router