import Phaser from 'phaser';
import './styles.css';

import TitleScene from './scenes/TitleScene.ts';
import GameScene from './scenes/GameScene.ts';
import GameOverScene from './scenes/GameOverScene.ts';

const aspectRatio = window.innerWidth / window.innerHeight;
const CANVAS_SIZE = 600;
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	scale: {
		mode: Phaser.Scale.FIT,
		width: CANVAS_SIZE * aspectRatio,
		height: CANVAS_SIZE
	},
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
