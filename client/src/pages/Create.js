import Container from "../components/Container";
import Select from "react-select";
import { useState } from "react";
import { css } from "@emotion/css";

const RentReceipt = () => {
	return null;
};

const templates = {
	"rent-receipt": RentReceipt,
};

const preview = css`
	align-items: center;
	border-color: rgb(204, 204, 204);
	border-radius: 4px;
	border-style: solid;
	border-width: 1px;
	cursor: default;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	min-height: 4rem;
	outline: 0 !important;
	position: relative;
	transition: all 100ms;
	box-sizing: border-box;
`;

const Preview = ({ Template }) => {
	if (Template)
		return (
			<div className={preview}>
				<Template />
			</div>
		);
	else return <div className={preview}>No template selected</div>;
};

const Create = () => {
	const [selected, setSelected] = useState("");

	return (
		<Container>
			<Select
				onChange={({ value }) => setSelected(value)}
				options={Object.keys(templates).map(template => ({
					value: template,
					label: template,
				}))}></Select>
			<Preview Template={templates[selected]} />
		</Container>
	);
};

export default Create;
