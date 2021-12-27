import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import Filters from './Filters';

afterEach(cleanup);

it('updates filter', async (done) => {
  let callback = (filters) => {
    expect(filters).toEqual({
      price_min: '123.45',
      price_max: '',
      search: ''
    });
    done();
  };
  const filters = render(
    <Filters onFilterUpdate={callback} />
  );

  expect(filters.queryByText('Price')).toBeDefined();
  const priceMin = filters.queryByPlaceholderText('Minimum');
  expect(priceMin.getAttribute('value')).toEqual('');

  fireEvent.change(priceMin, { target: { value: '123.45' }});
  expect(priceMin.getAttribute('value')).toEqual('123.45');

  fireEvent.click(filters.queryByText('Apply'));
});

