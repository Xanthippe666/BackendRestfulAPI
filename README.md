# BackendRestfulAPI
A back-end restful API mimicing a social network service

### Technical Stack
* Mysql/Sequelize (database + ORM)
* node.js/express.js (server + restful API)

### links
github: [https://github.com/Xanthippe666/BackendRestfulAPI](https://github.com/Xanthippe666/BackendRestfulAPI) <br>
postman API documentation: [https://documenter.getpostman.com/view/12097905/T1DjmLGc](https://documenter.getpostman.com/view/12097905/T1DjmLGc)

### How to use and start
One needs to have the following already installed:
* Node.js
* Npm
* Mysql

Before starting the server, start-up the mysql database. This can be done for example by running the following command in a terminal

`mysqld --console`

Next, clone the github project,

`git clone https://github.com/Xanthippe666/BackendRestfulAPI.git`

Also one needs to build the dependencies for the node.js server. This can be done by typing the following command once inside the main folder,

`npm install`

After downloading all the dependencies, one can then start the node.js server by typing,

`
npm start
`

The server will then start running on localhost through port 2333. If the server fails to connect, the database configuration may be incorrect. Mysql admin‘s username, password, and host settings can be changed in the file named "dbConfig.js" under the folder called "db". Server port settings (default: 2333) can be changed in the file named "index.js" under the main folder

###Testing the API
API testing can be done in postman, curl, advanced Rest client, etc.

### API summary
- register
- login
- view comments
- post comment
- add friend
- view friends
- () view users
