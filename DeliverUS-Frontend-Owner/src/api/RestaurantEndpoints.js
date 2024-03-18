
function getAll () {
  return restaurantsMock
}

function getDetail (id) {
  return restaurantsDetailMock[id]
}

export { getAll, getDetail }

const restaurantsMock = [
  {
    id: 1,
    name: 'Casa Félix',
    description: 'Cocina Tradicional',
    address: 'Av. Reina Mercedes 51, Sevilla',
    postalCode: '41012',
    url: 'https://goo.gl/maps/GZEfzge4zXz6ySLR8',
    shippingCosts: 2.5,
    averageServiceMinutes: null,
    email: 'casafelix@restaurant.com',
    phone: '954123123',
    logo: 'public/restaurants/casaFelixLogo.jpeg',
    heroImage: null,
    status: 'closed',
    restaurantCategoryId: 1,
    restaurantCategory: {
      id: 1,
      name: 'Spanish',
      createdAt: '2021-11-24T12:14:48.000Z',
      updatedAt: '2021-11-24T12:14:48.000Z'
    }
  },
  {
    id: 2,
    name: '100 montaditos',
    description: 'Una forma divertida y variada de disfrutar de la comida. Un lugar para compartir experiencias y dejarse llevar por el momento.',
    address: 'Av. de la Reina Mercedes, 43, Sevilla',
    postalCode: '41012',
    url: 'http://spain.100montaditos.com/',
    shippingCosts: 1.5,
    averageServiceMinutes: null,
    email: 'attcliente@gruporestalia.com',
    phone: '+34902197494',
    logo: 'public/restaurants/100MontaditosLogo.jpeg',
    heroImage: 'public/restaurants/100MontaditosHero.jpeg',
    status: 'online',
    restaurantCategoryId: 2,
    restaurantCategory: {
      id: 2,
      name: 'Fast food',
      createdAt: '2021-11-24T12:14:48.000Z',
      updatedAt: '2021-11-24T12:14:48.000Z'
    }
  }
]

