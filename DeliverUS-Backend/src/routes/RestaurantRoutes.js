import RestaurantController from '../controllers/RestaurantController.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants')
    .get(
      RestaurantController.index)
}

export default loadFileRoutes
