/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2012 Power-Command
***/

RequireScript('battleEngine/battleActor.js');
RequireScript('battleEngine/battleHUD.js');

class BattleScreen
{
	constructor(partyMaxMP)
	{
		this.actorTypes = {
			enemy: { isEnemy: true },
			party: { isEnemy: false }
		};

		this.actors = {};
		for (let type in this.actorTypes)
			this.actors[type] = [];
		this.background = new Texture('images/battleBackground.png');
		this.hud = new BattleHUD(partyMaxMP);

		this.startRunning = function()
		{
			term.print("activate main battle screen");
			this.thread = threads.create(this);
			this.hud.show();
		};
	}

	dispose()
	{
		this.hud.dispose();
		threads.kill(this.thread);
	}

	update()
	{
		for (let type in this.actorTypes) {
			for (let i = 0; i < this.actors[type].length; ++i) {
				this.actors[type][i].update();
			}
		}
		return true;
	}

	render()
	{
		prim.blit(screen, 0, -56, this.background);
		for (let type in this.actorTypes) {
			for (let i = 0; i < this.actors[type].length; ++i)
				this.actors[type][i].render();
		}
	}

	announceAction(actionName, alignment, bannerColor = Color.Gray)
	{
		let announcement = {
			screen: this,
			text: actionName,
			alignment: alignment,
			color: bannerColor,
			font: GetSystemFont(),
			fadeness: 1.0,
			render: function() {
				var width = this.font.getStringWidth(this.text) + 20;
				var height = this.font.getHeight() + 10;
				var x = GetScreenWidth() / 2 - width / 2;
				var y = 112;
				var textY = y + height / 2 - this.font.getHeight() / 2;
				var boxColor = this.color.fade(1.0 - this.fadeness);
				prim.rect(screen, x, y, width, height, boxColor);
				prim.lineRect(screen, x, y, width, height, 1, Color.Black.fade(0.25 * (1.0 - this.fadeness)));
				drawTextEx(this.font, x + width / 2, textY, this.text, CreateColor(255, 255, 255, 255 * (1.0 - this.fadeness)), 1, 'center');
			},
			update: function() {
				return true;
			}
		};
		let thread = threads.create(announcement, 10);
		new Scene()
			.tween(announcement, 7, 'easeInOutSine', { fadeness: 0.0 })
			.pause(46)
			.tween(announcement, 7, 'easeInOutSine', { fadeness: 1.0 })
			.run(true);
		threads.kill(thread);
	}

	createActor(name, position, row, alignment, alreadyThere = false)
	{
		if (!(alignment in this.actorTypes))
			throw new Error(`invalid actor alignment '${alignment}'`);
		let isEnemy = this.actorTypes[alignment].isEnemy;
		let actor = new BattleActor(name, position, row, isEnemy, alreadyThere);
		this.actors[alignment].push(actor);
		return actor;
	}

	fadeOut(duration)
	{
		if (Sphere.Game.disableAnimations) {
			this.dispose();
			return;
		}
		new Scene()
			.fadeTo(Color.Black, duration)
			.call(this.dispose.bind(this))
			.fadeTo(Color.Transparent, 0.5)
			.run(true);
	}

	go(title = null)
	{
		this.title = title;
		new Scene()
			.doIf(() => !Sphere.Game.disableAnimations)
				.fadeTo(Color.White, 15)
				.fadeTo(Color.Transparent, 30)
				.fadeTo(Color.White, 15)
			.end()
			.call(this.startRunning.bind(this))
			.doIf(() => !Sphere.Game.disableAnimations)
				.fadeTo(Color.Transparent, 60)
			.end()
			.run(true);
	}

	showTitle()
	{
		if (this.title === null || Sphere.Game.disableAnimations)
			return;
		new Scene()
			.marquee(this.title, Color.Black.fade(0.5))
			.run(true);
	}
}
