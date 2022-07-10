import {
	useCallback,
	useRef
} from "@wordpress/element";

export default function useElementDidMount(callback) {
	return useCallback((node) => {
		if (node !== null) {
			callback(node);
		}
	}, [])
}
