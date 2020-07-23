//Import important libraries
const express = require('express');
const router = express.Router();

//Set-up MYSQL and the ORM
const db = require('../db/db');
let sequelize = db.sequelize;
let commentModel = sequelize.models.comment;

//Import helper function
const handleError = require('./helperHandlers.js')

////////////////////////////RESTFUL API/////////////////////////
/*
 * POST
 * Save a comment into the database, following the same schema as in the samples provided in `comments.json`.
 */
router.post('/add', (req, res) => {
	let {text} = req.body;
	
	//console.log(text, Date.now())
	
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
		handleError(e, res);
	})
	
	
	
})

/*
 * GET
 * Returns a list of comments, sorted from newest to oldest.
 */
router.get('/view', (req, res) => {
	
	commentModel.findAll({order: sequelize.literal('timestamp DESC')}).then((data) => {
		
		res.send({
			status: "success",
			data: {
				comments: data
			}
		});
		
	}).catch((e) => {
		handleError(e, res);
	})
	
});

module.exports = router;
