import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import './AddToWishlist.css';
import { AppContext } from '../AppContext';

export default function AddToWishlist(props) {
  const { itemId } = props;
  return (<AppContext.Consumer>
    {context => {
      return (<button className="AddToWishlist"
        onClick={() => context.toggleWishlist(itemId)}>
        {context.wishlist.includes(itemId) ? <FaHeart /> : <FaRegHeart />}
      </button>);
    }}
  </AppContext.Consumer>);
}
