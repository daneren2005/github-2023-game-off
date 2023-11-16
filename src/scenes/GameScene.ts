import Phaser from 'phaser';
import items from '../data/items';
import randomElement from '../utils/random-element';
import formatNumber from '../utils/format-number';
import addBackground from './utils/add-background';

type PhysicsBody = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type ItemBody = PhysicsBody & { weight: number };
type ItemHolderBody = PhysicsBody & { weight: number, label: Phaser.GameObjects.Text }

const BASE_SPEED = 200;
const MAX_SPEED = 2_000;
export default class GameScene extends Phaser.Scene {
	position: number = 0;
	visiblePositions: Array<number> = [];
	startHeight: number = 30;
	elapsedTime: number = 0;

	downKeys: Array<Phaser.Input.Keyboard.Key> = [];

	// @ts-expect-error
	items: Phaser.Physics.Arcade.Group;
	// @ts-expect-error
	itemHolders: Phaser.Physics.Arcade.StaticGroup;
	itemHolderLines: Array<Phaser.GameObjects.Line> = [];
	fallingItems: Array<ItemBody> = [];

	// @ts-expect-error
	scoreTextBox: Phaser.GameObjects.Text;

	paused = false;

	constructor() {
		super('game');
	}

	preload() {
		this.initPhysics();
		this.initKeys();

		this.input.on('pointerup', (pointer: PointerEvent) => {
			if(this.paused) {
				return;
			}

			let closestIndex = 0;
			let itemHolders = this.itemHolders.children.entries;
			for(let i = 1; i < itemHolders.length; i++) {
				// @ts-expect-error
				if(Math.abs(itemHolders[i].x - pointer.x) < Math.abs(itemHolders[closestIndex].x - pointer.x)) {
					closestIndex = i;
				}
			}

			this.position = closestIndex;
			this.updatePosition();
		}, this);
	}

	create() {
		this.initPositions(3);
		this.spawnItem();

		this.scoreTextBox = this.add.text(0, 0, 'Score: 0', {
			color: 'blue',
			fontSize: '30px',
			fontStyle: 'bold'
		});
		this.elapsedTime = 0;

		addBackground(this);
	}

	update(time: number, delta: number) {
		this.elapsedTime += delta;
		let itemHolders = this.itemHolders.children.entries as Array<ItemHolderBody>;
		itemHolders.forEach(itemHolder => {
			itemHolder.label.y = itemHolder.y;
		});

		this.itemHolderLines.forEach((line, index) => {
			let itemHolder1 = itemHolders[index];
			let itemHolder2 = itemHolders[index + 1];
			line.geom.x1 = itemHolder1.x + itemHolder1.width / 2;
			line.geom.y1 = itemHolder1.y;

			line.geom.x2 = itemHolder2.x - itemHolder2.width / 2;
			line.geom.y2 = itemHolder2.y;
		});

		let speed = Math.min(BASE_SPEED + this.elapsedTime / 1_000 * 20, MAX_SPEED);
		if(this.downKeys.find(key => key.isDown)) {
			speed = MAX_SPEED;
		}
		this.fallingItems.forEach(item => {
			item.setVelocityY(speed);
		});
	}

