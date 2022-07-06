import { __ } from "@wordpress/i18n";
import { InspectorControls, RichText } from "@wordpress/block-editor";

import {
	createContext,
	useState,
	useContext,
	useRef,
	Fragment,
} from "@wordpress/element";

import {
	Panel,
	PanelBody,
	PanelRow,
	TabPanel,
	ToggleControl,
	TextControl,
} from "@wordpress/components";

import Draggable from "react-draggable";
import { capitalCase } from "change-case";

import "./editor.scss";

const AttributesContext = createContext();

export default function Edit({ attributes, setAttributes, isSelected }) {
	// Utility function to handle attribute change
	const handleAttributeChange = (attribute) => (newValue) =>
		setAttributes({ [attribute]: newValue });

	const parentDimensions = useRef([window.innerWidth, window.innerHeight]); // For now; need to get the parent's dimensions

	/* Elements */
	const backgroundElement = useRef(null);
	const contentElement = useRef(null);

	// Utility function to change the array output of useState to an object
	const generateStateObject = (state) => {
		return {
			value: state[0],
			handler: state[1],
		};
	};

	/* STATE DECLARATION */
	const state = {
		showContent: generateStateObject(useState(false)),
	};
	const setState = (key) => state[key].handler;

	// Attributes
	const {
		corners,
		style,
		backgroundColor,
		isLabelFixed,
		labelAlignX,
		labelAlignY,
		labelPos,
	} = attributes;

	const updateCorner =
		(type) =>
		(...args) => {
			let offsets = [0, 0];
			let data = args.pop();

			switch (type) {
				case "top":
					offsets = [0, 0];
					break;
				case "right":
					offsets = [width, 0];
					break;
				case "bottom":
					offsets = [width, height];
					break;
				case "left":
					offsets = [0, height];
					break;
			}

			const newCornerData = [
				Math.round((100 * (data.x + offsets[0])) / window.innerWidth),
				Math.round((100 * (data.y + offsets[1])) / window.innerHeight),
			];

			handleAttributeChange("corners")({ ...corners, [type]: newCornerData });
		};

	const getClipPathValue = () => {
		const { top, right, bottom, left } = corners;
		return `polygon(${top[0]}% ${top[1]}%, ${right[0]}% ${right[1]}%, ${bottom[0]}% ${bottom[1]}%, ${left[0]}% ${left[1]}%)`;
	};

	const getLabelDefaultPosition = () => {
		const { height, width } = parentDimensions.current;
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
	};

	// CSS variables
	const backgroundCssVars = {
		"--background-clip-path": getClipPathValue(),
		"--background":
			style?.color.background ?? `var(--wp--preset--color--${backgroundColor})`,
	};

	return (
		<AttributesContext.Provider
			value={{
				attributes,
				setAttributes,
				isSelected,
				handleAttributeChange,
				parentDimensions: parentDimensions.current,
				updateCorner,
				parentState: state,
				setParentState: setState,
			}}
		>
			<>
				<div
					className="section__background"
					style={backgroundCssVars}
					ref={backgroundElement}
				></div>
				<div className="section__content-wrapper">
					<Label defaultPosition={getLabelDefaultPosition()} />
					<div className="section__content" useRef={contentElement}></div>
				</div>
				{isSelected && <Points />}
				<SidebarSettings />
			</>
		</AttributesContext.Provider>
	);
}

function Label({ defaultPosition }) {
	const {
		attributes: { label, isLabelFixed },
		handleAttributeChange,
		isSelected,
	} = useContext(AttributesContext);

	// Handle label on drag
	const handlePosChange = (e, data) => {
		if (isLabelFixed) {
			e.preventDefault();
			return;
		}
		const x = data.x;
		const y = data.y;

		handleAttributeChange("labelPos")([x, y]);
	};

	const richText = (
		<RichText
			tagName="h2"
			value={label}
			allowedFormats={["core/bold", "core/italic", "core/strikethrough"]}
			onChange={handleAttributeChange("label")}
			placeholder={__("Label")}
			className="section__label"
		/>
	);

	// Let the label be draggable only when the user is editing the Section
	return isSelected ? (
		<Draggable onDrag={handlePosChange} defaultPosition={defaultPosition}>
			{richText}
		</Draggable>
	) : (
		richText
	);
}

