import world from '@server/core/world';
import npcs from '@server/core/data/npcs';
import emoji from 'node-emoji';
import Actor from './index';

/*
Define NPCs class
  How often do we want NPCs roaming?
  How will we define the class as whole?
  Interaction duties defined how?

*/

export default class NPC extends Actor {
  /*
  constructor(data) {
    super(data);

    //this.dialogue = data.dialogue;
  }
  */
  static load(context) {
    npcs.forEach((npc) => {
      world.npcs.push(new NPC(npc));
    }, context);
    console.log(`${emoji.get('walking')}  Loading NPCs...`);
  }
  /*
  //TODO
  publicChat(message) {
    // create text
  }

  speakWith(player) {
    // TODO:
    // create new component on the game canvas for speaking
  }
  */
}
