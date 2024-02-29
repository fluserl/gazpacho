# Introduction
We will learn how to define and implement the Endpoints of our backend and how endpoints are handled by Controllers (from the MVC pattern). Controllers run some parts of the business logic of our application.

Secondly, we will learn how an ORM software tool (the _Sequelize_ package) will help us performing operations on the Maria Database from these controllers.
## Prerequisites
* Keep in mind we are developing the backend software needed for DeliverUS project. Please, read project requirements found at:  https://github.com/IISSI2-IS-2024
  * The template project includes EsLint configuration so it should auto-fix formatting problems as soon as a file is saved.
  * The template project also includes the complete model of the App, which was completed in the previous lab.


# Exercices

## 1. Create a new repository from template and clone

Click on "Use this template" in GitHub and "Create a new repository" to create your own repository based on this template. Afterwards, clone your own repository by opening VScode and clone the previously created repository by opening Command Palette (Ctrl+Shift+P or F1) and `Git clone` this repository, or using the terminal and running
```PowerShell
git clone <url>
```

Alternatively, you can use the *Source Control* button in the left-sided bar and click on *Clone Repository* button. 

In case you are asked if you trust the author, please select yes.

It may be necessary to setup your git username by running the following commands on your terminal, in order to be able to commit and push:
```PowerShell
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```

As in previous labs, it is needed to create a copy of the `.env.example` file, name it `.env` and include your environment variables.

Open a terminal a run `npm run install:backend` to install dependencies. A folder `node_modules` will be created under the `DeliverUS-Backend` folder.

## 2. Remember project structure

