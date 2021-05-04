import API from "../api";
import { useAPI } from "../utils/useAPI";

import Container from "../components/Container";
import Button from "../components/Button";
import { useHistory } from "react-router";

const Dashboard = () => {
	const history = useHistory();

	const [docs, error, loading] = useAPI(API.document.list, {
		defaultState: [],
	});

	return (
		<Container>
			<Button onClick={() => history.push("/create")}>
				+ NEW DOCUMENT
			</Button>
			{docs.map(doc => (
				<div key={doc._id}></div>
			))}
		</Container>
	);
};

export default Dashboard;
