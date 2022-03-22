import { GameDatabase } from "../game-database.js";
import { DC } from "../../constants.js";

GameDatabase.celestials.pelle.rifts = {
  famine: {
    id: 1,
    key: "famine",
    name: "Famine",
    drainResource: "IP",
    baseEffect: x => `IP gain ${formatX(x, 2, 2)}`,
    additionalEffects: () => [PelleRifts.famine.milestones[2]],
    strike: () => PelleStrikes.infinity,
    percentage: totalFill => Math.log10(totalFill.plus(1).log10() * 10 + 1) ** 2.5 / 100,
    percentageToFill: percentage => Decimal.pow(10,
      Decimal.pow(10, (percentage * 100) ** (1 / 2.5)).div(10).minus(0.1)
    ).minus(1),
    effect: totalFill => {
      if (player.challenge.eternity.current !== 0) {
        const chall = EternityChallenge.current;
        const goal = chall.goalAtCompletions(chall.gainedCompletionStatus.totalCompletions);
        return totalFill.plus(1).pow(0.1).min(goal.pow(0.15));
      }
      return totalFill.plus(1).pow(0.33);
    },
    currency: () => Currency.infinityPoints,
    galaxyGeneratorThreshold: 1000,
    milestones: [
      {
        resource: "famine",
        requirement: 0.04,
        description: "You can equip a single basic Glyph with decreased level and rarity"
      },
      {
        resource: "famine",
        requirement: 0.06,
        description: () => `Uncap Replicanti and make its unlock and upgrades ${formatX(1e130)} cheaper`,
        effect: () => 1e130
      },
      {
        resource: "famine",
        requirement: 0.4,
        description: "Famine also affects EP gain",
        effect: () => Decimal.pow(4, PelleRifts.famine.totalFill.log10() / 2 / 308 + 3),
        formatEffect: x => `EP gain ${formatX(x, 2, 2)}`
      },
    ]
  },
  pestilence: {
    id: 2,
    key: "pestilence",
    name: "Pestilence",
    drainResource: "Replicanti",
    spendable: true,
    baseEffect: x => `Replicanti speed ${formatX(x, 2, 2)}`,
    additionalEffects: () => [PelleRifts.pestilence.milestones[0], PelleRifts.pestilence.milestones[2]],
    strike: () => PelleStrikes.powerGalaxies,
    // 0 - 1
    percentage: totalFill => totalFill.plus(1).log10() * 0.05 / 100,
    // 0 - 1
    percentageToFill: percentage => Decimal.pow(10, 20 * percentage * 100).minus(1),
    effect: totalFill => (PelleRifts.chaos.milestones[0].canBeApplied
      ? Decimal.sqrt(2000 + 1) : Decimal.sqrt(totalFill.plus(1).log10() + 1)),
    currency: () => Currency.replicanti,
    galaxyGeneratorThreshold: 1e7,
    milestones: [
      {
        resource: "pestilence",
        requirement: 0.2,
        description: "First rebuyable Pelle upgrade also affects 1st Infinity Dimension",
        effect: () => {
          const x = player.celestials.pelle.rebuyables.antimatterDimensionMult;
          return Decimal.pow(1e50, x - 9);
        },
        formatEffect: x => `1st Infinity Dimension ${formatX(x, 2, 2)}`
      },
      {
        resource: "pestilence",
        requirement: 0.6,
        description: () => `When Replicanti exceeds ${format(DC.E1300)},
          all Galaxies are ${formatPercents(0.1)} more effective`,
        effect: () => (Replicanti.amount.gt(DC.E1300) ? 1.1 : 1)
      },
      {
        resource: "pestilence",
        requirement: 1,
        description: "Increase max Replicanti Galaxies based on total Rift milestones",
        effect: () => {
          const x = PelleRifts.totalMilestones();
          return x ** 2 - 2 * x;
        },
        formatEffect: x => `Max RG count +${formatInt(x)}`
      },
    ]
  },
  chaos: {
    id: 3,
    key: "chaos",
    name: "Chaos",
    drainResource: "Pestilence",
    baseEffect: x => `Time Dimensions ${formatX(x, 2, 2)}`,
    strike: () => PelleStrikes.eternity,
    percentage: totalFill => totalFill / 10,
    percentageToFill: percentage => 10 * percentage,
    effect: totalFill => {
      const fill = totalFill > 6.5
        ? (totalFill - 6.5) / 7 + 6.5
        : totalFill;
      return Decimal.pow(6, Decimal.pow(6, Decimal.pow(6, fill / 10 + 0.1)).minus(6))
        .div(1e5)
        .plus(Decimal.pow(10, fill / 10 + 0.1));
    },
    currency: () => ({
      get value() {
        return PelleRifts.pestilence.percentage;
      },
      set value(val) {
        const spent = PelleRifts.pestilence.percentage - val;
        player.celestials.pelle.rifts.pestilence.percentageSpent += spent;
      }
    }),
    galaxyGeneratorThreshold: 1e9,
    milestones: [
      {
        resource: "chaos",
        requirement: 0.09,
        description: "Pestilence effect is always maxed and milestones always active"
      },
      {
        resource: "chaos",
        requirement: 0.15,
        description: "Glyphs gain a new Pelle-specific effect",
      },
      {
        resource: "chaos",
        requirement: 1,
        description: () => `You gain ${formatPercents(0.01)} of your EP gained on Eternity per second`,
      },
    ]
  },
  war: {
    id: 4,
    key: "war",
    name: "War",
    drainResource: "EP",
    baseEffect: x => `EP formula: log(x/${formatInt(308)}) ➜ log(x/${formatFloat(308 - x.toNumber(), 2)})`,
    additionalEffects: () => [PelleRifts.war.milestones[0], PelleRifts.war.milestones[1]],
    strike: () => PelleStrikes.ECs,
    percentage: totalFill => totalFill.plus(1).log10() ** 0.4 / 4000 ** 0.4,
    percentageToFill: percentage => Decimal.pow(10, percentage ** 2.5 * 4000).minus(1),
    effect: totalFill => new Decimal(58 * totalFill.plus(1).log10() ** 0.2 / 4000 ** 0.2),
    currency: () => Currency.eternityPoints,
    galaxyGeneratorThreshold: 1e10,
    milestones: [
      {
        resource: "war",
        requirement: 0.10,
        description: "Dimensional Boosts are more powerful based on EC completions",
        effect: () => Math.max(100 * EternityChallenges.completions ** 2, 1) *
          Math.max(1e4 ** (EternityChallenges.completions - 40), 1),
        formatEffect: x => `Dimension Boost power ${formatX(x, 2, 2)}`
      },
      {
        resource: "war",
        requirement: 0.15,
        description: "Infinity Dimensions are stronger based on EC completions",
        effect: () => Decimal.pow("1e1500", ((EternityChallenges.completions - 25) / 20) ** 1.7).max(1),
        formatEffect: x => `Infinity Dimensions ${formatX(x)}`
      },
      {
        resource: "war",
        requirement: 1,
        description: "Unlock the Galaxy Generator",
      },
    ]
  },
  death: {
    id: 5,
    key: "death",
    name: "Death",
    drainResource: "Dilated Time",
    baseEffect: x => `All Dimensions ${formatPow(x, 2, 3)}`,
    additionalEffects: () => [PelleRifts.death.milestones[2]],
    strike: () => PelleStrikes.dilation,
    percentage: totalFill => totalFill.plus(1).log10() / 100,
    percentageToFill: percentage => Decimal.pow10(percentage * 100).minus(1),
    effect: totalFill => new Decimal(1 + totalFill.plus(1).log10() * 0.004),
    currency: () => Currency.dilatedTime,
    galaxyGeneratorThreshold: 1e5,
    milestones: [
      {
        resource: "death",
        requirement: 0.15,
        description: "Time Dimensions 5-8 are much cheaper, unlock more Dilation upgrades",
        // FIXME: Not a great solution
        onStateChange: () => {
          updateTimeDimensionCosts();
        }
      },
      {
        resource: "death",
        requirement: 0.25,
        description: () => `Raise Tachyon Particle effect to Dilated Time gain to ${formatPow(1.4, 1, 1)}`,
        effect: 1.4
      },
      {
        resource: "death",
        requirement: 0.5,
        description: "Dilation rebuyable purchase count improves Infinity Power conversion rate",
        effect: () => Math.min(
          1.1 ** (Object.values(player.dilation.rebuyables).sum() - 90),
          712
        ),
        formatEffect: x => `Infinity Power Conversion ${formatX(x, 2, 2)}`
      },
    ]
  }
};