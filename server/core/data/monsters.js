module.exports = [
  {
    id: 1,
    name: 'Goblin',
    examine: 'An ugly, green humanoid creature.',
    hp: 10,
    hostile: false,
    combat: {
      attack: {
        stab: 0,
        slash: 1,
        crush: 1,
        range: 0,
      },
      defense: {
        stab: 0,
        slash: 1,
        crush: 2,
        range: 0,
      },
    },
    graphics: {
      tileset: 'monsters',
      row: 0,
      column: 0,
    },
    actions: [
      'talk',
      'examine',
      'attack',
    ],
    spawn: {
      x: 29,
      y: 70,
      range: 4,
    },
  },
  {
    id: 2,
    name: 'Giant Red Spider',
    examine: 'Hopefully it\'s not poisonous!',
    hp: 5,
    graphics: {
      tileset: 'monsters',
      row: 0,
      column: 1,
    },
    actions: [
      'examine',
      'attack',
    ],
    spawn: {
      x: 0,
      y: 0,
      range: 2,
    },
  },
  {
    id: 3,
    name: 'Large Eagle',
    examine: 'The most patriotic of eagles..',
    hp: 5,
    graphics: {
      tileset: 'monsters',
      row: 0,
      column: 2,
    },
    actions: [
      'examine',
      'attack',
    ],
    spawn: {
      x: 16,
      y: 111,
      range: 7,
    },
  },
]; // 18 monsters total on tilesheet
