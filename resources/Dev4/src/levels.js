// levels.js
// All levels in Perlenblocks
// Ben Reinherz 2025

PB_GAME.LEVELS = [];

// Level 1
PB_GAME.LEVELS[0] = {
    player: {
        pivot: [4, 6],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [8, 6],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
};