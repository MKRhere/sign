import { css } from "@emotion/css";
import classNames from "classnames";

const container = css`
	display: inline-block;
`;

const select = css`
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
	appearance: none;

	& option {
		background: aliceblue;
		color: black;
	}

	& option:hover,
	& option:focus {
		background: aliceblue;
		color: black;
	}

	&:hover,
	&:focus {
		background: rgba(80, 80, 255, 1);
		outline: none;
	}
`;

function Select({ none, items, error, className, ...props }) {
	return (
		<div className={container}>
			<select className={classNames(select, className)} {...props}>
				{[{ id: "none", label: none }].concat(items).map(item => (
					<option key={item.id}>{item.label}</option>
				))}
			</select>
			{error ? <div className="error-message">{error}</div> : ""}
		</div>
	);
}

export default Select;
