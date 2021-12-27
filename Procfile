#web: python manage.py runserver
release: python manage.py migrate
web: gunicorn demo.wsgi --log-file -
