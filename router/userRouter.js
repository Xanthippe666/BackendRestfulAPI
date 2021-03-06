//Import important libraries
const express = require('express');
const router = express.Router();
const {Op } = require('sequelize');

//Set-up MYSQL and the ORM
const db = require('../db/db');
let sequelize = db.sequelize;
let userModel = sequelize.models.user;


//Import helper function
const handler = require('./helperHandlers.js')

////////////////////////////RESTFUL API/////////////////////////
/*
 * POST
 * Register a user with the following fields:
	- name
	- birthdate
	- email
	- password
 */
router.post('/add', (req, res) => {
	let {username, password, email, birthdate} = req.body;
	
	let userObj = {username: username, 
				   password: password,
				   email: email,
				   birthdate: new Date(birthdate),
				};
	
	userModel.create(userObj).then((data) =>{
		//console.log(data);
		res.send({
			status: "success",
			data: {
				newUser: data
			}
		});
	})
	.catch((e) => {
		handler.handleError(e, res)
	})
	
})
////////////////////////////////End of Register User/////////////////////


/*
 * GET
 * Login the user based on the following fields:
	- email
	- password
	
 *   If successful, the session will be logged-in for the user, unlocking
 *  other api calls, like view/add friend, view/add comments
 */
router.post('/login', (req, res) => {
	
	
	let {email, password} = req.body;
	
	userModel.findOne({
		where: {
		    email: email,
		    password: password
		 }
	}).then((data) => {
		
		//If no data entry is found ...
		if(data == undefined){
			let error = {
				type: "custom",
				status: "failed",
				message: "email and/or password incorrect"
			}
			throw error;
		}else{	
			
			//Save the logged-in username as a session
			req.session.username = data.username
			//console.log(req.session.username);
			
			res.send({
				status: "success",
				data: {
					enterUser: data
				}
			});
		}
		
	}).catch((e) => {
		handler.handleError(e, res)
	})
});
//////////////////////End of Login User//////////////////////////



/*
 * POST
 * ONLY AFTER LOGIN SUCCESSFUL
 * Add a friend
	You will need at least 2 users to test this functionality.
 */
router.post('/friendAdd', (req, res)=>{
	
	
	//Can only add friends if an user has already logged-in during the session
	if(req.session.username == undefined || req.session.username.length == 0){
		res.send({
			status: "failed",
			message: "No user logged-in! Please log-in before adding friends"
		})
		return;
	}
	
	//if user logged-in, continue
	//let {currentUser, toAddUser} = req.body;
	 let currentUser = req.session.username;
	 let {toAddUser} = req.body;
	 
	//Containers for the two users to add each other
	let userJSON; 
	let toAddUserJSON;
	
	
	//PROMISE CHAIN START
	userModel.findOne({
		where:{
			username: currentUser
		}
	})
	//Check if the current user exists
	.then((data) => {
		
		if(currentUser == toAddUser){
			let error = {
				type: "custom",
				status: "failed",
				message: "user cannot add self as a friend"
			};
			
			throw error;
			
		}
		
		//If no data entry is found ...
		if(data == undefined){
			
			let error = {
				type: "custom",
				status: "failed",
				message: "current user does not exist, or is not logged in correctly"
			};
			
			throw error;
		}
		
		//Save the current user's data
		userJSON = data.dataValues;
		//console.log(userJSON);
		
		return userModel.findOne({where:{username: toAddUser}});
	})
	//Find the user to be added
	.then( (data) =>{
		//If no data entry is found ...
		if(data == undefined){
			
			let error = {
				type: "custom",
				status: "failed",
				message: "user to add does not exist"
			};
			
			throw error;
			
		}
		
		//Save the to be added user's data
		toAddUserJSON = data.dataValues;
		//console.log(userJSON);
		
		//Check if both of their birthdate's are above 18
		let userYears = (Date.now() - new Date(userJSON.birthdate).getTime())
		userYears = userYears/1000/60/60/24/365;
		let toAddUserYears = (Date.now() - new Date(toAddUserJSON.birthdate).getTime())
		toAddUserYears = toAddUserYears/1000/60/60/24/365;
		if(userYears < 18.0){
			
			let error = {
				type: "custom",
				status: "failed",
				message: "The user " + userJSON.username + " is not at least 18"
			};
			
			throw error;
			
		}else if(toAddUserYears < 18.0){
			
			let error = {
				type: "custom",
				status: "failed",
				message: "The user " + toAddUserJSON.username + " is not at least 18"
			};
			
			throw error;
		}
		
		
		
		
		//Update the current user's friend list
		let friendList;
		if(userJSON.friends.length == 0){
			friendList = [];
		}
		else{
			friendList = userJSON.friends.split(',');
		}
		//Check if friend is added already or not
		if(!friendList.includes(toAddUserJSON.id.toString())){	
			friendList.push(toAddUserJSON.id);
		}
		
		return userModel.update({friends: friendList.toString()}, {where:userJSON})
	})
	//Do the reciprocal - add the current user into the to-be-added user's
	//friend list
	.then(() => {
		
		//Update the current user's friend list
		let friendList;
		if(toAddUserJSON.friends.length == 0){
			friendList = [];
		}
		else{
			friendList = toAddUserJSON.friends.split(',');
		}
		//Check if friend is added already or not
		if(!friendList.includes(userJSON.id.toString())){	
			friendList.push(userJSON.id);
		}else{
			let error = {
				type: "custom",
				status: "failed",
				message: "The user " + toAddUserJSON.username + " is already friends with " + userJSON.username 
			};
			 
			throw error;
		}
		
		return userModel.update({friends: friendList.toString()}, {where:toAddUserJSON})
	})
	.then(() => {
		res.send({
			status: "success",
			data: {
				friendAdd:{
					currentUser: userJSON.username,
					toAddUser: toAddUserJSON.username
				}
			}
		});
	})
	.catch((e) => {
		handler.handleError(e, res)
	})
	
});
//////////////////////End of add a friend///////////////////////////////////


