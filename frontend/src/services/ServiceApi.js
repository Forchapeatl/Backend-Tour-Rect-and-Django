import Axios from 'axios';

const clientId = 'UYpBkKY6vYW72ayc7ovAZ5xvUapQ3a8TucsGI2jS';
const clientSecret = 'REvBZR4e1yVflIrF1FAWcLVl08ZtewuxinaQsSNt6XKpxar6v17LvjkrCkKVDqHQUTDCcLfuZfm1V7JQ0C9qdKnYQpbjjjMrYMt76kdzTtE3xGv4ZaxdX9TnLsTeadZu';

let _accessToken;

export function getAccessToken() {
  return new Promise((resolve) => {
    if (_accessToken) {
      resolve(_accessToken);
    } else {
      const data = {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'read'
      }
      Axios.post('https://quawnt.herokuapp.com/oauth/token/', data).then((response) => {
        _accessToken = response.data.access_token;
        resolve(_accessToken);
      });
    }
  });
}

export async function getConfig() {
  const accessToken = await getAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
  return new Promise((resolve) => {
    resolve(config);
  });
}

export default {
  async retrieveWishlist() {
    const config = await getConfig();
    return new Promise((resolve) => {
      Axios.get('https://quawnt.herokuapp.com/api/v1/wishlist/', config).then((response) => {
        resolve(response.data);
      });
    });
  },

  async wishlistAdd(id) {
    const config = await getConfig();
    const data = { id };
    return Axios.post('https://quawnt.herokuapp.com/api/v1/wishlist/', data, config);
  },

  async wishlistDelete(itemId) {
    const config = await getConfig();
    return Axios.delete(`https://quawnt.herokuapp.com/api/v1/wishlist/${itemId}/`, config);
  },

  async wishlistCartStatus(id, added_to_cart) {
    const config = await getConfig();
    const data = { id, added_to_cart };
    return Axios.patch(`https://quawnt.herokuapp.com/api/v1/wishlist/${id}/`, data, config);
  },

  async retrieveDetails(id) {
    const config = await getConfig();
    return new Promise((resolve) => {
      Axios.get(`https://quawnt.herokuapp.com/api/v1/public/packages/${id}/`, config).then((response) => {
        resolve(response.data);
      });
    });
  },

  async retrieveList(pageIndex, queryParams) {
    const config = await getConfig();
    config['params'] = queryParams;
    config['params']['page'] = pageIndex;
    return new Promise((resolve) => {
      Axios.get('https://quawnt.herokuapp.com/api/v1/public/packages/', config).then((response) => {
        resolve(response.data);
      });
    });
  },

  async createBooking(data) {
    const config = await getConfig();
    return new Promise((resolve, reject) => {
      Axios.post('https://quawnt.herokuapp.com/api/v1/bookings/', data, config).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        reject(error.response.data);
      });
    });
  }
}
