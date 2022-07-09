import { __ } from "@wordpress/i18n";
import { useState, useEffect, useRef } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";

import AttributesContext from "./AttributesContext";
import MorphableRect from "./MorphableRect";
import SidebarSettings from "./SidebarSettings";

import "./editor.scss";

export default function Edit({ attributes, setAttributes, isSelected }) {
	function updateAttribute(attribute) {
		return (newValue) =>
			setAttributes({
				[attribute]: newValue,
			});
	}

	const [parentDimensions, setParentDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const parentDimensionsRef = useRef(null);
	const updatingFirstTime = useRef(true);

	useEffect(() => {
		if (updatingFirstTime?.current) {
			updatingFirstTime.current = false;

			let parent = parentDimensionsRef.current.closest(
				".jumbotron__sections-wrapper"
			);

			function updateParentDimensions() {
				setParentDimensions({
					width: parent.clientWidth,
					height: parent.clientHeight,
				});
			}

			new ResizeObserver(updateParentDimensions).observe(parent);

			updateParentDimensions();
		}
	}, [parentDimensions]);

	return (
		<AttributesContext.Provider
			value={{
				attributes,
				setAttributes,
				updateAttribute,
				isSelected,
				parentDimensions,
			}}
		>
			<div {...useBlockProps({ className: "section__container" })}>
				<MorphableRect
					parentDimensions={parentDimensions}
					ref={parentDimensionsRef}
				>
					{/* <Label /> */}
				</MorphableRect>
			</div>
			{/* <SidebarSettings /> */}
		</AttributesContext.Provider>
	);
}
