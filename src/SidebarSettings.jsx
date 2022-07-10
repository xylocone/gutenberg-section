import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
	Panel,
	PanelBody,
	PanelRow,
	TabPanel,
	ToggleControl,
	TextControl,
	AnglePickerControl,
} from "@wordpress/components";
import { capitalCase } from "change-case";
import { useContext } from "@wordpress/element";

import AttributesContext from "./AttributesContext";

export default function SidebarSettings() {
	const { attributes, updateAttribute, isOpened, setIsOpened, updateCorner } =
		useContext(AttributesContext);

	return (
		<InspectorControls key="section">
			<Panel>
				<PanelBody title={__("Content")} initialOpen={false}>
					<PanelRow>
						<fieldset>
							<legend>{__("Source Page")}</legend>
							<TextControl
								onChange={updateAttribute("source")}
								placeholder={__("https://example.com/about")}
								value={attributes.source}
							/>
						</fieldset>
					</PanelRow>
					<PanelRow>
						<fieldset>
							<ToggleControl
								onChange={() => setIsOpened(!isOpened)}
								label={__("Show content?")}
								checked={isOpened}
							/>
						</fieldset>
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody title={__("Corners")} initialOpen={false}>
					{Object.keys(attributes.corners).map((position) => {
						return (
							<PanelRow>
								<label>{__(capitalCase(position))}</label>
								<fieldset>
									<legend>{__("X")}</legend>
									<Number
										onChange={(x) =>
											updateCorner(
												position,
												x,
												attributes.corners[position][1] // existing y
											)
										}
										value={attributes.corners[position][0]}
									/>
								</fieldset>
								<fieldset>
									<legend>{__("Y")}</legend>
									<Number
										onChange={(y) =>
											updateCorner(
												position,
												attributes.corners[position][0], // existing x
												y
											)
										}
										value={attributes.corners[position][1]}
									/>
								</fieldset>
							</PanelRow>
						);
					})}
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody title={__("Label")} initialOpen={false}>
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
												<legend>{__("Rotation")}</legend>
												<AnglePickerControl
													value={attributes.labelRot}
													onChange={updateAttribute("labelRot")}
												/>
											</fieldset>
										</PanelRow>
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
