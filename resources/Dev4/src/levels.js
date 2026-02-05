// levels.js
// All levels in Perlenblocks
// Ben Reinherz 2025

PB_GAME.LEVELS = [];

// Level 1
PB_GAME.LEVELS.push({
    name: "WASD to Move",
    player: {
        pivot: [3, 5],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [8, 5],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
});

// Level 2
PB_GAME.LEVELS.push({
    name: "R to Rotate",
    player: {
        pivot: [3, 5],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [8, 5],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
});

// Level 3
PB_GAME.LEVELS.push({
    // name: "",
    player: {
        pivot: [3, 3],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [8, 8],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
});