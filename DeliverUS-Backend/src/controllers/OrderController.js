// eslint-disable-next-line no-unused-vars
import { Order, Product, Restaurant, User, sequelizeSession } from '../models/models.js'
import moment from 'moment'
import { Op } from 'sequelize'
const generateFilterWhereClauses = function (req) {
  const filterWhereClauses = []
  if (req.query.status) {
    switch (req.query.status) {
      case 'pending':
        filterWhereClauses.push({
          startedAt: null
        })
        break
      case 'in process':
        filterWhereClauses.push({
          [Op.and]: [
            {
              startedAt: {
                [Op.ne]: null
              }
            },
            { sentAt: null },
            { deliveredAt: null }
          ]
        })
        break
      case 'sent':
        filterWhereClauses.push({
          [Op.and]: [
            {
              sentAt: {
                [Op.ne]: null
              }
            },
            { deliveredAt: null }
          ]
        })
        break
      case 'delivered':
        filterWhereClauses.push({
          sentAt: {
            [Op.ne]: null
          }
        })
        break
    }
  }
  if (req.query.from) {
    const date = moment(req.query.from, 'YYYY-MM-DD', true)
    filterWhereClauses.push({
      createdAt: {
        [Op.gte]: date
      }
    })
  }
  if (req.query.to) {
    const date = moment(req.query.to, 'YYYY-MM-DD', true)
    filterWhereClauses.push({
      createdAt: {
        [Op.lte]: date.add(1, 'days') // FIXME: se pasa al siguiente día a las 00:00
      }
    })
  }
  return filterWhereClauses
}

// Returns :restaurantId orders
const indexRestaurant = async function (req, res) {
  const whereClauses = generateFilterWhereClauses(req)
  whereClauses.push({
    restaurantId: req.params.restaurantId
  })
  try {
    const orders = await Order.findAll({
      where: whereClauses,
      include: {
        model: Product,
        as: 'products'
      }
    })
    res.json(orders)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the indexCustomer function that queries orders from current logged-in customer and send them back.
// Orders have to include products that belongs to each order and restaurant details
// sort them by createdAt date, desc.
const indexCustomer = async function (req, res) {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'email', 'avatar', 'userType']
      },
      {
        model: Product,
        as: 'products'
      }],
      order: [
        ['createdAt', 'DESC']
      ]
    })
    res.json(orders)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the create function that receives a new order and stores it in the database.
// Take into account that:
// 1. If price is greater than 10€, shipping costs have to be 0.
// 2. If price is less or equals to 10€, shipping costs have to be restaurant default shipping costs and have to be added to the order total price
// 3. In order to save the order and related products, start a transaction, store the order, store each product linea and commit the transaction
// 4. If an exception is raised, catch it and rollback the transaction

