/** @noSelfInFile **/

export function describe(name: string, func: () => void): void;
export function it(name: string, func: () => void, enabled?: boolean): void;
export function before(func: () => void): void;
export function after(func: () => void): void;
export function report(): void;
export function exit(): void;

/** @noSelf **/
export namespace expect {
	export function tohumanstring(v: unknown): void;
	export function fail(func: () => void, expected: unknown): void;
	export function not_fail(func: () => void): void;
	export function exist(v: unknown): void;
	export function not_exist(v: unknown): void;
	export function truthy(v: unknown): void;
	export function falsy(v: unknown): void;
	export function strict_eq(t1: Record<string, unknown>, t2: Record<string, unknown>, name: string): void;
	export function equal(v1: unknown, v2: unknown): void;
}
