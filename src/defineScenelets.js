/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2018 Power-Command
***/

import { Joypad, Music, Prim, Scene } from 'sphere-runtime';

import { BattleEngine, BattleResult } from './battleSystem/index.js';
import GameOverScreen, { GameOverAction } from './gameOverScreen.js';

Scene.defineOp('adjustBGM', {
	start(scene, volume, numFrames = 0) {
		Music.adjustVolume(volume, numFrames);
	},

	update(scene) {
		return Music.adjustingVolume;
	},
});

// .battle() command
// Starts a battle.
// Arguments:
//     battleID: The ID of the battle definition to use to initialize the fight.
Scene.defineOp('battle', {
	async start(scene, battleID, session) {
		this.mode = 'battle';
		this.battle = new BattleEngine(session, battleID);
		this.battleThread = await this.battle.go();
	},

	async update(scene) {
		switch (this.mode) {
			case 'battle':
				if (!this.battleThread.running) {
					if (this.battle.result === BattleResult.Lose) {
						console.log("player lost battle, showing Game Over screen");
						this.mode = 'gameOver';
						this.gameOver = new GameOverScreen();
						this.gameOverThread = this.gameOver.show();
					}
					else {
						return false;
					}
				}
				break;
			case 'gameOver':
				if (!this.gameOverThread.running) {
					if (this.gameOver.action === GameOverAction.Retry) {
						console.log("player asked to retry last battle");
						this.mode = 'battle';
						this.battleThread = await this.battle.go();
					}
					else {
						return false;
					}
				}
				break;
		}
		return true;
	},
});

Scene.defineOp('changeBGM', {
	start(scene, trackName, fadeTime) {
		Music.play(trackName, fadeTime);
	},
});

Scene.defineOp('marquee', {
	start(scene, text, backgroundColor = Color.Black, color = Color.White) {
		this.text = text;
		this.color = color;
		this.background = backgroundColor;
		this.font = Font.Default;
		this.windowSize = Surface.Screen.width + this.font.widthOf(this.text);
		this.height = this.font.height + 10;
		this.textHeight = this.font.height;
		this.fadeness = 0.0;
		this.scroll = 0.0;
		this.animation = new Scene()
			.tween(this, 15, 'linear', { fadeness: 1.0 })
			.tween(this, 60, 'easeOutExpo', { scroll: 0.5 })
			.tween(this, 60, 'easeInExpo', { scroll: 1.0 })
			.tween(this, 15, 'linear', { fadeness: 0.0 });
		this.animation.run();
	},

	render(scene) {
		let boxHeight = this.height * this.fadeness;
		let boxY = (Surface.Screen.height - boxHeight) / 2;
		let textX = Surface.Screen.width - this.scroll * this.windowSize;
		let textY = boxY + (boxHeight - this.textHeight) / 2;
		Prim.drawSolidRectangle(Surface.Screen, 0, boxY, Surface.Screen.width, boxHeight, this.background);
		this.font.drawText(Surface.Screen, textX + 1, textY + 1, this.text, Color.Black.fadeTo(this.color.a));
		this.font.drawText(Surface.Screen, textX, textY, this.text, this.color);
	},

	update(scene) {
		return this.animation.running;
	},
});

Scene.defineOp('popBGM', {
	start(scene) {
		Music.pop();
	},
});

Scene.defineOp('pushBGM', {
	start(scene, trackName) {
		Music.push(trackName);
	},
});

