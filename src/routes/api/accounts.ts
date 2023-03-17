import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../../common/util/asyncHandlerDecorator'
import accountsController from '../controllers/accountsController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router: Router = Router()

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required()
    })
  }),
  asyncHandlerDecorator(accountsController.createAccount)
)

router.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }),
  asyncHandlerDecorator(accountsController.authPassword)
)

router.patch(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        // Require Authorization header
        authorization: Joi.string().required()
      })
      // Allow unknown headers
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      updates: Joi.object()
        .keys({
          email: Joi.string(),
          name: Joi.string(),
          password: Joi.string()
        })
        .required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(accountsController.updateAccount)
)

router.delete(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        // Require Authorization header
        authorization: Joi.string().required()
      })
      // Allow unknown headers
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      uuid: Joi.string().required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(accountsController.deleteAccount)
)

export default router
