import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import * as yup from 'yup'
import { Formik } from 'formik'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import defaultProductImage from '../../../assets/product.jpeg'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getDetail } from '../../api/RestaurantEndpoints'
import { getOrderDetail, update } from '../../api/OrderEndpoints'

export default function EditOrderScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState([])
  const [products, setProducts] = useState([])
  const [orderProducts, setOrderProducts] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)
  const initialOrderValues = {
    createdAt: new Date(),
    startedAt: null,
    sentAt: null,
    deliveredAt: null,
    price: null,
    address: null,
    shippingCosts: route.params.shippingCosts,
    restaurantId: route.params.id,
    userId: loggedInUser.id,
    status: 'pending',
    products: null
  }
  const [order, setOrder] = useState(initialOrderValues)
  const [address, setAddress] = useState()
  const validationSchema = yup.object().shape({
    address: yup.string().min(1, 'Address too short').max(255, 'Address too long').required()
  })

  useEffect(() => {
    fetchOrderDetail()
    fetchProducts()
  }, [route, loggedInUser, orderProducts])

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(route.params.id)
      setOrder(response)
      setOrderProducts(response.products)
      setAddress(response.address)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving order details (id ${route.params.id}). ${error}`,
        type: 'error'
      })
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await getOrderDetail(route.params.id)
      const restaurant = await getDetail(response.restaurantId)
      setProducts(restaurant.products)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant products (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      console.log(`ERROR:${error}`)
    }
  }

  const renderProduct = ({ item }) => {
    if (item.availability) {
      return (
        <ImageCard
          imageUri={item.image ? { uri: `${process.env.API_BASE_URL}/${item.image}` } : defaultProductImage}
          title={item.name}
          onPress={() => addOrderProducts({ item })}
        >
          <TextRegular numberOfLines={2}>{item.description}</TextRegular>
          <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        </ImageCard>
      )
    }
  }

  const renderOrderProduct = ({ item }) => {
    const orderData = item.OrderProducts
    return (
      <View style={styles.orderProduct}>
        <View style={[{ flex: 2 }]}>
          <TextRegular style={styles.orderProductText}>{orderData.quantity}x {item.name}: {orderData.quantity * orderData.unityPrice} €</TextRegular>
        </View>
        <View style={[{ flex: 1, flexDirection: 'row' }]}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? GlobalStyles.brandBlueTap : GlobalStyles.brandBlue
              },
              styles.actionButton
            ]}
            onPress={() => deleteOneUnitOfOrderProduct({ item })}
          >
            <View style={styles.unitButton}>
              <TextRegular textStyle={styles.textButton}>-</TextRegular>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? GlobalStyles.brandBlueTap : GlobalStyles.brandBlue
              },
              styles.actionButton
            ]}
            onPress={() => addOrderProducts({ item })}
          >
            <View style={styles.unitButton}>
              <TextRegular textStyle={styles.textButton}>+</TextRegular>
            </View>
          </Pressable>
        </View>
      </View>
    )
  }

  const addOrderProducts = ({ item }) => {
    const newOrderProducts = [...orderProducts]
    const existingProduct = newOrderProducts.find(p => p.id === item.id)

    if (orderProducts.length > 0 && existingProduct) {
      existingProduct.quantity++
    } else {
      item.quantity = 1
      newOrderProducts.push(item)
    }

    setOrderProducts(newOrderProducts)
  }

  const deleteOneUnitOfOrderProduct = ({ item }) => {
    const newOrderProducts = [...orderProducts]
    const existingProduct = newOrderProducts.find(p => p.id === item.id)

    if (orderProducts.length > 0 && existingProduct) {
      existingProduct.quantity--
      if (existingProduct.quantity === 0) {
        newOrderProducts.splice(newOrderProducts.indexOf(existingProduct), 1)
      }
    }

    setOrderProducts(newOrderProducts)
  }

  const getOrderPrice = () => {
    let sum = 0
    orderProducts.forEach(product => {
      const orderData = product.OrderProducts
      sum += orderData.quantity * orderData.unityPrice
    })
    return sum
  }

  const updateOrder = async (values) => {
    try {
      const updatedOrder = { ...order }
      updatedOrder.products.forEach(product => {
        product.productId = product.id
        product.quantity = product.OrderProducts.quantity
      })
      delete updatedOrder.restaurantId
      const address = values.address
      if (address && address.length > 0) {
        updatedOrder.address = address
      }
      await update(updatedOrder.id, updatedOrder)
      showMessage({
        message: `Order ${updatedOrder.id} successfully updated`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('OrdersScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      showMessage({
        message: `Failed to update order ${values.id}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      setBackendErrors(error.errors || ['Failed to update order'])
    }
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialOrderValues}
      onSubmit={updateOrder}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <View style={styles.page}>
          <View style={styles.container}>
            <View style={styles.yourOrderContainer}>
              <TextSemiBold style={styles.text}>Your order</TextSemiBold>
              <View style={styles.orderProductsContainer}>
                <FlatList
                  data={orderProducts}
                  renderItem={renderOrderProduct}
                />
                <TextRegular>{'\n'}Total: {getOrderPrice()} €</TextRegular>
                <TextRegular>{'\n'}Old address: {address}</TextRegular>
                <InputItem
                  name='address'
                  label='New address:'
                />
                <Pressable onPress={handleSubmit}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? GlobalStyles.brandSuccessTap
                        : GlobalStyles.brandSuccess
                    },
                    styles.button
                  ]}
                >
                  <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                    <MaterialCommunityIcons name='content-save' color={'white'} size={20} />
                    <TextRegular textStyle={styles.textButton}>
                      Save
                    </TextRegular>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.productsListContainer}>
            <View style={styles.list}>
              <FlatList
                data={products}
                renderItem={renderProduct}
              />
              {backendErrors &&
                backendErrors.map((error, index) => <TextRegular key={index}>{error.param}-{error.msg}</TextRegular>)
              }
            </View>
          </View>
        </View>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  container: {
    flex: 3,
    backgroundColor: GlobalStyles.brandPrimary,
    padding: 20,
    minHeight: '100%',
    flexDirection: 'row',
    margin: 0
  },
  yourOrderContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  text: {
    color: GlobalStyles.brandBackground,
    fontSize: 20
  },
  productsListContainer: {
    flex: 7,
    flexDirection: 'row',
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10
  },
  yourOrderList: {
    backgroundColor: GlobalStyles.brandPrimary,
    flex: 1
  },
  list: {
    flex: 1
  },
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  textButton: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  orderProductsContainer: {
    marginTop: 20
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
  orderProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orderProductText: {
    flex: 1
  },
  unitButton: {
    flex: 1,
    height: 10,
    width: '10%',
    backgroundColor: GlobalStyles.brandBlue,
    alignContent: 'center'
  }

})
