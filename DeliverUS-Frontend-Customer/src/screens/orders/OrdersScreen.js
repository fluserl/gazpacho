import React, { useEffect, useContext, useState } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { getCustomerOrders, deleteOrder } from '../../api/OrderEndpoints'
import { showMessage } from 'react-native-flash-message'
import ImageCard from '../../components/ImageCard'
import { FlatList } from 'react-native-web'
import DeleteModal from '../../components/DeleteModal'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function OrdersScreen ({ navigation }) {
  const [orders, setOrders] = useState([])
  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    async function fetchOrders () {
      try {
        const fetchedOrders = await getCustomerOrders()
        setOrders(fetchedOrders)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving the orders. ${error}`,
          type: 'error',
          style: flashStyle,
          textStyle: flashTextStyle
        })
      }
    }
    if (loggedInUser) {
      fetchOrders()
    } else {
      setOrders(null)
    }
  }, [loggedInUser])

  const formatDateString = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-gb', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderOrders = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + item.restaurant.logo } : undefined}
        onPress={() => {
          navigation.navigate('OrderDetailScreen', { id: item.id, dirty: true })
        }}
      >
        <View style={{ marginLeft: 10 }}>
          <TextSemiBold textStyle={{ fontSize: 16, color: 'black' }}>Order {item.id}</TextSemiBold>
          <TextSemiBold>
            Created at: <TextRegular>{formatDateString(item.createdAt)}</TextRegular>
          </TextSemiBold>
          <TextSemiBold>
            Price: <TextRegular style={{ color: brandPrimary }}>{item.price.toFixed(2)} €</TextRegular>
          </TextSemiBold>
          <TextSemiBold>
            Shipping: <TextRegular style={{ color: brandPrimary }}>{item.shippingCosts.toFixed(2)} €</TextRegular>
          </TextSemiBold>
          <TextSemiBold>
            Status: <TextRegular style={{ color: brandPrimary, textTransform: 'capitalize' }}>{item.status}</TextRegular>
          </TextSemiBold>
          <View style={styles.actionButtonsContainer}>
            <Pressable
              onPress={() => navigation.navigate('EditOrderScreen', { id: item.id })
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandBlueTap
                    : GlobalStyles.brandBlue
                },
                styles.actionButton
              ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Edit
                </TextRegular>
              </View>
            </Pressable>
            <Pressable
              onPress={() => { setOrderToBeDeleted(item) }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandPrimaryTap
                    : GlobalStyles.brandPrimary
                },
                styles.actionButton
              ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Delete
                </TextRegular>
              </View>
            </Pressable>
          </View>
        </View>
      </ImageCard>
    )
  }

  const renderEmptyOrders = () => {
    return <TextRegular textStyle={styles.emptyList}>No orders were retrieved.</TextRegular>
  }

  const isUserLoggedIn = () => {
    return loggedInUser !== null
  }

  const userNotLoggedInMessage = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        You need to be logged in in order to access this page.
      </TextRegular>
    )
  }

  const removeOrder = async (order) => {
    try {
      if (order.status === 'In Process' || order.status === 'Delivered') {
      throw new Error(`Cannot delete order ${order.id} because it is in process or already delivered.`);
    }
      await deleteOrder(order.id)
      const updatedOrders = orders.filter((item) => item.id !== order.id)
      setOrders(updatedOrders)
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.id} successfully removed`,
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.id} could not be removed.`,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }

  return (
    <>
      {isUserLoggedIn()
        ? (
        <FlatList
          style={styles.container}
          data={orders}
          renderItem={renderOrders}
          ListEmptyComponent={renderEmptyOrders}
          keyExtractor={(item) => item.id.toString()}
        />
          )
        : (
            userNotLoggedInMessage()
          )}
      {orderToBeDeleted && (
        <DeleteModal
          isVisible={true}
          onCancel={() => setOrderToBeDeleted(null)}
          onConfirm={() => removeOrder(orderToBeDeleted)}
        >
          <TextRegular>Are you sure you want to delete this order?</TextRegular>
        </DeleteModal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  textTitle: {
    fontSize: 16,
    color: 'black'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'relative',
    width: '90%'
  }
})
