import axios from "axios";

const instance = axios.create({
	baseURL:
		process.env.NODE_ENV === "development"
			? process.env.REACT_APP_API_BASE
			: "",
});

instance.interceptors.request.use(function (config) {
	const token = localStorage.getItem("password");
	if (token) config.headers.Authorization = `Simple ${token}`;
	return config;
}, Promise.reject);

instance.interceptors.response.use(
	function (response) {
		return response.data;
	},
	e => {
		console.log(e);
		return Promise.reject(e);
	},
);

export const verify = () => instance.get("/verify");

export const document = {
	list: () => instance.get("/document"),
	get: id => instance.get(`/document/${id}`),
	delete: id => instance.delete(`/document/${id}`),
	create: ({ template, name, sender, context, signatures }) =>
		instance.post(`/document`, {
			template,
			name,
			sender,
			context,
			signatures,
		}),
	void: id => instance.put(`/document/void/${id}`),
	send: (id, emails = []) =>
		instance.post(`/document/send/${id}`, { emails }),
	sign: (id, signId, { name, sign, font, mode, pdf }) =>
		instance.put(`/document/sign/${id}?signId=${signId}`, {
			name,
			sign,
			font,
			mode,
			pdf,
		}),
};

const API = { verify, document };

export default API;
