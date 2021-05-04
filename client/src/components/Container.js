import { css } from "@emotion/css";

const container = css`
	width: 100%;
	height: 100%;
	max-width: 900px;
	margin: auto;
	padding: 2rem 2rem;
`;

const Container = ({ children }) => {
	return <div className={container}>{children}</div>;
};

export default Container;
