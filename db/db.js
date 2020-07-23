//Module imports from npm
const {Sequelize, DataTypes} = require('sequelize');
const mysql = require('mysql2');
var fs = require("fs");

//Import the user model configurations (database's tables')
const UserModel = require('./userModel')
const CommentModel = require('./commentModel')

//Configure important parameters for the ORM and SQL drivers (database itself)
const dbConfig = require('./dbConfig')
const databaseName = dbConfig.databaseName;
const sequelizeOptions = dbConfig.sequelizeOptions; 
const sequelize = new Sequelize(databaseName, dbConfig.username, dbConfig.password, 
	sequelizeOptions);


////////////////////////////////////////////////////////
// set-up the ORM model

//Bind the models with the database
const User = sequelize.define('user',UserModel.model,UserModel.config);
const Comment = sequelize.define('comment',CommentModel.model,CommentModel.config);


// #############################begin of init ##############################
//Function that initializes the database and persists it
async function init(){
	
///////////////////////////////////////////////////////////////
//Initialize the database before using the ORM sequelize
let connection = await mysql.createConnection({
	user: dbConfig.username,
	password: dbConfig.password
});

//First Create the database
await connection.promise().query(`DROP DATABASE IF EXISTS ${databaseName}`)
.then(() => {
	console.log('previous database cleared -- complete');
	
	return connection.promise().query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`)
})

//Second Check the sequelize ORM once database is created
.then(()=>{
	connection.end();
	console.log('database (re-)creation -- complete');
	
	return sequelize.authenticate()
})

//Third Add initial User and Comment data into the database
.then(() => {
		console.log("ORM connection with MYSQL -- complete");

		return sequelize.sync({alter: true});
})
//Create a first user
.then(() => {
	return User.create({username: 'jane', 
	password: '123',
	email: '123@123.com',
	birthdate: new Date('1998-03-24'),
	});
})
//Create a second initial user
.then(() => {
	return User.create({username: 'simayi', 
	password: 'root',
	email: 'abc@cba.com',
	birthdate: new Date('1995-10-24'),
	});
})
//Create a third initial user
.then(() => {
	return User.create({username: 'youngling', 
	password: '123',
	email: 'young@young.com',
	birthdate: new Date('2005-10-24'),
	});
})
//Add initial Comment data from the file comments.json
.then(() => {
		fs.readFile("public/comments.json" , 'utf8', (err, data) =>{
			//console.log(err, data);
			let list = JSON.parse(data);
			//console.log(typeof list);
			list.forEach((item) => {
				//console.log(item);
				//Add each comment into the database
				Comment.create(item)
			})
		})
		
		console.log("initial data load of database -- complete")

})
//Handle any errors, including failing to connect with the database and so on
.catch((e) => {
	console.log("###internal error with connecting and creating the database ... retrying after 5 seconds");
	console.log("###did you start-up Mysql? Is the admin's username + password correct?")
	setTimeout(init, 5000)
})


}
// #############################end of init ##############################

let db = {}
db.sequelize = sequelize;
db.init = init;

module.exports = db;


