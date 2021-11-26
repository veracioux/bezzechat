FROM alpine:3.14.3

# Install global python dependencies
RUN apk add python3 py3-pip
RUN pip install pipenv

# Setup virtual env
WORKDIR /app
COPY . .
RUN LANG=en_US.UTF-8 pipenv install
RUN mkdir -p bezzechat/migrations
RUN touch bezzechat/migrations/__init__.py
RUN pipenv run python manage.py migrate

EXPOSE 8000
# TODO doesn't work otherwise
ENV DEBUG_SERVER true
CMD ["pipenv", "run", "gunicorn", "-b", ":8000", "bezzechat.wsgi"]
