import { destroy, get, post, put } from './helpers/ApiRequestsHelper'

function getCustomerOrders () {
  return get('orders')
}

function getOrderDetail (id) {
  return get(`orders/${id}`)
}

function create (data) {
  return post('orders', data)
}

function deleteOrder (id) {
  return destroy(`orders/${id}`)
}

function update (id, data) {
  return put(`orders/${id}`, data)
}

export { getCustomerOrders, getOrderDetail, create, deleteOrder, update }
