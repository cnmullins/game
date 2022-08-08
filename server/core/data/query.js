import { general, wearableItems, smithing } from '@server/core/data/items';
import npcs from '@server/core/data/npcs';
import monsters from '@server/core/data/monsters';
import { foregroundObjects } from '@server/core/data/foreground';

import Smithing from '@server/core/skills/smithing';

class Query {
  /**
   * Obtains the full information of a foreground object by its ID
   *
   * @param {integer} id The ID of the foreground item
   * @returns {object}
   */
  static getForegroundData(id) {
    return foregroundObjects
      .map((t) => {
        t.context = 'action';
        return t;
      })
      .find(item => item.id === id);
  }

  /**
   * Obtain the full information of an item by its ID on the server-side
   *
   * @param {integer} id The ID of the item
   * @returns {object}
   */
  static getItemData(id) {
    const allItems = [...wearableItems, ...general, ...smithing];
    return allItems
      .map((t) => {
        t.context = 'item';
        return t;
      })
      .find(item => item.id === id);
  }

  /**
   * Obtain full information of a skill abilities for a given ID.
   *
   * @param {string} skill Skill name
   * @returns {object} Skill data
   */
  static getItemSkillData(skill, id) {
    switch (skill.toLowerCase()) {
    case 'smithing':
      const { barType, item } = id.split('-');
      if (item === 'bar') {
        return Smithing.ores().find(i => i === id);
      }
      const items = Smithing.getItemsToSmith(barType);
      return items.find(i => i.id === id);

    case 'mining':
    case 'fishing':
    case 'woodcutting':
    default:
      console.log(`${skill} has not been defined as a skill.`);
      break;
    }

    return [];
  }

  /**
   * Obtain full information of an actor for a given ID.
   *
   * @param {number} id id of entity
   * @param {string} name name of entity
   * @return {object} actor data
   */
  static getActorData(id, name) {
    const foundActor = [...npcs, ...monsters].find((actor) => {
      if (actor.id === id && actor.name === name) {
        return actor;
      }
      return null;
    });
    // console.log('id:', id);
    // console.log('name:', name);
    // console.log('testing:', foundActor);

    return foundActor;
  }
}

export default Query;
