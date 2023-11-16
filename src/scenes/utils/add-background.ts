export default function addBackground(scene: Phaser.Scene) {
	let backgroundImage = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'background')
	let scaleX = scene.cameras.main.width / backgroundImage.width
	let scaleY = scene.cameras.main.height / backgroundImage.height
	let scale = Math.max(scaleX, scaleY);
	backgroundImage.depth = -1;
	backgroundImage.setScale(scale).setScrollFactor(0);
}