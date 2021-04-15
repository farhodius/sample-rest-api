# Code challenge - Product management backend API

Simple API to manage products
The API allows to create/read/update/delete and search products by name
Basic pagination is implemented
API is using Bearer Token authentication method and JWT is used as token solution
The api has an endpoint to obtain an auth token that allows access to other endpoints

# Installation and usage

Application is using Nodejs 12.
Run `npm instal` from the root of the project to install all the dependencies.
Create `.env` file from versioned `.env-example` to set the necessary environment variables. All the default values from the example file can be used to run the app properly.
Local file system is being used to store uploaded files. To start using the feature - create `uploadedFiles` directory at the root of the project.
Run `npm start` to start the app in development mode. Using modemon to watch for file changes.
The API should be available at `http://localhost:5000`.
> Note: Follow instruction on the fronend app side to start using the api.

# Storage solution

Using app memory for storage. Data is persistent only while application is running. On restart all the data is cleared.
Implemented storage in the form of driver to make data model unaware of underlying storage solution.

# Code challenge summary

API is pretty basic and not account for all possible edge cases and scenarious.

#### Known issues:

- _The API has an endpoint to obtain an auth token - ideally should be a standalone atuth server._
- _Tokens generated don't have expiration time implemented._

