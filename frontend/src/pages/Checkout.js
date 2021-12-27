import React from 'react';
import './Checkout.css';
import { AppContext } from '../AppContext';
import { FormField } from '../components/form/FormField';
import { FaMinusCircle } from 'react-icons/fa';
import OnHold from '../components/OnHold';
import { withFieldValidation } from '../components/form/FieldValidation';

const ValidatedField = withFieldValidation(FormField);

export default class Checkout extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { validationErrors: [], orderPlaced: false };
  }

  placeOrder() {
    this.context.placeOrder().then(() => {
      this.setState({ validationErrors: [], orderPlaced: true });
    }).catch((validationErrors) => {
      this.setState({ validationErrors, orderPlaced: false });
    });
  }

  render() {
    const { booking, item, updateField, clearOrderItem } = this.context;
    const { validationErrors, orderPlaced } = this.state;
    const inputFields = [
      { label: 'Name', name: 'name' },
      { label: 'Email Address', name: 'email_address' },
      { label: 'Street Address', name: 'street_address' },
      { label: 'City', name: 'city' }
    ];
    if (orderPlaced) {
      return (
        <section className="Checkout">
          <header className="Checkout-header">
            <h2>Checkout</h2>
            <h3>Thanks for buying an excursion with Explore California!</h3>
          </header>
        </section>
      );
    }
    const errors = [];
    inputFields.forEach((field) => {
      const error = validationErrors[field.name];
      if (error) {
        errors.push(<li className="error" key={field.name}>{field.label}: {error}</li>);
      }
    });
    const formFields = inputFields.map((fieldProps) => {
      return (
        <ValidatedField
          key={fieldProps.name}
          value={booking[fieldProps.name]}
          onUpdate={updateField}
          {...fieldProps}
          />
      );
      }
    );
    let displayItem;
    if (item) {
      displayItem = (
        <div>
          <button className="Checkout-package-remove" onClick={() => clearOrderItem(item.id)}>
            <FaMinusCircle />
          </button>
          {item.name} - ${item.price} starts on {item.start} for {item.tour_length} days.
        </div>
      );
    }
    return (
      <section className="Checkout">
        <header className="Checkout-header">
          <h2>Checkout</h2>
        </header>
        <section className="Checkout-summary">
          {item && <OnHold duration={59} />}
          {displayItem}
        </section>
        <section className="Checkout-form">
          <form>
            <ul>{errors}</ul>
            {formFields}
          </form>
        </section>
        <section className="Checkout-actions">
          <div className="Checkout-actions__next">
            <button onClick={this.placeOrder.bind(this)} disabled={item === null}>
              Place order
            </button>
          </div>
        </section>
      </section>
    );
  }
}
