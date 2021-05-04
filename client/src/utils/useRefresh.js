import { useState } from "react";

export const useRefresh = () => {
	const [refToken, setRefToken] = useState(0);

	return [refToken, () => setRefToken(ref => ref + 1)];
};
