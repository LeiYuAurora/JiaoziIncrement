import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js";

export function totalEnergyMult() {
  let multiplier = DC.D1;
  multiplier = multiplier.timesEffectOf(SimulationRebuyable.energyBoost);
  return multiplier;
}

export function energyPerSecond() {
  return Currency.cores.value.times(GameCache.totalEnergyMult.value);
}

class SimulationRebuyableState extends RebuyableMechanicState {
  constructor(config) {
    super(config);
    this.lastCost = new Lazy(() => this.cost);
  }
  
  get currency() {
    return Currency.energy;
  }
  
  get boughtAmount() {
    return player.simulation.upgrades.review[this.id];
  }

  set boughtAmount(value) {
    player.simulation.upgrades.review[this.id] = value;
  }
  
  onPurchased() {
    player.simulation.spentEnergy = player.simulation.spentEnergy.add(this.lastCost.value);
    GameCache.totalSimulationRebuyablesBought.invalidate();
    this.lastCost.invalidate();
  }
}

class SimulationUpgradeState extends BitPurchasableMechanicState {
   get currency() {
    return Currency.cores;
  }
  
  get bits() {
    return player.simulation.upgrades.previewBits;
  }
  
  set bits(value) {
    player.simulation.upgrades.previewBits = value;
  }
  
  get bitIndex() {
    return this.id;
  }
}

export const SimulationRebuyable = mapGameDataToObject(
  GameDatabase.simulation.upgrades.review,
  config => new SimulationRebuyableState(config)
);

export const SimulationUpgrade = mapGameDataToObject(
  GameDatabase.simulation.upgrades.preview,
  config => new SimulationUpgradeState(config)
);

export const SimulationRebuyableGroup = {
  upgrades: SimulationRebuyable.all,
  
  get totalBought() {
    return GameCache.totalSimulationRebuyablesBought.value;
  }
}

export function resetAllSimulationUpgrades() {
  for (let upgrade of SimulationRebuyableGroup.upgrades) {
    upgrade.boughtAmount = 0;
    upgrade.lastCost.invalidate();
  }
  GameCache.totalSimulationRebuyablesBought.invalidate();
  Currency.energy.add(player.simulation.spentEnergy.times(0.8));
  player.simulation.spentEnergy = DC.D0;
  concludeSimulationReset(true);
}