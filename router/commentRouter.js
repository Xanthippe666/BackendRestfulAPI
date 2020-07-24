//Import important libraries
const express = require('express');
const router = express.Router();

//Set-up MYSQL and the ORM
const db = require('../db/db');
let sequelize = db.sequelize;
let commentModel = sequelize.models.comment;

//Import helper function
const handler = require('./helperHandlers.js')

////////////////////////////RESTFUL API/////////////////////////
/*
 * POST
 * CAN ONLY BE USED ONCE LOGGED-IN
 * Save a comment into the database, following the same schema as in the samples provided in `comments.json`.
 */
router.post('/add', (req, res) => {
	
	//Can only post comments if an user has already logged-in during the session
	if(req.session.username == undefined || req.session.username.length == 0){
		res.send({
			status: "failed",
			message: "No user logged-in! Please log-in before posting comments"
		})
		return;
	}
	
	//if user logged-in, continue
	let {text} = req.body;
	
	let commentObj = {text: text, timestamp: Date.now()/1000};
	
	commentModel.create(commentObj).then((data) =>{
		//console.log(data);
		res.send({
			status: "success",
			data: {
				newComment: data
			}
		});
	})
	.catch((e) => {
		handler.handleError(e, res);
	})
	
	
	
})

/*
 * GET
 * CAN ONLY BE USED ONCE LOGGED-IN
 * Returns a list of comments, sorted from newest to oldest.
 */
router.get('/view', (req, res) => {
	
	//Can only post comments if an user has already logged-in during the session
	if(req.session.username == undefined || req.session.username.length == 0){
		res.send({
			status: "failed",
			message: "No user logged-in! Please log-in before viewing comments"
		})
		return;
	}
	
	//if user logged-in, continue
	commentModel.findAll({order: sequelize.literal('timestamp DESC')}).then((data) => {
		
		res.send({
			status: "success",
			data: {
				comments: data
			}
		});
		
	}).catch((e) => {
		handler.handleError(e, res);
	})
	
});

module.exports = router;
