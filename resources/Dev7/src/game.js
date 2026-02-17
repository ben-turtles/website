// game.js for Perlenspiel 3.3.x
// Perlenblocks game
// 

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict";

const FROG_GAME = {};
// FROG_GAME.lastDownMap = new Map();

function idk(image) {
    PS.imageDump(image)
}

PS.init = function(system, options) {
    // Set grid basics
    PS.statusText("");
	PS.gridSize(FROG_GAME.CONSTANTS.GRID_WIDTH, FROG_GAME.CONSTANTS.GRID_HEIGHT);
    PS.gridColor(FROG_GAME.CONSTANTS.GRID_BG_COLOR);
    PS.color(PS.ALL, PS.ALL, FROG_GAME.CONSTANTS.LEVEL_BG_COLOR);
    PS.border(PS.ALL, PS.ALL, 0);

    PS.keyRepeat(true, 0, 2);

    // Start game
    FROG_GAME.HANDLER.start();
};


PS.keyDown = function(key, shift, ctrl, options) {
    // const time = options.time;
    // const lastTime = FROG_GAME.lastDownMap.get(key);
    // if (lastTime != null && (time - lastTime) < FROG_GAME.CONSTANTS.MIN_TIME_GAP) {
    //     // This key was down too recently, skip input
    //     return;
    // }
    // // Track time this key was down for key cooldowns
    // FROG_GAME.lastDownMap.set(key, time);

    // if (FROG_GAME.CONSTANTS.ROTATE_KEYS.some(k => k == key)) {
    //     FROG_GAME.HANDLER.toggleRotatePreview(true);
    // }
    // else if (FROG_GAME.CONSTANTS.MOVE_UP_KEYS.some(k => k == key)) {
    //     FROG_GAME.HANDLER.tryMovePlayer([0, -1]);
    // }
    // else if (FROG_GAME.CONSTANTS.MOVE_DOWN_KEYS.some(k => k == key)) {
    //     FROG_GAME.HANDLER.tryMovePlayer([0, 1]);
    // }
    if (FROG_GAME.CONSTANTS.MOVE_LEFT_KEYS.some(k => k == key)) {
        FROG_GAME.HANDLER.moveFrog(-1);
    }
    if (FROG_GAME.CONSTANTS.MOVE_RIGHT_KEYS.some(k => k == key)) {
        FROG_GAME.HANDLER.moveFrog(1);
    }
    if (FROG_GAME.CONSTANTS.JUMP_KEYS.some(k => k == key)) {
        FROG_GAME.HANDLER.jumpFrog();
    }
    // else if (FROG_GAME.CONSTANTS.CONNECT_KEYS.some(k => k == key)) {
    //     FROG_GAME.HANDLER.tryConnectPlayer();
    // }
    // else if (FROG_GAME.CONSTANTS.RESET_KEYS.some(k => k == key)) {
    //     FROG_GAME.HANDLER.tryResetLevel();
    // }
};


PS.keyUp = function( key, shift, ctrl, options ) {
    // // On release, remove key cooldown
    // FROG_GAME.lastDownMap.delete(key);

    // if (FROG_GAME.CONSTANTS.ROTATE_KEYS.some(k => k == key)) {
    //     FROG_GAME.HANDLER.toggleRotatePreview(false);
    //     FROG_GAME.HANDLER.tryRotatePlayer();
    // }
};


PS.input = function( sensors, options ) {
    
};




PS.enter = function( x, y, data, options ) {

};


PS.exit = function( x, y, data, options ) {
    
};


PS.exitGrid = function( options ) {
    
};



// PS.touch = function(x, y, data, options) {
// 	// Uncomment the following code line
// 	// to inspect x/y parameters:

// 	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

// 	// Add code here for mouse clicks/touches
// 	// over a bead.
// };


// PS.release = function( x, y, data, options ) {
// 	// Uncomment the following code line to inspect x/y parameters:

// 	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

// 	// Add code here for when the mouse button/touch is released over a bead.
// };