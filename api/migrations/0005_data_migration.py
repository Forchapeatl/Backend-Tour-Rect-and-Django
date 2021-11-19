from random import choice
from datetime import datetime, timedelta

from django.db import migrations
from django.contrib.auth.hashers import make_password

def user_creation(UserModelClass):
    def make_user(username, email, is_admin=False):
        user = UserModelClass(
            username=username,
            email=email,
            password=make_password(username)
        )
        if is_admin:
            user.is_superuser = True
            user.is_staff = True
        user.save()
        return user
    return make_user

def create_sample_data(apps, schema_editor):
    make_user = user_creation(apps.get_model('auth', 'User'))
    # Get model classes
    Package = apps.get_model('api', 'Package')
    PackagePermission = apps.get_model('api', 'PackagePermission')
    PackageDate = apps.get_model('api', 'PackageDate')
    Booking = apps.get_model('api', 'Booking')

    # Create admin user
    make_user('admin', 'admin@localhost', is_admin=True)

    # Create users
    users = [
        make_user('user_a', 'user_a@localhost'),
        make_user('user_b', 'user_b@localhost'),
        make_user('user_c', 'user_c@localhost'),
    ]

    # Create packages
    categories = ['hiking', 'tour', 'restaurants']
    prices = [30.00, 49.99, 100.0, 199.99, 200.00, 399.99]
    ratings = ['easy', 'medium', 'hard']
    tour_lengths = [1, 2, 3, 4]
    thumbnail_urls = [
        '/images/calm_desc_bug.gif',
        '/images/desert_desc_bug.gif',
        '/images/map_bigsur.gif',
        '/images/map_channel.gif',
        '/images/map_valley.gif',
        '/images/map_whitney.gif',
        '/images/map_yosemite.gif',
        '/images/nature_desc_bug.gif',
        '/images/snow_desc_bug.gif',
        '/images/springs_desc_bug.gif',
        '/images/taste_desc_bug.gif',
    ]
    promos = [
        "Explore California our favorite way...by foot! Get outdoors and into the millions of acres of forests, desert, and spectacular scenery that California is famous for. We have a wide range of backpacking tour options, from single day-trips to week long guided excursions. Find a comfortable pair of shoes and come hiking with us!",
        "Looking for a little relaxation? California Calm is our hand-picked collection of incredible California Spas and therapy retreats. Enjoy unbelievable massage treatments, beauty regimens, and active getaways. We've combed the entire state to find the finest spa experiences available...imagine that, we've even made choosing a spa retreat relaxing!",
        """Let's be honest, you have no idea what a hot spring is...do you? Well, we do, and we can't wait for you to experience the relaxing warmth of "nature's hot-tubs!" We offer packages that range from all-inclusive hot spring resorts to camping opportunities next to some of the country's last remaining primitive springs.""",
        "Whether you are a hard-core mountain biking enthusiast, or just looking for a cool way to see the many scenic towns and vistas of our great state, Cycle California has a package for you! Explore the thousand of miles of biking trails from Big Sur all the way to the Southern California coast. Packages range from bring-your-own bike to full bike rental and travel days.",
        "Our most wide-ranging tour option! Come explore California from the stunning deserts all the way to our beautiful coast. Along the way you'll travel through breathtaking mountain ranges and some of the nation's most fertile farmland as you see why California is regarded as the most diverse state in the nation! Come see ALL that California has to offer!",
        "If you love the outdoors, nature, and the environment, California is the place for you! Our eco-tours range from watching seals and whales to exploring the desert for rare lizards and fauna. As inspirational as they are educational, our Nature Watch packages bring you the full range of California's natural beauty.",
        "California has some of the best snowboarding in the US and at Explore California we've combed the runs to offer you the best resorts in the state. We even offer multi-resort packages for those that just can't get enough of that pack and grind. See you on the slopes!",
        "Tour of the wine country? Tour of the olive groves? We couldn't decide so we put them together in one of our most amazing tour packages ever. Taste of California immerses you in the serene, romantic lifestyle of the California wine country and olive groves. Along the way you'll experience some of the best cuisine in the world, all made from fresh local ingredients by some of the nation's most renown chefs. Bon Appetit!",
    ]
    for i in range(500):
        owner = choice(users)
        category = choice(categories)
        package = Package.objects.create(
            category=category,
            name='Package {}{}'.format(
                owner.username.replace('User ', ''),
                i
            ),
            promo=choice(promos),
            price=choice(prices),
            rating=choice(ratings),
            tour_length=choice(tour_lengths),
            thumbnail_url=choice(thumbnail_urls),
        )
        # Set up package permissions
        PackagePermission.objects.create(
            user=owner,
            package=package,
            is_owner=True,
        )
        # Create package date range
        package_date = PackageDate.objects.create(
            package=package,
            start=datetime.today(),
            end=datetime.today() + timedelta(days=10),
        )
        # Create bookings
        for count in range(3):
            name = choice(['DEF', 'GHI', 'JKL'])
            Booking(
                package_date=package_date,
                start=datetime.today() + timedelta(days=choice(range(10))),
                name='Customer {}'.format(name),
                email_address='customer{}@localhost'.format(name),
            )

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20190805_2336'),
    ]

    operations = [
        migrations.RunPython(create_sample_data),
    ]
