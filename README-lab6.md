# Introduction

We will learn how to design screens by using FlexBox to create our Layout. Once we understand basic Flexbox, we will design our first Form screen to create Restaurants and secondly, to create Products.

# 0. Setup

## 0. Setup

Click on "Use this template" in GitHub and "Create a new repository" to create your own repository based on this template. Afterwards, clone your own repository by opening VScode and clone the previously created repository by opening Command Palette (Ctrl+Shift+P or F1) and `Git clone` this repository, or using the terminal and running

```PowerShell
git clone <url>
```

Alternatively, you can use the _Source Control_ button in the left-sided bar and click on _Clone Repository_ button.

In case you are asked if you trust the author, please select yes.

It may be necessary to setup your git username by running the following commands on your terminal, in order to be able to commit and push:

```PowerShell
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```

As in previous labs, it is needed to create a copy of the `.env.example` file, name it `.env` and include your environment variables.

Open a terminal a run `npm run install:all:bash` (`npm run install:all:bash` for Windows OS) to install dependencies. A folder `node_modules` will be created under the `DeliverUS-Backend` and `DeliverUS-Frontend` folders.

Once you should setup your .env file for DeliverUS-Backend project. API_BASE_URL must points to your server. For instance `API_BASE_URL=http://localhost:3000`.

You have to run the backend server as well. Go to your global project folder and run `start:backend`.

You can then run `start:frontend`. Check that the base project is working.

It is important to notice that **this base project includes**:

- Previous labs solved.
- Added button to create restaurant, and navigates to CreateRestaurantScreen.
- Added button to create product, and navigates to CreateProductScreen.
- An InputItem component that renders forms inputs, labels and manages errors.

Keep in mind that to make some API requests, it is needed to be logged-in. So **confirm that you can log-in with some owner user**. The provided user-seeder at the backend creates an owner with the following credentials:

- email: `owner1@owner.com`
- password: `secret`

Once the user is logged in, the bearer token is used in every request.

# 1. GUI Design

## 1.1. Flexbox

React native components use Flexbox algorithm to define the layout of its children. Flexbox is also available in standard CSS styles definition for web interfaces.

For instance, within a `View` component we can include some children, such as `Text`, `Pressable`, `Image`, `InputItems` or nested `View`. The parent `View` can define the Flexbox behaviour of these children (children of these children do not inherit these properties). The most common properties to be defined are:

- `flexDirection` which can take two values: `column` (default) if we want its children to render vertically or `row` if we want them to be rendered horizontally. Check
- `justifyContent` which can take the following values:
  - `flex-start` (default). The contents are distributed at the start of the primary axis (the flex direction determines the primary and secondary axis)
  - `center`. The contents are distributed at the center.
  - `flex-end`. The contents are distributed at the end.
  - `space-around` and `space-between` so the contentes are distributed evenly.
- `alignItems` define how the content will be aligned along the secondary axis (depending on the `flexDirection`)
  - `flex-start`,
  - `center`,
  - `flex-end`,
  - `stretch` (default) contents will be stretched to fill the space available

You can experiment with these properties and values at the following example:
<https://snack.expo.dev/@afdez/flex-example>

Please, take your time to understand the behaviour of Flexbox algorithm.

There are some more properties that defines the Flexbox algorithm behaviour, you can learn more at: <https://reactnative.dev/docs/flexbox>

## 1.2. Views as containers

Usually we will define a general container for our components. This container will usually be a `View` component and it will determine the Flexbox behaviour of its children and the size, margins etc where we will render our elements.
Notice that the return statement must include one and only one root element. For instance this return statement would be wrong:

```JSX
return (
  <View>
    <Text>Some text</Text>
  </View>
  <View>
    <Text>Some other text</Text>
  </View>
)
```

To fix this, we must include a parent element to those siblings,for instance the empty tag `<>`:

```JSX
return (
  <>
    <View>
      <Text>Some text</Text>
    </View>
    <View>
      <Text>Some other text</Text>
    </View>
  </>
)
```

Let's start designing the `CreateRestaurantScreen.js`.

