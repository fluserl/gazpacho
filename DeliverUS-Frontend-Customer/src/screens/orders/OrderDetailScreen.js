import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { getOrderDetail } from '../../api/OrderEndpoints'

export default function OrderDetailScreen ({ route }) {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetchOrderDetail()
  }, [])

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(route.params.id)
      console.log('Order details obtained succesfully')
      setOrder(response)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving order details (id ${route.params.id}). ${error}`,
        type: 'error'
      })
    }
  }

  const renderOrderItem = ({ item }) => {
    return (
      <View style={styles.orderProduct}>
        <TextRegular>{item.name}</TextRegular>
        <TextSemiBold>{item.price.toFixed(2)}€ x {item.OrderProducts.quantity}</TextSemiBold>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {
        order !== null
          ? (
          <View style={styles.container}>
            <View style={styles.tittleContainer}>
              <TextSemiBold style={styles.tittle}>Order #{order.id}</TextSemiBold>
            </View>
            <View style={styles.container}>
              <View style={styles.list}>
                <FlatList
                  data={order.products}
                  renderItem={renderOrderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </View>
            <View style={styles.info}>
              <TextSemiBold style={[styles.infoText, { fontWeight: 'bold' }]}>Total price:</TextSemiBold>
              <TextRegular style={styles.infoText}> {order.price.toFixed(2)}€</TextRegular>
            </View>
            <View style={styles.info}>
              <TextSemiBold style={[styles.infoText, { fontWeight: 'bold' }]}>Status:</TextSemiBold>
              <TextRegular style={styles.infoText}> {order.status}</TextRegular>
            </View>
          </View>)
          : (<Text>No order details available</Text>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  productItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  tittleContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tittle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  orderProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200
  },
  infoText: {
    fontSize: 18
  },
  list: {
    flex: 1
  }
})
