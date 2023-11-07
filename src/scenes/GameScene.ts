import Phaser from 'phaser';
import items from '../data/items';
import randomElement from '../utils/random-element';

export default class GameScene extends Phaser.Scene {
	leftPosition: number = 0;
	rightPosition: number = 0;
	startHeight: number = 0;

	constructor() {
		super('game');
	}

	preload() {
		this.load.spritesheet('food', 'items/Food.png', {
			frameWidth: 32,
			frameHeight: 32
		});
	}

	create() {
		this.initLeftRightPositions();
		this.spawnItem();
	}

	initLeftRightPositions() {
		let { width } = this.sys.game.canvas;

		this.leftPosition = width / 3;
		this.rightPosition = this.leftPosition * 2;
	}

	spawnItem() {
		let item = randomElement(items);
		const sprite = this.physics.add.image(this.leftPosition, this.startHeight, item.key, item.frame);

		sprite.setVelocity(0, 200);
		sprite.setCollideWorldBounds(true);
	}
}
