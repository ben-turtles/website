// game.js for Perlenspiel 3.3.x
// Tennis game
// Ben Reinherz 2026

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict";

const TENNIS_GAME = {};

PS.init = function(system, options) {
    // Set grid basics
    PS.statusText("");
	PS.gridSize(TENNIS_GAME.CONSTANTS.GRID_WIDTH, TENNIS_GAME.CONSTANTS.GRID_HEIGHT);
    PS.gridColor(TENNIS_GAME.CONSTANTS.GRID_BG_COLOR);
    PS.border(PS.ALL, PS.ALL, 0);

    // Start game
    TENNIS_GAME.HANDLER.start();
};


PS.keyDown = function(key, shift, ctrl, options) {
    if (TENNIS_GAME.CONSTANTS.MOVE_UP_KEYS.some(k => k == key)) {
        TENNIS_GAME.HANDLER.flagPlayerMove(-1, true);
    }
    if (TENNIS_GAME.CONSTANTS.MOVE_DOWN_KEYS.some(k => k == key)) {
        TENNIS_GAME.HANDLER.flagPlayerMove(1, true);
    }
    if (TENNIS_GAME.CONSTANTS.CHARGE_KEYS.some(k => k == key)) {
        TENNIS_GAME.HANDLER.toggleRacketCharge(true);
    }
};


PS.keyUp = function(key, shift, ctrl, options) {
    if (TENNIS_GAME.CONSTANTS.MOVE_UP_KEYS.some(k => k == key)) {
        TENNIS_GAME.HANDLER.flagPlayerMove(-1, false);
    }
    if (TENNIS_GAME.CONSTANTS.MOVE_DOWN_KEYS.some(k => k == key)) {
        TENNIS_GAME.HANDLER.flagPlayerMove(1, false);
    }
    if (TENNIS_GAME.CONSTANTS.CHARGE_KEYS.some(k => k == key)) {
        TENNIS_GAME.HANDLER.toggleRacketCharge(false);
    }
};


PS.input = function(device, options) {
    const wheel = device.wheel;
    if (wheel) {
        const direction = wheel == PS.WHEEL_FORWARD ? -1 : 1;
        TENNIS_GAME.HANDLER.pullRacket(direction);
    }
};




PS.enter = function(x, y, data, options) {

};


PS.exit = function(x, y, data, options) {
    
};


PS.exitGrid = function(options) {
    
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