import { __ } from "@wordpress/i18n";
import { useContext } from "@wordpress/element";
import { RichText } from "@wordpress/block-editor";
import { DraggableCore } from "react-draggable";

// Internal dependencies
import AttributesContext from "./AttributesContext";

export default function Label() {
	const MOVEMENT_THRESHOLD = 0.1;
	const {
		attributes,
		updateAttribute,
		isSelected,
		parentDimensions,
		isOpened,
	} = useContext(AttributesContext);

	return (
		<DraggableCore
			onDrag={(e, { x, y, deltaX, deltaY }) =>
				handleDrag(x, y, deltaX, deltaY, handlePosChange)
			}
			onStop={(e, { x, y, deltaX, deltaY }) =>
				handleStop(x, y, deltaX, deltaY, handlePosChange)
			}
		>
			<div
				className="section__label-wrapper"
				style={{
					transform: `translate(${
						(attributes.labelPos[0] * parentDimensions.width) / 100
					}px, ${(attributes.labelPos[1] * parentDimensions.height) / 100}px)`,
				}}
			>
				<RichText
					tagName="h2"
					value={attributes.label}
					allowedFormats={["core/bold", "core/italic", "core/strikethrough"]}
					onChange={updateAttribute("label")}
					placeholder={__("Label")}
					className="section__label"
					style={{ transform: `rotate(${attributes.labelRot}deg)` }}
				/>
			</div>
		</DraggableCore>
	);

	function handleDrag(x, y, deltaX, deltaY, callback) {
		if (deltaX * deltaY > MOVEMENT_THRESHOLD) {
			callback(x, y);
		}
	}

	function handleStop(x, y, callback) {
		callback(x, y);
	}

	function handlePosChange(x, y) {
		if (isSelected && isOpened) {
			return;
		}

		const { width, height } = parentDimensions;

		updateAttribute("labelPos")([(100 * x) / width, (100 * y) / height]);
	}
}
