// game.js for Perlenspiel 3.3.x
// Perlenblocks game
// 

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict";

const PB_GAME = {};

PS.init = function(system, options) {
    // Set grid basics
    PS.statusText("Perlenblocks");
	PS.gridSize(PB_GAME.CONSTANTS.GRID_SIZE, PB_GAME.CONSTANTS.GRID_SIZE);
    PS.gridColor(PB_GAME.CONSTANTS.GRID_BG_COLOR);
    
    // Setup grid border
	PS.border(PS.ALL, PS.ALL, 0);
    PB_GAME.UTIL.fillRegionBorder(
        [0, 0], [PB_GAME.CONSTANTS.GRID_SIZE, PB_GAME.CONSTANTS.GRID_SIZE],
        PB_GAME.CONSTANTS.GRID_BORDER_SIZE, PB_GAME.CONSTANTS.GRID_BORDER_COLOR
    );

    // Start game
    PB_GAME.HANDLER.start();
};


PS.keyDown = function(key, shift, ctrl, options) {
    if (PB_GAME.CONSTANTS.ROTATE_KEYS.some(k => k == key)) {
        PB_GAME.HANDLER.tryRotatePlayer();
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
};


PS.keyUp = function( key, shift, ctrl, options ) {
    
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


var GAME = {
	// Constants


	// Variables

	// Functions

	// FIREWORK.getBackgroundColor()
    // Gets default color at the cell
    // getBackgroundColor : function ( x, y ) {
    //     if (y == FIREWORK.GRID_HEIGHT - 1 && (x >= FIREWORK.GRASS_COLUMN_PADDING &&
    //         x < FIREWORK.GRID_WIDTH - FIREWORK.GRASS_COLUMN_PADDING)
    //     ) {
    //         // Grass cell
    //         return FIREWORK.GRASS_COLOR;
    //     }
    //     // Background cell
    //     return FIREWORK.BG_COLOR;
    // },
}