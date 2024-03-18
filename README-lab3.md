# Introduction
We will learn how to define and implement the validation middleware and others on our backend Node.js Apps. Middlewares are intented to run some specific parts of our business logic such as:
* Validation of data from clients (the software that performs operations against the backend).
* Checking authorization. 
* Checking permissions.
* Checking ownership of resources.

Secondly, we will learn how a Validation package will help us performing validation of data coming from clients.

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

It may be necessary to setup your git username by running the following commands on your terminal:
```PowerShell
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```

As in previous labs, it is needed to create a copy of the `.env.example` file, name it `.env` and include your environment variables.

Open a terminal a run `npm run install:backend` to install dependencies. A folder `node_modules` will be created under the `DeliverUS-Backend` folder.

## 2. Remember project structure

All the elements related to the backend subsystem are located in `DeliverUS-Backend` folder. You will find the following elements (during this lab we will focus our attention on the `middlewares` and `controllers/validation` folders):

* **`src/middlewares` folder: various checks needed such as authorization, permissions and ownership.**
* **`src/controllers/validation` folder: validation of data included in client requests. One validation file for each entity**
* `package.json`: scripts for running the server and packages dependencies including express, sequelize and others. This file is usally created with `npm init`, but you can find it already in your cloned project.
    * In order to add more package dependencies you have to run `npm install packageName --save` or `npm install packageName --save-dev` for dependencies needed only for development environment. To learn more about npm please refer to [its documentation](https://docs.npmjs.com/cli/v7/commands/npm).
* `package-lock.json`: install exactly the same dependencies in futures deployments. Notice that dependencies versions may change, so this file guarantees to download and deploy the exact same tree of dependencies.
* `.env.example`: example environment variables.
* `src/backend.js`: run http server, setup connections to Mariadb and it will initialize various components
* `src/models` folder: where models entities are defined
* `src/database` folder: where all the logic for creating and populating the database is located
    * `src/database/migrations` folder: where the database schema is defined
    * `src/database/seeders` folder: where database sample data is defined
* `src/routes` folder: where URIs are defined and referenced to middlewares and controllers
* `src/controllers` folder: where business logic is implemented, including operations to the database


* `src/config` folder: where some global config files are stored (to run migrations and seeders from cli)
* `src/test` folder: will store unit test requests to our Rest API, using the [SuperTest](https://www.npmjs.com/package/supertest) module.


## 3. Middlewares and validation middleware.
You will find middlewares at `DeliverUS-Backend/src/middlewares` folder. One for each entity, one for checking if a given id identifies a record of a given entity in the database, and another for authentication/authorization.

At `AuthMiddleware.js` file you will find two functions:
* `isLoggedIn` checks if the user is logged in (the request includes a valid bearer token).
*  `hasRole` receives an array of roles names and check if the logged-in user has the needed role.

At `EntityMiddleware.js` file you will find a function:
* `checkEntityExists` checks, for a given id and entity, if there exists a record in the corresponding table in the database that matches such id, and in case that the record does not exist, it returns the 404 HTTP status code.

At `ValidationHandlingMiddleware.js` file you will find a function:
* `handleValidation` checks the result from express-validator and if an error is found, returns 422 (Validation error) and stops the validation procedure.

At `FileHandlerMiddleware.js` file you will find a function:
* `handleFilesUpload` receives an array of field names, corresponding to file-type attributes for an entity, as well as the base path of the server where these files must be stored. It is responsible for managing the upload of the files to the server, including the generation of a unique name for each file and the storage of the full paths in the corresponding fields of the entity.

For instance, when a user sends a request for creating a new product we will middleware components to:
* check the user is logged in
* check the user has the role owner (since customers cannot create products)
* manage the upload of the image of the product
* check the product belongs to a restaurant the he/she owns (data includes a restaurantId which belongs to the owner that makes the request)
* check the product data include valid values for each property in order to be created according to our information requirements.

In order to check all these requirements, we have to include each middleware method in the corresponding route:
```Javascript
app.route('/products')
    .post(
      isLoggedIn,
      hasRole('owner'),
      handleFilesUpload(['image'], process.env.PRODUCTS_FOLDER),
      ProductValidation.create,
      handleValidation,
      ProductMiddleware.checkProductRestaurantOwnership,
      ProductController.create
    )
```

### 3.1. Validation middlewares
Validation middlewares are intended to check if the data that comes in a request fulfills the information requirements. Most of this requirements are defined at the database level, and were included when creating the schema on the migration files. Some other requirements, are checked at the application layer. For instance, if you want to create a new restaurant, some images can be provided: logo image and hero image. These files should be image files and its size should be less than 10mbs. In order to check these other requirements we will use the `express-validator` package. **It is a good practice to make a complete validation using `express-validator` regardless if such validation is partially included in the database or not.**

Notice that we will create an array of rules for each endpoint that would require validation, usually a `create` array of rules for creating new data and an `update` array of rules for updating data.

More info about **using** middlewares can be found at Express documentation: https://expressjs.com/en/guide/using-middleware.html

More info about **writing** middlewares can be found at Express documentation: https://expressjs.com/en/guide/writing-middleware.html

### 3.2. Defining middlewares and validation middlewares for Restaurant routes
Open the file `DeliverUS-Backend/src/routes/RestaurantRoutes.js`. You will find that routes are defined, but it is needed to define which middlewares will be called for each route.

Include middlewares needed for Restaurant routes according to the requirements of Deliverus project. For each route you should determine if:
* is it needed that a user is logged in?
* is it needed that the user has a particular role?
* may the data include files? 
* is it needed that the restaurant belongs to the logged-in user? (restaurant data should include a userId which belongs to the owner of that restaurant)
* is it needed that the restaurant data include valid values for each property in order to be created according to our information requirements?


### 3.3. Implement validation middleware for Restaurant create()
Open the file `controllers/validation/RestaurantValidation.js`. You will find the arrays of rules for validating data when creating `create` and when updating `update`.
Restaurant properties are defined at database level. You can check the corresponding migration. Some validations are done at the app level, for instance we will include validations to check that email data is a valid email.

Moreover, it is common to apply some sanitizing over data. For instance, to remove blank spaces at the beginning and at the end of string values we can use the `trim()` method. 

In order to add validations, follow this snippet:
```Javascript
const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
  // TODO: Complete validations
  ], update:[
    ...
  ]

```

Complete validations for the rest of the fields in Restaurant entity: `address`, `postalCode`, `url`, `email`, `phone`, `restaurantCategoryId` and `userId`.

For a comprehensive list of validations methods, see https://github.com/validatorjs/validator.js#validators, and for a comprehensive list of sanitizing methods, see https://github.com/validatorjs/validator.js#sanitizers


### 3.4. Check validation in controllers
When validation fails, it is passed to the following middleware method in the middleware chain. In this case, the next method should be the validation handler method which will be always executed after the validation middleware.

Within the `handleValidation` method, we can check if any validation rule has been violated, and return the appropriate response. To this end, the `handleValidation` method includes the following code:

```Javascript
const handleValidation = async (req, res, next) => {
  const err = validationResult(req)
  if (err.errors.length > 0) {
    res.status(422).send(err)
  } else {
    next()
  }
}
```

## 4. Test Restaurant routes, controllers and middlewares

Open a terminal and run:
```
npm run test:backend
```

In this project, tests are included for all the functional requirements of the complete backend, including those related to owners and customers. Since some of these requirements must be implemented by students as part of the deliverable project, you will notice that running the tests yields many failures.

In preparation for this lab, you must ensure that all the restaurant tests are passed. You can consult a summary of the test runs in the file `tests/e2e/testResults.csv`. When you tackle the implementation of the functional requirements related to the client side in the context of the deliverable project, you must ensure that all tests are passed.

## A. Annex about transactions
Some database operations should be enclosed in a database transaction. This is useful when it is needed to ensure that several operations are successfully executed in the database, and in case that any of them raise an exception, undo all the previous operations. For instance, to create an `Order` it is needed to insert a record in the `Orders` table and to insert several records in the `OrderProducts` table. This must be done in a transaction.

To create a transaction by using Sequelize, you can follow this sample code snippet:

```Javascript
const models = require('../models')
const EntityName = models.EntityName

const someFunctionThatNeedsTransaction = async (req, res) => {
  let newEntity = EntityName.build(req.body)
  const transaction = await models.sequelize.transaction() //creates a transaction
  try {
    newEntity = await newEntity.save({transaction}) //use the transaction in every operation
    await newEntity.addRelatedEntity(relatedEntityId, { through: { associatedAttribute1: value1, associatedAttributeN: valueN }, transaction }) //adding associated element through an association table
    await transaction.commit() //confirm all operations
    res.json(newEntity)
  } catch (err) {
    await transaction.rollback() //in case of error, rollback all the operations executed in the context of the transaction
    res.status(500).send(err)
  }
}
```
