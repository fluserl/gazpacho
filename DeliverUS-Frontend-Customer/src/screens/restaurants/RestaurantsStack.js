import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import RestaurantDetailScreen from './RestaurantDetailScreen'
import RestaurantsScreen from './RestaurantsScreen'
import CreateOrderScreen from './CreateOrderScreen'

const Stack = createNativeStackNavigator()

export default function RestaurantsStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='RestaurantsScreen'
        component={RestaurantsScreen}
        options={{
          title: 'Restaurants'
        }} />
      <Stack.Screen
        name='RestaurantDetailScreen'
        component={RestaurantDetailScreen}
        options={{
          title: 'Restaurant Detail'
        }} />
      <Stack.Screen
        name='CreateOrderScreen'
        component={CreateOrderScreen}
        options={{
          title: 'Create Order'
        }} />
    </Stack.Navigator>
  )
}
