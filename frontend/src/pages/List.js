import React from 'react';
import './List.css';

import { AppContext } from '../AppContext';
import Item from '../components/Item';
import Pagination from '../components/Pagination';
import Filters from '../components/Filters';
import ServiceApi from '../services/ServiceApi';

export class OneItemList extends React.Component {
  static context = AppContext;

  render() {
    const { wishlist, toggleWishlist } = this.context;
    const route = "/details/1";
    const item = { id: 1, name: "Example", thumbnail_url: "/images/map_channel.gif", price: 777.77, rating: 'easy' , promo: 'Tour package description' };
    return (
      <section className="List" data-testid="list">
        <section className="List-items">
          <Item route={route} item={item}  wishlist={wishlist} toggleWishlist={toggleWishlist} />
        </section>
      </section>
    );
  }
}

export default class List extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pageIndex: 1,
      totalItems: 0,
      filters: {
        price_min: null,
        price_max: null,
        search: ''
      }
    };
    this.updateList();
  }

  updateList() {
    const { pageIndex, filters } = this.state;
    const queryParams = {};
    if (filters.price_min) {
      queryParams.price_min = filters.price_min;
    }
    if (filters.price_max) {
      queryParams.price_max = filters.price_max;
    }
    if (filters.search && filters.search.length > 0) {
      queryParams.search = filters.search;
    }
    ServiceApi.retrieveList(pageIndex, queryParams).then((data) => {
      const { results, count } = data;
      this.setState({ list: results, totalItems: count });
    })
  }

  updateFilters(filters) {
    this.setState({ filters }, () => {
      this.updateList();
    });
  }

  previousPage() {
    this.setState({ pageIndex: this.state.pageIndex - 1 });
    this.updateList();
  }

  nextPage() {
    this.setState({ pageIndex: this.state.pageIndex + 1 });
    this.updateList();
  }

  render() {
    const { wishlist, toggleWishlist } = this.context;
    const { list, pageIndex, totalItems } = this.state;
    return (
      <section className="List" data-testid="list">
        <header>
          <Filters onFilterUpdate={this.updateFilters.bind(this)} />
        </header>
        <section className="List-items">
          {list.map(item => {
            return (<Item key={item.id} route={`/details/${item.id}`} item={item} wishlist={wishlist} toggleWishlist={toggleWishlist} />);
          })}
        </section>
        <footer>
          <Pagination
            pageIndex={pageIndex}
            total={totalItems}
            perPage={9}
            onNext={this.nextPage.bind(this)}
            onPrevious={this.previousPage.bind(this)}
          />
        </footer>
      </section>
    )
  }
}