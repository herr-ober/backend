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
        authorization: Joi.string().required()
      })
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
        authorization: Joi.string().required()
      })
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
        authorization: Joi.string().required()
      })
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
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.deleteEvent)
)

router.post(
  '/:eventUuid/staff',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      role: Joi.string().required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.addStaff)
)

router.get(
  '/:eventUuid/staff',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.getStaff)
)

router.patch(
  '/staff',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      uuid: Joi.string().required(),
      updates: Joi.object()
        .keys({
          name: Joi.string(),
          role: Joi.string()
        })
        .required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.updateStaff)
)

router.delete(
  '/staff',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      uuid: Joi.string().required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.removeStaff)
)

export default router