	initPhysics() {
		this.items = this.physics.add.group();
		this.itemHolders = this.physics.add.staticGroup();

		this.physics.add.collider(this.itemHolders, this.items, (itemHolder: any, item: any) => {
			this.itemLanded(itemHolder, item);
		});

		this.physics.world.on('worldbounds', (body: any) => {
			let sprite = body.gameObject as PhysicsBody;

			// If somehow we get to the end of the world want to not completely break the game
			let itemIndex = this.fallingItems.indexOf(sprite as ItemBody);
			if(itemIndex !== -1) {
				// @ts-expect-error
				this.itemLanded(this.itemHolders.children.entries[this.position], this.fallingItems[itemIndex]);
			}

			// If box hits the bottom you have lost!
			let holderIndex = this.itemHolders.children.entries.indexOf(sprite);
			if(holderIndex !== -1) {
				this.scene.start('gameOver', {
					score: this.getScore()
				});
			}

			// Don't keep triggering this over and over again
			body.onWorldBounds = false;
		});
	}
	initKeys() {
		// Left
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A).on('down', () => {
			this.incPosition(-1);
		});
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).on('down', () => {
			this.incPosition(-1);
		});

		// Right
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D).on('down', () => {
			this.incPosition(1);
		});
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).on('down', () => {
			this.incPosition(1);
		});

		this.downKeys = [
			this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S) as Phaser.Input.Keyboard.Key,
			this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN) as Phaser.Input.Keyboard.Key
		];
		
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.P).on('down', () => {
			this.paused = !this.paused;
			if(this.paused) {
				this.pause();
			} else {
				this.resume();
			}
		});
	}

	incPosition(inc: -1 | 1) {
		if(this.paused) {
			return;
		}

		this.position = Math.max(0, Math.min(this.visiblePositions.length - 1, this.position + inc));
		this.updatePosition();
	}
	updatePosition() {
		this.fallingItems.forEach(sprite => {
			sprite.x = this.visiblePositions[this.position];
		});
	}

	initPositions(count: number) {
		let { width, height } = this.sys.game.canvas;

		this.itemHolderLines = [];
		this.fallingItems = [];

		let widthPortion = width / (count + 1);
		this.visiblePositions = [];
		const START_HEIGHT = height - 150;
		for(let i = 0; i < count; i++) {
			let x = widthPortion * (i + 1);
			this.visiblePositions.push(x);

			const sprite = this.physics.add.image(x, START_HEIGHT, 'box') as ItemHolderBody;
			sprite.setScale(1.5, 1);
			this.itemHolders.add(sprite);
			sprite.setImmovable(true);

			let label = this.add.text(x, height - 50, '0', {
				align: 'center',
				fontSize: '20px',
				color: 'black',
				stroke: '#0000FF',
				strokeThickness: 2,
				backgroundColor: 'white'
			});
			label.setOrigin(0.5, 0.5);
			sprite.label = label;
			sprite.weight = 0;

			sprite.setCollideWorldBounds(true);
			sprite.body.onWorldBounds = true;
		}

		for(let i = 1; i < count; i++) {
			let line = this.add.line(0, 0, 0, 0, 0, 0, 0xFFFFFF);
			line.setLineWidth(3, 3);
			this.itemHolderLines.push(line);
		}
	}

	spawnItem() {
		let item = randomElement(items);
		const sprite = this.physics.add.image(this.visiblePositions[this.position], this.startHeight, item.key, item.frame) as ItemBody;
		sprite.weight = item.weight;

		this.fallingItems.push(sprite);
		this.items.add(sprite);

		sprite.setVelocity(0, BASE_SPEED);
		
		sprite.setCollideWorldBounds(true);
		sprite.body.onWorldBounds = true;
	}
	itemLanded(itemHolder: ItemHolderBody, item: ItemBody) {
		let index = this.fallingItems.indexOf(item);
		if(index !== -1) {
			this.fallingItems.splice(index);
		}
		itemHolder.weight += item.weight;
		itemHolder.label.text = `${formatNumber(itemHolder.weight)}`;
		this.scoreTextBox.text = `Score: ${this.getScore()}`;

		this.rebalanceWeights();

		// TODO: Should really keep items on the scale to make look better
		item.destroy();

		this.spawnItem();
	}

	rebalanceWeights() {
		let itemHolders = this.itemHolders.children.entries as Array<ItemHolderBody>;
		let averageWeight = itemHolders.reduce((total, holder) => total + holder.weight, 0) / itemHolders.length;
		for(let i = 0; i < itemHolders.length; i++) {
			let itemHolder = itemHolders[i] as ItemHolderBody;

			let diffWeight = itemHolder.weight - averageWeight;
			itemHolder.setVelocityY(diffWeight / 5);
		}
	}

	getScore() {
		let itemHolders = this.itemHolders.children.entries as Array<ItemHolderBody>;
		return itemHolders.reduce((total, itemHolder) => total + itemHolder.weight, 0);
	}

	pause() {
		this.physics.pause();
	}
	resume() {
		this.physics.resume();
	}
}
