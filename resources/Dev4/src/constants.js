// constants.js
// Constants for Perlenblocks game
// Ben Reinherz 2025

PB_GAME.CONSTANTS = {};

// Grid + level constants
PB_GAME.CONSTANTS.GRID_SIZE = 12;
PB_GAME.CONSTANTS.GRID_BG_COLOR = 0xffffff;
PB_GAME.CONSTANTS.GRID_BORDER_COLOR = 0x000000;
PB_GAME.CONSTANTS.GRID_BORDER_SIZE = 2;
PB_GAME.CONSTANTS.LVL_BG_COLOR = 0xffffff;
PB_GAME.CONSTANTS.LVL_BORDER_SIZE = 2;

// Input constants
PB_GAME.CONSTANTS.MOVE_UP_KEYS = [
    87, // W
    119, // w
    PS.KEY_ARROW_UP,
];
PB_GAME.CONSTANTS.MOVE_DOWN_KEYS = [
    83, // S
    115, // s
    PS.KEY_ARROW_DOWN,
]
PB_GAME.CONSTANTS.MOVE_LEFT_KEYS = [
    65, // A
    97, // a
    PS.KEY_ARROW_LEFT,
]
PB_GAME.CONSTANTS.MOVE_RIGHT_KEYS = [
    68, // D
    100, // d
    PS.KEY_ARROW_RIGHT,
]
PB_GAME.CONSTANTS.ROTATE_KEYS = [
    82, // R
    114, // r
]

// Player constants
PB_GAME.CONSTANTS.PLAYER_COLOR = 0xf59e42

// Shapes
PB_GAME.SHAPES = {};
PB_GAME.SHAPES.VERTICAL_RECTANGLE = {
    // 3x1 vertical rectangle
    offsets: [
        [0, -1],
        [0, 1]
    ]
};