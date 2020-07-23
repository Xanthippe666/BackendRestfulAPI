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
<br>
Before starting the server, start-up the mysql database. This can be done for example by running the following command in a terminal
<br>
`mysqld --console`
<br>
Also one needs to build the dependencies for the node.js server. This can be done by typing the following command in this project's main folder,
<br>
`npm install`
<br>
After downloading all the dependencies, one can then start the node.js server by typing,
<br>
`
npm start
`
</br>
The server will then start running on localhost through port 2333. If the server fails to connect, the database configuration may be incorrect. Mysql admin username, password, and host 
settings can be changed in the file named "dbConfig.js" under the folder called "db"

### API summary
- register
- login
- view comments
- post comment
- add friend
- view friends
