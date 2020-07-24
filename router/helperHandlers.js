function handleError(e, res){
	//Database connection failed
		//custom defined errors
		if(e.type == 'custom'){
			res.send({
				status: "failed",
				message: e.message
			})
		}
		else if(e.original != undefined && e.original.code == 'ECONNREFUSED'){
			res.send({
		    status : "error",
		    message : "Unable to communicate with database ",
		    data: e
			})
		}
		//Unable to add
		else{
			//console.log(e.errors[0].message);
			
			let message;
			if(e.errors == undefined || e.errors[0] == undefined || e.errors[0].message == undefined){
				message = "could not update database, missing body parameters, or internal error. Retry request."
			}else{
				message = e.errors[0].message;
			}
			
			res.send({
		    status : "failed",
		    message : message,
		    data: e
			})
		}
}

function handleNoLogin(req, res){
	if(req.session.username == undefined || req.session.username.length == 0){
		res.send({
			status: "failed",
			message: "No user logged-in! Please log-in before viewing comments"
		})
		return;
	}
}




let handlers = {}
handlers.handleError = handleError;
handlers.handleNoLogin = handleNoLogin;


module.exports = handlers;