import { __ } from "@wordpress/i18n";
import { useContext } from "@wordpress/element";
import { RichText } from "@wordpress/block-editor";
import Draggable from "react-draggable";

// Internal dependencies
import AttributesContext from "./AttributesContext";

export default function Label() {
	const {
		attributes,
		updateAttribute,
		isSelected,
		parentDimensions,
		isOpened,
		isLabelHovered,
	} = useContext(AttributesContext);

	return (
		<Draggable
			onDrag={(e, { x, y }) => handlePosChange(x, y)}
			handle={".label__handle"}
			position={getLabelPosition()}
		>
			<div className="section__label" style={getCSSvariables()}>
				<div className={`label__wrapper ${isLabelHovered ? "is-hovered" : ""}`}>
					{isSelected && !isOpened && !isLabelHovered && (
						<div className="label__handle"></div>
					)}
					<div className="label__container">
						<RichText
							tagName="h2"
							value={attributes.label}
							allowedFormats={[
								"core/bold",
								"core/italic",
								"core/strikethrough",
							]}
							onChange={updateAttribute("label")}
							placeholder={__("Label")}
							className="label__text"
							onMouseDown={(e) => {
								if (e.currentTarget == document.activeElement)
									e.stopPropagation(); // prevent dragging while typing
							}}
						/>
						<div className="label__clones-container">
							{[...Array(3)].map((_value, index) => (
								<h2 className="label__clone" key={index}>
									{attributes.label}
								</h2>
							))}
						</div>
					</div>
				</div>
			</div>
		</Draggable>
	);

	function getLabelPosition() {
		const [x, y] = attributes.labelPos;
		const { width, height } = parentDimensions;
		return {
			x: (x / 100) * width,
			y: (y / 100) * height,
		};
	}

	function handlePosChange(x, y) {
		if (isSelected && isOpened) {
			return;
		}

		const { width, height } = parentDimensions;

		let xPercent = (100 * x) / width;
		let yPercent = (100 * y) / height;

		if (xPercent <= 0) xPercent = 0;
		else if (xPercent >= 100) xPercent = 100;

		if (yPercent <= 0) yPercent = 0;
		else if (yPercent >= 100) yPercent = 100;

		updateAttribute("labelPos")([xPercent, yPercent]);
	}

	function getCSSvariables() {
		return {
			"--label-rotate": `rotate(${attributes.labelRot}deg)`,
		};
	}
}
