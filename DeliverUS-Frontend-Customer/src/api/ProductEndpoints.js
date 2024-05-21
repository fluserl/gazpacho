import { get } from './helpers/ApiRequestsHelper'

function getProductCategories () {
  return get('productCategories')
}

function getPopular () {
  return get('/products/popular')
}

export { getProductCategories, getPopular }
