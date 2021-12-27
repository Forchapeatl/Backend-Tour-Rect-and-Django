import React from 'react';
import './Filters.css';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price_min: '',
      price_max: '',
      search: ''
    };
  }

  updateFilter(field) {
    return (event) => {
      const filters = {};
      filters[field] = event.target.value;
      this.setState(filters);
    };
  }

  applyFilter() {
    this.props.onFilterUpdate(this.state);
  }

  render() {
    const updatePriceMin = this.updateFilter('price_min').bind(this);
    const updatePriceMax = this.updateFilter('price_max').bind(this);
    const updateSearch = this.updateFilter('search').bind(this);
    const apply = this.applyFilter.bind(this);
    const { price_min, price_max, search } = this.state;
    return (
      <section className="Filters" data-testid="filters">
        <label>Price</label>
        <input placeholder="Minimum" type="text" size="7"
          name="price_min"
          value={price_min}
          onChange={updatePriceMin} />
        &nbsp;-&nbsp;
        <input placeholder="Maximum" type="text" size="7"
          name="price_max"
          value={price_max}
          onChange={updatePriceMax} />
        <label>Search</label>
        <input type="text" placeholder="Try typing in 'hiking'" size="20"
          name="search"
          value={search}
          onChange={updateSearch} />
        <button onClick={apply}>Apply</button>
      </section>
    );
  }
}
