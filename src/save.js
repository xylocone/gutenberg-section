import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";

// Internal dependencies
import Label from "./Label";
import MorphableRect from "./MorphableRect";
import Content from "./Content";

import "./style.scss";

export default function Save({ attributes }) {
	return (
		<div
			{...useBlockProps.save({
				className: "section__container",
			})}
		>
			<MorphableRect.Content attributes={attributes}>
				<Label.Content attributes={attributes} />
				<Content.Content attributes={attributes} />
			</MorphableRect.Content>
		</div>
	);
}
