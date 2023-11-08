import Item from '../types/item';

const foods: Array<Item> = [
	{
		name: 'Bannana',
		key: 'food',
		frame: 0,
		weight: 472
	},
	{
		name: 'Orange',
		key: 'food',
		frame: 1,
		weight: 120
	},
	{
		name: 'Apple',
		key: 'food',
		frame: 2,
		weight: 70
	},
	// TODO: This blows everything out of the water.  Should we make these rarer or just pretend they are a lot lighter?
	{
		name: 'Watermelon',
		key: 'food',
		frame: 2,
		weight: 10_000
	}
];

export default foods;