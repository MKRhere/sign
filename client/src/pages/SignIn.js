import { css } from "@emotion/css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";
import Input from "../components/Input";

const container = css`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	& h4 {
		font-size: 0.75rem;
		font-weight: 400;
		color: rgb(75, 75, 75, 1);
	}
`;

const SignIn = () => {
	const [password, setPassword] = useState("");
	const history = useHistory();

	const signIn = async () => {
		try {
			localStorage.setItem("password", password);
			await API.verify();
			history.push("/documents");
		} catch {
			toast.error("Could not login. Verify your password.");
		}
	};

	return (
		<div className={container}>
			<form>
				<h4>PASSWORD</h4>
				<Input
					type="password"
					autoComplete="password"
					onChange={e => setPassword(e.target.value)}
					onKeyDown={e => {
						if (e.key === "Enter") return signIn(history);
					}}
				/>
			</form>
		</div>
	);
};

export default SignIn;
