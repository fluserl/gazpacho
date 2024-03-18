# Introduction

We will learn how to perform GET requests from the Frontend client to the backend server. It is important to remember that to performn an HTTP GET Request we will need:

- the URI where we will address the request
- optionally, some path or query params.

For instance, if we want to obtain the list of restaurants that belongs to the current logged-in owner, we will do an HTTP GET Request to: `/users/myrestaurants` and we will have to provide a bearer token since this endpoint requires a logged-in user (and it has to be of type owner)

Once we will learn this basic elements, we will develop the Restaurants list and the restaurant detail screen.

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

- all the required screens and artifacts needed to perform the **Sign-up, Sign-in, Sign-out and edit user information**.
- Helpers files for performing requests for RESTful services
- New packages including: axios, image-pickers, font loading
- some styling and GUI improvements including:
  - Loaded Montserrat fonts.
  - Flash messaging to notify user with results of actions.
  - Text components for re-use of some styling (TextRegular, TextSemibold, TextError).
  - Restaurants and products are rendered using ImageCard componentes (Solution to extra exercises of previous lab).

In order to make some API requests, it is needed to be logged-in. So **confirm that you can log-in with some owner user**. The provided user-seeder at the backend creates an owner with the following credentials:

- email: `owner1@owner.com`
- password: `secret`

Once the user is logged in, the bearer token is used in every request.

# 1. RESTful API Requests

You have been provided with some files located at `src/api`:

- `helpers\ApiRequestHelper.js` that includes the needed functions to perform GET, POST, PUT and DELETE HTTP requests to the Backend API. It uses Axios package. Axios is the most popular package to perform HTTP requests in Javascript environments. It is an easier to use package than the included Fetch API.
  - `get` function receives the destination route of the request, perform the HTTP GET request and can throw an error exception
  - `post` and `put` functions receive the destination route and the data needed to perform a POST or a PUT HTTP requests respectively. Keep in mind that POST requests are intended for creating new elements and PUT requests are intended for updating elements.
  - `destroy` function receives the destination route to perform a DELETE HTTP request.
- `AuthEndpoints.js` that includes the needed functions to perform authorization and user related operations. It also setup the bearer token for future requests.
- Other helper files that includes errors and files handling when performing requests.

## 1.1. RestaurantEndpoints implementation

We have to modify `RestaurantEndpoints.js` in order to perform HTTP GET requests. In the future we will extend this file in order to create or edit restaurants.

Modify the `getAll` function so it uses the `get` method as follows:

```Javascript
import { get } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('/users/myrestaurants')
}
```

## 1.2. RestaurantsScreen implementation

In order to retrieve owner's restaurants it is needed to be logged-in. There are some ways to avoid that the Front-end makes requests if the user is not logged in. For simplicity, we will just ask if there is a logged-in user before executing the request.

The `loggedInUser` is accessed through the `AuthorizationContext`. Keep in mind that a `Context` is a place to memorize information that could be shared between various components. The `AuthorizationContext` stores the information about the logged-in user. To obtain a reference of the user, add the following to the RestaurantsScreen component:

```JavaScript
const { loggedInUser } = useContext(AuthorizationContext)
```

If `loggedInUser` is `null`, it means that no user is logged-in. By contrast, if a user is logged-in, the `loggedInUser` variable will store the user object including its properties.

Once we have retrieved the `loggedInUser` from the context, we can ask if its null or not before doing the operation.

We can modify our `useEffect` function so we can retrieve restaurants. Analyse the following code snippet:

```Javascript
useEffect(async () => {
   const fetchedRestaurants = await getAll()
   setRestaurants(fetchedRestaurants)
  }, [])
```

This code snippet has some problems:

1. We have to use `await` since getAll returns a `Promise`. This forces us to declare the arrow function as `async`. Async functions always return a `Promise`. However, `useEffect` expects a function that returns nothing, so we are not allowed to do this.
2. Restaurants should be fetched if a `loggedInUser` exists. We should declare this object as the triggering object value for this `useEffect`. It has to be added to the array that receives as second parameter.
3. No error handling is implemented, an API call could return some kind of error and our code would not notice.

We have to face these problems. Check the following implementation and discuss what have been done to address each of the problems:
First, import showMessage and some styles as follows:

```Javascript
import { showMessage } from 'react-native-flash-message'
```

Secondly, check the following implementation:

```Javascript

  const { loggedInUser } = useContext(AuthorizationContext)
  useEffect(() => {
    async function fetchRestaurants () { // Addresses problem 1
      try {
        const fetchedRestaurants = await getAll()
        setRestaurants(fetchedRestaurants)
      } catch (error) { // Addresses problem 3
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    if (loggedInUser) { // Addresses problem 2
      fetchRestaurants()
    } else {
      setRestaurants(null)
    }
  }, [loggedInUser]) // Addresses problem 2
```

Now, check that the owner's restaurants are retrieved from the backend and that they are listed at RestaurantsScreen component. Remember to log in as an owner.

## 1.3. RestaurantDetail implementation

Now we need to modify our code to retrieve restaurant details. To this end, modify your code to:

- Change `getDetail(id)` function of `RestaurantEndpoints.js`
- Change `useEffect` function of `RestaurantDetailScreen.js`

Notice that we do not need to check if a user is logged in, as the details of restaurants are public.

Check that restaurant details and products are retrieved from the backend and listed at RestaurantDetailScreen component.

# 2. Extra

`FlatList` has a way of rendering an empty list. For instance, when no restaurants are fetched. Check out FlatList documentation for more information, and modify RestaurantsScreen and RestaurantDetail to include an empty list renderer. https://reactnative.dev/docs/flatlist#listemptycomponent
