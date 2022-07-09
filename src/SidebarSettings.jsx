import { InspectorControls } from "@wordpress/block-editor";
import {
	Panel,
	PanelBody,
	PanelRow,
	TabPanel,
	ToggleControl,
	TextControl,
} from "@wordpress/components";
import { capitalCase } from "change-case";
import { useContext } from "@wordpress/element";

import AttributesContext from "./AttributesContext";
import Dropdown from "./Dropdown";

export default function SidebarSettings() {
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