1. Include a `<View style={{ alignItems: 'center' }}>`
2. Insert some `<InputItem name='sampleInput' label='Sample input' />`
3. Check results.

You will notice that the input items are arranged from top to bottom, full width.

4. Let's modify our container, so it does not fill all the horizontal space, just 60%. To this end we will create a **nested** view width 60%: `<View style={{ width: '60%' }}>`
5. Check results
6. Include a `Pressable` button after the set of inputs.
7. Check results.

The following code snippet, includes all the previous steps:

```JSX
export default function CreateRestaurantScreen () {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: '60%' }}>
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <InputItem
        name='sampleInput'
        label='Sample input'
      />
      <Pressable
        onPress={() => console.log('Button pressed')
        }
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? GlobalStyles.brandPrimaryTap
              : GlobalStyles.brandPrimary
          },
          styles.button
        ]}>
        <TextRegular textStyle={styles.text}>
          Create restaurant
        </TextRegular>
      </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.brandSecondary,
    textAlign: 'center'
  }
})
```

You may ask yourself: why was it needed to include two nested views? The reason is that the first view defines that its children have to be centered. You can check what happens if we declare just a view with both properties: `<View style={{ alignItems: 'center', width: '60%' }}>`.
Layout definition can be quite tricky sometimes, and various solutions can be found: for instance there is another property named `alignSelf`, that could have been used to this end.

## 1.3. ScrollViews

Insert more `InputItems` so they exceed the vertical space available. Notice that you cannot scroll down to see them all. `Views` are not scrollable. To this end we have to use the `<ScrollView>` component. Add a new `<ScrollView>` parent and check results. Scrolling should be enabled.

Note: Some components are an extension of `ScrollView` component. For instance, `FlatList` inherits the properties of `ScrollView`, but load contents lazily (when you have to render lots of elements, `FlatList` will be a more performant solution than `ScrollView`).

# 2. Forms

Forms are the way of alowing users to submit data from the frontend GUI to the backend. This is needed to create new elements of our entities.
In order to create and mantain the state of the form, we will use a third party component: `<Formik>`.

Formik manages the state of the inputs within the form, and can apply validation rules to them. Formik component needs to be initialized with the names and initial values of the inputs of the form.

We will learn more about Formik in the next lab. In this lab you just have to add the following parent element in the return sentence of the screens that include a form:

```JSX
import { Formik } from 'formik'


export default function CreateRestaurantScreen () {
  const initialRestaurantValues = { name: null, description: null, address: null, postalCode: null, url: null, shippingCosts: null, email: null, phone: null, restaurantCategoryId: null }

  // Rest of the code of this component
  // ...

  return (
    <Formik
    initialValues={initialRestaurantValues}
    >
      {({ setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />

              {/* Any other inputs */}

            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
```

Forms present to the user various input fields. The most popular are:

- Text inputs: where user introduces some kind of text. It is usually the most general input, we can use it so users can include information such as: names, surnames, emails, descriptions, urls, addresses, prices, postal codes or telephones. You have been provided the `src/components/InputItem.js` component that returns: a) a `TextInput`, b) a label for the input and c) some elements needed for validation that we will use in the next lab.
- Image/File pickers: where user can select an image/file from its gallery or file system in order to upload them.
- Select/Dropdown: where users can select a value for a field from a given set of options. Typical use cases includes: select some category from the ones that exist, select some status value from a given set of possible values.
- Switches: where user is asked between two options that are typically send as a boolean.

## 2.1 CreateRestaurant Form

### 2.1.1 Text inputs

Modify the CreateRestaurantScreen so the user is presented with the needed text inputs for the creation of new restaurants including:

- `name`
- `description`
- `address`
- `postalCode`
- `url`
- `shippingCosts`
- `email`
- `phone`

Notice that `InputItem` can receive the following properties:

- `name`: the name of the field. **It has to match the name of the field expected at the backend.**
- `label`: the text presented to the user so it will be rendered among the text input.
- Other properties: any other property available for the react-native `TextInput`component. For instance, the `placeholder` property will render a hint in the input so the user can better understand what kind of value is expected. You can see the full `TextInput` reference at: <https://reactnative.dev/docs/textinput>

