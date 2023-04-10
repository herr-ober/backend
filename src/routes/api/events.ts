import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import asyncHandlerDecorator from '../../common/util/asyncHandlerDecorator'
import eventsController from '../controllers/eventsController'
import { isAuthenticated } from '../middlewares/authMiddleware'
import { TokenIssuer } from '../../common/enums'

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
router.post(
  '/:eventUuid/staff/login',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      code: Joi.string().required()
    })
  }),
  asyncHandlerDecorator(eventsController.authStaffCode)
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

router.get(
  '/products/categories',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.getCategories)
)

router.post(
  '/:eventUuid/products',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      categoryUuid: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.createProduct)
)

router.get(
  '/:eventUuid/products',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      category: Joi.string()
    }),
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.getProducts)
)

router.get(
  '/products/:productUuid',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.getProduct)
)

router.delete(
  '/products',
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
  asyncHandlerDecorator(eventsController.deleteProduct)
)

router.post(
  '/:eventUuid/tables',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      tableNumber: Joi.number().required()
    })
  }),
  async (req, res, next) => {
    await isAuthenticated([TokenIssuer.KITCHEN], req, res, next)
  },
  asyncHandlerDecorator(eventsController.addTable)
)

router.post(
  '/:eventUuid/tables/bulk',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true),
    [Segments.BODY]: Joi.object().keys({
      tableNumber: Joi.number().required()
    })
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.addMultipleTables)
)

router.get(
  '/:eventUuid/tables',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        authorization: Joi.string().required()
      })
      .unknown(true)
  }),
  isAuthenticated,
  asyncHandlerDecorator(eventsController.getTables)
)

router.delete(
  '/:eventUuid/tables',
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
  asyncHandlerDecorator(eventsController.removeTable)
)

export default router
