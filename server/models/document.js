const Document = mongoose => {
	const Signature = new mongoose.Schema({
		name: String,
		sign: String,
		font: String,
		email: String,
		mode: { type: String, enum: ["IMG", "TEXT"] },
		signedAt: Date,
		required: Boolean,
	});

	const Document = mongoose.model(
		"document",
		new mongoose.Schema({
			template: String,
			name: String,
			sender: String,
			void: Boolean,
			context: mongoose.Schema.Types.Mixed,
			signatures: [Signature],
			mailsSentAt: Date,
			created: Date,
		}),
	);

	return Document;
};

module.exports = Document;