### 2.1.2 Image pickers

Restaurants can be created including some images, the `logo` and the `heroImage` which is an image that is rendered as background in the RestaurantDetailScreen. To this end, expo SDK includes some tools. For more info you can check the expo documentation: <https://docs.expo.dev/tutorial/image-picker/>

To include an image picker for the restaurant logo follow these steps:

1. Add import sentences for the needed library `ExpoImagePicker`, some components, and some default images:

   ```Javascript
   import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
   import * as ExpoImagePicker from 'expo-image-picker'
   import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
   import restaurantBackground from '../../../assets/restaurantBackground.jpeg'
   ```

1. Include a `useEffect` hook to obtain permissions from the device to access to the media gallery (it is needed for iOS and Android).

   ```Javascript
     useEffect(() => {
       (async () => {
         if (Platform.OS !== 'web') {
           const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
           if (status !== 'granted') {
             alert('Sorry, we need camera roll permissions to make this work!')
           }
         }
       })()
     }, [])
   ```

1. Include a new pressable element including a text for the label and an image for visualizing selected image. Once we press and select an image, we will store its contents in the state variable by using the `setLogo` function. You can use the following code snippet:

   ```JSX
   <Pressable onPress={() =>
     pickImage(
       async result => {
         await setFieldValue('logo', result)
       }
     )
   }
     style={styles.imagePicker}
   >
     <TextRegular>Logo: </TextRegular>
     <Image style={styles.image} source={values.logo ? { uri: values.logo.assets[0].uri } : restaurantLogo} />
   </Pressable>
   ```

1. Notice that `onPress` calls the `pickImage`method. This method is in charge of launching the selection interface for picking an image. This is the proposed code extracted from the `ExpoImagePicker` component documentation:

   ```Javascript
   const pickImage = async (onSuccess) => {
     const result = await ExpoImagePicker.launchImageLibraryAsync({
       mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
       allowsEditing: true,
       aspect: [1, 1],
       quality: 1
     })
     if (!result.canceled) {
       if (onSuccess) {
         onSuccess(result)
       }
     }
   }
   ```

1. Finally, we can include some styling:

   ```Javascript
   imagePicker: {
     height: 40,
     paddingLeft: 10,
     marginTop: 20,
     marginBottom: 80
   },
   image: {
     width: 100,
     height: 100,
     borderWidth: 1,
     alignSelf: 'center',
     marginTop: 5
   }
   ```

### 2.1.4. CreateRestaurantScreen.js

<details>
  <summary>
Click here to check the complete CreateRestaurantScreen component:
  </summary>

```JSX
import React, { useEffect, useState } from 'react'
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import * as ExpoImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { getRestaurantCategories } from '../../api/RestaurantEndpoints'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import restaurantBackground from '../../../assets/restaurantBackground.jpeg'
import { showMessage } from 'react-native-flash-message'
import { Formik } from 'formik'

export default function CreateRestaurantScreen () {
  const initialRestaurantValues = { name: null, description: null, address: null, postalCode: null, url: null, shippingCosts: null, email: null, phone: null, restaurantCategoryId: null }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  return (
    <Formik
    initialValues={initialRestaurantValues}
    >
      {({ setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />
              <InputItem
                name='description'
                label='Description:'
              />
              <InputItem
                name='address'
                label='Address:'
              />
              <InputItem
                name='postalCode'
                label='Postal code:'
              />
              <InputItem
                name='url'
                label='Url:'
              />
              <InputItem
                name='shippingCosts'
                label='Shipping costs:'
              />
              <InputItem
                name='email'
                label='Email:'
              />
              <InputItem
                name='phone'
                label='Phone:'
              />

              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('logo', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Logo: </TextRegular>
                <Image style={styles.image} source={values.logo ? { uri: values.logo.assets[0].uri } : restaurantLogo} />
              </Pressable>

              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('heroImage', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Hero image: </TextRegular>
                <Image style={styles.image} source={values.heroImage ? { uri: values.heroImage.assets[0].uri } : restaurantBackground} />
              </Pressable>

              <Pressable
                onPress={() => console.log('Submit pressed')}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Save
                </TextRegular>
              </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  }
})
```

