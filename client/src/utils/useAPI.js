import { usePromise } from "./usePromise";
import { useRefresh } from "./useRefresh";

export const useAPI = (
	apiCall,
	{ defaultState, dependencies = [] } = {},
	...data
) => {
	const [refToken, refresh] = useRefresh();

	const [response, err, loading] = usePromise(
		() => apiCall(...data),
		defaultState,
		[...dependencies, refToken],
	);

	return [response, err, loading, refresh];
};
