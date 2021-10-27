# VocaBee
VocaBee is a simple, Django-based, single-page application (SPA) for creating and reviewing flashcards. Although designed with foreign language in mind, the flash cards can be made for any topic.

## Design Considerations
The author chose to use vanilla Javascript to build an SPA specifically as a learning opportunity for the final project. For real-world design, he would have chosen a JS framework, likely Vue.JS, or would have possibly relied a bit more on Django templates. However, his weakest area was vanilla JS, so it was where he focused his efforts for thie project.

The author used the built in SQLite database to allow more focus on the Javascript frontend. However, in real-world development, he would have chose PostgreSQL, with the instance residing on a separate server.

For real-world deployment, he also would have chosen Heroku as the server.

## External Dependencies
- Django: Django was used as the primary backend. The basic Django Python package is the only one required to run this project.
- Bootstrap: Bootstrap is used for responsiveness and ease of CSS. However, a lot of the CSS is customized.
- Fontawesome: FontAwesome has been used for a handful of fonts; access to these fonts is granted through the author's account which is currently coded in the index.html file. 

## Installation
Installation is simple:
  - unzipping the package
  - creating a Python virtual environment
  - installing Django using PIP
  - make the database migrations
  - create a superuser
  - run the server

## Usage
Unregistered users will be presented with a list of publicly available stacks, if any; they can view the stacks, but not do too much else. Registered users can create vocabulary stacks, add cards to them, make them public/private, fork other users' stacks, and do learning exercises for stacks.

## Time runs out
Several features and functions were not implemented due to time constraints:
- Pagination of the lists
- Keeping track of a user's progress
- Additional vocabulary exercises
- Improved user interface for moving cards between various stacks

## Files
vocabee: 
  db.sqlite3 - Database for VocaBee
  manage.py - Django project python module
  README.md - this file
  requirements.txt - Python packages required
  stacks:
    admin.py - Establishes admin functionality for the stacks models
    apps.py - Settings for the Stacks app
    models.py - Database models for the Stacks app
    tests.py - not used in this project
    urls.py - URL patterns for the Stacks app
    views.py - Views for the Stacks app
    static:
      stacks:
        learn.css - Style sheet for the learning exercises
        learn.js - Functions for the learning exercises
        script.js - Primary script for the overall single-page application
        styles.css - Style sheet for most of the application
      users:
        styles.css - Style sheet for the login and registration pages
    templates:
      stacks:
        base.html - Base file for overall application; includes navbar
        index.html - Landing page for single-page application
      users:
        base.html - Base file for user admin pages
        login.html - Login pages
        register.html - Registration page
  vocabee:
    asgi.py - Django-created, not used for this project
    settings.py - VocaBee's Django project settings
    urls.py - Base URL patterns for the project
    wsgi.py - Django-created, not used for this project


## License
Written by Jacob Wagner as a final project for the Spring 2021 iteration of Harvard Extension's CS33A. 

[MIT](https://choosealicense.com/licenses/mit/)