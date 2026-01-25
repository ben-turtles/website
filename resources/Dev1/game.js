/*

Perlenspiel 3.3
Firework Toy by Ben Reinherz - IMGD 2900 Dev 1
Click on a cell to spawn a firework which shoots up and explodes.

A lot of code is based off the Simple Rain Toy by Brian Moriarty:
https://ps3.perlenspiel.net/examples.html
https://ps3.perlenspiel.net/examples/rain/game.html

*/

/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!


// All constants related to firework toy to prevent name clashing.
var FIREWORK = {

	// Constants
	GRID_WIDTH: 32, // width of grid
	GRID_HEIGHT: 32, // height of grid
	EXPLODE_ROW: 6, // default row of grid where fireworks explode
    HIGHEST_CREATE_ROW: 12, // highest row where a firework can spawn at
	FRAME_RATE: 6,	// animation frame rate; 6/60ths = 10 fps
	BG_COLOR: 0x383761, // background color
	// DROP_COLOR: 0x4040FF, // raindrop color
    STATUS_TEXT: "Firework Toy",

    // Styles of all fireworks.
    // color: color of the firework.
    // speedRange: range of random speed, in format [min, max, decimalPlaces].
    // rowOffsetRange: range of random offset of exploding row, in format [min, max].
    // explodePatterns: a list of explosion patterns, which are a group of
    // [x, y] arrays defining positions relative to the center of the explosion to color.
    FIREWORK_STYLES: [
        {
            // Red
            color: 0xFF0000,
            speedRange: [ 1, 2, 0 ],
            rowOffsetRange: [ -2, 2 ],
            explodePatterns: [
                {
                    color: 0xFF0000,
                    offsets: [
                        [-1, -1], [1, -1], [1, 1], [-1, 1]
                    ]
                },
                {
                    color: 0xFF0000,
                    offsets: [
                        [-1, -1], [1, -1], [1, 1], [-1, 1]
                    ]
                },
                {
                    color: 0xFFA600,
                    offsets: [
                        [-2, -1], [-1, -2], [1, -2], [2, -1],
                        [2, 1], [1, 2], [-1, 2], [-2, 1]
                    ]
                },
                {
                    color: 0xFFFF00,
                    offsets: [
                        [-2, -1], [-1, -2], [1, -2], [2, -1],
                        [2, 1], [1, 2], [-1, 2], [-2, 1]
                    ]
                },
            ],
        },
        {
            // Yellow
            color: 0xFFFF00,
            speedRange: [ 1, 2, 0 ],
            rowOffsetRange: [ -2, 2 ],
            explodePatterns: [
                {
                    color: 0xFF0000,
                    offsets: [
                        [-1, -1], [1, -1], [1, 1], [-1, 1]
                    ]
                },
            ]
        },
        {
            // Lime
            color: 0x00FF00,
            speedRange: [ 1, 2, 0 ],
            rowOffsetRange: [ -2, 2 ],
            explodePatterns: [
                {
                    color: 0xFF0000,
                    offsets: [
                        [-1, -1], [1, -1], [1, 1], [-1, 1]
                    ]
                },
            ]
        },
        {
            // Cyan
            color: 0x00FFFF,
            speedRange: [ 1, 1, 0 ],
            rowOffsetRange: [ 1, 3 ],
            explodePatterns: [
                {
                    color: 0xFF0000,
                    offsets: [
                        [-1, -1], [1, -1], [1, 1], [-1, 1]
                    ]
                },
            ]
        },
        {
            // Purple
            color: 0xA600FF,
            speedRange: [ 1, 2, 1 ],
            rowOffsetRange: [ -2, 0 ],
            explodePatterns: [
                {
                    color: 0xA600FF,
                    offsets: [
                        [-1, -1], [-1, 1], [1, 1], [1, -1]
                    ]
                },
                {
                    color: 0xA600FF,
                    offsets: [
                        [-1, -1], [-1, 1], [1, 1], [1, -1],
                        [-2, 0], [2, 0], [0, 2], [0, -2],
                    ]
                },
                {
                    color: 0x7300ff,
                    offsets: [
                        [-2, 0], [2, 0], [0, 2], [0, -2],
                    ]
                },
                {
                    color: 0x7300ff,
                    offsets: [
                        [-2, 0], [2, 0], [0, 2], [0, -2],
                        [-2, -2], [-2, 2], [2, 2], [2, -2],
                    ]
                },
                {
                    color: 0x4400ff,
                    offsets: [
                        [-2, -2], [-2, 2], [2, 2], [2, -2],
                    ]
                },
            ]
        },
        {
            // Magenta
            color: 0xFF00FF,
            speedRange: [ 1, 2, 1 ],
            rowOffsetRange: [ -2, 0 ],
            explodePatterns: [
                {
                    color: 0xFF00FF,
                    offsets: [
                        [-1, 0], [1, 0], [0, 1], [0, -1]
                    ]
                },
                {
                    color: 0xFF00FF,
                    offsets: []
                },
                {
                    color: 0xFF00FF,
                    offsets: [
                        [-2, 0], [2, 0], [0, 2], [0, -2],
                        [-1, -1], [1, -1], [1, 1], [-1, 1]
                    ]
                },
                {
                    color: 0xff00d4,
                    offsets: [
                        [-2, 0], [2, 0], [0, 2], [0, -2],
                    ]
                },
                {
                    color: 0xff478b,
                    offsets: [
                        [-3, 0], [3, 0], [0, 3], [0, -3],
                    ]
                },
            ]
        },
    ],

	// Variables
    fireworks: [],

	// Functions

	// FIREWORK.pickOnRandomRange()
    // Picks a random number within [min, max]. Decimal places specifies
    // how many decimal places the numbers can have (default 0 for integers)
    pickOnRandomRange : function ( min, max, decimalPlaces = 0 ) {
        const factor = Math.pow(10, decimalPlaces);
        return min + ((PS.random( ((max - min) * factor) + 1 ) - 1) / factor);
    },

	// FIREWORK.pickFireworkStyle()
    // Picks a random type of firework to use
	pickFireworkStyle : function ( ) {
        const random = PS.random(FIREWORK.FIREWORK_STYLES.length);
        return FIREWORK.FIREWORK_STYLES[random - 1];
	},

    // FIREWORK.colorExplosionOffsets()
    // Colors explosion offsets at (x, y) with the provided color
    colorExplosionOffsets : function ( x, y, offsets, color ) {
        offsets.forEach(offset => {
            const offsetX = x + offset[0];
            if (offsetX < 0 || offsetX >= FIREWORK.GRID_WIDTH - 1) {
                return;
            }
            const offsetY = y + offset[1];
            if (offsetY < 0 || offsetY >= FIREWORK.GRID_HEIGHT - 1) {
                return;
            }
            // PS.debug("GRID = [" + FIREWORK.GRID_WIDTH + ", " + FIREWORK.GRID_HEIGHT + "]");
            // PS.debug("x = " + offsetX + ", y=" + offsetY );
            PS.color( offsetX, offsetY, color );
        });
    },

	// FIREWORK.tick()
	// Called on every clock tick to animation fireworks
	tick : function () {
        let len = FIREWORK.fireworks.length;
        let i = 0;
        while (i < len) {
            const firework = FIREWORK.fireworks[i];
            let x = firework.x;
            let y = firework.y;
            PS.color( x, y, FIREWORK.BG_COLOR );
            const explodeRow = FIREWORK.EXPLODE_ROW + firework.rowOffset;

            if (y > explodeRow ) {
                // Not exploding yet, rise up
                y -= firework.speed;
                if (y > explodeRow) {
                    PS.color( x, y, firework.style.color );
                }
                firework.y = y;

                i += 1;
            }
            else if (!firework.exploding) {
                // Reached explode row, start to explode
                firework.exploding = true;
                firework.explodeTimer = 0;
            }

            if (firework.exploding) {
                // Do explode effect
                const explodePatterns = firework.style.explodePatterns;
                const explodePatternCount = explodePatterns.length;
                let explodeTimer = firework.explodeTimer;
                
                // Clear previous beads
                if (explodeTimer > 0) {
                    const lastPattern = explodePatterns[explodeTimer - 1];
                    FIREWORK.colorExplosionOffsets( x, y, lastPattern.offsets, FIREWORK.BG_COLOR );
                }

                // Update explosion pattern
                if (explodeTimer >= explodePatternCount) {
                    // No more explosion patterns left, remove this firework from the list
				    FIREWORK.fireworks.splice( i, 1 );
                    len -= 1;
                }
                else {
                    // Cycle to the next explosion pattern to display
                    const newPattern = explodePatterns[explodeTimer];
                    FIREWORK.colorExplosionOffsets( x, y, newPattern.offsets, newPattern.color );
                    explodeTimer += 1;
                    firework.explodeTimer = explodeTimer;
                    i += 1;
                }
            }
        }
	}
};

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

    // Change layout of grid and status
	PS.gridSize( FIREWORK.GRID_WIDTH, FIREWORK.GRID_HEIGHT );
	PS.statusColor( PS.COLOR_WHITE );
	PS.statusText( FIREWORK.STATUS_TEXT );

    // Change grid color and blend all cells with background
    PS.gridColor( FIREWORK.BG_COLOR );
	PS.color( PS.ALL, PS.ALL, FIREWORK.BG_COLOR );
	PS.border( PS.ALL, PS.ALL, 0 );
    
    // Start timer to animate fireworks
	PS.timerStart( FIREWORK.FRAME_RATE, FIREWORK.tick );


	// // Change background color

	// PS.gridColor( RAIN.BG_COLOR );

	// // Hide all bead borders

	// PS.border( PS.ALL, PS.ALL, 0 );

	// // Set all beads to background color

	// PS.color( PS.ALL, PS.ALL, RAIN.BG_COLOR );

	// // Add fader FX to bottom row only
	// // This makes the beads flash white when they "splash"

	// PS.fade( PS.ALL, RAIN.BOTTOM_ROW, 30, { rgb : PS.COLOR_WHITE } );

	// // Load and lock audio files

	// PS.audioLoad( "fx_drip1", { lock : true } );
	// PS.audioLoad( "fx_drip2", { lock : true } );

	// // Set color and text of title

	// PS.statusColor( PS.COLOR_WHITE );
	// PS.statusText( "Simple Rain Toy" );

	// // Start the animation timer

	// PS.timerStart( RAIN.FRAME_RATE, RAIN.tick );
    
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
    PS.debug(" x = " + x  + ", y=" + y + "\n");
    if (y >= FIREWORK.HIGHEST_CREATE_ROW) {
        // Spawn a firework at this bead
        
        // Pick a random firework style to use and add it
        let style = FIREWORK.pickFireworkStyle();
        const speedRange = style.speedRange;
        const speed = FIREWORK.pickOnRandomRange(speedRange[0], speedRange[1], speedRange[2]);
        const rowOffsetRange = style.rowOffsetRange;
        const rowOffset = FIREWORK.pickOnRandomRange(rowOffsetRange[0], rowOffsetRange[1]);
        PS.debug("New firework at x = " + x + ", y = " + y + ", speed = " + speed + ", rowOffset = " + rowOffset + "\n");
        FIREWORK.fireworks.push( {
            x: x,
            y: y,
            rowOffset: rowOffset,
            speed: speed,
            style: style,
        } );

		PS.color( x, y, style.color );
		// PS.audioPlay( "fx_drip1" );
    }
    else {
        // Too high up to spawn a firework
        
    }

	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

