/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2013 Power-Command
***/

Game.battles =
{
	// Headless Horse (Boss Battle)
	// Boss of Lexington Manor
	headlessHorse: {
		title: "Headless Horse",
		bgm: 'ManorBoss',
		battleLevel: 8,
		enemies: [
			'headlessHorse'
		],
		onStart: function() {
			new Scenario()
				.talk("maggie", true, 2.0, Infinity,
					"I'd suggest keeping your wits about you while fighting this thing if you don't want to be barbequed. "
					+ "It won't hesitate to roast you--and then I'd have to eat you!")
				.run(true);
		}
	},
	
	// Robert Spellbinder (II) (Final Battle)
	// Final Boss of Spectacles: Bruce's Story
	robert2: {
		title: "#9, Robert Spellbinder",
		isFinalBattle: true,
		bgm: 'ThePromise',
		battleLevel: 50,
		enemies: [
			'robert2'
		],
		onStart: function() {
			new Scenario()
				.talk("Robert", true, 2.0, Infinity,
					"Bruce's death changed nothing. If anything, it's made you far too reckless. Look around, "
					+ "Scott! Where are your friends? Did they abandon you in your most desperate hour, or are you truly so "
					+ "brazen as to face me alone?")
				.talk("Scott", true, 2.0, Infinity,
					"I owe Bruce my life, Robert! To let his story end here... that's something I won't allow. "
					+ "Not now. Not when I know just what my world would become if I did!")
				.pause(2.0)
				.talk("Robert", true, 1.0, Infinity, "What makes you so sure you have a choice?")
				.synchronize()
				.run(true);
			this.playerUnits[0].addStatus('reGen');
		}
	},
	
	// Scott Starcross (Final Battle)
	// Final Boss of Spectacles III: The Last Lucidan
	numberEleven: {
		title: "#11, Scott Starcross",
		isFinalBattle: true,
		bgm: 'NaturalCorruption',
		battleLevel: 60,
		enemies: [
			'numberEleven'
		]
	},
};
