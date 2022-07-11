import { useContext } from "@wordpress/element";

import AttributesContext from "./AttributesContext";
import Points from "./Points";

export default function MorphableRect({ children }) {
	const { attributes, updateCorner, parentDimensions, isSelected, isOpened } =
		useContext(AttributesContext);

	return (
		<>
			<div className="section__background" style={getCSSvars()}></div>
			{children}
			{isSelected && !isOpened && (
				<Points
					positions={getPointsPositions()}
					cornerTypes={Object.keys(attributes.corners)}
					onDrag={updateCorner}
					onStop={preventExitingView}
				/>
			)}
		</>
	);

	function getPointsPositions() {
		const { corners } = attributes;
		const { width, height } = parentDimensions;

		let positions = {};

		for (const cornerType in corners) {
			positions[cornerType] = { x: 0, y: 0 };
			positions[cornerType].x = (corners[cornerType][0] * width) / 100;
			positions[cornerType].y = (corners[cornerType][1] * height) / 100;
		}

		return positions;
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

	function preventExitingView(cornerType, x, y) {
		const { width, height } = parentDimensions;

		if (x < 0) x = 0;
		else if (x > width) x = width;

		if (y < 0) y = 0;
		else if (y > height) y = height;

		updateCorner(cornerType, x, y);
	}
}

MorphableRect.Content = ({ attributes, children }) => {
	return (
		<>
			<div className="section__background" style={getCSSvars()}></div>
			{children}
		</>
	);

	function getCSSvars() {
		return {
			"--parent-height": "var(--height)",
			"--parent-width": "var(--width)",
			"--background-clip-path": getClipPathValue(),
			"--background":
				attributes.style?.color.background ??
				`var(--wp--preset--color--${attributes.backgroundColor})`,
		};
	}

	function getClipPathValue() {
		const { top, right, bottom, left } = attributes.corners;
		return `polygon(${top[0]}% ${top[1]}%, ${right[0]}% ${right[1]}%, ${bottom[0]}% ${bottom[1]}%, ${left[0]}% ${left[1]}%)`;
	}
};
