const Document = ({ Schema, model }) => {
	const Signature = new Schema({
		name: String,
		sign: String,
		font: String,
		email: String,
		mode: { type: String, enum: ["IMG", "TEXT"] },
		signedAt: Date,
		required: Boolean,
	});

	const Document = model(
		"document",
		new Schema({
			template: String,
			name: String,
			sender: String,
			void: Boolean,
			context: Schema.Types.Mixed,
			signatures: [Signature],
			mailsSentAt: Date,
			created: Date,
		}),
	);

	return Document;
};

module.exports = Document;
