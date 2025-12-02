export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  imageUrl?: string
  menu: MenuItem[]
}

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Bella Italia',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '30-45 min',
    deliveryFee: 3.99,
    menu: [
      {
        id: 'item-1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, basil',
        price: 14.99,
        category: 'Pizza',
      },
      {
        id: 'item-2',
        name: 'Pepperoni Pizza',
        description: 'Pepperoni, mozzarella, tomato sauce',
        price: 16.99,
        category: 'Pizza',
      },
      {
        id: 'item-3',
        name: 'Chicken Alfredo',
        description: 'Grilled chicken, fettuccine, alfredo sauce',
        price: 18.99,
        category: 'Pasta',
      },
      {
        id: 'item-4',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, caesar dressing, croutons, parmesan',
        price: 12.99,
        category: 'Salads',
      },
      {
        id: 'item-5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert',
        price: 7.99,
        category: 'Desserts',
      },
    ],
  },
  {
    id: 'rest-2',
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '25-40 min',
    deliveryFee: 4.99,
    menu: [
      {
        id: 'item-6',
        name: 'California Roll',
        description: 'Crab, avocado, cucumber',
        price: 8.99,
        category: 'Sushi Rolls',
      },
      {
        id: 'item-7',
        name: 'Spicy Tuna Roll',
        description: 'Tuna, spicy mayo, cucumber',
        price: 9.99,
        category: 'Sushi Rolls',
      },
      {
        id: 'item-8',
        name: 'Chicken Teriyaki Bowl',
        description: 'Grilled chicken, rice, vegetables, teriyaki sauce',
        price: 15.99,
        category: 'Bowls',
      },
      {
        id: 'item-9',
        name: 'Miso Soup',
        description: 'Traditional Japanese soup',
        price: 4.99,
        category: 'Soups',
      },
      {
        id: 'item-10',
        name: 'Edamame',
        description: 'Steamed soybeans',
        price: 5.99,
        category: 'Appetizers',
      },
    ],
  },
  {
    id: 'rest-3',
    name: 'Burger Junction',
    cuisine: 'American',
    rating: 4.3,
    deliveryTime: '20-35 min',
    deliveryFee: 2.99,
    menu: [
      {
        id: 'item-11',
        name: 'Classic Cheeseburger',
        description: 'Beef patty, cheese, lettuce, tomato, pickles',
        price: 11.99,
        category: 'Burgers',
      },
      {
        id: 'item-12',
        name: 'Bacon BBQ Burger',
        description: 'Beef patty, bacon, BBQ sauce, onion rings',
        price: 13.99,
        category: 'Burgers',
      },
      {
        id: 'item-13',
        name: 'Chicken Tenders',
        description: 'Crispy chicken tenders with dipping sauce',
        price: 10.99,
        category: 'Chicken',
      },
      {
        id: 'item-14',
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 4.99,
        category: 'Sides',
      },
      {
        id: 'item-15',
        name: 'Chocolate Shake',
        description: 'Rich chocolate milkshake',
        price: 5.99,
        category: 'Beverages',
      },
    ],
  },
  {
    id: 'rest-4',
    name: 'Thai Garden',
    cuisine: 'Thai',
    rating: 4.6,
    deliveryTime: '35-50 min',
    deliveryFee: 4.49,
    menu: [
      {
        id: 'item-16',
        name: 'Pad Thai',
        description: 'Stir-fried noodles with shrimp, tofu, peanuts',
        price: 13.99,
        category: 'Noodles',
      },
      {
        id: 'item-17',
        name: 'Green Curry',
        description: 'Chicken, vegetables, coconut milk, jasmine rice',
        price: 14.99,
        category: 'Curries',
      },
      {
        id: 'item-18',
        name: 'Spring Rolls',
        description: 'Fried vegetable spring rolls',
        price: 6.99,
        category: 'Appetizers',
      },
      {
        id: 'item-19',
        name: 'Mango Sticky Rice',
        description: 'Sweet sticky rice with fresh mango',
        price: 7.99,
        category: 'Desserts',
      },
    ],
  },
  {
    id: 'rest-5',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.4,
    deliveryTime: '25-40 min',
    deliveryFee: 3.49,
    menu: [
      {
        id: 'item-20',
        name: 'Beef Tacos',
        description: '3 soft tacos with ground beef, lettuce, cheese',
        price: 11.99,
        category: 'Tacos',
      },
      {
        id: 'item-21',
        name: 'Chicken Quesadilla',
        description: 'Grilled chicken, cheese, tortilla',
        price: 12.99,
        category: 'Quesadillas',
      },
      {
        id: 'item-22',
        name: 'Guacamole & Chips',
        description: 'Fresh guacamole with tortilla chips',
        price: 7.99,
        category: 'Appetizers',
      },
      {
        id: 'item-23',
        name: 'Churros',
        description: 'Fried dough with cinnamon sugar',
        price: 5.99,
        category: 'Desserts',
      },
    ],
  },
]

export function searchRestaurants(query: string): Restaurant[] {
  if (!query.trim()) {
    return mockRestaurants
  }

  const lowerQuery = query.toLowerCase()
  return mockRestaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      restaurant.cuisine.toLowerCase().includes(lowerQuery)
  )
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find((restaurant) => restaurant.id === id)
}

export function getMenuItemById(restaurantId: string, itemId: string): MenuItem | undefined {
  const restaurant = getRestaurantById(restaurantId)
  if (!restaurant) return undefined

  return restaurant.menu.find((item) => item.id === itemId)
}
