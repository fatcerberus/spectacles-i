Spectacles: Bruce's Story
=========================

*Spectacles: Bruce's Story* is the first installment of the three-part
Spectacles Saga, a series of role-playing games following the travails of Scott
Starcross as he quests to defeat the Primus, an exceedingly powerful magic user
who threatens both worlds.  According to a prophecy made years before the saga
begins, Scott, the eleventh Littermate, is the only person capable of stopping
the Primus with the aid of the Spectacles, a legendary pair of eyeglasses
granting their wearer magical protection--ostensibly making Scott the chosen
one.  But all may not be as it seems...


Credits
=======

- Bruce Pascoe - *Director / Writer / Lead Developer*
- John Stanko - *Writer / Beta Tester*
- Richard Lawrence - *Programming/Optimization*


Building
========

*Spectacles: Bruce's Story* was developed in JavaScript for the miniSphere game
engine.  To build the game, you will need to install miniSphere, available for
download here:

[miniSphere on GitHub](https://github.com/fatcerberus/minisphere/releases)

Be sure to install the development tools, not just the engine itself.  After
that's done, build and run the game by entering the following at the command
line:

```
$ cell
$ spherun dist
```

Alternatively, you can open `spectacles.ssproj` in Sphere Studio.


The Battle System
=================

Spectacles uses the CTB (Conditional Turn-based Battle) combat system, the same
system seen in Final Fantasy X.  CTB resolves turns dynamically and
assymetrically, based on both the battlers' speed (AGI stat) and the nature of
the attacks used.  The Rank of a move determines how long the move will take to
recover from.  The higher the Rank, the more recovery time is needed and the
longer it will take before the unit's next turn will arrive.

Battlers may also choose to change to a defensive stance to parry powerful
blows and counterattack.  Pressing 'V' during move selection will switch the
battler into Guard, which reduces the damage taken from attacks and prevents
secondary effects, such as the Zombie affliction caused by Electrocute.  Guard
cannot block statuses inflicted as a primary effect, however, such as that from
Necromancy.  Guard is a Rank 5 action; if the cooldown expires before the
character is attacked, they will automatically return to Normal stance.

Note that when a melee (sword or contact) move is Guarded, the attack will
always miss outright.  The opening thus created will allow the Guarding
character to counterattack, dealing extra damage with their attack.


Status Effects
==============

There are many status effects in Spectacles; some are detrimental, while others
are benign or even beneficial.  Unlike many other role-playing games, almost
all bosses in Spectacles are susceptible to status afflictions, with a small to
non-existant list of immunities.

Below are descriptions of some of the statuses available in the
Spectacles Saga.

* **Crackdown:** Crackdown, as its name suggests, cracks down on consecutive
  attacks of the same type. Each time an attack of the same type as the
  previous one is used, its efficacy is cut by 25%. Using a different type of
  move will reset the multiplier, but the affliction will remain in effect
  until the end of the battle.

* **Disarray:** Randomizes the ranks of actions taken by the afflicted unit.
  Disarray cannot be cured; it will however wear off on its own after the
  victim has taken 3 turns.

* **Drunk:** Using Alcohol constitutes full HP recovery at the cost of
  inflicting the Drunk status on the user. This cuts the victim's AGI, FOC, and
  accuracy, as well as creating a painful Earth weakness, but doubles STR as a
  compromise.  The status must be allowed to wear off on its own; the number of
  turns required for it to expire depends on the victim's base VIT.

* **Frostbite:** Inflicts a small amount of ice damage after every action taken
  by the victim. The effect worsens over time, peaking at double its initial
  efficacy.  Frostbite can be removed by subjecting the afflicted battler to a
  fire attack, the damage from which will be increased as a tradeoff.

* **Ghost:** A battler in Ghost status can't be damaged by anything other than
  magic; however, they are also limited to using magic against non-Ghosts if
  they intend to get anywhere.  Note that two Ghosts attacking each other will
  bypass this restriction.  Ghost can be removed with Holy Water.

* **Ignite:** Similar to Frostbite, except it inflicts fire damage and hits
  between turns, dealing damage with every action taken in the battle.  As a
  tradeoff, the effect weakens over time, quickly dropping to only half its
  initial output.  As with Frostbite, this can be removed by attacking the
  afflicted unit with ice.

* **Skeleton:** The end result of a Zombie affliction (see below) if the status
  is not cured before the victim reaches 0 HP.  Skeletons have their STR and
  FOC cut in half in exchange for being allowed to continue fighting after
  death.  Any physical or slash damage will end a Skeleton, however.  Skeleton
  can be removed with Holy Water, reviving the battler with 1 HP.

* **Zombie:** Reverses HP restoration (healing), converting it into an
  equivalent amount of damage.  If a zombified battler is reduced to 0 HP by an
  attack, the status will progress to Skeleton; however, converted restoratives
  bypass this clause and may kill the Zombie outright.  Zombie can be cured
  with the use of Holy Water.
