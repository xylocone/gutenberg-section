import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";

// Internal Dependencies
import AttributesContext from "./AttributesContext";
import MorphableRect from "./MorphableRect";
import Content from "./Content";
import Label from "./Label";
import SidebarSettings from "./SidebarSettings";
import useElementDidMount from "./useElementDidMount";
import useStateUpdated from "./useStateUpdated";

import "./editor.scss";

export default function Edit({ attributes, setAttributes, isSelected }) {
	const [parentDimensions, setParentDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [isOpened, setIsOpened] = useState(false);

	// Update the parentDimensions state variable every time the parent's dimensions change
	const containerRef = useElementDidMount((node) => {
		let parent = node.closest(".jumbotron__sections-wrapper");

		function updateParentDimensions() {
			setParentDimensions({
				width: parent.clientWidth,
				height: parent.clientHeight,
			});
		}

		new ResizeObserver(updateParentDimensions).observe(parent);

		updateParentDimensions();
	}, []);

	// Whenever isOpened changes, dispatch a relevant Event
	useStateUpdated(() => {
		if (isOpened) window.dispatchEvent(new Event("sectionOpened"));
		if (!isOpened) window.dispatchEvent(new Event("sectionClosed"));
	}, [isOpened]);

	// Whenever a sectionClosed event is triggered on window, set isOpened to false
	useEffect(() => {
		window.addEventListener("sectionClosed", () => {
			setIsOpened(false);
		});
	}, []);

	return (
		<AttributesContext.Provider
			value={{
				attributes,
				setAttributes,
				updateAttribute,
				isSelected,
				isOpened,
				setIsOpened,
				parentDimensions,
				updateCorner,
			}}
		>
			<div
				{...useBlockProps({
					className: `section__container ${isOpened ? "is-opened" : ""}`,
					ref: containerRef,
				})}
			>
				<MorphableRect>
					<Label />
					{isOpened && <Content />}
				</MorphableRect>
			</div>
			<SidebarSettings />
		</AttributesContext.Provider>
	);

	function updateCorner(cornerType, x, y) {
		const { width, height } = parentDimensions;

		updateAttribute("corners")({
			...attributes.corners,
			[cornerType]: [(100 * x) / width, (100 * y) / height], // save as percentages
		});
	}

	function updateAttribute(attribute) {
		return (newValue) =>
			setAttributes({
				[attribute]: newValue,
			});
	}
}
