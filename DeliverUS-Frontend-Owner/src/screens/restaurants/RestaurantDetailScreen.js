/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { getDetail } from '../../api/RestaurantEndpoints'
import TextRegular from '../../components/TextRegular'

import * as GlobalStyles from '../../styles/GlobalStyles'

export default function RestaurantDetailScreen ({ route }) {
  const { id } = route.params
  return (
        <View style={styles.container}>
            <TextRegular style={{ fontSize: 16, alignSelf: 'center', margin: 20 }}>Restaurant details. Id: {id}</TextRegular>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: GlobalStyles.brandSecondary
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  }
})
