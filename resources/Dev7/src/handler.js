// handler.js
// Handler functions for Perlenblocks game
// Ben Reinherz 2025

FROG_GAME.HANDLER = {};

FROG_GAME.frogPosition = null;
FROG_GAME.frogSprite = null;
FROG_GAME.frogVelocityY = 0;
FROG_GAME.isFrogJumping = false;


FROG_GAME.HANDLER.updateFrogPosition = function() {
    // PS.color(PS.ALL, PS.ALL, FROG_GAME.CONSTANTS.LEVEL_BG_COLOR);
    PS.spriteMove(FROG_GAME.frogSprite, FROG_GAME.frogPosition[0], FROG_GAME.frogPosition[1]);
    // PS.color(FROG_GAME.frogPosition[0], FROG_GAME.frogPosition[1], 0xff0000);
}

FROG_GAME.HANDLER.spawnFrog = function() {
    FROG_GAME.frogPosition = FROG_GAME.CONSTANTS.FROG_SPAWN;
    const groundY = FROG_GAME.CONSTANTS.LEVEL_GROUND_Y
    FROG_GAME.UTIL.onStep(() => {
        var [x, y] = FROG_GAME.frogPosition;
        if (y < groundY) {
            FROG_GAME.frogVelocityY = Math.min(FROG_GAME.frogVelocityY + FROG_GAME.CONSTANTS.FROG_GRAVITY, FROG_GAME.CONSTANTS.FROG_MAX_Y_VEL);
            FROG_GAME.isFrogJumping = false;
        }
        else if (FROG_GAME.isFrogJumping) {
    FROG_GAME.frogVelocityY += FROG_GAME.CONSTANTS.FROG_JUMP_VEL;
        }
        if (FROG_GAME.frogVelocityY > 0) {
            
        PS.debug(y + ", " + FROG_GAME.frogVelocityY + "\n");
        }
        y = Math.min(y + FROG_GAME.frogVelocityY, groundY);
        if (y == groundY) {
            FROG_GAME.frogVelocityY = 0;
        }
        FROG_GAME.frogPosition = [x, y];
        FROG_GAME.HANDLER.updateFrogPosition();
    })
}

FROG_GAME.HANDLER.moveFrog = function(direction) {
    var [newX, y] = FROG_GAME.UTIL.addOffset(FROG_GAME.frogPosition, [direction, 0]);
    newX = FROG_GAME.UTIL.clamp(newX, 0, FROG_GAME.CONSTANTS.GRID_WIDTH - FROG_GAME.CONSTANTS.FROG_WIDTH);
    FROG_GAME.frogPosition = [newX, y];
}
FROG_GAME.HANDLER.jumpFrog = function() {
    FROG_GAME.isFrogJumping = true;
}

// Starts game handling
FROG_GAME.HANDLER.start = function() {

    // Load and lock audio
	// PS.audioLoad("fx_silencer", {lock: true});
	// PS.audioLoad("fx_bloop", {lock: true});
	// PS.audioLoad("fx_rip", {lock: true});
	// PS.audioLoad("fx_squink", {lock: true});
	// PS.audioLoad("fx_powerup8", {lock: true});
	// PS.audioLoad("fx_tada", {lock: true});
    
    FROG_GAME.frogSprite = PS.spriteImage(FROG_GAME.CONSTANTS.FROG_SPRITE);
    PS.debug(FROG_GAME.frogSprite);
    

    // Load starting level
    FROG_GAME.HANDLER.spawnFrog();
    // PB_GAME.HANDLER.loadLevel(
    //     PB_GAME.CONSTANTS.START_AT_LAST ? PB_GAME.LEVELS.length - 1 :
    //     PB_GAME.CONSTANTS.STARTING_LEVEL
    // );
}