import { useState, useEffect } from "@wordpress/element";

export default function Content() {
	const [content, setContent] = useState(null);

	useEffect(async () => {
		const fetchedContent = await fetchContent();
		setContent(fetchedContent);
	}, []);

	return (
		<div className={`section__content ${content ? "content-fetched" : ""}`}>
			{content ?? "Loading..."}
		</div>
	);

	async function fetchContent() {
		return await new Promise((resolve) =>
			setTimeout(() => resolve(`<h1>Some Juicy Content</h1>`), 5000)
		);
	}
}
