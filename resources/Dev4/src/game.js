// game.js for Perlenspiel 3.3.x
// Perlenblocks game
// 

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict";

const PB_GAME = {};
PB_GAME.lastDownMap = new Map();

PS.init = function(system, options) {
    // Set grid basics
    PS.statusText("Perlenblocks");
	PS.gridSize(PB_GAME.CONSTANTS.GRID_SIZE, PB_GAME.CONSTANTS.GRID_SIZE);
    PS.gridColor(PB_GAME.CONSTANTS.GRID_BG_COLOR);

    // Start game
    PB_GAME.HANDLER.start();
};


PS.keyDown = function(key, shift, ctrl, options) {
    const time = options.time;
    const lastTime = PB_GAME.lastDownMap.get(key);
    if (lastTime != null && (time - lastTime) < PB_GAME.CONSTANTS.MIN_TIME_GAP) {
        // This key was down too recently, skip input
        return;
    }
    // Track time this key was down for key cooldowns
    PB_GAME.lastDownMap.set(key, time);

    if (PB_GAME.CONSTANTS.ROTATE_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.toggleRotatePreview(true);
    }
    else if (PB_GAME.CONSTANTS.MOVE_UP_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.tryMovePlayer([0, -1]);
    }
    else if (PB_GAME.CONSTANTS.MOVE_DOWN_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.tryMovePlayer([0, 1]);
    }
    else if (PB_GAME.CONSTANTS.MOVE_LEFT_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.tryMovePlayer([-1, 0]);
    }
    else if (PB_GAME.CONSTANTS.MOVE_RIGHT_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.tryMovePlayer([1, 0]);
    }
    else if (PB_GAME.CONSTANTS.CONNECT_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.tryConnectPlayer();
    }
    else if (PB_GAME.CONSTANTS.RESET_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.resetLevel();
    }
};


PS.keyUp = function( key, shift, ctrl, options ) {
    // On release, remove key cooldown
    PB_GAME.lastDownMap.delete(key);

    if (PB_GAME.CONSTANTS.ROTATE_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.toggleRotatePreview(false);
        PB_GAME.HANDLER.tryRotatePlayer();
    }
    
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