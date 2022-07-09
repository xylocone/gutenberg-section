/**
 * Render a Dropdown menu with the given options
 * @param {Object} props Properties
 * @returns A JSX Dropdown menu
 */
export default function Dropdown({ options, value, onChange }) {
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
