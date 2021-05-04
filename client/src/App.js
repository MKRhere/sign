import { useEffect } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Create from "./pages/Create";
import Dashboard from "./pages/Dashboard";
import Document from "./pages/Document";
import SignIn from "./pages/SignIn";
import API from "./api";

function App() {
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		API.verify()
			.then(() => {
				if (location.pathname === "/")
					return history.push("/documents");
			})
			.catch(() => history.push("/"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="App">
			<ToastContainer position="bottom-right" hideProgressBar={true} />
			<Switch>
				<Route path="/documents">
					<Dashboard />
				</Route>
				<Route path="/create">
					<Create />
				</Route>
				<Route path="/sign/:id">
					<Document />
				</Route>
				<Route path="/">
					<SignIn />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
