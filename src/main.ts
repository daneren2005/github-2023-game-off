import Phaser from 'phaser';

import TitleScene from './scenes/TitleScene.ts';
import GameScene from './scenes/GameScene.ts';
import GameOverScene from './scenes/GameOverScene.ts';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {}
	},
	scene: [
		TitleScene,
		GameScene,
		GameOverScene
	]
};

export default new Phaser.Game(config);
