/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2012 Power-Command
***/

import { Random } from 'sphere-runtime';

import { AutoBattler } from '$/battle-system/auto-battler.mjs';
import { Stance } from '$/battle-system/battle-unit.mjs';

export default
class ScottTempleAI extends AutoBattler
{
	constructor(unit, battle)
	{
		super(unit, battle);

		this.definePhases([ 9000, 3000 ], 100);
		this.defaultSkill = 'swordSlash';
	}

	strategize(stance, phase)
	{
		switch (phase) {
			case 1:
				var qsTurns = this.predictSkillTurns('quickstrike');
				if (qsTurns[0].unit === this.unit) {
					this.queueSkill('quickstrike');
				} else if (Random.chance(0.25)) {
					if (this.battle.hasCondition('inferno')) {
						this.queueSkill('hellfire');
					} else if (this.battle.hasCondition('subzero')) {
						this.queueSkill('windchill');
					} else {
						this.queueSkill(Random.sample([ 'inferno', 'subzero' ]));
					}
				} else {
					this.queueSkill(Random.sample([ 'flare', 'chill', 'lightning', 'quake', 'heal' ]));
				}
				break;
			case 2:
				if (this.isQSComboStarted) {
					var qsTurns = this.predictSkillTurns('quickstrike');
					if (qsTurns[0].unit === this.unit) {
						this.queueSkill('quickstrike');
					} else {
						var skillToUse = Random.sample([ 'flare', 'chill', 'lightning', 'quake' ])
						this.queueSkill(this.isSkillUsable(skillToUse) ? skillToUse : 'swordSlash');
					}
				} else if (this.movesTillReGen <= 0 && this.isSkillUsable('rejuvenate')) {
					this.queueSkill('rejuvenate');
					this.queueSkill('chargeSlash');
					this.movesTillReGen = 3 + Math.min(Math.floor(Math.random() * 3), 2);
				} else {
					--this.movesTillReGen;
					var skillToUse = this.unit.hasStatus('reGen')
						? Random.sample([ 'hellfire', 'windchill', 'upheaval', 'quickstrike' ])
						: Random.sample([ 'hellfire', 'windchill', 'upheaval', 'quickstrike', 'heal' ]);
					skillToUse = this.isSkillUsable(skillToUse) ? skillToUse : 'quickstrike';
					if (skillToUse != 'quickstrike') {
						this.queueSkill(skillToUse);
					} else {
						var qsTurns = this.predictSkillTurns(skillToUse);
						if (qsTurns[0].unit === this.unit) {
							this.isQSComboStarted = true;
							this.queueSkill(skillToUse);
						} else {
							this.queueSkill('chargeSlash');
						}
					}
				}
				break;
			case 3:
				if (this.isQSComboStarted) {
					var qsTurns = this.predictSkillTurns('quickstrike');
					this.queueSkill(qsTurns[0].unit === this.unit ? 'quickstrike' : 'swordSlash');
				} else if (!this.battle.hasCondition('generalDisarray') && 0.5 > Math.random()) {
					this.queueSkill('tenPointFive');
				} else {
					var skillToUse = Random.sample([ 'quickstrike',
						'hellfire', 'windchill', 'electrocute', 'upheaval',
						'flare', 'chill', 'lightning', 'quake', 'heal' ]);
					this.queueSkill(this.isSkillUsable(skillToUse) ? skillToUse
						: Random.sample([ 'swordSlash', 'quickstrike', 'chargeSlash' ]));
					if (this.isSkillQueued('quickstrike')) {
						var qsTurns = this.predictSkillTurns('quickstrike');
						this.isQSComboStarted = qsTurns[0].unit === this.unit;
					}
				}
				break;
		}
	}

	on_itemUsed(userID, itemID, targetIDs)
	{
		if (this.unit.hasStatus('offGuard'))
			return;

		if (from([ 'tonic', 'powerTonic' ]).anyIs(itemID) && !from(targetIDs).anyIs('scottTemple')
			&& Random.chance(0.5))
		{
			this.queueSkill('electrocute', targetIDs[0]);
		}
	}

	on_phaseChanged(newPhase, lastPhase)
	{
		switch (newPhase) {
			case 1:
				this.queueSkill('omni', 'elysia');
				var spellID = Random.sample([ 'inferno', 'subzero' ]);
				this.phase2Opener = spellID != 'inferno' ? 'inferno' : 'subzero';
				this.queueSkill(spellID);
				break;
			case 2:
				this.queueSkill('rejuvenate');
				this.queueSkill(this.phase2Opener);
				this.isQSComboStarted = false;
				this.movesTillReGen = 3 + Math.min(Math.floor(Math.random() * 3), 2);
				break;
			case 3:
				this.queueSkill(this.isSkillUsable('renewal')
					? 'renewal' : 'chargeSlash');
				this.isQSComboStarted = false;
				break;
		}
	}

	onSkillUsed(userID, skillID, stance, targetIDs)
	{
		if (this.unit.hasStatus('offGuard'))
			return;

		if (skillID == 'rejuvenate' && userID != 'scottTemple' && !from(targetIDs).anyIs('scottTemple')) {
			if (this.phase <= 1 && !this.isSkillQueued('chargeSlash')) {
				this.queueSkill('chargeSlash', targetIDs[0]);
			} else if (this.phase >= 2 && 0.25 > Math.random) {
				this.queueSkill('necromancy', targetIDs[0]);
			}
		}
		else if (skillID == 'dispel' && from(targetIDs).anyIs('scottTemple')
			&& this.unit.hasStatus('reGen'))
		{
			this.queueSkill('electrocute', userID);
			this.queueSkill('heal', userID);
		}
	}
}