Scene.defineOp('talk', {
	start(scene, speaker, showSpeaker, textSpeed, timeout /*...pages*/) {
		this.speakerName = speaker;
		this.speakerText = this.speakerName != null ? this.speakerName + ":" : null;
		this.showSpeaker = showSpeaker;
		this.textSpeed = textSpeed;
		this.timeout = timeout;
		this.timeoutLeft = this.timeout;
		this.font = Font.Default;
		this.text = [];
		let speakerTextWidth = this.font.widthOf(this.speakerText);
		let textAreaWidth = Surface.Screen.width - 16;
		for (let i = 5; i < arguments.length; ++i) {
			let lineWidth = this.speakerName != null ? textAreaWidth - (speakerTextWidth + 5) : textAreaWidth;
			let wrappedText = this.font.wordWrap(arguments[i], lineWidth);
			let page = this.text.push([]) - 1;
			for (let iLine = 0; iLine < wrappedText.length; ++iLine)
				this.text[page].push(wrappedText[iLine]);
		}
		this.boxVisibility = 0.0;
		this.textVisibility = 1.0;
		this.nameVisibility = 0.0;
		this.lineVisibility = 0.0;
		this.scrollOffset = 0.0;
		this.currentPage = 0;
		this.numLinesToDraw = 0;
		this.topLine = 0;
		this.lineToReveal = 0;
		this.textSurface = new Surface(textAreaWidth, this.font.height * 3 + 1);
		this.transition = new Scene()
			.tween(this, 20, 'easeOutBack', { boxVisibility: 1.0 });
		this.transition.run();
		this.mode = "fadein";
		Keyboard.Default.clearQueue();
		if (Sphere.Game.disableTalking)
			this.mode = "finish";
		return true;
	},

	render(scene) {
		let lineHeight = this.font.height;
		let boxHeight = lineHeight * 3 + 11;
		let finalBoxY = Surface.Screen.height * 0.85 - boxHeight / 2;
		let boxY = finalBoxY + (Surface.Screen.height - finalBoxY) * (1.0 - this.boxVisibility);
		Prim.drawRectangle(Surface.Screen, -1, boxY - 1, Surface.Screen.width + 2, boxHeight + 2,
			Color.Black.fadeTo(0.55 * this.boxVisibility));
		Prim.drawSolidRectangle(Surface.Screen, 0, boxY, Surface.Screen.width, boxHeight,
			Color.Black.fadeTo(0.5 * this.boxVisibility));
		this.textSurface.blendOp = BlendOp.Replace;
		Prim.drawSolidRectangle(this.textSurface, 0, 0, this.textSurface.width, this.textSurface.height, Color.Transparent);
		this.textSurface.blendOp = BlendOp.AlphaBlend;
		let lineCount = this.text[this.currentPage].length;
		let textAreaWidth = this.textSurface.width;
		let textX = 0;
		if (this.speakerName != null) {
			let speakerTextWidth = this.font.widthOf(this.speakerText);
			textX = speakerTextWidth + 5;
		}
		textAreaWidth -= textX;
		for (let iLine = Math.min(this.lineToReveal - this.topLine + 1, lineCount - this.topLine, 3) - 1; iLine >= 0; --iLine) {
			let trueLine = this.topLine + iLine;
			let textY = iLine * lineHeight - this.scrollOffset * lineHeight;
			let lineVisibility = iLine == 0 ? 1.0 - this.scrollOffset : 1.0;
			if (this.lineVisibility > 0.0 || this.lineToReveal != trueLine) {
				let lineText = this.text[this.currentPage][trueLine];
				this.font.drawText(this.textSurface, textX + 1, textY + 1, lineText,
					Color.Black.fadeTo(this.textVisibility * lineVisibility));
				this.font.drawText(this.textSurface, textX, textY, lineText,
					Color.White.fadeTo(this.textVisibility * lineVisibility));
				if (this.lineToReveal == trueLine) {
					let shownArea = textAreaWidth * this.lineVisibility;
					this.textSurface.blendOp = BlendOp.Subtract;
					Prim.drawSolidRectangle(this.textSurface,
						(textX - lineHeight * 2) + shownArea, textY, lineHeight * 2, lineHeight + 1,
						Color.Transparent, Color.Black, Color.Black.fadeTo(this.boxVisibility), Color.Transparent);
					this.textSurface.blendOp = BlendOp.Replace;
					Prim.drawSolidRectangle(this.textSurface,
						textX + shownArea, textY, textAreaWidth - shownArea, lineHeight + 1,
						Color.Transparent);
					this.textSurface.blendOp = BlendOp.AlphaBlend;
				}
			}
			if (this.showSpeaker && this.speakerName != null && trueLine == 0) {
				this.font.drawText(this.textSurface, 1, textY + 1, this.speakerText, Color.Black.fadeTo(this.textVisibility * this.nameVisibility));
				this.font.drawText(this.textSurface, 0, textY, this.speakerText, Color.Orange.fadeTo(this.textVisibility * this.nameVisibility));
			}
		}
		Prim.blit(Surface.Screen,
			(Surface.Screen.width - this.textSurface.width) / 2, boxY + 5,
			this.textSurface);
	},

	update(scene) {
		if (Sphere.Game.disableTalking)
			this.mode = "finish";
		switch (this.mode) {
			case "idle":
				if (this.timeout !== Infinity) {
					if (this.topLine + 3 >= this.text[this.currentPage].length) {
						this.timeoutLeft -= 1.0 / Sphere.frameRate;
						if (this.timeoutLeft <= 0.0) {
							if (this.currentPage < this.text.length - 1)
								this.mode = "page";
							else
								this.mode = "hidetext";
							this.timeoutLeft = this.timeout;
						}
					}
					else {
						this.mode = "nextline";
						this.numLinesToDraw = 0;
						this.lineVisibility = 0.0;
					}
				}
				break;
			case "fadein":
				if (!this.transition.running)
					this.mode = "write";
				break;
			case "write":
				this.nameVisibility = Math.min(this.nameVisibility + 4.0 / Sphere.frameRate, 1.0);
				if (this.nameVisibility >= 1.0) {
					this.lineVisibility = Math.min(this.lineVisibility + this.textSpeed / Sphere.frameRate, 1.0);
					let lineCount = Math.min(3, this.text[this.currentPage].length - this.topLine);
					let currentLineText = this.text[this.currentPage][this.lineToReveal];
					let currentLineWidth = this.font.widthOf(currentLineText);
					let textAreaWidth = this.textSurface.width;
					if (this.speakerName != null) {
						let speakerTextWidth = this.font.widthOf(this.speakerText);
						textAreaWidth -= speakerTextWidth + 5;
					}
					if (this.lineVisibility >= 1.0 || textAreaWidth * this.lineVisibility >= currentLineWidth + 20) {
						if (this.lineToReveal - this.topLine == lineCount - 1) this.mode = "idle";
						++this.lineToReveal;
						++this.numLinesToDraw;
						if (this.numLinesToDraw < 3 && this.lineToReveal < this.text[this.currentPage].length)
							this.mode = "nextline";
						else
							this.mode = "idle";
						this.lineVisibility = 0.0;
					}
				}
				break;
			case "nextline":
				if (this.lineToReveal < 3) {
					this.lineVisibility = 0.0;
					this.mode = "write";
					break;
				}
				this.scrollOffset = Math.min(this.scrollOffset + 8.0 * this.textSpeed / Sphere.frameRate, 1.0);
				if (this.scrollOffset >= 1.0) {
					this.topLine += 1;
					this.scrollOffset = 0.0;
					this.lineVisibility = 0.0;
					this.textVisibility = 1.0;
					this.mode = "write";
				}
				break;
			case "page":
				this.textVisibility = Math.max(this.textVisibility - (2.0 * this.textSpeed) / Sphere.frameRate, 0.0);
				if (this.textVisibility <= 0.0) {
					this.mode = "write";
					++this.currentPage;
					this.lineToReveal = 0;
					this.numLinesToDraw = 0;
					this.textVisibility = 1.0;
					this.topLine = 0;
					this.lineVisibility = 0.0;
				}
				break;
			case "hidetext":
				this.textVisibility = Math.max(this.textVisibility - (4.0 * this.textSpeed) / Sphere.frameRate, 0.0);
				if (this.textVisibility <= 0.0) {
					this.transition = new Scene()
						.tween(this, 20, 'easeInBack', { boxVisibility: 0.0 });
					this.transition.run();
					this.mode = "fadeout";
				}
				break;
			case "fadeout":
				if (!this.transition.running)
					this.mode = "finish";
				break;
			case "finish":
				return false;
		}
		return true;
	},

	getInput(scene) {
		if (this.mode != "idle")
			return;
		if ((Keyboard.Default.isPressed(Key.Z) || Joypad.P1.isPressed(0))
			&& this.timeout == Infinity)
		{
			if (this.topLine + 3 >= this.text[this.currentPage].length) {
				if (this.currentPage < this.text.length - 1)
					this.mode = "page";
				else
					this.mode = "hidetext";
			}
			else {
				this.mode = "nextline";
				this.numLinesToDraw = 0;
				this.lineVisibility = 0.0;
			}
		}
	},
});
