export default function randomElement<T>(array: Array<T>): T {
	let index = Math.floor(Math.random() * array.length);
	return array[index];
}