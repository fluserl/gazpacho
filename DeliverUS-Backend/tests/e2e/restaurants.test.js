import dotenv from 'dotenv'
import request from 'supertest'
import { checkValidDate } from './utils/date'
import { getApp, shutdownApp } from './utils/testApp'
dotenv.config()

const _checkRestaurantProperties = (restaurant) => {
  expect(restaurant.name).toBeDefined()
  expect(typeof restaurant.name).toBe('string')
  expect(restaurant.address).toBeDefined()
  expect(typeof restaurant.address).toBe('string')
  expect(restaurant.postalCode).toBeDefined()
  expect(typeof restaurant.postalCode).toBe('string')
  expect(restaurant.shippingCosts).toBeDefined()
  expect(typeof restaurant.shippingCosts).toBe('number')
  expect(restaurant.restaurantCategoryId).toBeDefined()
  expect(Number.isInteger(restaurant.restaurantCategoryId)).toBeTruthy()
  expect(restaurant.createdAt).toBeDefined()
  expect(checkValidDate(restaurant.createdAt)).toBeTruthy()
  expect(restaurant.updatedAt).toBeDefined()
  expect(checkValidDate(restaurant.updatedAt)).toBeTruthy()
  if (restaurant.description !== null) { expect(typeof restaurant.description).toBe('string') }
  if (restaurant.url !== null) { expect(typeof restaurant.url).toBe('string') }
  if (restaurant.averageServiceMinutes !== null) { expect(typeof restaurant.averageServiceMinutes).toBe('number') }
  if (restaurant.email !== null) { expect(typeof restaurant.email).toBe('string') }
  if (restaurant.phone !== null) { expect(typeof restaurant.phone).toBe('string') }
  if (restaurant.logo !== null) { expect(typeof restaurant.logo).toBe('string') }
  if (restaurant.heroImage !== null) { expect(typeof restaurant.heroImage).toBe('string') }
  expect(restaurant.status).toBeDefined()
  expect(['online', 'offline', 'closed', 'temporarily closed']).toContain(restaurant.status)
}

describe('Get all restaurants', () => {
  let restaurants, app
  beforeAll(async () => {
    app = await getApp()
  })
  it('There must be more than one restaurant', async () => {
    const response = await request(app).get('/restaurants').send()
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).not.toHaveLength(0)
    restaurants = response.body
  })
  it('All restaurants must have an id', async () => {
    expect(restaurants.every(restaurant => restaurant.id !== undefined)).toBe(true)
  })
  it('All restaurants must have a restaurant category', async () => {
    expect(restaurants.every(restaurant => restaurant.restaurantCategory !== undefined)).toBe(true)
  })
  // eslint-disable-next-line jest/expect-expect
  it('All restaurants properties must be correctly defined', async () => {
    restaurants.forEach(restaurant => _checkRestaurantProperties(restaurant))
  })
  afterAll(async () => {
    await shutdownApp()
  })
})
