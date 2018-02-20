/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2017 Power-Command
***/

import { TestHarness } from '$/test-harness.mjs';

TestHarness.addBattle('temple',
{
	battleID: 'scottTemple',
	party: {
		elysia: {
			level: 60,
			weapon: 'powerBow',
			items: [
				'tonic',
				'powerTonic',
				'fullTonic',
				'redBull',
				'holyWater',
				'vaccine',
			],
		},
		justin: {
			level: 60,
			items: [
				'fullTonic',
				'lazarusPotion',
			],
		},
		bruce: {
			level: 60,
			weapon: 'arsenRifle',
			items: [],
		},
	}
});
