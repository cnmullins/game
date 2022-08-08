import MapUtils from '@server/shared/map-utils';
import Socket from '@server/socket';
import UI from 'shared/ui';
import world from '@server/core/world';

/*
Define base Actor class

This class will extend to NPCs and Monsters so we can inherit some of
the same properties and behaviors that both will share like:
  Examine actor
  Get information
  Contextual-menu items on right-click
*/
export default class Actor {
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.examine = data.examine;
    // Restarting position
    this.spawn = {
      x: data.spawn.x,
      y: data.spawn.y,
    };
    // Current position
    this.x = this.spawn.x;
    this.y = this.spawn.y;
    // How far they can walk from spawn
    this.range = data.spawn.range;
    // What actions can be perfomed on this actor?
    this.actions = data.actions;

    this.walkCycle = {
      name: data.walkCycleName || 'random',
      status: 'continue',
      stuckCount: 0,
    };
    this.walkCycle.stuckCount = 0;
    this.lastAction = 0;
    this.column = data.graphics.column;
  }

  /**
   * Simulate Actor movements every cycle
   */
  static movement() {
    [...world.npcs, ...world.monsters].map((actor) => {
      // Next movement allowed in 2.5 seconds
      const nextActionAllowed = actor.lastAction + 2500;

      if (actor.lastAction === 0 || nextActionAllowed < Date.now()) {
        // Are they going to continue w/ cycle or sit still this time?
        const action = UI.getRandomInt(1, 2) === 1 ? 'continue' : 'nothing';

        // Is Actor going to move during this loop?
        if (action === 'continue') {
          // Determine next move for this actor
          const going = actor.getNextCycleMove();
          const moved = actor.move(going);

          if (moved) {
            actor.walkCycle.stuckCount = 0;
          } else {
            actor.walkCycle.stuckCount += 1;
          }
        }
      }
      return actor;
    });
  }

  /**
   * Move 1 unit to a given direction of the parameter string if tiles permit.
   *
   * @param {string} direction 'up', 'down', 'left', or 'right'
   * @return {boolean} was movement successful
   */
  move(direction) {
    // What tile will they be stepping on?
    const tile = {
      background: UI.getFutureTileID(
        world.map.background,
        this.x,
        this.y,
        direction,
      ),
      foreground: UI.getFutureTileID(
        world.map.foreground,
        this.x,
        this.y,
        direction,
      ) - 252,
    };
    // Can the NPCs walk on that tile in their path?
    const walkable = {
      background: UI.tileWalkable(tile.background),
      foreground: UI.tileWalkable(tile.foreground, 'foreground'),
    };

    const canWalkThrough = (walkable.background && walkable.foreground);
    if (canWalkThrough) {
      switch (direction) {
      case 'up':
        if ((this.y - 1) >= (this.spawn.y - this.range)) {
          this.y -= 1;
        }
        break;
      case 'down':
        if ((this.y + 1) <= (this.spawn.y + this.range)) {
          this.y += 1;
        }
        break;
      case 'left':
        if ((this.x - 1) >= (this.spawn.x - this.range)) {
          this.x -= 1;
        }
        break;
      case 'right':
        if ((this.x + 1) <= (this.spawn.x + this.range)) {
          this.x += 1;
        }
        break;
      default:
        break;
      }
    }
    this.lastAction = Date.now();

    // Tell the clients of the new Actors
    Socket.broadcast('npc:movement', world.npcs);
    // Socket.broadcast('monsters:movement', world.monsters);
    return canWalkThrough;
  }

  /**
   * Given this Actors current information, get the appropriate response for the next walk cycle.
   *
   * @return {string} Direction of next move or 'nothing'
   */
  getNextCycleMove() {
    const direction = ['up', 'down', 'left', 'right'];
    let going = UI.getRandomInt(0, 3);
    let stuck = false;
    switch (this.walkCycle.name) {
    default:
    case 'random':
      break;

    case 'pace-x':
      const toSpawn = this.directionTo(this.spawn.x, this.spawn.y);
      const movingLeft = (this.walkCycle.status === 'continue'
          && toSpawn === 'left') || (this.walkCycle.status === 'returning'
          && toSpawn === 'right');

      going = (movingLeft) ? 'left' : 'right';
      stuck = !this.move(going);
      const halfRange = this.range / 2;
      this.walkCycle.status = (this.x === Math.abs(this.spawn.x));
      // toggle direction
      if (this.x === this.spawn.x + halfRange || this.x === this.spawn.x - halfRange) {
        this.walkCycle.status = (this.walkCycle.status === 'continue') ? 'returning' : 'continue';
      }
      break;

    case 'pace-y':
      going = direction[UI.getRandomInt(0, 1)];
      // TODO:
      // copy code from above and apply to y-axis
      stuck = !this.move(going);
      break;

    case 'circle':
      // range^2 = x^2 + y^2?
      // calculate from relative to spawn?
      // y = Math.sqrt(Math.pow(range, 2)-Math.pow(x, 2))???
      // when do you move up? use range to find the peak?
      // find x or y and create algorithm
      stuck = !this.move(going);
      break;
    }

    if (stuck) {
      this.walkCycle.stuckCount += 1;
      if (this.walkCycle.stuckCount > 2) {
        // return to original state
        this.walkCycle.status = 'returning';
        this.walkCycle.stuckCount = 0;
      }
    }

    return direction[going];
  }

  /**
   * Determine distance from this entity to a specified position.
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   * @return {number} distance
   */
  distanceTo(x, y) {
    return MapUtils.distance(this.x, this.y, x, y);
  }

  /**
   * Determine the direction from this entity to a specified position.
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   * @return {string} direction
   */
  directionTo(x, y) {
    return MapUtils.direction(this.x, this.y, x, y);
  }
}
