import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Create from "./pages/Create";
import Dashboard from "./pages/Dashboard";
import Document from "./pages/Document";
import SignIn from "./pages/SignIn";

function App() {
	return (
		<div className="App">
			<ToastContainer position="bottom-right" hideProgressBar={true} />
			<Router>
				<Switch>
					<Route path="/">
						<SignIn />
					</Route>
					<Route path="/documents">
						<Dashboard />
					</Route>
					<Route path="/new">
						<Create />
					</Route>
					<Route path="/sign/:id">
						<Document />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
