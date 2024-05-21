import { get } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('restaurants') // Antes estaba users/myrestaurants pero esa ruta no existe
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

export { getAll, getDetail, getRestaurantCategories }
