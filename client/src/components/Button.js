import { css } from "@emotion/css";
import classNames from "classnames";

const container = css`
	display: inline-block;
`;

const button = css`
	font-size: 0.8rem;
	padding: 0.5rem;
	border-radius: 0.25rem;
	border: 1px solid transparent;
	background: rgba(100, 100, 255, 1);
	color: white;
	outline: none;
	max-width: 80vw;
	transition: all 300ms;
	cursor: pointer;
	font-weight: 600;

	&:hover,
	&:focus {
		background: rgba(80, 80, 255, 1);
		outline: none;
	}
`;

function Input({ error, className, ...props }) {
	return (
		<div className={container}>
			<button className={classNames(button, className)} {...props} />
			{error ? <div className="error-message">{error}</div> : ""}
		</div>
	);
}

export default Input;
