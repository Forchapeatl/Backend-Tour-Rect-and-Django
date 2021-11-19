from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
import django.utils.timezone

class Package(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    promo = models.TextField()
    price = models.FloatField()
    rating = models.CharField(max_length=50)
    tour_length = models.IntegerField()
    start = models.DateField(default=django.utils.timezone.now)
    thumbnail_url = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class WishlistItem(models.Model):
    session_id = models.CharField(max_length=32)
    package = models.ForeignKey(Package, null=True, on_delete=models.SET_NULL)
    added_to_cart = models.BooleanField(default=False)

    def __str__(self):
        return '{} - {} (added to cart? {})'.format(
            self.session_id, self.package.name, self.added_to_cart
        )

class Booking(models.Model):
    name = models.CharField(max_length=200)
    email_address = models.CharField(max_length=200)
    street_address = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    package = models.ForeignKey(Package, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return '{}, {}'.format(self.name, self.email_address)

class PackagePermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    is_owner = models.BooleanField(blank=False, default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'package'], name='unique_owner'),
        ]

    def __str__(self):
        if self.is_owner:
            fmt = '{} ({}) can write to {} ({})'
        else:
            fmt = '{} ({}) cannot write to {}'
        return fmt.format(self.user.username, self.user.id, self.package.name, self.package.id)

    @classmethod
    def can_write(cls, user, package):
        try:
            permission = cls.objects.get(user=user, package=package)
            return permission.is_owner
        except ObjectDoesNotExist:
            return False

    @classmethod
    def set_can_write(cls, user, package):
        obj, created = cls.objects.get_or_create(user=user, package=package, defaults={'is_owner': True})
        if not created:
            obj.is_owner = True
            obj.save()
