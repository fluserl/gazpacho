# Introduction

During this lab we will learn how to:

- modify screens to include action buttons for editing and deleting data
- modify screens to perform delete actions on entities.
- create screens and forms for editing entities data.

We will learn how to perform an HTTP DELETE requests from the Frontend client to the backend server. It is important to remember that to performn a DELETE Request we will need:

- the URI where we will address the request,
- the id of the entity to be removed.

For instance, if we want to remove a restaurant, we will do an HTTP DELETE Request to: `/restaurants/:restaurantId`.

We will learn how to perform an HTTP PUT requests from the Frontend client to the backend server. It is important to remember that to performn a PUT Request we will need:

- the URI where we will address the request,
- the id of the entity to be edited, and
- the updated entity data.

For instance, if we want to edit some restaurant, we will do an HTTP PUT Request to: `/restaurants/:restaurantId` and we will have to provide the updated restaurant data.

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

# 1. Action buttons for editing and removing Restaurants.

We need to include some actions for editing and removing restaurants. One possible implementation is to include `Pressable` components in the card that renders each restaurant in the `RestaurantsScreen`.

To this end you can include the following `Pressable` instances in the renderRestaurant function of `RestaurantScreen`:

```JSX
<Pressable
  onPress={() => console.log(`Edit pressed for restaurantId = ${item.id}`)}
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
  onPress={() => console.log(`Delete pressed for restaurantId = ${item.id}`)}
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
```

You can try both buttons and check that messages are printed in the console.

# 2. Delete Modal and HTTP DELETE Request for removing Restaurants.

We need to implement the delete action when the user press the corresponding button.

1. Include a remove function in the `src/api/RestaurantEndpoints.js` file. The functions receives the restaurantID and is in charge of doing the request to the corresponding endpoint. You can use the following implementation:

   ```Javascript
   function remove (id) {
     return destroy(`restaurants/${id}`)
   }
   ```

1. Implement the needed elements in `RestaurantsScreen.js`. It is a good practice to ask for confirmation when performing undoable operations.

   To this end, you have been provided with a component named `DeleteModal`. This component opens a modal window that includes:

   - a button to cancel the operation
   - a button to confirm the operation
   - the elements passed as children of this component are rendered as the body of the modal window.

   Therefore, `DeleteModal` component needs three properties:

   - `isVisible`: a boolean expression that is evaluated to show or hide the modal window.
   - `onCancel`: the function that will be run when the user presses on the cancel button.
   - `onConfirm`: the function that will be run when the user presses the confirmation button.

1. The component should be included in the return sentence of the `RestaurantsScreen` as follows:

   ```JSX
   <DeleteModal
     isVisible={restaurantToBeDeleted !== null}
     onCancel={() => setRestaurantToBeDeleted(null)}
     onConfirm={() => removeRestaurant(restaurantToBeDeleted)}>
       <TextRegular>The products of this restaurant will be deleted as well</TextRegular>
       <TextRegular>If the restaurant has orders, it cannot be deleted.</TextRegular>
   </DeleteModal>
   ```

1. Notice that we need to include a state object to store the restaurant that would be deleted when the user presses the delete button. Include the following state:

   ```Javascript
   const [restaurantToBeDeleted, setRestaurantToBeDeleted] = useState(null)
   ```

1. Next, we will change the `onPress` property of the delete `Pressable` previously included in the `renderRestaurant`, so when the user presses, the `restaurantToBeDeleted` state will be set with the rendered restaurant.

   ```JSX
   onPress={() => { setRestaurantToBeDeleted(item) }}
   ```

1. Finally, we need to implement the `removeRestaurant` function that is called when the user confirms the deletion. This function calls to the `remove` method of the `RestaurantEndpoints`, then refreshes the view by fetching all the restaurants again and reset the restaurantToBeDeleted state object.

   ```Javascript
   const removeRestaurant = async (restaurant) => {
     try {
       await remove(restaurant.id)
       await fetchRestaurants()
       setRestaurantToBeDeleted(null)
       showMessage({
         message: `Restaurant ${restaurant.name} succesfully removed`,
         type: 'success',
         style: GlobalStyles.flashStyle,
         titleStyle: GlobalStyles.flashTextStyle
       })
     } catch (error) {
       console.log(error)
       setRestaurantToBeDeleted(null)
       showMessage({
         message: `Restaurant ${restaurant.name} could not be removed.`,
         type: 'error',
         style: GlobalStyles.flashStyle,
         titleStyle: GlobalStyles.flashTextStyle
       })
     }
   }
   ```

