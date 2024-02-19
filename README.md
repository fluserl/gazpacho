# Introduction
We will learn how to run a basic _Node.js_ HTTP server and setup our project structure using the _Express_ framework.
Secondly, we will understand how to create the Model of our project (from the MVC pattern) and learn how the _Sequelize_ package will help us creating the relational database schema and perform operations on the Maria Database.
## Prerequisites
* Keep in mind we are developing the backend software needed for DeliverUS project. Please, read project requirements found at:  https://github.com/IISSI2-IS-2024
  * The template project includes EsLint configuration so it should auto-fix formatting problems as soon as a file is saved.

* Install the software requirements:
  * MariaDB: https://mariadb.org/download/
    * MacOS: https://mariadb.com/kb/en/installing-mariadb-on-macos-using-homebrew/
    
    Create a database `deliverus` and a user (for example `iissi_user`). The user must have privileges on the `deliverus` database. 
  * Node.js: https://nodejs.org/en/download/
  * Visual Studio Code: https://code.visualstudio.com/
    * Extensions: ESLint (dbaeumer.vscode-eslint)
  * Git: https://git-scm.com/

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

Open a terminal a run `npm run install:backend` to install dependencies. A folder `node_modules` will be created under the `DeliverUS-Backend` folder. 



## 2. Inspect project structure

All the elements related to the backend subsystem are located in `DeliverUS-Backend` folder. You will find the following elements (some of them are empty and will be added in following labs):
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
    * `src/controllers/validation` folder: validation of data included in client requests. One validation file for each entity
