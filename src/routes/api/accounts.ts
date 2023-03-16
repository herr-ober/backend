import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../../common/util/asyncHandlerDecorator'
import accountsController from '../controllers/accountsController'

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
      uuid: Joi.string().required(),
      updates: Joi.object()
        .keys({
          email: Joi.string(),
          name: Joi.string(),
          password: Joi.string()
        })
        .required()
    })
  }),
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
  asyncHandlerDecorator(accountsController.deleteAccount)
)

export default router