All the elements related to the backend subsystem are located in `DeliverUS-Backend` folder. You will find the following elements (during this lab we will focus our attention on the `routes` and `controllers` folders):
* **`src/routes` folder: where URIs are defined and referenced to middlewares and controllers**
* **`src/controllers` folder: where business logic is implemented, including operations to the database**
* `package.json`: scripts for running the server and packages dependencies including express, sequelize and others. This file is usally created with `npm init`, but you can find it already in your cloned project.
    * In order to add more package dependencies you have to run `npm install packageName --save` or `npm install packageName --save-dev` for dependencies needed only for development environment. To learn more about npm please refer to [its documentation](https://docs.npmjs.com/cli/v7/commands/npm).
* `package-lock.json`: install exactly the same dependencies in futures deployments. Notice that dependencies versions may change, so this file guarantees to download and deploy the exact same tree of dependencies.
* `.env.example`: example environment variables.
* `src/backend.js`: run http server, setup connections to Mariadb and it will initialize various components
* `src/models` folder: where models entities are defined
* `src/database` folder: where all the logic for creating and populating the database is located
    * `src/database/migrations` folder: where the database schema is defined
    * `src/database/seeders` folder: where database sample data is defined
* `src/controllers/validation` folder: validation of data included in client requests. One validation file for each entity
* `src/middlewares` folder: various checks needed such as authorization, permissions and ownership.
* `src/config` folder: where some global config files are stored (to run migrations and seeders from cli)
* `src/test` folder: will store unit test requests to our Rest API, using the [SuperTest](https://www.npmjs.com/package/supertest) module.


## 3. Routes
Backend software can publish its functionalities through RESTFul services. These services follows the architectural patterns of the HTTP protocol. DeliverUS functionalities are explained at https://github.com/IISSI2-IS-2024#functional-requirements

As an example, if the system provides CRUD operations over an entity, there should be an endpoint for each operation. HTTP POST endpoint to Create, HTTP GET to Read, HTTP PUT|PATCH to Update and HTTP DELETE to Delete.

Routes are usually created following some common patterns and good practices. For instance, for the CRUD operations on the Restaurant entity:
* `HTTP POST /restaurants` to **C**reate a restaurant. The controller method typically is named as `create`
* `HTTP GET /restaurants` to **R**ead all restaurants. The controller method typically is named as `index`
* `HTTP GET /restaurants/{restaurantId}` to **R**ead details of the restaurant with id=restaurantId (a path param). The controller method typically is named as `show`
* `HTTP PUT /restaurants/{restaurantId}` to **U**pdate details of the restaurant with id=restaurantId (a path param). The controller method typically is named as `update`
* `HTTP DELETE /restaurants/{restaurantId}` to Delete the restaurant with id=restaurantId (a path param). The controller method typically is named as `destroy`

Moreover, and endpoint may define some query params. These are usually intended to include some optional parameters in the request, such as implementing a search over the entity. For instance, if we want to query the orders filtered by status, a `status` query param should be defined.

### 3.1. Restaurant routes definition
In order to define routes in an _Express Node.js_ application, we have to follow the following template:
```Javascript
app.route('/path') //the endpoint path
    .get( //the http verb that we want to be available at the previous path
      EntityController.index) // the function that will attend requests for that http verb and that path
    .post( //we can chain more http verbs for the same endpoint
      EntityController.create) // the function that will attend requests for that http verb and that path
````

DeliverUS project organizes its routes in the `src/routes` folder. We define routes for each entity in its own file. For instance, restaurant routes will be defined in the `RestaurantRoutes.js` file.

Complete the file `RestaurantRoutes.js` in order to define the endpoints for the following functional requirements:
* Customer functional requirements:
  * FR1: Restaurants listing: Customers will be able to query all restaurants.
  * FR2: Restaurants details and menu: Customers will be able to query restaurants details and the products offered by them.

* Owner functional requirements:
  * FR1: To Create, Read, Update and Delete (CRUD) Restaurants: Restaurantes are related to an owner, so owners can perform these operations to the restaurants owned by him. If an owner creates a Restaurant, it will be automatically related (owned) to him.


## 4. Controllers.
Controllers are the main components of the business logic layer. Functionalities and business rules may be implemented on controllers specially according to the MVC architectural pattern. DeliverUS project organizes its controllers in the `src/controllers` folder. We define controllers for the business logic related to each entity in its own file. For instance, restaurant controller will be defined in the `RestaurantController.js` file.

Each controller method receives a request `req` and a response `res` object. Request object _represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on_ (see https://expressjs.com/en/4x/api.html#req for more details).
In our project we will need the following attributes from the request:
* `req.body` represents the data that comes from the client (usually a JSON document or the a form sent as multipart/form-data when files are needed).
* `req.params` represents path params. For instance if we defined a `:restaurantId` param, we will have access to it by `req.params.restaurantId`.
* `req.query` represents query params. For instance, if a request includes a `status` query param, it will be accessed by `req.query.status`.
* `req.user` represents the logged in user that made the request. We will learn more about this in lab3.

 Response object _represents the HTTP response that an Express app sends when it gets an HTTP request_ (see https://expressjs.com/en/4x/api.html#res.
In our project we will need the following methods from the `res` object:
* `res.json(entityObject)` returns the object `entityObject` to the client as a JSON document with the HTTP 200 status code. For instance: `res.json(restaurant)` will return the restaurant object as json document.
* `res.json(message)` returns a string `message` to the client as a JSON document with HTTP 200 status code.
* `res.status(500).send(err)` returns the `err` object (typically including some kind of error message) and a HTTP 500 status code to the client.

HTTP Code status used in this project are:
* `200`. Requests attended successfully.
* `401`. Wrong credentials.
* `403`. Request forbidden (not enough privileges).
* `404`. Requested resource was not found.
* `422`. Validation error.
* `500`. General error.

For more information about HTTP Status code see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

### 4.1. Restaurant controller methods.
#### 4.1.1 Create method to Create entity
Typically, we expect that the body of the req includes a JSON document with all the needed information to create a new element of the entity. To access this document we use the `req.body` attribute.

Sequelize offers a way of creating new elements, the `Model.build` method that receives a JSON object that includes the needed fields for buliding a new element and then a `Model.save` method to store it in the corresponding database table.

For the RestaurantController we can do this by using the following snippets:
```Javascript
const newRestaurant = Restaurant.build(req.body)
```
Then, we have to include the logged in owner as the restaurant userId. Notice that until next lab, the system does not implement authentication, so we will temporarily include a fixed value for the userId. We will fix this next lab.
```Javascript
 // newRestaurant.userId = req.user.id // authenticated user
 newRestaurant.userId = 1
```
Finally, we can save the new created restaurant. Our `newRestaurant` variable is built, but not saved. To this end, sequelize offers a `save` method for each model. As this is an I/O operation, we don't want to block the system, so the save method returns a promise. We will use the await/async syntax to make our code more readable. We can use the following snippet:
```Javascript
try {
  const restaurant = await newRestaurant.save()
  res.json(restaurant)
} catch (err) {
    res.status(500).send(err)
}
```

#### 4.1.2 Index methods to Read entity.

Implement the FR1: Restaurants listing: Customers will be able to query all restaurants. To this end, you can use the Sequelize `Model.findAll` method.

#### 4.1.3 Show methods to return entity details.

Implement the FR2: Restaurants details and menu: Customers will be able to query restaurants details and the products offered by them.
To this end, you will receive a `req.params.restaurantId` identifying the restaurant. You can use the Sequelize `Model.findByPk` method.
Notice that you will need to include its products and its restaurant category. Remember that products should be sorted according to the order field value. You can use the following code snippet to perform the query:
```Javascript
const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
  attributes: { exclude: ['userId'] },
  include: [{
    model: Product,
    as: 'products',
    include: { model: ProductCategory, as: 'productCategory' }
  },
  {
    model: RestaurantCategory,
    as: 'restaurantCategory'
  }],
  order: [[{model:Product, as: 'products'}, 'order', 'ASC']],
}
)
```

Next, return the restaurant by using `res.json()` method that receives the object to be returned. Surround this code with the corresponding try and catch In case that an exception is raised, you should return the HTTP status code 500 in the catch block by using the methods `res.status(httpCode).send(error)`.

#### 4.1.4 Update method to modify entity.

Use the `Model.update` method. In case of success, you should return the updated restaurant element by querying the database (using the method `findByPk`) after the update.
This method follows the same steps that when creating a restaurant.

#### 4.1.5 Destroy method to remove entity.
Use the `Model.destroy` method. You need to specify a where clause to remove only the restaurant identified by `req.params.restaurantId` . Destroy returns the number of destroyed elements. Return an info message.

## 5. Test Restaurant routes and controllers

Open a terminal and run:
```
npm run test:backend
```

By now, only the restaurant routes are tested. We will add more tests in following labs.

# References
* Node.js docs: https://nodejs.org/en/docs/
* Express docs: https://expressjs.com/
* Sequelize docs: https://sequelize.org/master/manual/getting-started.html
