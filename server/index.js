const CONFIG = require("../config.json");

const { resolve } = require("path");
const express = require("express");
const { json } = require("body-parser");

const createDB = require("./database");
const routes = require("./routes");
const { createTransport } = require("nodemailer");
const app = express();

const port = CONFIG.PORT || process.env.PORT || 4000;

async function main() {
	app.use(express.static(resolve(__dirname, "../public")));
	app.use(json());

	// --

	const db = await createDB(CONFIG.MONGO_CONN);

	const mailers = CONFIG.SMTP.reduce((acc, config) => {
		acc[config.auth.user] = createTransport(config);
		acc[config.auth.user].config = config;
		return acc;
	}, {});

	routes({ server: app, db, mailers });

	// --

	app.listen(port, () => console.log("Listening on port", port));
}

main();
