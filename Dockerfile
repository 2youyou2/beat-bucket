# this Dockerfile is for deployment of ./server to Heroku

FROM python:3.6.1

# install pipenv
RUN pip install pipenv

# set working directory
WORKDIR /usr/src/app

# add Pipfile
COPY ./server/Pipfile* ./

# install dependencies
RUN pipenv install

# add app
COPY ./server .

ENV SECRET_KEY=${SECRET_KEY} DATABASE_URL=${DATABASE_URL} APP_SETTINGS="api.config.ProdConfig"

# run server
CMD ["pipenv", "run", "gunicorn", "-b 0.0.0.0:$PORT", "run:app"]
