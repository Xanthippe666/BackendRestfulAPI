//Use helpful libraries to do file reading
const fs = require('fs');
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty')

//Set-up MYSQL and the ORM
const db = require('./db/db');

let sequelize = db.sequelize;
let userModel;
let commentModel;
userModel = sequelize.models.user;
commentModel = sequelize.models.comment;

//Initial load of database data
//-->Loads two sample users, and loads sample comments
//-->Into the database
db.init();

//Set-up express's REST api
const express = require('express');
let app = express();

//Bind body parsers for POSTS
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multipart());

//Set-up express's session capabilities
const session = require('express-session')
app.use(session({ secret: 'keyboard cat',resave: false,
     saveUninitialized: true,}))

////////////////////////ROUTERS FOR RESTFUL API//////////////////
//Set-up routers for back-end API
const userRouter = require('./router/userRouter')
app.use("/user",userRouter)

const commentRouter = require('./router/commentRouter')
app.use("/comment",commentRouter)


/////////////////////////RESTFUL API//////////////////////
//Default page for if the user is not sure what to do
app.get("/", (req, res) =>{
	res.send(`<h1>Welcome to the user/comment API page<h1/>
	<br/>
	<h4>Github : <a></a> <h4/>
	<br/>
	<h4> Postman API docs : <a href="https://documenter.getpostman.com/view/12097905/T1DjmLGc">https://documenter.getpostman.com/view/12097905/T1DjmLGc</a> <h4/>
	`);
})



//Initialize server
let server = app.listen(2333, () => {
	let host = 'localhost';
	let port = server.address().port;
	
	console.log('server running at https://%s:%s -- complete', host, port);
});








