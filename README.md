# Fullstack Django and React

Get started with Django:

```shell
pip3 install virtualenv
virtualenv --python=python3 env
source env/bin/activate
pip install -r requirements.txt

# Django
cd demo
python manage.py migrate
python manage.py test
python manage.py runserver
```

Source code for React is in `frontend` directory.

Getting started with React:

```shell
sudo npm install -g create-react-app

# React
cd frontend
npm install

# Run tests
npm test

# React server for local development
npm start

# Build for production
npm run-script build
```

Created by Rudolf Olah <rudolf.olah.to@gmail.com>
