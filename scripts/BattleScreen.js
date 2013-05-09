/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (C) 2012 Power-Command
***/

RequireScript('BattleSprite.js');

RequireScript('Core/Threads.js');
RequireScript('lib/kh2Bar.js');
RequireScript('lib/Scenario.js');

// BattleScreen() constructor
// Creates an object representing a battle screen.
function BattleScreen()
{
	this.$startThread = function()
	{
		this.thread = Threads.createEntityThread(this);
	};
	
	this.$sprites = [];
	this.$lifeBars = [];
	this.$turnQueue = [];
	
	// .dispose() method
	// Frees all outstanding resources associated with the BattleScreen.
	this.dispose = function()
	{
		Threads.kill(this.thread);
	};
	
	// .announceAction() method
	// Momentarily displays the name of an action being performed.
	// Arguments:
	//     action:      The action being performed.
	//     alignment:   The alignment of the unit performing the action. Can be one of the following:
	//                      'party': A member of the player's party.
	//                      'enemy': An enemy battler.
	//     bannerColor: The background color to use for the announcement banner.
	this.announceAction = function(actionName, alignment, bannerColor)
	{
		var bannerColor = alignment == 'enemy' ? CreateColor(128, 32, 32, 192) : CreateColor(64, 64, 192, 192);
		var announcement = {
			screen: this,
			text: actionName,
			alignment: alignment,
			color: bannerColor,
			font: GetSystemFont(),
			endTime: 1000 + GetTime(),
			render: function() {
				var width = this.font.getStringWidth(this.text) + 50;
				var height = this.font.getHeight() + 10;
				var x = GetScreenWidth() / 2 - width / 2;
				var y = 96;
				var textX = x + width / 2 - this.font.getStringWidth(this.text) / 2;
				var textY = y + height / 2 - this.font.getHeight() / 2;
				Rectangle(x + 1, y + 1, width - 2, height - 2, this.color);
				OutlinedRectangle(x, y, width, height, CreateColor(0, 0, 0, 255));
				this.font.setColorMask(CreateColor(0, 0, 0, 255));
				this.font.drawText(textX + 1, textY + 1, this.text);
				this.font.setColorMask(CreateColor(255, 255, 255, 255));
				this.font.drawText(textX, textY, this.text);
			},
			update: function() {
				return GetTime() < this.endTime;
			}
		};
		Threads.createEntityThread(announcement, 10);
	};
	
	// .createLifeBar() method
	// Creates an enemy life bar to be displayed on this BattleScreen.
	// Arguments:
	//     name:     The name of the battler the life bar belongs to.
	//     capacity: The HP capacity of the new life bar.
	// Returns:
	//     A reference to a kh2Bar object that represents the new life bar.
	this.createLifeBar = function(name, capacity)
	{
		var lifeBar = new kh2Bar(capacity);
		this.$lifeBars.push(lifeBar);
		return lifeBar;
	};
	
	// .createSprite() method
	// Creates a battler sprite to be displayed on this BattleScreen.
	// Arguments:
	//     name: The name of the battler represented by the new sprite.
	// Returns:
	//     A reference to a BattleSprite object representing the new sprite.
	this.createSprite = function(name, position, row, alignment, alreadyThere)
	{
		var isMirrored = alignment == 'party';
		var sprite = new BattleSprite(name, position, row, isMirrored, alreadyThere);
		this.$sprites.push(sprite);
		return sprite;
	};
	
	// .go() method
	// Transitions into the BattleScreen.
	// Arguments:
	//     title: Optional. A title to display during the battle transiton.
	this.go = function(title)
	{
		if (title === void null) { title = null; }
		
		this.$title = title;
		if (DBG_DISABLE_TRANSITIONS) {
			this.$startThread();
			return;
		}
		var transition = new Scenario();
		with (transition) {
			if (this.$title !== null) {
				beginFork()
					marquee("Boss Battle")
				endFork();
			}
			fadeTo(CreateColor(255, 255, 255, 255), 0.25)
			fadeTo(CreateColor(0, 0, 0, 0), 0.5)
			fadeTo(CreateColor(255, 255, 255, 255), 0.25)
			call(delegate(this, '$startThread'))
			fadeTo(CreateColor(0, 0, 0, 0), 2.0)
		}
		transition.run();
	};
	
	// .render() method
	// Renders the BattleScreen.
	this.render = function()
	{
		Rectangle(0, 0, 320, 112, CreateColor(0, 128, 0, 255));
		Rectangle(0, 112, 320, 16, CreateColor(64, 64, 64, 255));
		Rectangle(0, 128, 320, 112, CreateColor(192, 128, 0, 255));
		for (var i = 0; i < this.$sprites.length; ++i) {
			this.$sprites[i].render();
		}
		for (var i = 0; i < this.$lifeBars.length; ++i) {
			var x = 0;
			var y = i * 20;
			//this.$lifeBars[i].render(x, y);
		}
	};
	
	// .showTitle() method
	// Displays the title of the battle, if one is defined.
	this.showTitle = function()
	{
		if (this.$title === null) {
			return;
		}
		new Scenario()
			.marquee(this.$title)
			.run();
	};
	
	// .update() method
	// Advances the BattleScreen's internal state by one frame.
	// Returns:
	//     true if the BattleScreen is still active; false otherwise.
	this.update = function()
	{
		for (var i = 0; i < this.$sprites.length; ++i) {
			this.$sprites[i].update();
		}
		for (var i = 0; i < this.$lifeBars.length; ++i) {
			this.$lifeBars[i].update();
		}
		return true;
	};
};