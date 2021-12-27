import React from 'react';
import { Link } from 'react-router-dom';
import { FaMountain } from 'react-icons/fa';
import './Item.css';
import AddToWishList from './AddToWishlist';

export default function Item(props) {
  let { wishlist, toggleWishlist, item, route } = props;
  return (
    <div className="Item" data-testid="item">
      <h3>
        <AddToWishList wishlist={wishlist} itemId={item.id} toggle={toggleWishlist} />
        <Link to={route}>
          {item.name}
        </Link>
      </h3>
      <img src={item.thumbnail_url} alt={item.name} />
      <p className="Item-price">
        ${item.price} USD total
      </p>
      <p>
        Difficulty Rating: {item.rating}&nbsp;
        <span className={`Item-rating Item-rating__${item.rating}`}>
          <FaMountain/>
          <FaMountain/>
          <FaMountain/>
        </span>
      </p>
      <p>{item.promo}</p>
      <Link className="Item-more" to={route}>Learn more!</Link>
    </div>
  )
}
