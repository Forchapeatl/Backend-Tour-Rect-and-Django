from datetime import timedelta
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.core.cache import cache
from django.utils import timezone
import oauth2_provider.models
from api.models import Package, PackagePermission
from api.serializers import BookingSerializer

Application = oauth2_provider.models.get_application_model()
AccessToken = oauth2_provider.models.get_access_token_model()

def create_access_token(user):
    token_expiration_time = timezone.now() + timedelta(minutes=60)
    token = AccessToken.objects.create(
        user=user,
        scope='read write packages',
        token='test{}{}'.format(
            user.id,
            int(token_expiration_time.timestamp()),
        ),
        application=Application.objects.first(),
        expires=token_expiration_time,
    )
    return token

def auth_header(token):
    return { 'HTTP_AUTHORIZATION': 'Bearer {}'.format(token) }

class CachingTestCase(APITestCase):
    def test_wishlist_cache(self):
        package = Package.objects.create(category='a', name='package', price=0.0, rating='medium', tour_length=1)

        self.assertIsNone(cache.get('wishlist:wishlist-items'))
        response = self.client.get('/api/v1/wishlist/')
        self.assertListEqual(response.data, [])
        self.assertListEqual(cache.get('wishlist:wishlist-items'), [])

        response = self.client.post('/api/v1/wishlist/', { 'id': package.id })
        self.assertIsNone(cache.get('wishlist:wishlist-items'))

        response = self.client.get('/api/v1/wishlist/')
        self.assertListEqual(response.data, [package.id])
        self.assertListEqual(cache.get('wishlist:wishlist-items'), [package.id])

class SortingFilteringTestCase(APITestCase):
    def setUp(self):
        Package.objects.all().delete()

    def test_sorting_and_filtering(self):
        discount_package = Package.objects.create(category='a', name='a', price=1.0, rating='easy', tour_length=1)
        expensive_package = Package.objects.create(category='b', name='b', price=99.0, rating='medium', tour_length=2)
        user = User.objects.create(username='user')
        token = create_access_token(user)
        response = self.client.get('/api/v1/public/packages/', **auth_header(token))
        ids = list(map(lambda result: result['id'], response.data['results']))
        self.assertListEqual(ids, [expensive_package.id, discount_package.id])

        response = self.client.get('/api/v1/public/packages/?search=a', **auth_header(token))
        ids = list(map(lambda result: result['id'], response.data['results']))
        self.assertListEqual(ids, [discount_package.id])

        response = self.client.get('/api/v1/public/packages/?price_min=50.00', **auth_header(token))
        ids = list(map(lambda result: result['id'], response.data['results']))
        self.assertListEqual(ids, [expensive_package.id])

class ValidationTestCase(APITestCase):
    def test_invalid_street_address_returns_error(self):
        data = {
            'name': 'Example',
            'email_address': 'example@localhost',
            'street_address': 'Invalid St.',
            'city': 'City',
            'package': 1,
        }

        response = self.client.post('/api/v1/bookings/', data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['street_address'][0],
            BookingSerializer.STREET_ADDRESS_ERROR
        )

        data['street_address'] = '11 Abc St.'
        response = self.client.post('/api/v1/bookings/', data)
        self.assertEqual(response.status_code, 201)
