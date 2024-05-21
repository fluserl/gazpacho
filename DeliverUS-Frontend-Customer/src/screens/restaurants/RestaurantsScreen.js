/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, View, Text } from 'react-native'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'

import { getAll } from '../../api/RestaurantEndpoints'
import { getPopular } from '../../api/ProductEndpoints'
import ImageCard from '../../components/ImageCard'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { showMessage } from 'react-native-flash-message'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import product from '../../../assets/product.jpeg'

export default function RestaurantsScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  useEffect(() => {
    setRestaurants(restaurants)
    setBestSellers(bestSellers)
    fetchRestaurants()
    fetchBestSellers()
  }, [route])

  const fetchRestaurants = async () => {
    try {
      const fetchedRestaurants = await getAll()
      setRestaurants(fetchedRestaurants)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurants. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const fetchBestSellers = async () => {
    try {
      const fBS = await getPopular()
      setBestSellers(fBS)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving best sellers. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderEmptyRestaurantsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No restaurants were retreived.
      </TextRegular>
    )
  }

  const renderEmptyBestSellersList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No products were retrieved.
      </TextRegular>
    )
  }

  const renderRestaurant = ({ item }) => {
    return (

      <ImageCard
        imageUri={item.logo ? { uri: process.env.API_BASE_URL + '/' + item.logo } : restaurantLogo}
        title={item.name}
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.id })
        }}

      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        {item.averageServiceMinutes !== null &&
          <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
        }
        <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
      </ImageCard>
    )
  }

  const renderBestSeller = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : product}
        title={item.name}
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.restaurantId })
        }}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
      </ImageCard>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerRestaurants}>
        <FlatList
          style={styles.list}
          data={restaurants}
          renderItem={renderRestaurant}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={renderEmptyRestaurantsList}
          />
      </View>

      <MaterialCommunityIcons name="crown-circle" size={40} color={GlobalStyles.brandSecondary} />
      <Text style={styles.bigText}>Top 3 Best Sellers</Text>
      <View style={styles.containerProducts}>
        <FlatList
          style={styles.list}
          data={bestSellers}
          renderItem={renderBestSeller}
          keyExtractor={item => item.id.toString()}
          horizontal='true'
          ListEmptyComponent={renderEmptyBestSellersList}
          />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    height: 10
  },
  containerRestaurants: {
    flex: 2,
    flexDirection: 'column',
    marginBottom: 10
  },
  list: {
    flex: 1
  },
  containerProducts: {
    flex: 1,
    flexDirection: 'column'
  },
  bigText: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
