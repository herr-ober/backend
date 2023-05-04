import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../../common/util/asyncHandlerDecorator'
import accountsController from '../controllers/accountsController'
import { isAuthenticated } from '../middlewares/authMiddleware'
import { TokenIssuer } from '../../common/enums'

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

router.get(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  async (req, res, next) => {
    await isAuthenticated([TokenIssuer.ACCOUNT], req, res, next)
  },
  asyncHandlerDecorator(accountsController.getAccount)
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
        authorization: Joi.string().required()
      })
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      updates: Joi.object()
        .keys({
          email: Joi.string().email().optional(),
          name: Joi.string().optional(),
          password: Joi.string().optional()
        })
        .required()
    })
  }),
  async (req, res, next) => {
    await isAuthenticated([TokenIssuer.ACCOUNT], req, res, next)
  },
  asyncHandlerDecorator(accountsController.updateAccount)
)

router.delete(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  async (req, res, next) => {
    await isAuthenticated([TokenIssuer.ACCOUNT], req, res, next)
  },
  asyncHandlerDecorator(accountsController.deleteAccount)
)

export default router
