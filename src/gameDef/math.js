/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2017 Power-Command
***/

Game.math =
{
	accuracy: {
		bow: function(userInfo, targetInfo) {
			return userInfo.stats.foc / targetInfo.stats.agi * userInfo.level / userInfo.weapon.level;
		},
		breath: function(userInfo, targetInfo) {
			return 1.0;
		},
		devour: function(userInfo, targetInfo) {
			return (100 - targetInfo.health) / 100 / targetInfo.tier
				* userInfo.stats.agi / targetInfo.stats.agi;
		},
		gun: function(userInfo, targetInfo) {
			return 1.0;
		},
		magic: function(userInfo, targetInfo) {
			return 1.0;
		},
		physical: function(userInfo, targetInfo) {
			return 1.0;
		},
		shuriken: function(userInfo, targetInfo) {
			return userInfo.level / userInfo.weapon.level;
		},
		sword: function(userInfo, targetInfo) {
			return userInfo.stats.agi * 1.5 / targetInfo.stats.agi * userInfo.level / userInfo.weapon.level;
		}
	},
	
	damage: {
		calculate: function(power, level, targetTier, attack, defense) {
			let multiplier = 1.0 + 4.0 * (level - 1) / 99;
			return 2.5 * power * multiplier * attack / defense;
		},
		bow: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power, userInfo.weapon.level, targetInfo.tier,
				userInfo.stats.str,
				Game.math.statValue(0, targetInfo.level));
		},
		breath: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power, userInfo.level, targetInfo.tier,
				Math.round((userInfo.stats.vit * 2 + userInfo.stats.mag) / 3),
				targetInfo.stats.vit);
		},
		magic: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power, userInfo.level, targetInfo.tier,
				Math.round((userInfo.stats.mag * 2 + userInfo.stats.foc) / 3),
				targetInfo.stats.foc);
		},
		gun: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power, userInfo.weapon.level, targetInfo.tier,
				Game.math.statValue(100, userInfo.level),
				targetInfo.stats.def);
		},
		physical: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power, userInfo.level, targetInfo.tier,
				userInfo.stats.str,
				Math.round((targetInfo.stats.def * 2 + targetInfo.stats.str) / 3));
		},
		physicalRecoil: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power / 2, userInfo.level, targetInfo.tier,
				targetInfo.stats.str, userInfo.stats.str);
		},
		shuriken: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power, userInfo.weapon.level, targetInfo.tier,
				userInfo.stats.foc, targetInfo.stats.def);
		},
		sword: function(userInfo, targetInfo, power) {
			return Game.math.damage.calculate(power, userInfo.level, targetInfo.tier,
				userInfo.stats.str, targetInfo.stats.def);
		}
	},
	
	experience: {
		skill: function(skillInfo, userInfo, targetsInfo) {
			var levelSum = 0;
			var statSum = 0;
			for (var i = 0; i < targetsInfo.length; ++i) {
				levelSum += targetsInfo[i].level;
				statSum += targetsInfo[i].baseStatAverage;
			}
			var levelAverage = Math.round(levelSum / targetsInfo.length);
			var statAverage = Math.round(statSum / targetsInfo.length);
			return levelAverage * statAverage;
		},
		stat: function(statID, enemyUnitInfo) {
			return enemyUnitInfo.level * enemyUnitInfo.baseStats[statID];
		}
	},
	
	guardStance: {
		damageTaken: function(baseDamage, tags) {
			if (from(tags).anyIs('deathblow')) {
				return baseDamage - 1;
			} else if (from(tags).anyIn([ 'bow', 'omni', 'special', 'zombie' ])) {
				return baseDamage;
			} else {
				return baseDamage / 2;
			}
		}
	},
	
	healing: function(userInfo, targetInfo, power) {
		return Game.math.damage.calculate(power, userInfo.level, targetInfo.tier,
			Math.round((userInfo.stats.mag * 2 + userInfo.stats.foc) / 3),
			Game.math.statValue(0, targetInfo.level));
	},
	
	hp: function(unitInfo, level, tier) {
		var statAverage = Math.round((unitInfo.baseStats.vit * 10
			+ unitInfo.baseStats.str
			+ unitInfo.baseStats.def
			+ unitInfo.baseStats.foc
			+ unitInfo.baseStats.mag
			+ unitInfo.baseStats.agi) / 15);
		return 25 * tier * Game.math.statValue(statAverage, level);
	},
	
	mp: {
		capacity: function(unitInfo) {
			var statAverage = Math.round((unitInfo.baseStats.mag * 10
				+ unitInfo.baseStats.vit
				+ unitInfo.baseStats.str
				+ unitInfo.baseStats.def
				+ unitInfo.baseStats.foc
				+ unitInfo.baseStats.agi) / 15);
			return 10 * unitInfo.tier * Game.math.statValue(statAverage, unitInfo.level);
		},
		usage: function(skill, level, userInfo) {
			var baseCost = 'baseMPCost' in skill ? skill.baseMPCost : 0;
			return 2.5 * baseCost * (level + userInfo.baseStats.mag) / 200;
		}
	},
	
	retreatChance: function(enemyUnitsInfo) {
		return 1.0;
	},
	
	skillRank: function(skill) {
		var rankTotal = 0;
		for (var i = 0; i < skill.actions.length; ++i) {
			rankTotal += skill.actions[i].rank;
		}
		return rankTotal;
	},
	
	statValue: function(baseStat, level) {
		return Math.round((50 + 0.5 * baseStat) * (10 + level) / 110);
	},
	
	timeUntilNextTurn: function(unitInfo, rank) {
		return rank * 10000 / unitInfo.stats.agi;
	}
};
