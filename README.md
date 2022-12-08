# Northcoders House of Games API

# The project

This is a backend project based on various games with reviews and comments.
Endpoints are all available in the endpoints.json file.
The ftomnt end project will work using this project with ReactJS.

# The link to the hosted API

Here is the link to the API hosted on Cyclic: https://chloe-jenner-nc-games-be.cyclic.app/api

# Instructions on setup and dependencies

1. In your terminal create a new folder:

```
$ mkdir <make a new directory name>
```

2. Change in to this directory:

```
$ cd <your new directory name>
```

3. Using Github, fork the repository
4. Clone the repository in to your terminal:

```
$ git clone <The repo clone id>
```

6. Once opened these need to be installed

- Node.js: v17.8.0 minimum
- PostgreSQL: v 12.10 minimum

7. install all dependencies in the directory (make sure you are in the correct one): npm install
8. Create the two .env files, development and test, ensure these are ignored:

```
  $ PGDATABASE=nc_games
  $ PGDATABASE=nc_games_test
```

9. For the setup and seeding, run:

```
  $ npm run setup-dbs
```

```
$ npm run seed
```

10. Finally use npm test to use jest run through the tests.