* `src/middlewares` folder: various checks needed such as authorization, permissions and ownership.
* `src/config` folder: where some global config files are stored (to run migrations and seeders from cli)
* `src/test` folder: will store unit test requests to our Rest API, using the [SuperTest](https://www.npmjs.com/package/supertest) module.


## 3. Inspect and run backend.js
### 3.1. Environment values
We need an environment file including the credentials of our database. To this end make a copy of `.env.example` and name the new file as `.env` at the project root folder.
Replace the database connection values in order to match your database credentials.
It is important to notice that the file `.env` contains credentials to access your database so it **must not be pushed to your repository** (as specified in .gitignore).

NOTE: you need a database user and a database schema named `deliverus`. Check Lab0 and IISSI1 for more information.

### 3.2. Run HTTP server and connect to database

We will run our first version of the backend server (`backend.js`):
 
```JavaScript
import { initializeServer } from './app.js'

const enableConsoleLog = true
initializeServer(enableConsoleLog)
```

The function `initializeServer`, as defined in `apps.js`, instantiates an Express app, load all the API routes as defined in .js files in the `src/routes` folder, and initializes the database connection through Sequelize:

```JavaScript
import express from 'express'
import dotenv from 'dotenv'
import loadRoutes from './routes/index.js'
import { initSequelize, disconnectSequelize } from './config/sequelize.js'

const initializeServer = async (enableConsoleLog = false) => {
  controlConsoleLog(enableConsoleLog)
  try {
    const app = await initializeApp()
    const port = process.env.APP_PORT || 3000
    const server = await app.listen(port)
    console.log('DeliverUS listening at http://localhost:' + server.address().port)
    return { server, app }
  } catch (error) {
    console.error(error)
  }
}

const initializeApp = async () => {
  dotenv.config()
  const app = express()
  loadRoutes(app)  
  app.connection = await initializeDatabase()
  await postInitializeDatabase(app)
  return app
}

const initializeDatabase = async () => {
  let connection
  try {
    connection = await initSequelize()
    console.log('INFO - Relational/MariaDB/Sequelize technology connected.')
  } catch (error) {
    console.error(error)
  }
  return connection
}
```

* Run backend.js by opening a Terminal (Ctrl+Shift+\`) and executing `npm run start:backend`. This command will launch `node --watch backend.js`, as defined in `DeliverUS-Backend/package.json`; when using the `--watch` option, each time you change and save some file of your project, it will stop the server and run it again, so it is very suitable for developing purposes.

  You should read something like:
  ```PowerShell
  (...)
  Executing (default): SELECT 1+1 AS result
  INFO - Relational/MariaDB/Sequelize technology connected.
  DeliverUS listening at http://localhost:3000
  ```

* Alternatively you can run and debug your project by using the *Run and Debug* tool of VSCode. It can be found on the left-sided bar or by typing `shift+ctrl+D`, and selecting `Debug Backend` in the drop down list. Add a breakpoint at line 21 of app.js, and click on the play icon in the *Run and Debug* tool to debug this file. Inspect `server` variable.

## 4. Migrations
Keep in mind the requirements described at: https://github.com/IISSI2-IS-2024

And this is the Entity diagram proposed:

***

![alt text](https://user-images.githubusercontent.com/19324988/155700850-bb7817fb-8818-440b-97cb-4fbd33787f20.png)

***

Migrations are a powerfull tool to keep your database schema and statuses tracked. During this subject, we will use them to create our database schema. Notice that you can find one migration for each entity: User, Restaurant, Product, Order (and ProductCategory + RestaurantCategory).
Each migration has two methods: `up` and `down`, that dictate how to perform the migration and undo it.
For our purposes, the `up` method will include the creation of each table and its fields, defining PrimaryKey and ForeignKeys.

You will find migrations' files completed for all entities but Restaurant.

### 4.1. Complete Create Restaurant migration
Please complete the code of the file `database/migrations/<timestamp>-create_restaurant.js` in order to include the Resturant entity properties (**it is mandatory to name them as it is shown in the Entity Diagram**, specifically: name, description, address, postalCode, url, restaurantCategoryId, shippingCosts, email, logo, phone, createdAt, updatedAt, userId, status). Check Sequelize documentation for [Migrations Skeleton](https://sequelize.org/master/manual/migrations.html#migration-skeleton) and [DataTypes](https://sequelize.org/v5/manual/data-types.html); alternatively, you can check the Product migration for examples.

Keep in mind that relationships are implemented by using foreign keys. Check Restaurant relationships and define foreign key properties and how are referencing related tables. For instance, a Restaurant is related to RestarantCategory, so you may have to define the following foreign key:
```Javascript
restaurantCategoryId: {
  type: Sequelize.INTEGER,
  references: {
    model: {
      tableName: 'RestaurantCategories'
    },
    key: 'id'
  }
}

```

Once you have completed the Restaurant table migration, you should run migrations. To this end, a Command Line Interface (CLI) binary is available (named `sequelize-cli`). It uses the database connection details found at `DeliverUS-Backend/src/config/config.js`.
To run migrations, execute them using npx (tool for running npm packages binaries) on the terminal. First, you need to navigate to the Backend directory:
```PowerShell
cd DeliverUS-Backend
```

And then run:
```PowerShell
npx sequelize-cli db:migrate
```
After doing this, you should find created tables in your mariadb.

To undo migrations you can execute:
```PowerShell
npx sequelize-cli db:migrate:undo:all
```

More information about migrations can be found at: https://sequelize.org/master/manual/migrations.html

## 5. Seeders
Seed files are used to populate database tables with sample or test data. You can find them in the `seeders` folder. Notice that `restaurants_seeder.js` presumes a given naming for restaurants table fields.

You can run your seeders to populate the database by running:
```PowerShell
npx sequelize-cli db:seed:all
```

And you can undo them by running:
```PowerShell
npx sequelize-cli db:seed:undo:all
```

More information about seeders can be found at: https://sequelize.org/master/manual/migrations.html#creating-the-first-seed

---
If you make any changes to migrations or seeders, you can update the database by running the undo migrations, run migrations, and run seeders commands all at once by opening a terminal and running `npm run migrate:backend`. This script is configured to be run on the root directory.


## 6. Models
Object Relational Mapping (ORM) is a software programming technique to bind business logic objects to data sources, so programmers can directly work with high-level objects in order to perform database operations seamlessly. Usually, objects that are related to database entities are called _Models_ and we work with them in order to interact with their corresponding database entities for standard CRUD (create, read, update and delete) operations. When using ORM tools you are provided with the following operations: create, findAll, update and destroy (among others).

Sequelize is a Node.js Object Relational Mapping tool that provides all the necessary tools for establishing connections to the database (as explained in section 3), running migrations and seeders (sections 4 and 5), defining models and perform operations.

You can find Models definitions for all entities at `DeliverUS-Backend/src/models` folder. Each model is a class named after its corresponding table (but in singular) and extends the Model class from Sequelize.

### 6.1. Complete Restaurant model
Please complete the code of the file `DeliverUS-Backend/src/models/restaurant.js` in order to include all the properties that match the corresponding fields of the Restaurants table.

Notice that we have also defined the relationships between Models. For instance, Restaurant model is related to RestaurantCategory, User, Product and Order. In order to define these relationships, we have to include the following method:

```Javascript
 static associate (models) {
      // define association here
      Restaurant.belongsTo(models.RestaurantCategory, { foreignKey: 'restaurantCategoryId', as: 'restaurantCategory' })
      Restaurant.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Restaurant.hasMany(models.Product, { foreignKey: 'restaurantId', as: 'products' })
      Restaurant.hasMany(models.Order, { foreignKey: 'restaurantId', as: 'orders' })
    }
```
On the other side of the relationship, you have to include the oposite relation For instance, you can find that a Product _belongsTo_ a Restaurant, or that a RestaurantCategory _hasMany_ Restaurant.

Finally, you can define methods that perform computations over the model. For instance, in the Restaurant model, you can find a method that computes and returns the average service time of a restaurant.
```Javascript
async getAverageServiceTime () {
      try {
        const orders = await this.getOrders()
        const serviceTimes = orders.filter(o => o.deliveredAt).map(o => moment(o.deliveredAt).diff(moment(o.createdAt), 'minutes'))
        return serviceTimes.reduce((acc, serviceTime) => acc + serviceTime, 0) / serviceTimes.length
      } catch (err) {
        return err
      }
    }
````

## 7. Test migrations, seeders and Restaurant model
In order to make a minimal test, we have included the following code at `src/controllers/RestaurantController.js` and `src/routes/RestaurantRoutes.js` (we will address the details of implementing routes and controllers in the next lab):
```Javascript
// RestaurantController.js
import { Restaurant, RestaurantCategory} from '../models/models.js'

const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const RestaurantController = {
  index
}
export default RestaurantController

```

```Javascript
// RestaurantRoutes.js
import RestaurantController from '../controllers/RestaurantController.js'

const loadFileRoutes = function (app) {
  app.route('/restaurants')
    .get(
      RestaurantController.index)
}

export default loadFileRoutes
```

Notice that the `index` function performs a query to the model in order to retrieve all restaurants from the database, ordered by RestaurantCategory, and returns them as a JSON document. Next we define the endpoint `/restaurants` that answers to requests using the `index` function in `RestaurantController`. 

All the routes in the `src/routes` folder are dinamically loaded in `app.js`:
```Javascript
import loadRoutes from './routes/index.js'
...
const initializeApp = async () => {
  ...
  const app = express()
  loadRoutes(app)  
  ...
}
```
Now you are ready to test your backend. Open a terminal and run:
```
npm run test:backend
```

By now, only the `Get all restaurants` route is tested. We will add more tests in following labs.


# References
* Node.js docs: https://nodejs.org/en/docs/
* Express docs: https://expressjs.com/
* Sequelize docs: https://sequelize.org/master/manual/getting-started.html
* JSON spec: https://www.json.org/json-en.html; (en español: https://www.json.org/json-es.html)