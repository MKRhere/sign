import { css } from "@emotion/css";
import classNames from "classnames";

const input = css`
	font-size: 1rem;
	padding: 0.5rem;
	border-radius: 0.25rem;
	border: 1px solid rgba(0, 0, 0, 0.2);
	background: aliceblue;
	outline: none;
	max-width: 80vw;

	&:focus {
		border: 1px solid rgba(0, 0, 0, 1);
		outline: none;
	}
`;

function Input({ error, className, ...props }) {
	return (
		<div>
			<input className={classNames(input, className)} {...props} />
			{error ? <div className="error-message">{error}</div> : ""}
		</div>
	);
}

export default Input;
