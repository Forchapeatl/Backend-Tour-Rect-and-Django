import React from 'react';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import './App.css';

import { AppContext } from './AppContext';
import List from './pages/List';
import Details from './pages/Details';
import Checkout from './pages/Checkout';
import CartLink from './components/CartLink';
import AppSidebar from './AppSidebar';
import ServiceApi from './services/ServiceApi';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: [],
      booking: {
        name: '',
        email_address: '',
        street_address: '',
        city: '',
      },
      item: null,
      toggleWishlist: this.toggleWishlist.bind(this),
      updateField: this.updateField.bind(this),
      setOrderItem: this.setOrderItem.bind(this),
      clearOrderItem: this.clearOrderItem.bind(this),
      placeOrder: this.placeOrder.bind(this),
    };
    ServiceApi.retrieveWishlist().then((data) => {
      this.setState({ wishlist: data });
    });
  }

  toggleWishlist(itemId) {
    let toggle;
    if (this.state.wishlist.includes(itemId)) {
      toggle = ServiceApi.wishlistDelete(itemId);
    } else {
      toggle = ServiceApi.wishlistAdd(itemId);
    }
    toggle.then(() => {
      ServiceApi.retrieveWishlist().then((data) => {
        this.setState({ wishlist: data });
      });
    });
  }

  updateField(field, value) {
    const { booking } = this.state;
    booking[field] = value;
    this.setState({ booking });
  }

  setOrderItem(item) {
    return new Promise((resolve) => {
      ServiceApi.wishlistCartStatus(item.id, true).then(() => {
        this.setState({ item });
        resolve(item);
      });
    });
  }

  clearOrderItem(itemId) {
    return new Promise((resolve) => {
      ServiceApi.wishlistCartStatus(itemId, false).then(() => {
        this.setState({ item: null });
        resolve();
      });
    });
  }

  placeOrder() {
    const { booking, item } = this.state;
    const bookingData = {...booking};
    bookingData.package = item.id;

    return new Promise((resolve, reject) => {
      ServiceApi.createBooking(bookingData).then(() => {
        this.setState({ item: null });
        resolve();
      }).catch((validationErrors) => {
        reject(validationErrors);
      });
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <nav className="App-nav">
            <div className="App-nav__main">
              <NavLink to="/">Explore our tours</NavLink>
            </div>
            <div className="App-nav__links">
              <button>Advertise your tour</button>
              <button>Help</button>
              <CartLink booking={this.state.booking} />
            </div>
          </nav>
          <AppSidebar />
          <section className="App-content">
            <AppContext.Provider value={this.state}>
              <Route path="/" exact component={List} />
              <Route path="/details/:id" component={Details} />
              <Route path="/checkout" component={Checkout} />
            </AppContext.Provider>
          </section>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
