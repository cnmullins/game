import UI from 'shared/ui';
import world from '@server/core/world';

class MapUtils {
  /**
   * Calculate whether the grid is walkable through various methods
   *
   * @param {array} tiles The tiles we are marking
   * @param {object} player The player for which we are working with
   * @param {integer} onTile On what tile did wil lthey walk from
   * @param {integer} row On what row are they on?
   * @param {integer} column On what column are they on?
   * @return {integer}
   */
  static gridWalkable(tiles, player, onTile, row = 0, column = 0) {
    // What's going on here? FG & BG collision
    let walkableTile = 0;

    // Get walkable status of both foreground and background tiles
    const walkable = {
      fg: UI.tileWalkable(tiles.foreground, 'foreground'),
      bg: UI.tileWalkable(tiles.background),
    };

    // Is the foreground not walkable?
    if (!walkable.fg) {
      walkableTile = 1; // Nope
    }

    // Is the foreground AND background walkable?
    if (walkable.fg && walkable.bg) {
      walkableTile = 0; // Yep.
    }

    // Is the foreground NOT walkable BUT the background is?
    if (!walkable.fg && walkable.bg) {
      walkableTile = 1;
    }

    // Is the foreground walkable BUT the background is not?
    if (walkable.fg && !walkable.bg) {
      // Is there no foreground tile?
      if ((world.map.foreground[onTile] - 1) === -1) {
        walkableTile = 1;
      } else {
        // If there is, then it is (because the BG is not walkable).
        walkableTile = 0;
      }
    }

    // If the action requires us to be on the "edge" of a tile
    // (eg: resource gathering, action tile, door push, etc.)
    // then let us temporarily make it 'walkable' so the pathfinding does its job
    // and then we will simply snip of the last step of the path so we are right next ot it.
    if (player.action && player.action.nearby === 'edge' && player.action.coordinates.x === row && player.action.coordinates.y === column) {
      walkableTile = 0;
    }

    return walkableTile;
  }

  /**
   * Returns the distance between two point values on the map.
   *
   * @param {number} x1 coordinate point 1 along the x axis
   * @param {number} y1 coordinate point 1 along the y axis
   * @param {number} x2 coordinate point 2 along the x axis
   * @param {number} y2 coordinate point 2 along the y axis
   * @return {number} distance
   */
  static distance(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
  }

  /**
   * Return the direction from point 1 to point 2.
   *
   * @param {number} x1 coordinate point 1 along the x axis
   * @param {number} y1 coordinate point 1 along the y axis
   * @param {number} x2 coordinate point 2 along the x axis
   * @param {number} y2 coordinate point 2 along the y axis
   * @return {string} 'up', 'down', 'left', 'down', else '' if equal.
   */
  static direction(x1, y1, x2, y2) {
    // const slope = (y2 - y1) / (x2 - x1);
    const xDif = x2 - x1;
    const yDif = y2 - y1;
    let dir = '';

    // What axis? Then what direction?
    if (Math.Abs(xDif) > Math.Abs(yDif)) {
      dir = (xDif > 0) ? 'left' : 'right';
    } else if (Math.Abs(xDif) < Math.Abs(yDif)) {
      dir = (yDif > 0) ? 'up' : 'down';
    }
    return dir;
  }
}

export default MapUtils;
