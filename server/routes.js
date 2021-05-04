const { simpleAuth } = require("./middleware");

const alphanumberic = new Set(
	"abcdefghijklmnopqrstuvwxyz0123456789_-".split(""),
);

const routes = ({ config, server, db, mailers }) => {
	const auth = simpleAuth(config.MASTER_PASS);

	// verify password
	server.get("/verify", auth, async (req, res) =>
		res.send({ msg: "Verified" }),
	);

	// list documents
	server.get("/document", auth, async (req, res) => {
		const docs = await db.Document.find(
			{},
			"template name created signatures",
		);

		res.send(docs);
	});

	// delete specified document
	server.delete("/document/:id", auth, async (req, res) => {
		await db.Document.deleteOne({ _id: req.params.id });

		res.send({ msg: "Deleted one document." });
	});

	// create document
	server.post("/document", auth, async (req, res) => {
		const { template, name, sender, context, signatures } = req.body;

		try {
			const doc = await db.Document.create({
				template,
				name,
				sender,
				context,
				signatures,
				created: new Date(),
			});

			res.send({ msg: "Document created.", id: doc._id });
		} catch (e) {
			res.status(500).send({ msg: "An error occured." });
		}
	});

	// void specified document
	server.put("/document/void/:id", auth, async (req, res) => {
		try {
			const doc = await db.Document.findOneAndUpdate(
				{
					_id,
				},
				{ $set: { void: true } },
			);

			if (doc.mailsSentAt) {
				const status = await Promise.all(
					signatures.map(({ _id, email }) => {
						const mailer = mailers[doc.sender];
						return mailer
							.sendMail({
								from: `"${mailer.config.name}" <${mailer.config.auth.user}>`,
								to: email,
								subject: `${mailer.config.name} has voided the document ${doc.name}.`,
								text: `${mailer.config.name} has voided the document ${doc.name}`,
								html: `${mailer.config.name} has voided the document ${doc.name}`,
							})
							.then(() => ({ email, status: true }))
							.catch(() => ({ email, status: false }));
					}),
				);

				res.send({
					msg: `Document voided. Mail sent to ${
						status.filter(st => st.status).length
					} emails.`,
					failed: status.filter(st => !st.status).map(st => st.email),
				});
			} else {
				res.send({ msg: "Document voided. No emails sent." });
			}
		} catch (e) {
			res.status(500).send({ msg: "An error occured." });
		}
	});

	// send emails do signatories
	server.post("/document/send/:id", auth, async (req, res) => {
		const { emails = [] } = req.body;
		const origin = req.headers["origin"];

		const doc = await db.Document.findOne({ _id: req.params.id });

		console.log({ origin });

		const signatures = emails.length
			? doc.signatures
			: doc.signatures.filter(signature =>
					emails.includes(signature.email),
			  );

		const status = await Promise.all(
			signatures.map(({ _id, email }) => {
				const mailer = mailers[doc.sender];
				return mailer
					.sendMail({
						from: `"${mailer.config.name}" <${mailer.config.auth.user}>`,
						to: email,
						subject: `${mailer.config.name} has sent a document to sign.`,
						text: `${mailer.config.name} has sent a document "${doc.name}" for you to sign. Please sign at: ${origin}/sign/${doc._id}?signer=${_id}`,
						html: `${mailer.config.name} has sent a document "${doc.name}" for you to sign. Please sign at: ${origin}/sign/${doc._id}?signer=${_id}`,
					})
					.then(() => ({ email, status: true }))
					.catch(() => ({ email, status: false }));
			}),
		);

		doc.mailsSentAt = new Date();
		await doc.save();

		res.send({
			msg: `Successfully sent to ${
				status.filter(st => st.status).length
			} emails.`,
			failed: status.filter(st => !st.status).map(st => st.email),
		});
	});

	// get specified document
	server.get("/document/:id", async (req, res) => {
		const doc = await db.Document.findOne(
			{ _id: req.params.id },
			"-signature._id",
		);

		res.send(doc);
	});

	// sign as signatory
	server.put("/document/sign/:id", async (req, res) => {
		const { signId } = req.query;
		const { name, sign, font, mode, pdf } = req.body;
		const origin = req.headers["origin"];

		const doc = await db.Document.findOne({ _id: req.params.id });

		if (doc.void)
			return res.status(403).send({
				msg: "This document has been voided and cannot be signed.",
			});

		const signature = doc.signatures.find(signature => {
			return signature._id === signId;
		});

		if (!signature)
			return res
				.status(403)
				.send({ msg: "You cannot sign this document." });

		if (signature.signedAt)
			return res.status(403).send({
				msg: "You have already signed this document.",
			});

		if (!name || !sign)
			return res.status(400).send({ msg: "name and sign are required." });

		if (mode === "TEXT" && !font)
			return res.status(400).send({ msg: "You must select a font" });

		if (!["IMG", "TEXT"].includes(mode))
			return res
				.status(400)
				.send({ msg: "mode must be one of TEXT, IMG" });

		Object.assign(signature, { name, sign, font, mode });

		await doc.save();

		res.send({ msg: "Your signature was added successfully." });

		const attachments = [
			{
				// encoded string as an attachment
				filename:
					doc.name
						.toLowerCase()
						.replace(" ", "_")
						.split("")
						.filter(x => alphanumberic.has(x))
						.join("") + ".pdf",
				content: pdf,
				encoding: "base64",
			},
		];

		[
			doc.sender,
			...signatures
				.filter(sign => sign.signedAt)
				.map(({ email }) => email),
		].map(({ email }) => {
			const mailer = mailers[doc.sender];
			return mailer
				.sendMail({
					from: `"${mailer.config.name}" <${mailer.config.auth.user}>`,
					to: email,
					subject: `${name} has signed the document ${doc.name}.`,
					text: `"${name}" <${email}> has signed the document "${doc.name}". Find updated document at: ${origin}/sign/${doc._id}`,
					html: `"${name}" <${email}> has signed the document "${doc.name}". Find updated document at: ${origin}/sign/${doc._id}`,
					attachments,
				})
				.catch(() => {});
		});

		signatures
			.filter(sign => !sign.signedAt)
			.map(({ email }) => {
				const mailer = mailers[doc.sender];
				return mailer
					.sendMail({
						from: `"${mailer.config.name}" <${mailer.config.auth.user}>`,
						to: email,
						subject: `${name} has signed the document ${doc.name}.`,
						text: `"${name}" <${email}> has signed the document "${doc.name}". Please add your sign at: ${origin}/sign/${doc._id}?signer=${_id}`,
						html: `"${name}" <${email}> has signed the document "${doc.name}". Please add your sign at: ${origin}/sign/${doc._id}?signer=${_id}`,
						attachments,
					})
					.catch(() => {});
			});
	});
};

module.exports = routes;
