import React from 'react';
import { render, fireEvent, cleanup, wait } from '@testing-library/react';
import App from './App';
import ServiceApi from './services/ServiceApi';

jest.mock('../src/services/ServiceApi', () => {
  const exampleTourPackage = {
    id: 1,
    name: 'Taste of California',
    promo: "Tour of the wine country? Tour of the olive groves? We couldn't decide so we put them together in one of our most amazing tour packages ever. Taste of California immerses you in the serene, romantic lifestyle of the California wine country and olive groves. Along the way you'll experience some of the best cuisine in the world, all made from fresh local ingredients by some of the nation's most renown chefs. Bon Appetit!",
    rating: 'hard',
    tour_length: 2,
    price: 5000,
    start: '10/04/2019',
    departure_dates: [
      '10/04/2019',
      '12/04/2019'
    ]
  };
  return {
    retrieveWishlist: jest.fn(() => {
      return new Promise((resolve) => {
        resolve([exampleTourPackage.id]);
      });
    }),
    retrieveDetails: jest.fn(() => {
      return new Promise((resolve) => {
        resolve(exampleTourPackage);
      });
    }),
    retrieveList: jest.fn((pageIndex, queryParams) => {
      return new Promise((resolve) => {
        resolve({
          results: [exampleTourPackage],
          count: 1
        });
      });
    })
  };
});

afterEach(cleanup);

it('can navigate between two components using routes', async () => {
  const app = render(<App />);
  await wait();
  expect(ServiceApi.retrieveList).toHaveBeenCalled();
  expect(app.queryByTestId('list')).toBeDefined();
  expect(app.queryByTestId('details')).toBeNull();
  expect(app.queryAllByTestId('item')).toHaveLength(1);

  fireEvent.click(app.getByText('Explore our tours'));
  expect(ServiceApi.retrieveList).toHaveBeenCalled();
  expect(app.queryByTestId('list')).toBeDefined();
  expect(app.queryByTestId('details')).toBeNull();
  expect(app.queryAllByTestId('item')).toHaveLength(1);

  fireEvent.click(app.getByText('Learn more!'));
  expect(ServiceApi.retrieveDetails).toHaveBeenCalled();
  expect(app.queryByTestId('list')).toBeNull();
  expect(app.queryByTestId('details')).toBeDefined();
});
