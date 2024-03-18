# Introduction

During this lab first, we will learn how to validate forms with formik and yup. Secondly, we will learn how to perform POST requests to the backend.

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

It is important to notice that this base project includes:

- Previous labs solved, including creating restaurant and products forms (lacks from performing validation and requests to backend)
- Needed packages for validate forms, Formik and yup, added to package.json

Keep in mind that to make some API requests, it is needed to be logged-in. So confirm that you can log-in with some owner user. The provided user-seeder at the backend creates an owner with the following credentials:

email: owner1@owner.com
password: secret
Once the user is logged in, the bearer token is used in every request.

# 1. CreateRestaurant Form validation

Forms have to be validated at front-end before submission is done to backend. Validation should check if the filled data matches the requirements set in the various form inputs. For instance: an input for email should contain a valid email, or password should have a minimum size, or some input is required.

To this end, we will use the most popular package for validation in React and React Native projects named Formik. See the general docs for Formik React <https://formik.org/docs/overview> and the guide for using it in React-native <https://formik.org/docs/guides/react-native>.

Validation rules could be handwritten or we can use another package. Formik recommend using Yup package for schema validation rules. These can include various rules such as: required, email, strings, numbers, dates or default values. See documentation of Yup package <https://github.com/jquense/yup>.

We will include the validation for the `CreateRestaurantScreen` form by following these steps:

1. Complete the import sentences of Formik and ErrorMessage from 'formik', and yup from yup as follows:

   ```Javascript
   import { ErrorMessage, Formik } from 'formik'
   import * as yup from 'yup'
   ```

1. Keep in mind that Formik needs to be fed with an object of the initial values of the form inputs as follows:. Remember that these names has to match the ones that the backend expects when creating a Restaurant:

   ```Javascript
   const initialRestaurantValues = { name: null, description: null, address: null, postalCode: null, url: null, shippingCosts: null, email: null, phone: null, restaurantCategoryId: null }

   ```

1. Define a new validationSchema object by using yup rules. This validationSchema will be used by Formik to check the validity of the fields. You can use the following code snippet.

   ```Javascript
   const validationSchema = yup.object().shape({
   name: yup
     .string()
     .max(255, 'Name too long')
     .required('Name is required'),
   address: yup
     .string()
     .max(255, 'Address too long')
     .required('Address is required'),
   postalCode: yup
     .string()
     .max(255, 'Postal code too long')
     .required('Postal code is required'),
   url: yup
     .string()
     .nullable()
     .url('Please enter a valid url'),
   shippingCosts: yup
     .number()
     .positive('Please provide a valid shipping cost value')
     .required('Shipping costs value is required'),
   email: yup
     .string()
     .nullable()
     .email('Please enter a valid email'),
   phone: yup
     .string()
     .nullable()
     .max(255, 'Phone too long'),
   restaurantCategoryId: yup
     .number()
     .positive()
     .integer()
     .required('Restaurant category is required')
   })
   ```

   Notice that:

   - There should be a property named after each of the form inputs that needs validation.
   - Rules defined above include: a type of data that is expected (string, or number for instance), the length of strings, if a number can be negative or not, and if an input is required .
   - If the field does not follow any of these rules, the message passed to each rule should be shown to the user. For instance, if the shippingCosts is not a positive number, the message _Please provide a valid shipping cost value_ will be shown.

1. Remember that the inputs have to be nested under the `Formik` component. Add the following:

   ```JSX
   <Formik
     validationSchema={validationSchema}
     initialValues={initialRestaurantValues}
     onSubmit={createRestaurant}>
     {({ handleSubmit, setFieldValue, values }) => (
       <ScrollView>
         /* Your views, form inputs, submit button/pressable */
       </ScrollView>
     )}
   </Formik>
   ```

   It is important to understand how the `Formik` component works. The Formik component is in charge of handling the form values, validation, errors and submission. To this end we have to define the following properties:

   - `validationSchema`: the validation rules, usually a yup object.
   - `initialValues`: the initial values given to each of the form inputs.
   - `onSubmit`: the function to be called when the inserted form values pass the validation. Usually we will call a function that will be in charge of preparing the data and using a creation endpoint for the entity. We will learn hoy to POST data to the backend later. At this moment we will just print the values in console.

     ```Javascript
     const createRestaurant = async (values) => {
       //later we will call a method to perform a POST request
       console.log(values)
     }
     ```

   - `handleSubmit`: is the function that triggers the validation. It has to be called when the user presses the submission button.
   - `values`: is the array of elements that represents the state of the form.
   - `setFieldValue`: sometimes we will have to manually handle the storage of field values. This is a function that receives as first parameter the name of the field, and as second parameter the value for that field. It will be needed for non standard `InputItems` such as `Imagepickers` or `Dropdown/select` input controls.

