// handler.js
// Handler functions for Tennis game
// Ben Reinherz 2026

TENNIS_GAME.HANDLER = {};

TENNIS_GAME.playerPosition = [TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_X, TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_Y];   // [x, y] pos
TENNIS_GAME.playerMoveFlags = new Set();
TENNIS_GAME.playerVelocity = 0;
TENNIS_GAME.racketAngle = 0;     // angle in radians
TENNIS_GAME.racketVelocity = 0;


// Pulls the racket in the direction (> 0 pulls down, < 0 pulls up) 
TENNIS_GAME.HANDLER.pullRacket = function(direction) {
    TENNIS_GAME.racketVelocity += direction * TENNIS_GAME.CONSTANTS.RACKET_VELOCITY;
}

// Sets a flag for whether movement in the specified direction should be on
TENNIS_GAME.HANDLER.flagPlayerMove = function(direction, flag) {
    if (flag) {
        TENNIS_GAME.playerMoveFlags.add(direction);
    }
    else {
        TENNIS_GAME.playerMoveFlags.delete(direction);
    }
}

// Draws player and their racket at current position
TENNIS_GAME.HANDLER.drawPlayer = function() {
    TENNIS_GAME.UTIL.drawSprite(TENNIS_GAME.playerPosition, TENNIS_GAME.CONSTANTS.PLAYER_SPRITE);
    TENNIS_GAME.racketCells.forEach(cell => {
        TENNIS_GAME.UTIL.fillPivot(cell, TENNIS_GAME.CONSTANTS.RACKET_COLOR);
    })
}

// Updates player position based on current move flags
TENNIS_GAME.HANDLER.updatePlayerPosition = function() {
    var dir = 0;
    TENNIS_GAME.playerMoveFlags.forEach((value) => {
        dir += value;
    });
    const lastDir = Math.sign(TENNIS_GAME.playerVelocity);
    TENNIS_GAME.playerVelocity = TENNIS_GAME.UTIL.toward(
        TENNIS_GAME.playerVelocity, TENNIS_GAME.CONSTANTS.PLAYER_VELOCITY * dir,
        lastDir != 0 && lastDir != dir ? TENNIS_GAME.CONSTANTS.PLAYER_ACCELERATION :
            TENNIS_GAME.CONSTANTS.PLAYER_ACCELERATION_TURNAROUND
    );
    const newPlayerY = TENNIS_GAME.playerPosition[1] + TENNIS_GAME.playerVelocity;
    const clampedPlayerY = TENNIS_GAME.UTIL.clamp(
        newPlayerY, TENNIS_GAME.CONSTANTS.PLAYER_MIN_Y, TENNIS_GAME.CONSTANTS.PLAYER_MAX_Y
    );
    if (clampedPlayerY != newPlayerY) {
        TENNIS_GAME.playerVelocity = 0;
    }
    TENNIS_GAME.playerPosition[1] = clampedPlayerY;
}

// Updates racket position based on current velocity + angle
TENNIS_GAME.HANDLER.updateRacketPosition = function() {
    // Apply racket velocity this frame
    TENNIS_GAME.racketVelocity = TENNIS_GAME.UTIL.toward(
        TENNIS_GAME.racketVelocity, 0, TENNIS_GAME.CONSTANTS.RACKET_DECELERATION
    );
    const newAngle = TENNIS_GAME.racketAngle + TENNIS_GAME.racketVelocity;
    const clampedAngle = TENNIS_GAME.UTIL.clamp(
        newAngle, TENNIS_GAME.CONSTANTS.RACKET_ANGLE_MIN, TENNIS_GAME.CONSTANTS.RACKET_ANGLE_MAX
    );
    if (clampedAngle != newAngle) {
        TENNIS_GAME.racketVelocity = 0;
    }
    TENNIS_GAME.racketAngle = clampedAngle;

    // Calculate racket cells to be displayed + check for collisions
    const [playerX, playerY] = TENNIS_GAME.playerPosition;
    const [racketOffsetX, racketOffsetY] = TENNIS_GAME.CONSTANTS.RACKET_PIVOT_OFFSET;
    const racketPivot = [playerX + racketOffsetX, playerY + racketOffsetY];
    const racketVector = TENNIS_GAME.CONSTANTS.RACKET_VECTOR;
    TENNIS_GAME.racketCells = [];
    for (let offset = 0; offset < TENNIS_GAME.CONSTANTS.RACKET_LENGTH; offset++) {
        const cellOffset = TENNIS_GAME.UTIL.rotatePivot(
            TENNIS_GAME.UTIL.scalePivot(racketVector, TENNIS_GAME.CONSTANTS.RACKET_GAP_DISTANCE + offset),
            TENNIS_GAME.CONSTANTS.RACKET_ANGLE_FACTOR * TENNIS_GAME.racketAngle
        );
        const cell = TENNIS_GAME.UTIL.addOffset(racketPivot, cellOffset);
        TENNIS_GAME.racketCells.push(cell);
    }
}

// Called every game step
TENNIS_GAME.HANDLER.update = function() {
    TENNIS_GAME.HANDLER.updatePlayerPosition();
    TENNIS_GAME.HANDLER.updateRacketPosition();

    // Draw screen
    PS.color(PS.ALL, PS.ALL, TENNIS_GAME.CONSTANTS.LEVEL_BG_COLOR);
    TENNIS_GAME.HANDLER.drawPlayer();
}

// Starts game handling
TENNIS_GAME.HANDLER.start = function() {
    // FROG_GAME.UTIL.onStep(() => {
    //     var [x, y] = FROG_GAME.frogPosition;
    //     if (y < groundY) {
    //         FROG_GAME.frogVelocityY = Math.min(FROG_GAME.frogVelocityY + FROG_GAME.CONSTANTS.FROG_GRAVITY, FROG_GAME.CONSTANTS.FROG_MAX_Y_VEL);
    //         FROG_GAME.isFrogJumping = false;
    //     }
    //     else if (FROG_GAME.isFrogJumping) {
    // FROG_GAME.frogVelocityY += FROG_GAME.CONSTANTS.FROG_JUMP_VEL;
    //     }
    //     if (FROG_GAME.frogVelocityY > 0) {
            
    //     PS.debug(y + ", " + FROG_GAME.frogVelocityY + "\n");
    //     }
    //     y = Math.min(y + FROG_GAME.frogVelocityY, groundY);
    //     if (y == groundY) {
    //         FROG_GAME.frogVelocityY = 0;
    //     }
    //     FROG_GAME.frogPosition = [x, y];
    //     FROG_GAME.HANDLER.updateFrogPosition();

    // Load and lock audio
	// PS.audioLoad("fx_silencer", {lock: true});
	// PS.audioLoad("fx_bloop", {lock: true});
	// PS.audioLoad("fx_rip", {lock: true});
	// PS.audioLoad("fx_squink", {lock: true});
	// PS.audioLoad("fx_powerup8", {lock: true});
	// PS.audioLoad("fx_tada", {lock: true});
    
    // TENNIS_GAME.frogSprite = PS.spriteImage(TENNIS_GAME.CONSTANTS.FROG_SPRITE);
    // PS.debug(TENNIS_GAME.frogSprite);

    
    // Set defaults
    TENNIS_GAME.racketAngle = TENNIS_GAME.CONSTANTS.RACKET_ANGLE_INIT;
    TENNIS_GAME.playerPosition = [TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_X, TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_Y];
    
    // Start game loop
    TENNIS_GAME.UTIL.onStep(TENNIS_GAME.HANDLER.update);
}