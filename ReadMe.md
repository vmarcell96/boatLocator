### Boat location provider application

The coordinates for the 3 choosable routes are from the provided .csv files. When finishing a route the connection closes with the python coordinate provider server. I only made the coordinate provider server with python because websockets were new to me and i was curious how i could implement them in various programming languages. The main server which accesses the database is made with express.js. 

#### Features

- The coordinate provider server streams data from the provided csv files through a websocket connection. Based on the request parameter it can stream one of the 3 boat routes. When a route ends the connection closes. On a new connection it starts streaming from the beginning of the route.
- The express.js server can connect to a database and do CRUD operations. If one of the main page's 'Get Route' buttons is clicked, it creates a connection with the python server and listens to the provided boat data. The current boat position is showed on the main page and the center of the map is always set to the current boat position. This project is not complete there are many improvements i yet to make.
- Clicking Go to random position button takes you to a random position on the map
- If a database is initialised the 'get saved boat coordinates' button fetches boat data, if any.

#### Roadmap

- Indicating current boat position on map
- Showing the route of the boat on the map
- Implementing recording new route for boat
- Using provided 'heading' vectors
- CSS improvement
- Better folder structure
- Database functionality
- Css
- Error handling
- Better understanding of web sockets

### Running locally

#### Starting coordinate streamer python server locally:

Navigate to the servers folder:
```bash
cd .\Coordinate-provider\
```
Creating virtual environment:
```bash
python -m venv venv
```
Activate python virtual environment
```bash
venv\Scripts\activate
```
Install dependencies
```bash
 pip install -r requirements.txt
```
Start the server:
```bash
uvicorn main:app --reload
```
Now it listens on  http://127.0.0.1:8000

#### Setting up the PostgreSQL database

The server can be set up locally, but it only have functionality if you access the http://127.0.0.1:4000/api routes.
In the \server-and-react\server\queries.js you can access the default parameters for the database connection.
Currently the default name for the databese is 'norbit', and 'boatdata' for the used table (Id, NUMERIC, latitude NUMERIC, longitude NUMERIC, heading NUMERIC).

#### Starting react front-end and express.js server

From the root directory navigate to server-and-react folder:
```bash
cd .\server-and-react\
```
Install dependencies,
Open a terminal and use the npm start command, this will create a build folder in the root directory, and also starts the react app and the express.js server
which is automatically connects to the coordinate provider server
```bash
npm start
```
Now the application listens on http://127.0.0.1:4000