1. Next, we need to modify the behaviour of some components so they use the values object properties handled by `Formik`.

   - Modify the `DropDownPicker` so the following properties are defined as:

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
       placeholder='Select the restaurant category'
       containerStyle={{ height: 40, marginTop: 20 }}
       style={{ backgroundColor: GlobalStyles.brandBackground }}
       dropDownStyle={{ backgroundColor: '#fafafa' }}
     />
     ```

   - `InputItem` is a component the includes the error handling. However, non-standard input controls from 3rd parties don't handle `Formik` errors. For instance, `Dropdown picker` does not handle these errors, so add the following `<ErrorMessage>` component following the dropdown picker:

     ```JSX
     <ErrorMessage name={'restaurantCategoryId'} render={msg => <TextError>{msg}</TextError> }/>
     ```

   - Modify the `Imagepickers` as follows (example for `logo` image picker):

     ```JSX
     <Pressable
       onPress={() =>
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

   and apply similar modification to the `heroImage` `ImagePicker`.

1. Next, we need to modify the final `<Pressable>` component to call the `handleSubmit` method. Modify the `onPress` handler definition: `onPress={handleSubmit}`

Check that the validation now works and shows to the user the validation rules broken. Notice that these errors are handled and rendered in the `InputItem` component provided, or the `ErrorMessage` added after the `DropdownPicker`.

Fill the form with valid values and check if they are printed in the console when pressing the last `pressable` labeled with _Save_.

# 2. POST Request to create a restaurant

Backend provides a POST endpoint to create a restaurant. Notice that handling of images and files is already solved at frontend and backend in various provided artifacts. To include the POST request to your project, you can follow these steps:

1.  Add new endpoint
    In order to create a restaurant, we have to perform a POST request to `/restaurants`. `ApiRequestHelper` includes a `post` function that help us with this, we just need to provide the route and the data to be posted. To this end, include the following at the `RestaurantEndpoints.js` file:

        ```Javascript
        function create (data) {
          return post('restaurants', data)
        }
        ```

        Remember to import the `post` function from `ApiRequestHelper` and export the create function as well.

1.  Implement `createRestaurant` function at `CreateRestaurantScreen.js` file.
    In the previous exercise we just printed the values in the console. Now we need to make the API POST request. To this end keep in mind that:

    - Errors can occur at backend, so we need to handle the backend response to check if some errors ocurred.
    - I/O operations can freeze the interface so we need to handle with promises. The cleanest way of doing so is to declare the function `async` and using `await` when calling to the API.
    - Once the restaurant is created we may navigate to the `RestaurantsScreen`. You will need to declare the {route} param at the component level, and you will need to navigate including some information, so the RestaurantScreen will refresh the restaurant list and therefore the newly created restaurant is listed.
      To address these issues, we propose the following code snippet:

      ```Javascript
      const createRestaurant = async (values) => {
        setBackendErrors([])
        try {
          const createdRestaurant = await create(values)
          showMessage({
            message: `Restaurant ${createdRestaurant.name} succesfully created`,
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

    Moreover, we will need to store backend errors that eventually are returned in a state variable:

    ```Javascript
    const [backendErrors, setBackendErrors] = useState()
    ```

    And finally, we will need to show backendErrors if present. To do so, we can add the following at the end of the form, just before the _Save_ last `Pressable`:

    ```JSX
    {backendErrors &&
      backendErrors.map((error, index) => <TextError key={index}>{error.msg}</TextError>)
    }
    ```

    See the _Annex: Conditional Rendering_ for an explanation on the code above.

At `RestaurantsScreen`, we need to add the {route} as a component prop, and add another trigger value to the `useEffect` that queries the restaurant list. At the moment it was triggered if `loggedInUser` was changed, now add the route param as follows:
`[loggedInUser, route]`

Test the complete solution.

# 3. Create product validation and POST

Follow the same steps to validate the create product form and to perform the post request.

Notice that when creating a new product, we will need to include the `restaurantId` where it belongs. This restaurant id should be received as: `route.params.id` when navigating from `RestaurantDetailScreen` to the `CreateProductScreen`.

# 4. Extra: Component refactoring

Discuss with your teacher and partners if some components could be refactored. Is it possible to create a submit button component so that we don't copy/paste all the pressable details? Do you identify other elements that could be refactored as custom components and reused after?

Could it be possible to refactor de `DropdownPicker` and its error message?

# Annex: conditional rendering in JSX

Sometimes it is necessary to show a content depending on some conditions. To do this, it is possible to enter boolean conditions in the render method (return) of the component. Before the conditioned block prepend the condition followed by &&. Such block will only be rendered when the condition resolves to _truthy_.

```Javascript
return (
   // some JSX elements
   { backendErrors &&
        backendErrors.map((error, index) => <TextError key={index}>{error.msg}</TextError>)
   }
)
```

The expression `backendErrors && ...` checks that the the variable is _truthy_ or not and therefore, errors will only be rendered when backendErrors is not undefined nor null.
