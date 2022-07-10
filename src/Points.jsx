import { DraggableCore } from "react-draggable";

export default function Points({ positions, cornerTypes, onDrag, onStop }) {
	return (
		<>
			{cornerTypes.map((pos, index) => {
				{
					return (
						<Point
							onDrag={(x, y) => onDrag(pos, x, y)}
							onStop={(x, y) => onStop(pos, x, y)}
							key={index}
							position={positions[pos]}
						/>
					);
				}
			})}
		</>
	);
}

function Point({ position, onDrag, onStop }) {
	const MOVEMENT_THRESHOLD = 0.1;

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
					transform: `translate(${position.x}px, ${position.y}px)`,
					transition: "transform 0.1s linear",
				}}
			>
				<span className="section__point"></span>
			</span>
		</DraggableCore>
	);

	function handleDrag(x, y, deltaX, deltaY, callback) {
		if (deltaX * deltaY > MOVEMENT_THRESHOLD) {
			callback(x, y);
		}
	}

	function handleStop(x, y, callback) {
		callback(x, y);
	}
}
