/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2013 Power-Command
***/

// TurnPreview() constructor
// Creates an object representing the in-battle turn order preview.
function TurnPreview()
{
	this.entries = {};
	this.fadeness = 1.0;
	this.font = Font.Default;
	this.lastPrediction = null;
	this.thread = null;
};

// .dispose() method
// Frees resources associated with this TurnPreview object.
TurnPreview.prototype.dispose = function()
{
	threads.kill(this.thread);
};

// .render() method
// Renders the turn preview.
TurnPreview.prototype.render = function()
{
	var alpha = 255 * (1.0 - this.fadeness);
	var y = -16 * this.fadeness;
	SetClippingRectangle(0, y, 160, 16);
	Rectangle(0, y, 48, 16, Color.Black.fade(alpha * 0.75));
	OutlinedRectangle(0, y, 48, 16, Color.Black.fade(alpha * 0.125));
	DrawTextEx(this.font, 24, y + 2, "next:", Color.Gray.fade(alpha), 1, 'center');
	Rectangle(48, y, 112, 16, Color.Black.fade(alpha * 0.75));
	OutlinedRectangle(48, y, 112, 16, Color.Black.fade(alpha * 0.125));
	for (var id in this.entries) {
		var entry = this.entries[id];
		for (var i = 0; i < entry.turnBoxes.length; ++i) {
			var turnBox = entry.turnBoxes[i];
			var pictureColor = entry.color.fade(alpha);
			Rectangle(turnBox.x, y, 16, 16, pictureColor);
			OutlinedRectangle(turnBox.x, y, 16, 16, Color.Black.fade(alpha * 0.25));
			DrawTextEx(this.font, turnBox.x + 4, y + 2, entry.name[0], Color.mix(entry.color, Color.White), 1);
		}
	}
	SetClippingRectangle(0, 0, GetScreenWidth(), GetScreenHeight());
};

// .ensureEntries() method
// Ensures that turn entries for a specified unit exist and creates them if
// they don't.
// Arguments:
//     unit: The battle unit to check for.
TurnPreview.prototype.ensureEntries = function(unit)
{
	if (!(unit.tag in this.entries)) {
		var entry = {
			color: unit.isPartyMember() ? Color.DarkSlateBlue : Color.Maroon,
			name: unit.name,
			turnBoxes: []
		};
		for (var i = 0; i < 8; ++i) {
			entry.turnBoxes[i] = { x: 160, tween: null };
		}
		this.entries[unit.tag] = entry;
	}
};

// .set() method
// Updates the turn preview with a new prediction from the battle engine.
// Arguments:
//     prediction: The upcoming turn prediction, as returned by Battle.predictTurns().
TurnPreview.prototype.set = function(prediction)
{
	var moveEasing = 'easeInOutExpo';
	var moveTime = 0.25;
	if (this.lastPrediction !== null) {
		for (var i = 0; i < Math.min(this.lastPrediction.length, 7); ++i) {
			var unit = this.lastPrediction[i].unit;
			var turnIndex = this.lastPrediction[i].turnIndex;
			var turnBox = this.entries[unit.tag].turnBoxes[turnIndex];
			if (turnBox.tween !== null) {
				turnBox.tween.stop();
			}
			turnBox.tween = new scenes.Scene()
				.tween(turnBox, moveTime, moveEasing, { x: 160 });
			turnBox.tween.run();
		}
	}
	this.lastPrediction = prediction;
	for (var i = 0; i < Math.min(prediction.length, 7); ++i) {
		var unit = prediction[i].unit;
		var turnIndex = prediction[i].turnIndex;
		this.ensureEntries(unit);
		var turnBox = this.entries[unit.tag].turnBoxes[turnIndex];
		if (turnBox.tween !== null) {
			turnBox.tween.stop();
		}
		turnBox.tween = new scenes.Scene()
			.tween(turnBox, moveTime, moveEasing, { x: 48 + i * 16 });
		turnBox.tween.run();
	}
};

// .show() method
// Shows the turn preview.
TurnPreview.prototype.show = function()
{
	if (this.thread === null) {
		console.log("Activating in-battle turn preview");
		this.thread = threads.create(this, 20);
	}
	new scenes.Scene()
		.tween(this, 0.5, 'easeOutExpo', { fadeness: 0.0 })
		.run();
};

// .update() method
// Updates the turn preview for the next frame.
TurnPreview.prototype.update = function()
{
	return true;
};