function Points() {
	const { updateCorner } = useContext(AttributesContext);
	return (
		<>
			{["top", "right", "bottom", "left"].map((val, index) => {
				{
					return (
						<Point
							position={val}
							onDrag={updateCorner("val")}
							key={`${index}-${val}`}
						/>
					);
				}
			})}
		</>
	);
}

function Point({ position, onDrag }) {
	const {
		attributes: {
			corners: {
				[position]: [x, y],
			},
		},
	} = useContext(AttributesContext);

	return (
		<Draggable defaultPosition={{ x, y }} onDrag={onDrag}>
			<span className={`section__point--${position}`}></span>
		</Draggable>
	);
}

function SidebarSettings() {
	const {
		attributes: { isLabelFixed, labelAlignX, labelAlignY, corners },
		parentState: { showContent },
		setParentState,
		handleAttributeChange,
		updateCorner,
	} = useContext(AttributesContext);

	return (
		<InspectorControls key="section">
			<Panel>
				<PanelBody title="Content" initialOpen={false}>
					<PanelRow>
						<fieldset>
							<legend>{__("Source Page")}</legend>
							<TextControl
								onChange={handleAttributeChange("source")}
								placeholder={__("https://example.com/about")}
							/>
						</fieldset>
					</PanelRow>
					<PanelRow>
						<fieldset>
							<ToggleControl
								onChange={() =>
									setParentState("showContent")(!showContent.value)
								}
								label={__("Show content?")}
								checked={showContent.value}
							/>
						</fieldset>
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody title="Corners" initialOpen={false}>
					{["top", "right", "bottom", "left"].map((position) => {
						return (
							<PanelRow>
								<label>{__(capitalCase(position))}</label>
								<fieldset>
									<legend>{__("X")}</legend>
									<Number
										onChange={(x) => updateCorner(position)([x, 0])}
										value={corners[position][0]}
									/>
								</fieldset>
								<fieldset>
									<legend>{__("Y")}</legend>
									<Number
										onChange={(y) => updateCorner(position)([0, y])}
										value={corners[position][1]}
									/>
								</fieldset>
							</PanelRow>
						);
					})}
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody title="Label" initialOpen={false}>
					<TabPanel
						tabs={[
							{
								name: "normal",
								title: __("Normal"),
							},
							{
								name: "hover",
								title: __("Hover"),
							},
						]}
					>
						{(tab) => {
							if (tab.name == "normal")
								return (
									<>
										<PanelRow>
											<fieldset>
												<ToggleControl
													checked={attributes.isLabelFixed}
													onChange={() => handleAttributeChange("isLabelFixed")}
													label={__("Fix Label?")}
												/>
											</fieldset>
										</PanelRow>
										{isLabelFixed && (
											<>
												<PanelRow>
													<fieldset>
														<legend>{__("Vertical Align")}</legend>
														<Dropdown
															options={[
																{
																	value: "top",
																	title: __("Top"),
																},
																{
																	value: "center",
																	title: __("Center"),
																},
																{
																	value: "bottom",
																	title: __("Bottom"),
																},
															]}
															value={labelAlignY}
															onChange={handleAttributeChange("labelAlignY")}
														/>
													</fieldset>
												</PanelRow>
												<PanelRow>
													<fieldset>
														<legend>{__("Horizontal Align")}</legend>
														<Dropdown
															options={[
																{
																	value: "left",
																	title: __("Left"),
																},
																{
																	value: "center",
																	title: __("Center"),
																},
																{
																	value: "Right",
																	title: __("Right"),
																},
															]}
															value={labelAlignX}
															onChange={handleAttributeChange("labelAlignX")}
														/>
													</fieldset>
												</PanelRow>
											</>
										)}
									</>
								);
							else if (tab.name == "hover")
								return (
									<>
										<PanelRow>
											<h2>Animation related controls</h2>
										</PanelRow>
									</>
								);
						}}
					</TabPanel>
				</PanelBody>
			</Panel>
		</InspectorControls>
	);
}

/**
 * Render a Dropdown menu with the given options
 * @param {Object} props Properties
 * @returns A JSX Dropdown menu
 */
function Dropdown({ options, value, onChange }) {
	return (
		<select onChange={(e) => onChange(e.currentTarget.value)}>
			{options.map((option) => (
				<option value={option.value} selected={option.value == value}>
					{option.title}
				</option>
			))}
		</select>
	);
}
