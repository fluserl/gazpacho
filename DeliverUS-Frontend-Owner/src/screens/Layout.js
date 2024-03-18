import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import * as GlobalStyles from '../styles/GlobalStyles'
import RestaurantsStack from './restaurants/RestaurantsStack'
import ControlPanelScreen from './controlPanel/ControlPanelScreen'
import ProfileScreen from './profile/ProfileScreen'
// eslint-disable-next-line camelcase
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat'

const Tab = createBottomTabNavigator()

export default function Layout () {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold
  })
  return (
    <>
    {fontsLoaded &&
     <NavigationContainer theme={GlobalStyles.navigationTheme}>

      <Tab.Navigator screenOptions={({ route }) => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ color, size }) => {
          let iconName
          if (route.name === 'My Restaurants') {
            iconName = 'silverware-fork-knife'
          } else if (route.name === 'Control Panel') {
            iconName = 'view-dashboard'
          } else if (route.name === 'Profile') {
            iconName = 'account-circle'
          }
          return <MaterialCommunityIcons name={iconName} color={color} size={size} />
        },
        headerShown: false
      })}>
        <Tab.Screen
          name='My Restaurants'
          component={RestaurantsStack}
        />
        <Tab.Screen
          name='Control Panel'
          component={ControlPanelScreen} />
        <Tab.Screen
          name='Profile'
          component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
     }
     </>
  )
}