const create = async (req, res) => {
  // Use sequelizeSession to start a transaction
  try {
    const orderItems = req.body.products
    const products = await Product.findAll({
      where: {
        id: orderItems.map(p => p.productId)
      }
    })
    let totalPrice = 0
    orderItems.forEach(orderItem => {
      const product = products.find(p => p.id === orderItem.productId)
      if (product) totalPrice += product.price * orderItem.quantity
      orderItem.unityPrice = product.price
    })

    const restaurant = await Restaurant.findByPk(
      req.body.restaurantId
    )

    const shippingCosts = totalPrice > 10 ? 0 : restaurant.shippingCosts
    totalPrice += shippingCosts

    await sequelizeSession.transaction(async t => {
      const order = await Order.create({
        address: req.body.address,
        restaurantId: req.body.restaurantId,
        shippingCosts,
        userId: req.user.id,
        price: totalPrice,
        deliveredAt: req.body.deliveredAt,
        sentAt: req.body.sentAt,
        startedAt: req.body.startedAt
      },
      {
        transaction: t
      })
      await Promise.all(orderItems.map(async item => {
        await order.addProduct(item.productId,
          {
            through: { quantity: item.quantity, unityPrice: item.unityPrice, ProductId: item.productId },
            transaction: t
          })
      }))
      await order.reload({
        include: [
          {
            model: Product,
            as: 'products'
          }],
        transaction: t
      })
      res.status(200).send(order)
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the update function that receives a modified order and persists it in the database.
// Take into account that:
// 1. If price is greater than 10€, shipping costs have to be 0.
// 2. If price is less or equals to 10€, shipping costs have to be restaurant default shipping costs and have to be added to the order total price
// 3. In order to save the updated order and updated products, start a transaction, update the order, remove the old related OrderProducts and store the new product lines, and commit the transaction
// 4. If an exception is raised, catch it and rollback the transaction
const update = async function (req, res) {
  // Use sequelizeSession to start a transaction
  try {
    const orderItems = req.body.products
    const order = await Order.findByPk(req.params.orderId,
      {
        include: [{
          model: Restaurant,
          as: 'restaurant'
        }]
      })

    const products = await Product.findAll({
      where: {
        id: req.body.products.map(p => p.productId)
      }
    })
    let totalPrice = 0
    orderItems.forEach(orderItem => {
      const product = products.find(p => p.id === orderItem.productId)
      if (product) totalPrice += product.price * orderItem.quantity
      orderItem.unityPrice = product.price
    })

    const restaurant = order.restaurant

    const shippingCosts = totalPrice > 10 ? 0 : restaurant.shippingCosts
    totalPrice += shippingCosts

    order.shippingCosts = shippingCosts
    order.address = req.body.address
    order.price = totalPrice
    order.deliveredAt = req.body.deliveredAt
    order.sentAt = req.body.sentAt
    order.startedAt = req.body.startedAt

    await sequelizeSession.transaction(async t => {
      await order.save({ transaction: t })
      await order.setProducts([], { transaction: t })
      await Promise.all(orderItems.map(async item => {
        await order.addProduct(item.productId,
          {
            through: { quantity: item.quantity, unityPrice: item.unityPrice, ProductId: item.productId },
            transaction: t
          })
      }))
      await order.reload({
        include: [
          {
            model: Product,
            as: 'products'
          }],
        transaction: t
      })
      res.status(200).send(order)
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: Implement the destroy function that receives an orderId as path param and removes the associated order from the database.
// Take into account that:
// 1. The migration include the "ON DELETE CASCADE" directive so OrderProducts related to this order will be automatically removed.
const destroy = async function (req, res) {
  try {
    const orderId = req.params.orderId
    // Use sequelizeSession to start a transaction
    await sequelizeSession.transaction(async t => {
      const order = await Order.findByPk(orderId, { transaction: t })
      if (!order) {
        throw new Error('Orden no encontrada')
      }
      // Borra la order
      await order.destroy({ transaction: t })
      res.status(200).send('Orden borrada')
    })
  } catch (err) {
    res.status(500).send('Error al borrar la orden')
  }
}

const confirm = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.startedAt = new Date()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

const send = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.sentAt = new Date()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

const deliver = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId)
    order.deliveredAt = new Date()
    const updatedOrder = await order.save()
    const restaurant = await Restaurant.findByPk(order.restaurantId)
    const averageServiceTime = await restaurant.getAverageServiceTime()
    await Restaurant.update({ averageServiceMinutes: averageServiceTime }, { where: { id: order.restaurantId } })
    res.json(updatedOrder)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId']
      },
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'email', 'avatar', 'userType']
      },
      {
        model: Product,
        as: 'products'
      }]
    })
    res.json(order)
  } catch (err) {
    res.status(500).send(err)
  }
}

const analytics = async function (req, res) {
  const yesterdayZeroHours = moment().subtract(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  const todayZeroHours = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  try {
    const numYesterdayOrders = await Order.count({
      where:
      {
        createdAt: {
          [Op.lt]: todayZeroHours,
          [Op.gte]: yesterdayZeroHours
        },
        restaurantId: req.params.restaurantId
      }
    })
    const numPendingOrders = await Order.count({
      where:
      {
        startedAt: null,
        restaurantId: req.params.restaurantId
      }
    })
    const numDeliveredTodayOrders = await Order.count({
      where:
      {
        deliveredAt: { [Op.gte]: todayZeroHours },
        restaurantId: req.params.restaurantId
      }
    })

    const invoicedToday = await Order.sum(
      'price',
      {
        where:
        {
          createdAt: { [Op.gte]: todayZeroHours }, // FIXME: Created or confirmed?
          restaurantId: req.params.restaurantId
        }
      })
    res.json({
      restaurantId: req.params.restaurantId,
      numYesterdayOrders,
      numPendingOrders,
      numDeliveredTodayOrders,
      invoicedToday
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

const OrderController = {
  indexRestaurant,
  indexCustomer,
  create,
  update,
  destroy,
  confirm,
  send,
  deliver,
  show,
  analytics
}
export default OrderController
