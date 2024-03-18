import React from 'react'
import { StyleSheet, View } from 'react-native'
import TextRegular from '../../components/TextRegular'

import SystemInfo from '../../components/SystemInfo'

export default function ProfileScreen () {
  return (
        <View style={styles.container}>
            <TextRegular>Profile</TextRegular>
            <SystemInfo />
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
