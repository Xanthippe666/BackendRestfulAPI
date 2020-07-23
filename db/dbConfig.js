//Configuration for the database MYSQL
//Sets up who is to log-in (admin? root? guest?)

//Should be changed depending on which server the back-end is running on

const config = {
	username: 'admin',
	password: '123456', 
	databaseName: 'nodetest333',
	sequelizeOptions: {
		dialect: 'mysql',
		host: 'localhost',
		pool:{
			max: 5,
			idle: 30000,
			acquire: 60000,
		},
		logging: false
	},
}

module.exports = config;
