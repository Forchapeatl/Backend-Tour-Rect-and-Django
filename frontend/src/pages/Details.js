import React from 'react';
import './Details.css';
import { AppContext } from '../AppContext';
import ServiceApi from '../services/ServiceApi';
import AddToWishlist from '../components/AddToWishlist';

export default class Details extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { details: null, alreadyAddedToCart: false };
    const { id } = props.match.params;
    ServiceApi.retrieveDetails(id).then((details) => {
      const { item } = this.context;
      this.setState({
        details,
        alreadyAddedToCart: item && item.id === id
      });
    });
  }

  async addToCart() {
    await this.context.setOrderItem(this.state.details);
    this.props.history.push('/checkout');
  }

  render() {
    const { details, alreadyAddedToCart } = this.state;
    if (details === null) {
      return (<section className="Details"></section>);
    }
    return (
      <section className="Details" data-testid="details">
        <section className="Details-content">
          <header>
            <h2>
              <AddToWishlist itemId={details.id} />
              {details.name}
            </h2>
          </header>
          <section>
            <img src={details.thumbnail_url} alt={details.name} />
            <p>Starts on: {details.start}</p>
            <p>Tour Length: {details.tour_length} days</p>
            <p>
              <span className="Details-label">Total Price:</span>
              &nbsp;${details.price}
            </p>
          </section>
          <section>{details.promo}</section>
        </section>
        <section className="Details-reserve">
          <button className="Details-buy" data-testid="buy"
            onClick={this.addToCart.bind(this)}>
              {alreadyAddedToCart ? 'Already Reserved' : 'Reserve'}
          </button>
        </section>
      </section>
    )
  }
};
