import Draggable from "react-draggable";
import { RichText } from "@wordpress/block-editor";

import AttributesContext from "./AttributesContext";

export default function Label() {
	const { attributes, updateAttribute, isSelected } =
		useContext(AttributesContext);

	function handlePosChange(e, data) {
		const { isLabelFixed } = attributes;

		if (isLabelFixed || !isSelected) {
			// Don't let the label be draggable when it is fixed or not selected
			e.preventDefault();
			return;
		}

		const { x, y } = data;
		updateAttribute("labelPos")([x, y]);
	}

	function getDefaultPosition() {
		const { height, width } = parentDimensions;
		let result = { x: 0, y: 0 };

		if (isLabelFixed) {
			switch (labelAlignX) {
				case "left":
					result.x = 0;
					break;
				case "center":
					result.x = 0.5 * width;
					break;
				case "right":
					result.x = width;
					break;
			}
			switch (labelAlignY) {
				case "top":
					result.y = 0;
					break;
				case "center":
					result.y = 0.5 * height;
					break;
				case "bottom":
					result.y = height;
					break;
			}
		} else {
			result.x = labelPos[0];
			result.y = labelPos[1];
		}
		return result;
	}

	return (
		<Draggable onDrag={handlePosChange} defaultPosition={getDefaultPosition()}>
			<RichText
				tagName="h2"
				value={attributes.label}
				allowedFormats={["core/bold", "core/italic", "core/strikethrough"]}
				onChange={updateAttribute("label")}
				placeholder={__("Label")}
				className="section__label"
				style={!isLabelFixed && isSelected ? { cursor: "move" } : null}
			/>
		</Draggable>
	);
}
