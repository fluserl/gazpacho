// TODO: Include validation rules for create that should:
// 1. Check that restaurantId is present in the body and corresponds to an existing restaurant
// 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
// 3. Check that products are available
// 4. Check that all the products belong to the same restaurant

import { check } from 'express-validator'
import { Restaurant, Product } from '../../models/models.js'

const checkRestaurantExists = async (value, { req }) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (restaurant === null) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const runCustomOrderChecks = async (orderItems, { req }) => {
  const productIds = orderItems.map(p => p.productId)
  const products = await Product.findAll({
    where: {
      id: productIds
    },
    include: [{
      model: Restaurant,
      as: 'restaurant'
    }]
  })
  if (products.some(p => !p.availability)) {
    return Promise.reject(new Error('Trying to order unavailable products'))
  } else if (products.length !== productIds.length) {
    return Promise.reject(new Error('The product with does not exist.'))
  }

  const restaurants = products.map(p => p.restaurant.id)
  if (restaurants && new Set(restaurants).size > 1) {
    return Promise.reject(new Error('The products should belong to the same restaurant.'))
  }
  return Promise.resolve()
}

const create = [

  check('address').exists().isString().isLength({ min: 1 }).trim(),
  check('restaurantId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').custom(checkRestaurantExists),
  check('products').exists().isArray().notEmpty().toArray(),
  check('products.*.productId').exists().isInt({ min: 1 }),
  check('products.*.quantity').exists().isInt({ min: 1 }).toInt(),
  check('products').custom(runCustomOrderChecks)
]
// TODO: Include validation rules for update that should:
// 1. Check that restaurantId is NOT present in the body.
// 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
// 3. Check that products are available
// 4. Check that all the products belong to the same restaurant of the originally saved order that is being edited.
// 5. Check that the order is in the 'pending' state.
const update = [
  check('address').exists().isString().isLength({ min: 1 }).trim(),
  check('restaurantId').not().exists(),
  check('products').exists().isArray().notEmpty(),
  check('products.*.productId').exists().isInt(),
  check('products.*.quantity').exists().isInt({ min: 1 }).toInt(),
  check('products').custom(runCustomOrderChecks)
]

export { create, update }
