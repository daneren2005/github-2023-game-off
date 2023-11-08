import Phaser from 'phaser';
import items from '../data/items';
import randomElement from '../utils/random-element';

export default class GameScene extends Phaser.Scene {
	position: number = 0;
	visiblePositions: Array<number> = [];
	startHeight: number = 30;

	fallingSprites: Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody> = [];

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
		this.initKeys();
		this.initPositions(2);
		this.spawnItem();

		this.physics.world.on('worldbounds', (body: any) => {
			let sprite = body.gameObject as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

			let index = this.fallingSprites.indexOf(sprite);
			if(index !== -1) {
				this.fallingSprites.splice(index);
			}
			body.onWorldBounds = false;
			this.spawnItem();
		});
	}

	initKeys() {
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A).on('down', () => {
			this.incPosition(-1);
		});
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D).on('down', () => {
			this.incPosition(1);
		});
	}
	incPosition(inc: -1 | 1) {
		this.position = Math.max(0, Math.min(this.visiblePositions.length - 1, this.position + inc));

		this.fallingSprites.forEach(sprite => {
			sprite.x = this.visiblePositions[this.position];
		});
	}

	initPositions(count: number) {
		let { width } = this.sys.game.canvas;

		let widthPortion = width / (count + 1);
		this.visiblePositions = [];
		for(let i = 0; i < count; i++) {
			this.visiblePositions.push(widthPortion * (i + 1));
		}
	}

	spawnItem() {
		let item = randomElement(items);
		const sprite = this.physics.add.image(this.visiblePositions[this.position], this.startHeight, item.key, item.frame);

		sprite.setVelocity(0, 200);
		sprite.setCollideWorldBounds(true);
		sprite.body.onWorldBounds = true;
		this.fallingSprites.push(sprite);
	}
}
