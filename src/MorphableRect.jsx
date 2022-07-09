import { useContext, forwardRef } from "@wordpress/element";

import AttributesContext from "./AttributesContext";
import Points from "./Points";

const MorphableRect = forwardRef((props, ref) => {
	const { attributes, updateAttribute, parentDimensions, isSelected } =
		useContext(AttributesContext);

	return (
		<>
			<div className="section__background" ref={ref} style={getCSSvars()}></div>
			{props.children}
			<div className="section__content"></div>

			{isSelected && (
				<Points
					defaultPositions={getPointsDefaultPositions()}
					positions={Object.keys(attributes.corners)}
					onDrag={updateCorner}
					onStop={preventExitingView}
				/>
			)}
		</>
	);

	function getPointsDefaultPositions() {
		const { corners } = attributes;
		const { width, height } = props.parentDimensions;

		let defaultPositions = {};

		for (const cornerType in corners) {
			defaultPositions[cornerType] = { x: 0, y: 0 };
			defaultPositions[cornerType].x = (corners[cornerType][0] * width) / 100;
			defaultPositions[cornerType].y = (corners[cornerType][1] * height) / 100;
		}

		return defaultPositions;
	}

	function getClipPathValue() {
		const { top, right, bottom, left } = attributes.corners;
		return `polygon(${top[0]}% ${top[1]}%, ${right[0]}% ${right[1]}%, ${bottom[0]}% ${bottom[1]}%, ${left[0]}% ${left[1]}%)`;
	}

	function getCSSvars() {
		return {
			"--parent-height": `${parentDimensions.height}px`,
			"--parent-width": `${parentDimensions.width}px`,
			"--background-clip-path": getClipPathValue(),
			"--background":
				attributes.style?.color.background ??
				`var(--wp--preset--color--${attributes.backgroundColor})`,
		};
	}

	function updateCorner(cornerType, x, y) {
		const { width, height } = parentDimensions;

		updateAttribute("corners")({
			...attributes.corners,
			[cornerType]: [(100 * x) / width, (100 * y) / height], // save as percentages
		});
	}

	function preventExitingView(cornerType, x, y) {
		const { width, height } = parentDimensions;

		if (x < 0) x = 0;
		else if (x > width) x = width;

		if (y < 0) y = 0;
		else if (y > height) y = height;

		updateCorner(cornerType, x, y);
	}
});

export default MorphableRect;