</details>

## 2.2. CreateProduct Form

Now, follow and adapt the steps given for the `CreateRestaurantScreen` component in order to create a new product for a selected restaurant. Complete the `CreateProductScreen.js` component. Remember the needed properties when creating a product:

- `name`,
- `description`,
- `price`,
- `image`,
- `order` (remember, we can define the position where each product will be in the returned product list when querying restaurant details),
- `productCategory`,
- `availability`

# 3. Other form input components

Restaurants and products can belong to some categories. Include a select input to allow the user to select from available values of RestaurantCategories and from valid statuses when creating a new restaurant.

### 3.1 Select/Dropdown picker

React native does not provide a Dropdown picker component, so we will use a third party component. You can check the documentation at: <https://hossein-zare.github.io/react-native-dropdown-picker-website/>

In the `CreateRestaurantScreen` form we will use the dropdown to select the restaurant category.

Remember that the options of `DropDownPicker` are a list of pairs value/label. For instance the restaurant categories would be the pair `value: restaurantCategoryId, label: restaurantCategoryName`.

In order to populate the options of the `DropDownPicker` we need:

1. Import the `DropDownPicker`component:

   ```Javascript
   import DropDownPicker from 'react-native-dropdown-picker'
   ```

1. A state to store the restaurant categories:

   ```Javascript
   const [restaurantCategories, setRestaurantCategories] = useState([])
   ```

1. A boolean state to set if the option list of the `DropDownPicker` are visible or not:

   ```Javascript
   const [open, setOpen] = useState(false)
   ```

1. A `useEffect` hook to retrieve the restaurant categories from backend:

   ```Javascript
   useEffect(() => {
     async function fetchRestaurantCategories () {
       try {
         const fetchedRestaurantCategories = await getRestaurantCategories()
         const fetchedRestaurantCategoriesReshaped = fetchedRestaurantCategories.map((e) => {
           return {
             label: e.name,
             value: e.id
           }
         })
         setRestaurantCategories(fetchedRestaurantCategoriesReshaped)
       } catch (error) {
         showMessage({
           message: `There was an error while retrieving restaurant categories. ${error} `,
           type: 'error',
           style: GlobalStyles.flashStyle,
           titleStyle: GlobalStyles.flashTextStyle
         })
       }
     }
     fetchRestaurantCategories()
   }, [])
   ```

1. Finally, we have to add the component in the `return` sentence of the `CreateRestaurantScreen` component. Find below a code snippet to add a `DropDownPicker` component for restaurant categories:

   ```JSX
   <DropDownPicker
     open={open}
     value={values.restaurantCategoryId}
     items={restaurantCategories}
     setOpen={setOpen}
     onSelectItem={ item => {
       setFieldValue('restaurantCategoryId', item.value)
     }}
     setItems={setRestaurantCategories}
     placeholder="Select the restaurant category"
     containerStyle={{ height: 40, marginTop: 20 }}
     style={{ backgroundColor: GlobalStyles.brandBackground }}
     dropDownStyle={{ backgroundColor: '#fafafa' }}
   />
   ```

Similarly, when creating a new product, include a select input to select from ProductCategories.

### 3.2. Switch

Moreover, products can be available or not, we can add a radio or switch control to the `CreateProduct` Form. React native provides a Switch component. You can check the documentation at: <https://reactnative.dev/docs/switch>

First, you have to add the `Switch` component to the import statement of the react-native components:

```Javascript
import { Image, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'
```

Find below a code snippet for including a `Switch` component for the product availability:

```JSX
<TextRegular style={styles.switch}>Is it available?</TextRegular>
<Switch
  trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
  thumbColor={values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'}
  value={values.availability}
  style={styles.switch}
  onValueChange={value =>
    setFieldValue('availability', value)
  }
/>
```

And you can add some styling to your StyleSheet:

```Javascript
switch: {
  marginTop: 20
}
```
