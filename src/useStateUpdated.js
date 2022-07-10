import {
	useEffect,
	useRef
} from "@wordpress/element";

export default function useStateUpdated(callback, dependencies) {
	const isFirstTime = useRef(true);
	useEffect(() => {
		if (isFirstTime.current) isFirstTime.current = false;
		else callback();
	}, dependencies)
}
