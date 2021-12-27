import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
/*import { FaCalendar } from 'react-icons/fa'*/

export default function CartLink(props) {
  const { item } = props;
  return (
    <Link className="Cart" to="/checkout">
      <FaShoppingCart/>
      {item && item.name}
    </Link>
  );
}
