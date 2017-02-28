/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2017 Power-Command
***/

RequireScript('cpuBattlerAIs/headlessHorse.js');
RequireScript('cpuBattlerAIs/robertI.js');
RequireScript('cpuBattlerAIs/robertII.js');
RequireScript('cpuBattlerAIs/scottTemple.js');
RequireScript('cpuBattlerAIs/scottStarcross.js');
RequireScript('cpuBattlerAIs/victor.js');

// boss and miniboss battle definitions.
// random field battles don't have specific definitions as the
// game composes them on-the-fly, ex nihilo.
Game.battles =
{
	headlessHorse: {
		title: "Headless Horse",
		bgm: null,
		battleLevel: 8,
		enemies: [
			'headlessHorse',
		],
		onStart: function() {
			new scenes.Scene()
				.talk("maggie", true, 2.0, Infinity,
					"I'd suggest keeping your wits about you while fighting this thing if you don't want to be barbequed. "
					+ "It won't hesitate to roast you--and then I'd have to eat you!")
				.run(true);
		}
	},
	
	rsbFinal: {
		title: "Robert Spellbinder",
		isFinalBattle: true,
		bgm: 'thePromise',
		battleLevel: 50,
		enemies: [
			'robert2'
		],
		onStart: function() {
			var scott = this.findUnit('scott');
			if (scott != null) {
				new scenes.Scene()
					.talk("Robert", true, 1.0, Infinity,
						"Bruce's death changed nothing. If anything, it's made you far too reckless. Look around, "
						+ "Scott! Where are your friends? Did they abandon you in your most desperate hour, or are you truly so "
						+ "brazen as to face me alone?")
					.talk("Scott", true, 1.0, Infinity,
						"I owe Bruce my life, Robert! To let his story end here... that's something I won't allow. "
						+ "Not now. Not when I know just what my world would become if I did!")
					.pause(120)
					.talk("Robert", true, 1.0, Infinity, "What makes you so sure you have a choice?")
					.run(true);
				if (scott != null) {
					scott.addStatus('specs');
				}
			}
		}
	},
	
	scottTemple: {
		title: "Scott Victor Temple",
		isFinalBattle: false,
		bgm: 'BattleForLucida',
		battleLevel: 60,
		enemies: [
			'scottTemple',
		]
	},
	
	scottStarcross: {
		title: "Scott Starcross",
		isFinalBattle: true,
		bgm: 'deathComeNearMe',
		battleLevel: 60,
		enemies: [
			'starcross'
		],
		onStart: function() {
			var scottUnit = this.findUnit('starcross');
			scottUnit.addStatus('specs');
		}
	},
};

// enemy definitions.
// this includes boss and miniboss battlers as well as
// field enemies.
Game.enemies =
{
	headlessHorse: {
		name: "H. Horse",
		fullName: "Headless Horse",
		aiType: HeadlessHorseAI,
		hasLifeBar: true,
		tier: 2,
		turnRatio: 3.0,
		baseStats: {
			vit: 50,
			str: 10,
			def: 55,
			foc: 65,
			mag: 30,
			agi: 70
		},
		damageModifiers: {
			bow: Game.bonusMultiplier,
			gun: Game.bonusMultiplier,
			fire: -1.0,
			fat: Game.bonusMultiplier
		},
		immunities: [],
		munchData: {
			skill: 'spectralDraw'
		}
	},
	
	victor: {
		name: "Victor",
		fullName: "Victor Spellbinder",
		aiType: VictorAI,
		hasLifeBar: true,
		tier: 3,
		turnRatio: 1.0,
		baseStats: {
			vit: 50,
			str: 60,
			def: 85,
			foc: 75,
			mag: 85,
			agi: 50,
		},
		immunities: [],
		weapon: 'templeSword',
		items: [
			'alcohol'
		],
	},
	
	robert1: {
		name: "Robert",
		fullName: "Robert Spellbinder",
		aiType: Robert1AI,
		hasLifeBar: true,
		tier: 3,
		turnRatio: 3.0,
		baseStats: {
			vit: 75,
			str: 75,
			def: 75,
			foc: 75,
			mag: 75,
			agi: 75
		},
		immunities: [],
		weapon: 'rsbSword',
		munchData: {
			skill: 'omni'
		},
		items: [
			'tonic',
			'powerTonic',
			'vaccine'
		]
	},
	
	robert2: {
		name: "Robert",
		fullName: "Robert Spellbinder",
		aiType: Robert2AI,
		hasLifeBar: true,
		tier: 4,
		turnRatio: 1.0,
		baseStats: {
			vit: 75,
			str: 75,
			def: 75,
			foc: 75,
			mag: 75,
			agi: 75
		},
		immunities: [],
		weapon: 'rsbSword',
		munchData: {
			skill: 'omni'
		},
		items: [
			'tonic',
			'powerTonic',
			'redBull',
			'holyWater',
			'vaccine',
			'alcohol'
		]
	},
	
	scottTemple: {
		name: "Scott T",
		fullName: "Scott Victor Temple",
		aiType: ScottTempleAI,
		hasLifeBar: true,
		tier: 3,
		turnRatio: 2.0,
		baseStats: {
			vit: 100,
			str: 85,
			def: 80,
			foc: 60,
			mag: 90,
			agi: 70
		},
		immunities: [ 'zombie' ],
		weapon: 'templeSword'
	},
	
	starcross: {
		name: "Scott",
		fullName: "Scott Starcross",
		aiType: ScottStarcrossAI,
		hasLifeBar: true,
		tier: 4,
		turnRatio: 2.0,
		baseStats: {
			vit: 80,
			str: 80,
			def: 80,
			foc: 80,
			mag: 80,
			agi: 80
		},
		immunities: [],
		weapon: 'templeSword'
	},
};
