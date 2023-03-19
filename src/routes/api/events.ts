import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../../common/util/asyncHandlerDecorator'
import eventsController from '../controllers/eventsController'
import { isAuthenticated } from '../middlewares/authMiddleware'

const router: Router = Router()

router.post(
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
      name: Joi.string().required(),
      location: Joi.string().required(),
      date: Joi.date().required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.createEvent)
)

router.get(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        // Require Authorization header
        authorization: Joi.string().required()
      })
      // Allow unknown headers
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.getEvent)
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
          name: Joi.string(),
          location: Joi.string(),
          date: Joi.date()
        })
        .required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.updateEvent)
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
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.deleteEvent)
)

export default router
