import { Router } from 'express'
import auth from './auth'
import images from './images'
import users from './users'
import roles from './roles'
import people from './people'
import notifications from './notifications'
import reports from './reports'
import aux from './aux'

const router = Router()

router.use('/auth', auth)
router.use('/images', images)
router.use('/users', users)
router.use('/roles', roles)
router.use('/people', people)
router.use('/notifications', notifications)
router.use('/reports', reports)
router.use('/public', aux)

export default router