
const { DataTypes } = require("sequelize");

const Model = {
	text: {
		type: DataTypes.TEXT,
		allowNull: false,
		notEmpty: true,
		validate:{
			len:[1, 500]
		}
	},
	timestamp: {
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

const Config = {
	tableName: 'comment',
	timestamps: false
};

CommentModel = {}
CommentModel.model = Model;
CommentModel.config = Config;

module.exports =  CommentModel;
