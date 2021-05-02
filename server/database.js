const { Mongoose } = require("mongoose");
const Document = require("./models/document");

const db = async connString => {
	const mongoose = new Mongoose({
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	await mongoose.connect(connString);

	return { Document: Document(mongoose), _db: mongoose };
};

module.exports = db;
