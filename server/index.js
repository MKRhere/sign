require("dotenv").config();

const { resolve } = require("path");
const express = require("express");
const { json } = require("body-parser");

const createDB = require("./database");
const routes = require("./routes");
const app = express();

const port = process.env.PORT || 4000;

async function main() {
	app.use(express.static(resolve(__dirname, "../public")));
	app.use(json());

	// --

	const db = await createDB(process.env.MONGO_CONN);

	routes({ server: app, db });

	// --

	app.listen(port, () => console.log("Listening on port", port));
}

main();
