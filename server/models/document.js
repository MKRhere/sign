const Document = ({ Schema, model }) => {
	const Signature = new Schema({
		name: String,
		sign: String,
		font: String,
		mode: { type: String, enum: ["IMG", "TEXT"] },
		required: Boolean,
	});

	const Document = model(
		"document",
		new Schema({
			template: String,
			context: Schema.Types.Mixed,
			signatures: [Signature],
			created: Date,
		}),
	);

	return Document;
};

module.exports = Document;
