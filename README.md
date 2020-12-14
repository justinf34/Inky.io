# Inky.io




## Deployment Instruction
From the directory you would like to store the repo, clone the repository:
```
git clone https://github.com/justinf34/Inky.io.git
```

Change into the repo directory and install the node packages for both the serve and client.
```
cd Inky.io
cd client && npm i && cd ..
cd server && npm i && cd ..
```

Before running the servers, there are API keys and credentials that the server needs to run and access the database.

First, create a .env file with the following variables
```
AUTH_ID=/*Register application as a Google project/app to get the ID*/
AUTH_SECRET=/*Register application as a Google app**/
CLIENT_HOME_PAGE=/
```

Then create a `serviceAccountKey.json` by initializing a firestore database.


### Development

First run the frontend sever
```
cd client
npm start
```
It should be running in `http://localhost:3000`

Then run the backend server
```
cd server
node server.js
```
I would recommend using `nodemon` to run the server during development phase as it auto restarts the server when you make changes to the files related to the server.

The server should be running in `http://localhost:8888`


### Production/Deployment
We are hosting this application in an AWS EC2 instance. But the instructions below are for running it in your local machine,

First, build the frontend code
```
cd client
npm run build
```
This should create a build folder that will be located in the `server` directory.

Then run the server code
```
cd server
node server.js
```
The server should be running in `http://localhost:8888`



