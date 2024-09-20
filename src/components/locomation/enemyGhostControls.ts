import { Component } from "../../core/component";
import { Sprite } from "../graphics/sprite";
import { Actor } from "../physics/actor";
import { Solid } from "../physics/solid";
import { Position } from "../position";

class CostQueue<T> {
	private buckets: Map<number, T[]> = new Map(); // Map to store items based on cost
	private lowestCost: number | undefined = undefined; // Tracks the current lowest cost

	// Insert item with a given cost in O(1)
	public insert(item: T, cost: number): void {
		if (!this.buckets.has(cost)) {
			this.buckets.set(cost, []);
		}

		this.buckets.get(cost)!.push(item);

		// Update the lowest cost if needed
		if (this.lowestCost === undefined || cost < this.lowestCost) {
			this.lowestCost = cost;
		}
	}

	public popLowestCost(): T | undefined {
		if (this.lowestCost === undefined) return undefined;

		const items = this.buckets.get(this.lowestCost);

		if (!items || items.length === 0) return undefined;

		// const item = items.shift(); // Remove the item from the lowest cost bucket

		const item = items.pop();

		// If the bucket is empty, find the next lowest cost
		if (items.length === 0) {
			this.buckets.delete(this.lowestCost);
			this.updateLowestCost();
		}

		return item || undefined;
	}

	// Helper method to update the lowest cost after removal
	private updateLowestCost(): void {
		const costs = Array.from(this.buckets.keys());
		this.lowestCost = costs.length > 0 ? Math.min(...costs) : undefined;
	}
}

function coordToKey(x: number, y: number): number {
	return x + y * 1e7;
}

const offsets = [
	{
		x: -4,
		y: -4,
		distance: 1.44,
	},
	{
		x: 0,
		y: -4,
		distance: 1,
	},
	{
		x: 4,
		y: -4,
		distance: 1.44,
	},
	{
		x: -4,
		y: 0,
		distance: 1,
	},
	{
		x: 4,
		y: 0,
		distance: 1,
	},
	{
		x: -4,
		y: 4,
		distance: 1.44,
	},
	{
		x: 0,
		y: 4,
		distance: 1,
	},
	{
		x: 4,
		y: 4,
		distance: 1.44,
	},
];

interface Vertex {
	x: number;
	y: number;
	key: number;
	distance: number;
	parent: Vertex | undefined;
}

export class EnemyGhostControls extends Component {
	private position = this.inject(Position);
	private actor = this.inject(Actor);
	private sprite = this.inject(Sprite);

	private targetX = 40;
	private targetY = 20;

	public override update(dt: number): void {
		let verticesCreated = 0;

		if (this.context.input.leftButtonClicked) {
			this.targetX = this.context.input.mouseX;
			this.targetY = this.context.input.mouseY;
		}

		const startVertex = {
			x: this.position.x,
			y: this.position.y,
			key: coordToKey(this.position.x, this.position.y),
			distance: 0,
			parent: undefined,
		};

		const vertexLookup: Record<number, Vertex> = {};
		vertexLookup[startVertex.key] = startVertex;

		const openVertices = new CostQueue<Vertex>();
		openVertices.insert(startVertex, startVertex.distance);

		let reachedTarget = false;
		let targetVertex: Vertex | undefined = undefined;

		let iterations = 0;
		const verticesChecked = 0;

		while (reachedTarget === false) {
			iterations++;
			const smallestVertex = openVertices.popLowestCost();

			const distanceToTarget = Math.abs(smallestVertex!.x - this.targetX) + Math.abs(smallestVertex!.y - this.targetY);
			if (distanceToTarget <= 8) {
				reachedTarget = true;
				targetVertex = smallestVertex;
			}

			for (const offset of offsets) {
				const x = smallestVertex!.x + offset.x;
				const y = smallestVertex!.y + offset.y;

				if (
					this.context.bodyRegistry
						.query(
							{
								top: y - this.actor.height,
								bottom: y + this.actor.height,
								left: x - this.actor.width,
								right: x + this.actor.width,
							},
							this.actor,
						)
						.filter((x) => x instanceof Solid).length > 0
				) {
					continue;
				}

				const key = coordToKey(x, y);

				const existingNeighbour = vertexLookup[key];

				const neighbour = existingNeighbour ?? {
					key: key,
					x: smallestVertex!.x + offset.x,
					y: smallestVertex!.y + offset.y,
					distance: Infinity,
					parent: undefined,
				};

				const distance = smallestVertex!.distance + offset.distance;
				if (distance < neighbour.distance) {
					neighbour.distance = distance;
					neighbour.parent = smallestVertex!;
				}

				if (existingNeighbour === undefined) {
					openVertices.insert(neighbour, neighbour.distance);
					vertexLookup[key] = neighbour;

					verticesCreated++;
				}
			}
		}

		const path: Vertex[] = [];

		let currentVertex: Vertex | undefined = targetVertex;
		while (currentVertex) {
			path.push(currentVertex);
			currentVertex = currentVertex.parent;
		}
		path.reverse();

		const firstVertex = path[1];
		if (firstVertex !== undefined) {
			let dx = firstVertex.x - this.position.x;
			let dy = firstVertex.y - this.position.y;
			const d = Math.sqrt(dx * dx + dy * dy);

			dx /= d;
			dy /= d;

			if (dx < 0) {
				this.sprite.isFlipped = true;
			} else if (dx > 0) {
				this.sprite.isFlipped = false;
			}
			this.actor.move(dx * 30 * dt, dy * 30 * dt);
		}

		print(`Iterations: ${iterations} - Path length: ${path.length} - Vertices created: ${verticesCreated} `);
	}
}