Please, check that restaurants are deleted after this implementation is done.

# 3. Edit Form and HTTP PUT Request for editing Restaurants.

We need to implement the update action when the user press the corresponding button. To this end, we will complete the implementation of the `EditRestaurantScreen.js`. This component should:

- receive the `restaurantId` to be edited as a route param `route.params.id`
- fetch the details of that restaurant from backend.
- store the fetched restaurant in a state object
- update the initialRestaurantValues of the form
- when the user presses the button labelled with edit, validates the data and eventually send an HTTP PUT Request to the backend.
- if the update is successful, sends the user back to the `RestaurantsScreen.js`

Let's complete the implementation:

1. Include an update function in the `src/api/RestaurantEndpoints.js` file. The functions receives the restaurantID and the updated restaurant data, and is in charge of doing the request to the corresponding endpoint. You can use the following implementation:

   ```Javascript
   function update (id, data) {
     return put(`restaurants/${id}`, data)
   }
   ```

1. Modify the `onPress` action of the Edit `Pressable` at the `renderRestaurant`of the `RestaurantsScreen.js` component to navigate to this edit screen including the id of the restaurant. You can use the following:

   ```JSX
   onPress={() => navigation.navigate('EditRestaurantScreen', { id: item.id })}
   ```

1. At the `EditRestaurantScreen` import the `update` function from `RestaurantEndpoints`. Next, include state objects to store the restaurant to be fetched and the initialValues for the `Formik` edit form.

   ```Javascript
   const [restaurant, setRestaurant] = useState({})

   const [initialRestaurantValues, setInitialRestaurantValues] = useState({ name: null, description: null, address: null, postalCode: null, url: null, shippingCosts: null, email: null, phone: null, restaurantCategoryId: null, logo: null, heroImage: null })
   ```

1. Include an effect that fetches the restaurant details and set the `restaurant` state object and the `initialRestaurantValues`. You can use the following implementation:

   ```Javascript
   useEffect(() => {
     async function fetchRestaurantDetail () {
       try {
         const fetchedRestaurant = await getDetail(route.params.id)
         const preparedRestaurant = prepareEntityImages(fetchedRestaurant, ['logo', 'heroImage'])
         setRestaurant(preparedRestaurant)
         const initialValues = buildInitialValues(preparedRestaurant, initialRestaurantValues)
         setInitialRestaurantValues(initialValues)
       } catch (error) {
         showMessage({
           message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
           type: 'error',
           style: GlobalStyles.flashStyle,
           titleStyle: GlobalStyles.flashTextStyle
         })
       }
     }
     fetchRestaurantDetail()
   }, [route])
   ```

   Notice that we have to perform some processing of the entity data. We will use a couple of functions:

   - `prepareEntityImages`: receives an entity and an array of fieldNames that include images and returns the entity including the images in a form that can be rendered by `ImagePickers`.
   - `buildInitialValues`: receives an entity and return an object of initialValues valid for the `Formik` component.

1. Include the function to be run when the user presses on the submit/save button at the end of the form:

   ```Javascript
   const updateRestaurant = async (values) => {
     setBackendErrors([])
     try {
       const updatedRestaurant = await update(restaurant.id, values)
       showMessage({
         message: `Restaurant ${updatedRestaurant.name} succesfully updated`,
         type: 'success',
         style: GlobalStyles.flashStyle,
         titleStyle: GlobalStyles.flashTextStyle
       })
       navigation.navigate('RestaurantsScreen', { dirty: true })
     } catch (error) {
       console.log(error)
       setBackendErrors(error.errors)
     }
   }
   ```

   Notice that after the restaurant is update, we navigate back the the `RestaurantsScreen` that will re-render the restaurants list.

1. Update the `Formik` component with these properties:

   ```JSX
   enableReinitialize
   initialValues={initialRestaurantValues}
   onSubmit={updateRestaurant}
   ```

   The `enableReinitialize` property forces `Formik` to check for changes in the `intialRestaurantValues` assigned to the `initialValues` property.

# 4. Implement Edit and Delete of Products

Follow the steps of the previous exercices to implement the Edit and Deletion of products from the `RestaurantDetailScreen.js`.

You will need to include the `EditProductScreen` in the `RestaurantsStack.js` as follows:

```JSX
<Stack.Screen
  name='EditProductScreen'
  component={EditProductScreen}
  options={{
    title: 'Edit Product'
  }} />
```

Remember that the backend does not expect to receive the restaurantId of the product, since you cannot change the product from one restaurant to another.
