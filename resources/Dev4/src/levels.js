// levels.js
// All levels in Perlenblocks
// Ben Reinherz 2025

PB_GAME.LEVELS = [];

// Level 1
PB_GAME.LEVELS.push({
    name: "WASD to Move",
    player: {
        pivot: [3, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [9, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
});

// Level 2
PB_GAME.LEVELS.push({
    name: "R to Rotate",
    player: {
        pivot: [3, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [9, 7],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
});

// Level 3
PB_GAME.LEVELS.push({
    // name: "",
    player: {
        pivot: [3, 4],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [9, 9],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
});

// Level 4
PB_GAME.LEVELS.push({
    // name: "",
    player: {
        pivot: [3, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [10, 7],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
    walls: [
        [6, 7]
    ]
});

// Level 5
PB_GAME.LEVELS.push({
    // name: "",
    player: {
        pivot: [3, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [10, 7],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
    walls: [
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 5],
        [6, 6],
        [6, 7],
        [6, 8],
        [6, 9],
        [6, 12],
        [6, 13],
    ]
});

// Level 6
PB_GAME.LEVELS.push({
    // name: "",
    player: {
        pivot: [1, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [11, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    walls: [
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 5],
        [4, 6],
        [4, 7],
        [4, 8],
        [4, 9],
        [4, 10],
        [4, 11],
        [4, 12],
        [4, 13],

        [9, 0],
        [9, 1],
        [9, 2],
        [9, 3],
        [9, 4],
        [9, 5],
        [9, 6],
        [9, 7],
        [9, 8],
        [9, 10],
        [9, 11],
        [9, 12],
        [9, 13],
    ]
});

// Level 7
PB_GAME.LEVELS.push({
    // name: "",
    player: {
        pivot: [1, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [12, 9],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    walls: [
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 4],
        [4, 5],
        [4, 6],
        [4, 7],
        [4, 8],
        [4, 9],
        [4, 10],
        [4, 11],
        [4, 12],
        [4, 13],
        [5, 6],
        [6, 6],
        [8, 6],
        [9, 6],
        [10, 6],
        [11, 6],
        [12, 6],
        [13, 6],
        [10, 7],
        [10, 8],
        [10, 9],
        [10, 11],
        [10, 12],
        [10, 13],
    ]
});