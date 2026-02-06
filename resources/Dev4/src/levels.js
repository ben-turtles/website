// levels.js
// All levels in Perlenblocks
// Ben Reinherz 2025

PB_GAME.LEVELS = [];

// Level 1
PB_GAME.LEVELS.push({
    player: {
        pivot: [3, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [10, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
});

// Level 2
PB_GAME.LEVELS.push({
    name: "R - Rotate",
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
        pivot: [10, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [3, 7],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
    walls: [
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 5],
        [7, 6],
        [7, 7],
        [7, 8],
        [7, 9],
        [7, 12],
        [7, 13],
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
        pivot: [12, 10],
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

        [9, 7],
        [9, 8],
        [9, 9],
        [9, 11],
        [9, 12],
        [9, 13],
    ]
});

// Level 7
PB_GAME.LEVELS.push({
    name: "Space - Connect",
    player: {
        pivot: [3, 5],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [9, 9],
        shape: PB_GAME.SHAPES.MIDDLE_RIGHT_T_BLOCK
    },
    pickups: [
        [10, 5]
    ]
});

// Level 8
PB_GAME.LEVELS.push({
    player: {
        pivot: [3, 5],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [8, 8],
        shape: PB_GAME.SHAPES.HORIZONTAL_S_BLOCK
    },
    pickups: [
        [9, 3],
        [4, 10],
    ]
});

// Level 9
PB_GAME.LEVELS.push({
    // name: "",
    player: {
        pivot: [10, 7],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [12, 9],
        shape: {
            offsets: [
                [0, -2],
                [0, -1],
                [0, 1],
                [0, 2],
                [0, 3],
            ]
        }
    },
    walls: [
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [7, 6],
        [7, 8],
        [7, 9],
        [7, 10],
        [7, 11],
        [7, 12],
        [7, 13],

        [7, 4],
        [8, 4],
        [9, 4],
        [11, 4],
        [12, 4],
        [13, 4],
    ],
    pickups: [
        [2, 3],
        [4, 11],
        [12, 1],
    ]
});

// Level 10
PB_GAME.LEVELS.push({
    player: {
        pivot: [3, 5],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [4, 2],
        shape: {
            offsets: [
                [-2, 0],
                [-2, -1],
                [-1, 0],
                [1, 0],
                [1, -1],
            ]
        }
    },
    walls: [
        [8, 0],
        [8, 1],
        [8, 3],
        [8, 4],
        [9, 4],
        [10, 4],
        [11, 4],
        [12, 4],
        [13, 4],

        [0, 9],
        [1, 9],
        [4, 9],
        [5, 9],
        [6, 9],
        [6, 10],
        [6, 11],
        [6, 12],
        [6, 13],

        [7, 9],
        [8, 9],
        [9, 9],
        [10, 9],
        [12, 5],
        [10, 10],
        [10, 11],
        [10, 12],
        [10, 13],
        [11, 13],
        [12, 13],
        [13, 13],
        // [9, 8],
        // [13, 9],
    ],
    pickups: [
        [11, 2],
        [2, 11],
        [12, 8],
    ]
});

// Level 11
PB_GAME.LEVELS.push({
    player: {
        pivot: [11, 2],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [3, 2],
        shape: {
            offsets: [
                [-2, 0],
                [-2, -1],
                [-1, 0],
                [1, 0],
                [2, 0],
            ]
        }
    },
    walls: [
        [5, 0],
        [5, 1],
        [5, 3],
        [5, 4],
        [5, 5],
        [2, 5],
        [3, 5],
        [4, 5],

        [0, 10],
        [1, 10],
        [2, 10],
        [3, 10],
        [4, 10],
        [5, 10],

        [8, 8],
        [8, 9],
        [8, 10],
        [8, 12],
        [8, 13],
        [9, 8],
        [9, 7],
        [10, 8],
        [10, 7],
        [11, 8],
        [13, 8],
    ],
    pickups: [
        // [11, 2],
        // [3, 11],
        [8, 2],
        [8, 11],
        [12, 8],
    ]
});