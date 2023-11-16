import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
	// @ts-expect-error
	continueTextBox: Phaser.GameObjects.Text;
	// @ts-expect-error
	hsv: Phaser.Types.Display.ColorObject[];
	colorStep: number = 0;

	constructor() {
		super('title');
	}

	preload() {
		let { width, height } = this.sys.game.canvas;
		this.continueTextBox = this.add.text(width / 2, height / 2, 'Loading', {
			color: 'white',
			fontSize: '50px',
			align: 'center'
		});
		this.continueTextBox.setOrigin(0.5, 0.5);
		this.continueTextBox.width = width;
		this.continueTextBox.setWordWrapWidth(width);

		this.load.spritesheet('food', 'items/Food.png', {
			frameWidth: 32,
			frameHeight: 32
		});
		this.load.image('box', 'Box.png');
	}

	create() {
		this.continueTextBox.text = 'Click enter to start';
		this.continueTextBox.setStroke('#00f', 16);
		this.continueTextBox.setShadow(2, 2, "#333333", 2, true, true);
		this.hsv = Phaser.Display.Color.HSVColorWheel();

		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => {
			this.scene.start('game');
		});
		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
			this.scene.start('game');
		});

		this.input.on('pointerup', () => {
			this.scene.start('game');
		}, this);
	}

	update () {
		const top = this.hsv[this.colorStep].color;
		const bottom = this.hsv[359 - this.colorStep].color;

		this.continueTextBox.setTint(top, top, bottom, bottom);

		this.colorStep++;
		if(this.colorStep === 360) {
			this.colorStep = 0;
		}
	}
}