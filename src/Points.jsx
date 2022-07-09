import { useRef } from "@wordpress/element";

import { DraggableCore } from "react-draggable";

export default function Points({
	positions,
	defaultPositions,
	onDrag,
	onStop,
}) {
	return (
		<>
			{positions.map((pos, index) => {
				{
					return (
						<Point
							onDrag={(x, y) => onDrag(pos, x, y)}
							onStop={(x, y) => onStop(pos, x, y)}
							key={index}
							defaultPosition={defaultPositions[pos]}
						/>
					);
				}
			})}
		</>
	);
}

function Point({ defaultPosition, onDrag, onStop }) {
	const MOVEMENT_THRESHOLD = 0.1;
	const pointRef = useRef(null);

	return (
		<DraggableCore
			onDrag={(e, { x, y, deltaX, deltaY }) =>
				handleDrag(x, y, deltaX, deltaY, onDrag)
			}
			onStop={(e, { x, y }) => handleStop(x, y, onStop)}
		>
			<span
				className="section__point-wrapper"
				style={{
					transform: `translate(${defaultPosition.x}px, ${defaultPosition.y}px)`,
					transition: "transform 0.1s linear",
				}}
			>
				<span className="section__point"></span>
			</span>
		</DraggableCore>
	);

	function handleDrag(x, y, deltaX, deltaY, callback) {
		if (deltaX * deltaY > MOVEMENT_THRESHOLD) {
			pointRef.current.style.transform = `translate(${x}px, ${y}px)`;
			callback(x, y);
		}
	}

	function handleStop(x, y, callback) {
		callback(x, y);
	}
}
