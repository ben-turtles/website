// levels.js
// All levels in Perlenblocks
// Ben Reinherz 2025

PB_GAME.LEVELS = [];

// Level 1
PB_GAME.LEVELS.push({
    name: "Welcome",
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
    name: "Turning",
    controls: "R - Rotate",
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
    name: "Turning, Again",
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
    name: "Diversion",
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
    name: "Hole In The Wall",
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
    name: "The Squeeze",
    player: {
        pivot: [1, 8],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [12, 6],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    walls: [
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 3],
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
    name: "Dungeon I",
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

// Level 8
PB_GAME.LEVELS.push({
    controls: "Space - Connect",
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

// Level 9
PB_GAME.LEVELS.push({
    name: "Zig-Zagging",
    showRestartControls: true,
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

// Level 10
PB_GAME.LEVELS.push({
    name: "Breakout",
    showRestartControls: true,
    player: {
        pivot: [8, 8],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [5, 5],
        shape: {
            offsets: [
                [0, 1],
                [0, 2],
                [0, 3],
                [1, 0],
                [2, 0],
                [3, 0],
            ]
        }
    },
    walls: [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 1],
        [3, 1],
        [12, 1],
        [11, 1],
        [10, 1],
        [12, 2],
        [12, 3],
        [1, 12],
        [1, 11],
        [1, 10],
        [2, 12],
        [3, 12],
        [12, 12],
        [11, 12],
        [10, 12],
        [12, 11],
        [12, 10],
    ],
    pickups: [
        [11, 11],
        [2, 11],
        [11, 2],
        [2, 2],
    ]
});

// Level 11
PB_GAME.LEVELS.push({
    name: "Tetris..?",
    showRestartControls: true,
    player: {
        pivot: [4, 4],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [4, 7],
        shape: {
            offsets: [
                [0, 1],
                [0, 2],
                [0, 3],
                [1, 0],
                [-1, 0],
            ]
        }
    },
    walls: [
        [9, 0],
        [9, 1],
        [9, 2],
        [9, 3],
        [9, 5],
        [9, 6],
        [9, 7],
        [9, 8],
        [9, 9],
        [9, 10],
        [9, 11],
        [9, 12],
        [9, 13],
    ],
    pickups: [
        [12, 4],
        [6, 1],
        [1, 12],
    ]
});

// Level 12
PB_GAME.LEVELS.push({
    name: "Dungeon II",
    showRestartControls: true,
    player: {
        pivot: [11, 9],
        shape: PB_GAME.SHAPES.VERTICAL_RECTANGLE
    },
    goal: {
        pivot: [3, 6],
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
        [7, 7],
        [7, 8],
        [7, 10],
        [7, 11],
        [7, 12],
        [7, 13],

        [7, 5],
        [8, 5],
        [9, 5],
        [10, 5],
        [12, 5],
        [13, 5],
    ],
    pickups: [
        [2, 1],
        [4, 12],
        [9, 2],
    ]
});

// Level 13
PB_GAME.LEVELS.push({
    name: "Depth Perception",
    showRestartControls: true,
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
        [12, 0],
        [12, 1],
        [8, 2],
        [8, 4],
        [9, 4],
        [10, 4],
        [11, 4],
        [12, 4],
        [13, 4],

        [9, 2],
        [10, 2],
        [11, 2],
        [12, 2],
        [12, 3],
        // [9, 3],
        // [10, 3],
        // [11, 3],
        // [12, 3],
        // [13, 3],

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
        [11, 3],
        [2, 11],
        [12, 8],
    ]
});

// Level 14
PB_GAME.LEVELS.push({
    name: "The Hook",
    showRestartControls: true,
    player: {
        pivot: [9, 7],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
    goal: {
        pivot: [5, 11],
        shape: {
            offsets: [
                [-3, -1],
                [-3, 0],
                [-2, 0],
                [-1, 0],
                [1, 0],
                [2, 0],
            ]
        }
    },
    walls: [
        [5, 0],
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],

        [6, 0],
        [7, 0],
        [8, 0],
        [8, 1],
        [8, 2],

        [7, 2],
        [7, 3],
        [7, 4],
    ],
    pickups: [
        [11, 3],
        [5, 8],
        [2, 2],
        [7, 1],
    ]
});

// Level 15
PB_GAME.LEVELS.push({
    name: "Ant Farm",
    showRestartControls: true,
    player: {
        pivot: [8, 5],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
    goal: {
        pivot: [8, 11],
        shape: {
            offsets: [
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0],
                [5, 0],
            ]
        }
    },
    walls: [
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 6],
        [7, 7],
        [7, 8],
        [7, 9],
        [7, 10],
        [7, 12],
        [7, 13],

        [10, 4],
        [11, 4],
        [12, 4],
        [13, 4],
        [10, 6],
        [11, 6],
        [12, 6],
        [13, 6],

        [9, 0],
        [9, 1],
        [9, 2],
        [9, 3],
        [9, 4],
        [9, 6],
        [9, 7],
        [9, 8],
        [9, 9],
        [9, 10],
        [9, 12],
        [9, 13],

        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 6],
        [1, 7],
        [1, 8],
        [1, 9],
        [1, 10],
        [1, 12],
        [1, 13],

        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
        [3, 6],
        [3, 7],
        [3, 8],
        [3, 9],
        [3, 10],
        [3, 12],
        [3, 13],

        [0, 4],
        [4, 4],
        [5, 4],
        [6, 4],
        [0, 6],
        [4, 6],
        [5, 6],
        [6, 6],
        [0, 10],
        [4, 10],
        [5, 10],
        [6, 10],
        [0, 12],
        [4, 12],
        [5, 12],
        [6, 12],

        [10, 10],
        [11, 10],
        [12, 10],
        [13, 10],
        [10, 12],
        [11, 12],
        [12, 12],
        [13, 12],
    ],
    pickups: [
        [2, 0],
        [0, 11],
        [8, 13],
    ]
});

// Level 16
PB_GAME.LEVELS.push({
    name: "Order of Operations",
    showRestartControls: true,
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

// Level 17
PB_GAME.LEVELS.push({
    name: "Reformation",
    showRestartControls: true,
    player: {
        pivot: [10, 7],
        shape: PB_GAME.SHAPES.SMALL_SQUARE
    },
    goal: {
        pivot: [10, 7],
        shape: PB_GAME.SHAPES.HORIZONTAL_RECTANGLE
    },
    walls: [
        [0, 5],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
        [5, 5],
        [5, 2],
        [6, 5],
        [6, 4],
        [6, 3],
        [6, 2],
        [8, 5],
        [8, 4],
        [8, 3],
        [8, 2],
        [8, 1],
        [8, 0],
        
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],

        [9, 5],
        [10, 5],
        [11, 5],
        [12, 5],
        [13, 5],


        [0, 9],
        [1, 9],
        [3, 9],
        [4, 9],
        [5, 9],
        [6, 9],
        [7, 9],
        [8, 9],
        [9, 9],
        [10, 9],
        [11, 9],
        [12, 9],
        [13, 9],

        [1, 10],
        [1, 11],
        [0, 11],
        [0, 13],
        [1, 13],
        [3, 13],
        [3, 11],
        [3, 10],
        [4, 11],
        [5, 11],
        [6, 11],
        [7, 11],
        [8, 11],
        [9, 11],
        [10, 11],
        [11, 11],
        [12, 11],
        [13, 11],
        [4, 13],
        [5, 13],
        [6, 13],
        [7, 13],
        [8, 13],
        [9, 13],
        [10, 13],
        [11, 13],
        [12, 13],
        [13, 13],
    ],
    pickups: [
        [2, 1],
        [7, 12],
    ]
});

// TODO IF ROTATE when only 1x1 don't play rotate sfx
// Level 18
PB_GAME.LEVELS.push({
    name: "Ribcage",
    showRestartControls: true,
    player: {
        pivot: [10, 5],
        shape: {
            offsets: [
                [0, -3],
                [0, -2],
                [0, -1],
                [0, 1],
                [0, 2],
                [0, 3],
            ]
        }
    },
    goal: {
        pivot: [5, 10],
        shape: {
            offsets: [
                [-4, 0],
                [-3, 0],
                [-2, 0],
                [-1, 0],
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0],
                [-2, -1],
                [0, 1],
                [2, -1],
            ]
        }
    },
    walls: [
        [13, 1],
        [0, 5],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
        [0, 3],
        [1, 3],
        [8, 0],
        [12, 12],
        [13, 12],
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
    ],
    pickups: [
        [13, 0],
        [0, 4],
        [0, 6],
        [7, 0],
        [11, 12],
        // [2, 1],
        // [7, 12],
    ]
});

// 19: Fission
// 20: The Spiral