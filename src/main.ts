import Phaser from 'phaser';

import GameScene from './scenes/GameScene.ts';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {}
	},
	scene: [GameScene]
};

export default new Phaser.Game(config);
