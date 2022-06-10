import { Router } from 'express'
import Generic from '../controllers'
import Validator from '../validators/validator'
import Middleware from '../middleware'

const m = new Middleware()
const guard = require('express-jwt-permissions')({
  requestProperty: 'auth'
})

export default class CRUD {
  private router: Router
  constructor(routeName: string, controller: Generic, validator: Validator, preValidation: Array<any> = [], postValidation: Array<any> = []) {
    this.router = Router()

    this.router.route('/')
      .get([ guard.check(`${routeName}:read`) ], controller.all)
      .post([ guard.check(`${routeName}:read`) ], controller.all)

    this.router.route('/count')
      .get([ guard.check(`${routeName}:read`) ], controller.count)

    this.router.route('/new')
      .post([ guard.check(`${routeName}:write`), preValidation, validator.new, postValidation ], controller.create)

    this.router.route('/:id')
      .get(controller.byId)
      .put([ guard.check(`${routeName}:update`), preValidation, validator.update, postValidation ], controller.update)
      .delete( guard.check(`${routeName}:delete`), controller.delete)

  }

  getRouter() {
    return this.router
  }
}
