import { useState, useEffect } from "react";

export const usePromise = (promiseFunction, defaultState, dependencies) => {
	const [response, setResponse] = useState(defaultState);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		Promise.resolve(promiseFunction())
			.then(data => {
				setResponse(data);
				setLoading(false);
			})
			.catch(err => {
				setError(err);
				setLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	return [response, error, loading];
};
