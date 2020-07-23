const { DataTypes } = require("sequelize");

const Model = {
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		notEmpty: true,
		validate:{
			notContains: ' ',
			len: [1,100]
		},
		comment: 'User"s name'
	},
	password: {
		type: DataTypes.STRING(64),
		allowNull: false,
		notEmpty: true,
		validate:{
			len: [1,64]
		},
		comment: 'User"s password'
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		notEmpty: true,
		comment: 'User"s email',
		validate: {
			isEmail: true,
		}
	},
	birthdate: {
		type: DataTypes.DATEONLY,
		allowNull: false,
		notEmpty: true,
		comment: 'User"s birthdate',
		validate: {
			isDate: true,
		}
	},
	friends: {
		type: DataTypes.STRING,
		defaultValue: '',
		comment: 'User"s friends in array stringified format'
	}
};

const Config = {
	tableName: 'user',
	timestamps: false
};

UserModel = {}
UserModel.model = Model;
UserModel.config = Config;

module.exports =  UserModel;