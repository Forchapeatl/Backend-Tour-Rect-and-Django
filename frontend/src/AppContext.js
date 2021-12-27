import React from 'react';

export const AppContext = React.createContext({
  booking: null,
  wishlist: [],
  toggleWishlist: () => {},
  addToCart: () => {},
  removeFromCart: () => {}
});