/*
 * GET
 * ONLY CAN BE DONE AFTER USER LOG-IN
 * View friends
 * The user should be able to view a list of users that they have added as friends.
 */
router.get('/viewFriends', (req, res) => {
	
	
	//Can only add friends if an user has already logged-in during the session
	if(req.session.username == undefined || req.session.username.length == 0){
		res.send({
			status: "failed",
			message: "No user logged-in! Please log-in before adding friends"
		})
		return;
	}
	
	//if user logged-in, continue
	 let username = req.session.username;
	
	let friendList;
	let currentUser;
		
	//Find the user
	userModel.findOne({where: {username: username}})
	.then((data) => {
		currentUser = data.dataValues;
		//console.log(data);
		
		if(currentUser.friends.length == 0){
			friendList = []
		}
		else{
			friendList = currentUser.friends.split(',');
		}
		
		friendList = friendList.map(Number);
		//console.log(friendList);
		
		return userModel.findAll({where: 
			{
			    id: {
			      [Op.or]: friendList
			    }
			}
		});
		
	})
	.then((data) => {
		
		//Only output friend's username data
		let usernameList = data.map((item) => item.username)
		
		
		//covers the special case where the friend list is actually empty
		if(currentUser.friends.length == 0){
			usernameList = []
		}
		
		
		res.send({
				status: "success",
				data: {
					currentUser: currentUser.username,
					friendList: usernameList
				}
		})
		
	})
	.catch((e) => {
		handler.handleError(e, res)
	})
	
	
	
})

///////////////////////////End of view friend list //////////////////////////


/*
 * GET
 * View all users
 */
router.get('/view', (req, res) => {
	
	userModel.findAll().then((data) => {
		
		res.send({
			status: "success",
			data: {
				users: data
			}
		});
	}).catch((e) => {
		//console.log(e.original.code);
		//console.log(e)
		handler.handleError(e, res)
		
		//res.send(JSON.stringify(users,0,2));
	})
	
});


///////////////////////////End of view all users/////////////////////////////////

/*
 * GET
 * Logout user
 */
router.get('/logout', (req, res) => {
	
	if(req.session.username == undefined || req.session.username.length == 0){
		res.send({
			status: "failed",
			message: "No user to log-out!"
		})
	}else{
		let temp = req.session.username
		req.session.username = ""; //clear the session
		
		res.send({
			status: "success",
			message: "User " + temp + " logged-out!"
		})
	}
	
})


module.exports = router;
