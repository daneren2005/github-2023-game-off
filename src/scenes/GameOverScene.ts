import Phaser from 'phaser';
import addBackground from './utils/add-background';

export default class GameScene extends Phaser.Scene {
	// @ts-expect-error
	gameOverTextBox: Phaser.GameObjects.Text;
	score: number = 0;

	constructor() {
		super('gameOver');
	}

	preload() {
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => {
			this.scene.start('game');
		});
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
			this.scene.start('game');
		});
		this.input.on('pointerup', () => {
			this.scene.start('game');
		});
	}

	init(config: GameOverConfig) {
		this.score = config.score;
	}

	create() {
		let { width, height } = this.sys.game.canvas;
		this.gameOverTextBox = this.add.text(width / 2, height / 3, [
			'Game Over',
			`Score: ${this.score}`,
			'',
			'Press enter to try again'
		], {
			color: 'blue',
			fontSize: '50px',
			align: 'center',
			fontStyle: 'bold'
		});
		this.gameOverTextBox.setOrigin(0.5, 0.5);
		this.gameOverTextBox.width = width;
		this.gameOverTextBox.setWordWrapWidth(width);

		addBackground(this);
	}
}

interface GameOverConfig {
	score: number
}