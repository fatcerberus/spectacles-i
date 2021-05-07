/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *            Copyright (c) 2021 Fat Cerberus
***/

import { from, Random } from 'sphere-runtime';

import { AutoBattler, Stance } from '../battleSystem/index.js';

export default
class ScottTempleAI extends AutoBattler
{
	constructor(unit, battle)
	{
		super(unit, battle);

		this.definePhases([ 4800, 2400 ], 100);
		this.defaultSkill = 'swordSlash';

		this.inQSCombo = false;
		this.healingItems = from([ 'tonic', 'powerTonic' ]);
		this.nextSpell = null;
		this.spellTarget = null;
		this.zapChance = 0.0;
		this.zapTarget = null;
	}

	strategize()
	{
		if (this.zapTarget !== null) {
			this.queueSkill('electrocute', Stance.Normal, this.zapTarget);
			this.zapTarget = null;
			this.zapChance = 0.0;
		}
		else {
			const healChance = 0.15 * (this.phase - 1);
			if (this.nextSpell !== null) {
				this.queueSkill(this.nextSpell, Stance.Normal, this.spellTarget);
				this.nextSpell = null;
			}
			else if (!this.inQSCombo && Random.chance(healChance)) {
				this.queueSkill('heal');
			}
			else {
				const comboChance = this.phase < 3 ? 0.5 : 0.25;
				if (!this.inQSCombo && !this.hasStatus('crackdown') && Random.chance(comboChance))
					this.inQSCombo = true;
				if (this.inQSCombo) {
					const turns = this.predictSkillTurns('quickstrike');
					if (turns[0].unit === this.unit) {
						this.queueSkill('quickstrike');
					}
					else {
						this.queueSkill('swordSlash');
						this.inQSCombo = false;
					}
				}
				else {
					if (this.phase >= 3 && Random.chance(0.35)) {
						this.queueSkill('tenPointFive');
					}
					else {
						const usePowerSpell = Random.chance(0.25 * this.phase);
						const moveID = usePowerSpell
							? Random.sample([ 'hellfire', 'windchill' ])
							: Random.sample([ 'flare', 'chill', 'lightning', 'quake' ]);
						if (moveID === 'hellfire')
							this.nextSpell = 'windchill';
						else if (moveID === 'windchill')
							this.nextSpell = 'hellfire';
						this.spellTarget = Random.sample([ 'elysia', 'abigail', 'bruce' ]);
						this.queueSkill(moveID, Stance.Normal, this.spellTarget);
					}
				}
			}
		}
	}

	on_phaseChanged(newPhase, lastPhase)
	{
		switch (newPhase) {
		case 1:
			this.queueSkill('omni', Stance.Normal, 'elysia');
			break;
		}
	}

	on_itemUsed(userID, itemID, targetIDs)
	{
		if (this.healingItems.anyIs(itemID))
			this.zapTarget = targetIDs[0];
	}
	
	on_skillUsed(userID, skillID, stance, targetIDs)
	{
		// if someone gets healed, zombify the target. in case of Renewal, retaliate with Discharge.
		if ((skillID === 'heal' || skillID === 'rejuvenate') && userID !== 'scottTemple') {
			this.zapChance += (skillID === 'rejuvenate' ? 0.25 : 0.15);
			if (Random.chance(this.zapChance))
				this.zapTarget = targetIDs[0];
		}
		else if (skillID === 'renewal' && userID !== 'scottTemple') {
			this.queueSkill('discharge');
		}
	}
}
