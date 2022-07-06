import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";

import "./style.scss";

export default function Save() {
	return (
		<p {...useBlockProps.save()}>
			{__(
				"A fixed positioned section – hello from the saved content!",
				"section"
			)}
		</p>
	);
}
