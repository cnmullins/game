import monsters from '@server/core/data/monsters';
import world from '@server/core/world';
import emoji from 'node-emoji';
import Actor from './index';
// import MapUtils from '@server/shared/map-utils';
/*
Define Monsters class
  What variables will monsters hold?
  How with loot be calculated?
  How to control spawn rate?
*/

export default class Monster extends Actor {
  constructor(data) {
    super(data);
    // combat stats
    this.hp = {
      current: data.hp.current,
      max: data.hp.max,
    };
    this.hostile = data.hostile;
    this.attacking = null;
    this.combat = data.combat;
    this.loot = data.loot; // string Array
    this.respawnRate = data.respawnRate;
  }

  static load(context) {
    monsters.forEach((monster) => {
      world.monsters.push(new Monster(monster));
    }, context);
    console.log(`${emoji.get('walking')} Loading Monsters...`);
  }

  getNextCycleMove() {
    // Override this function if the Monster is aggroed to an entity
    if (this.hostile && this.attacking !== null) {
      const distance = this.distanceTo(this.attacking.x, this.attacking.y);
      if (distance > this.range) {
        // Go back to spawn
        this.walkCycle.status = 'returning';
        this.attacking = null;
        return this.directionTo(this.spawn.x, this.spawn.y);
      }
      if (distance === 1) {
        this.attack();
        return '';
      }
      return this.directionTo(this.attacking.x, this.attacking.y);
    }
    return super.getNextCycleMove();
  }

  attack() {
    // placeholder function for testing feedbak
    console.log(`Attacking: ${this.attacking.name}`);
  }
}
