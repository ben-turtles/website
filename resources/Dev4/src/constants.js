// constants.js
// Constants for Perlenblocks game
// Ben Reinherz 2025

PB_GAME.CONSTANTS = {};

// Grid constants
PB_GAME.CONSTANTS.GRID_SIZE = 12;
PB_GAME.CONSTANTS.GRID_BG_COLOR = 0xffffff;
PB_GAME.CONSTANTS.GRID_BORDER_COLOR = 0x000000;
PB_GAME.CONSTANTS.GRID_BORDER_SIZE = 2;

// Level + player constants
PB_GAME.CONSTANTS.LVL_BG_COLOR = 0xffffff;
PB_GAME.CONSTANTS.GOAL_BORDER_SIZE = 2;
PB_GAME.CONSTANTS.PLAYER_COLOR = 0xf59e42;
PB_GAME.CONSTANTS.PLAYER_PIVOT_GLYPH = 0x25CF;
PB_GAME.CONSTANTS.PLAYER_ROTATE_ANGLE = Math.PI / 2;
PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_IN_TIME = 0.22;
PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_OUT_DELAY = 0.12;
PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_OUT_TIME = 0.22;
PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_COLOR = 0xffee00;
PB_GAME.CONSTANTS.NEXT_LEVEL_LOAD_DELAY = 1.25;

// Input constants
PB_GAME.CONSTANTS.MOVE_UP_KEYS = [
    "W".codePointAt(0),
    "w".codePointAt(0),
    PS.KEY_ARROW_UP,
];
PB_GAME.CONSTANTS.MOVE_DOWN_KEYS = [
    "S".codePointAt(0),
    "s".codePointAt(0),
    PS.KEY_ARROW_DOWN,
]
PB_GAME.CONSTANTS.MOVE_LEFT_KEYS = [
    "A".codePointAt(0),
    "a".codePointAt(0),
    PS.KEY_ARROW_LEFT,
]
PB_GAME.CONSTANTS.MOVE_RIGHT_KEYS = [
    "D".codePointAt(0),
    "d".codePointAt(0),
    PS.KEY_ARROW_RIGHT,
]
PB_GAME.CONSTANTS.ROTATE_KEYS = [
    "R".codePointAt(0),
    "r".codePointAt(0),
]
PB_GAME.CONSTANTS.RESET_KEYS = [
    "P".codePointAt(0),
    "p".codePointAt(0),
]

// Shapes
PB_GAME.SHAPES = {};
PB_GAME.SHAPES.VERTICAL_RECTANGLE = {
    // 1x3 vertical rectangle
    offsets: [
        [0, -1],
        [0, 1],
    ]
};
PB_GAME.SHAPES.HORIZONTAL_RECTANGLE = {
    // 3x1 horizontal rectangle
    offsets: [
        [-1, 0],
        [1, 0],
    ]
};