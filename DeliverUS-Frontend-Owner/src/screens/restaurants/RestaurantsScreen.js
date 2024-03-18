/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import TextRegular from '../../components/TextRegular'
import { getAll } from '../../api/RestaurantEndpoints'
import * as GlobalStyles from '../../styles/GlobalStyles'

export default function RestaurantsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TextRegular style={{ fontSize: 16, alignSelf: 'center', margin: 20 }}>Random Restaurant</TextRegular>
      <Pressable
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: Math.floor(Math.random() * 100) })
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? GlobalStyles.brandBlueTap
              : GlobalStyles.brandBlue
          },
          styles.actionButton
        ]}
      >
        <TextRegular textStyle={styles.text}>
          Go to Random Restaurant Details
        </TextRegular>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  }
})