const restaurantsDetailMock =
[
  {},
  {
    id: 1,
    name: 'Casa Félix',
    description: 'Cocina Tradicional',
    address: 'Av. Reina Mercedes 51, Sevilla',
    postalCode: '41012',
    url: 'https://goo.gl/maps/GZEfzge4zXz6ySLR8',
    shippingCosts: 2.5,
    averageServiceMinutes: null,
    email: 'casafelix@restaurant.com',
    phone: '954123123',
    logo: 'public/restaurants/casaFelixLogo.jpeg',
    heroImage: null,
    status: 'closed',
    restaurantCategoryId: 1,
    products: [
      {
        id: 1,
        name: 'Ensaladilla',
        description: 'Tuna salad with mayonnaise',
        price: 2.5,
        image: 'public/restaurants/products/ensaladilla.jpeg',
        order: 1,
        availability: true,
        restaurantId: 1,
        productCategoryId: 1,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 1,
        productCategory: {
          id: 1,
          name: 'Starters',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 2,
        name: 'Olives',
        description: 'Home made',
        price: 1.5,
        image: 'public/restaurants/products/aceitunas.jpeg',
        order: 2,
        availability: true,
        restaurantId: 1,
        productCategoryId: 1,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 1,
        productCategory: {
          id: 1,
          name: 'Starters',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 3,
        name: 'Coca-cola',
        description: '33 cc',
        price: 1.5,
        image: 'public/restaurants/products/cola.jpeg',
        order: 3,
        availability: true,
        restaurantId: 1,
        productCategoryId: 3,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 3,
        productCategory: {
          id: 3,
          name: 'Drinks',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 4,
        name: 'Water',
        description: '50 cc',
        price: 1,
        image: 'public/restaurants/products/agua.png',
        order: 4,
        availability: true,
        restaurantId: 1,
        productCategoryId: 3,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 3,
        productCategory: {
          id: 3,
          name: 'Drinks',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 5,
        name: 'Coffee',
        description: 'expresso',
        price: 1.2,
        image: 'public/restaurants/products/cafe.jpeg',
        order: 5,
        availability: true,
        restaurantId: 1,
        productCategoryId: 3,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 3,
        productCategory: {
          id: 3,
          name: 'Drinks',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 6,
        name: 'Steak',
        description: 'Pork',
        price: 3.5,
        image: 'public/restaurants/products/steak.jpeg',
        order: 6,
        availability: true,
        restaurantId: 1,
        productCategoryId: 4,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 4,
        productCategory: {
          id: 4,
          name: 'Main Courses',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 7,
        name: 'Grilled tuna',
        description: 'with salad',
        price: 4.5,
        image: 'public/restaurants/products/grilledTuna.jpeg',
        order: 7,
        availability: true,
        restaurantId: 1,
        productCategoryId: 4,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 4,
        productCategory: {
          id: 4,
          name: 'Main Courses',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 8,
        name: 'Mexican burritos',
        description: 'tomato, chicken, cheese',
        price: 4,
        image: 'public/restaurants/products/burritos.jpeg',
        order: 8,
        availability: true,
        restaurantId: 1,
        productCategoryId: 4,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 4,
        productCategory: {
          id: 4,
          name: 'Main Courses',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 11,
        name: 'Churros',
        description: '5 pieces',
        price: 2,
        image: 'public/restaurants/products/churros.jpeg',
        order: 9,
        availability: false,
        restaurantId: 1,
        productCategoryId: 5,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 5,
        productCategory: {
          id: 5,
          name: 'Desserts',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 10,
        name: 'Apple pie',
        description: '1 piece',
        price: 3,
        image: 'public/restaurants/products/applePie.jpeg',
        order: 10,
        availability: false,
        restaurantId: 1,
        productCategoryId: 5,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 5,
        productCategory: {
          id: 5,
          name: 'Desserts',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 9,
        name: 'Chocolate cake',
        description: '1 piece',
        price: 3,
        image: 'public/restaurants/products/chocolateCake.jpeg',
        order: 11,
        availability: true,
        restaurantId: 1,
        productCategoryId: 5,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 5,
        productCategory: {
          id: 5,
          name: 'Desserts',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      }
    ],
    restaurantCategory: {
      id: 1,
      name: 'Spanish',
      createdAt: '2021-11-24T12:14:48.000Z',
      updatedAt: '2021-11-24T12:14:48.000Z'
    }
  },
  {
    id: 2,
    name: '100 montaditos',
    description: 'Una forma divertida y variada de disfrutar de la comida. Un lugar para compartir experiencias y dejarse llevar por el momento.',
    address: 'Av. de la Reina Mercedes, 43, Sevilla',
    postalCode: '41012',
    url: 'http://spain.100montaditos.com/',
    shippingCosts: 1.5,
    averageServiceMinutes: null,
    email: 'attcliente@gruporestalia.com',
    phone: '+34902197494',
    logo: 'public/restaurants/100MontaditosLogo.jpeg',
    heroImage: 'public/restaurants/100MontaditosHero.jpeg',
    status: 'online',
    restaurantCategoryId: 2,
    products: [
      {
        id: 12,
        name: 'Salchichón',
        description: '12 little pieces',
        price: 1.5,
        image: 'public/restaurants/products/salchichon.jpeg',
        order: 1,
        availability: true,
        restaurantId: 2,
        productCategoryId: 1,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 1,
        productCategory: {
          id: 1,
          name: 'Starters',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 13,
        name: 'Olives',
        description: '1 bowl',
        price: 1.5,
        image: 'public/restaurants/products/aceitunas.jpeg',
        order: 2,
        availability: true,
        restaurantId: 2,
        productCategoryId: 1,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 1,
        productCategory: {
          id: 1,
          name: 'Starters',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 14,
        name: 'Coca-cola',
        description: '33 cc',
        price: 1.5,
        image: 'public/restaurants/products/cola.jpeg',
        order: 3,
        availability: true,
        restaurantId: 2,
        productCategoryId: 3,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 3,
        productCategory: {
          id: 3,
          name: 'Drinks',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 15,
        name: 'Water',
        description: '50 cc',
        price: 1,
        image: 'public/restaurants/products/agua.png',
        order: 4,
        availability: true,
        restaurantId: 2,
        productCategoryId: 3,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 3,
        productCategory: {
          id: 3,
          name: 'Drinks',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 16,
        name: 'Beer',
        description: '20 cc',
        price: 1,
        image: 'public/restaurants/products/cerveza.jpeg',
        order: 5,
        availability: true,
        restaurantId: 2,
        productCategoryId: 3,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 3,
        productCategory: {
          id: 3,
          name: 'Drinks',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 17,
        name: 'Jamón',
        description: 'Cured Jam and olive oil',
        price: 1.5,
        image: 'public/restaurants/products/montaditoJamon.jpeg',
        order: 6,
        availability: true,
        restaurantId: 2,
        productCategoryId: 6,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 6,
        productCategory: {
          id: 6,
          name: 'Sandwiches',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 18,
        name: 'Cheese and tomato',
        description: 'Iberian cheese and tomato',
        price: 1,
        image: 'public/restaurants/products/montaditoQuesoTomate.jpeg',
        order: 7,
        availability: true,
        restaurantId: 2,
        productCategoryId: 6,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 6,
        productCategory: {
          id: 6,
          name: 'Sandwiches',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 19,
        name: 'Smoked salmon',
        description: 'Norwegian smoked salmon',
        price: 2,
        image: 'public/restaurants/products/montaditoSalmon.jpeg',
        order: 8,
        availability: true,
        restaurantId: 2,
        productCategoryId: 6,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 6,
        productCategory: {
          id: 6,
          name: 'Sandwiches',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 20,
        name: 'Chocolate ice-cream',
        description: '100 ml',
        price: 3,
        image: 'public/restaurants/products/chocolateIceCream.jpeg',
        order: 9,
        availability: true,
        restaurantId: 2,
        productCategoryId: 5,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 5,
        productCategory: {
          id: 5,
          name: 'Desserts',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 21,
        name: 'Sweet sandwich',
        description: '1 piece',
        price: 1.5,
        image: 'public/restaurants/products/montaditoChocolate.png',
        order: 10,
        availability: true,
        restaurantId: 2,
        productCategoryId: 5,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 5,
        productCategory: {
          id: 5,
          name: 'Desserts',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      },
      {
        id: 22,
        name: 'Muffin',
        description: '1 piece',
        price: 1,
        image: 'public/restaurants/products/muffin.jpeg',
        order: 11,
        availability: false,
        restaurantId: 2,
        productCategoryId: 5,
        createdAt: '2021-11-24T12:14:49.000Z',
        updatedAt: '2021-11-24T12:14:49.000Z',
        ProductCategoryId: 5,
        productCategory: {
          id: 5,
          name: 'Desserts',
          createdAt: '2021-11-24T12:14:48.000Z',
          updatedAt: '2021-11-24T12:14:48.000Z'
        }
      }
    ],
    restaurantCategory: {
      id: 2,
      name: 'Fast food',
      createdAt: '2021-11-24T12:14:48.000Z',
      updatedAt: '2021-11-24T12:14:48.000Z'
    }
  }
]
