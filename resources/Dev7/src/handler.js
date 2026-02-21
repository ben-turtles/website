// handler.js
// Handler functions for Tennis game
// Ben Reinherz 2026

TENNIS_GAME.HANDLER = {};

TENNIS_GAME.playerPosition = null;   // [x, y] pos
TENNIS_GAME.playerMoveFlags = null;
TENNIS_GAME.playerVelocity = 0;
TENNIS_GAME.racketAngle = 0;     // angle in radians
TENNIS_GAME.racketVelocity = 0;
TENNIS_GAME.racketCells = null;

TENNIS_GAME.balls = [];


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

// Updates all ball positions
TENNIS_GAME.HANDLER.updateBalls = function() {
    let newBalls = [];
    TENNIS_GAME.balls.forEach(ball => {
        let newPivot = TENNIS_GAME.UTIL.addOffset(
            ball.pivot, TENNIS_GAME.UTIL.scalePivot(ball.direction, ball.speed)
        );
        if (TENNIS_GAME.racketVelocity == 0 && !ball.hit) {
            // Ball not hit, check for slow collision if racket is still
            const pivotFloored = TENNIS_GAME.UTIL.floorPivot(newPivot);
            const collided = TENNIS_GAME.racketCells.some(
                racketCell => TENNIS_GAME.UTIL.doPivotsOverlap(
                    TENNIS_GAME.UTIL.floorPivot(racketCell), pivotFloored
                )
            );
            if (collided) {
                ball.hit = true;
                ball.speed = 0;
            }
        }
        if (ball.hit) {
            // Ball has been hit, do some special effects
            const isSlow = ball.speed <= TENNIS_GAME.CONSTANTS.RACKET_MIN_HIT_SPEED;
            if (ball.hitTimer == null) {
                ball.hitStartColor =
                    isSlow ? TENNIS_GAME.CONSTANTS.BALL_SLOW_START_COLOR : ball.color;
                ball.hitEndColor =
                    isSlow ? TENNIS_GAME.CONSTANTS.BALL_SLOW_END_COLOR : TENNIS_GAME.UTIL.lerpColor(
                        ball.color, TENNIS_GAME.CONSTANTS.BALL_FAST_HIT_LERP_COLOR,
                        TENNIS_GAME.CONSTANTS.BALL_FAST_HIT_LERP_ALPHA
                    );
                ball.hitTimer = 0;
            }
            const alpha = ball.hitTimer / TENNIS_GAME.CONSTANTS.BALL_FADE_STEPS;
            if (alpha <= 1) {
                ball.color = TENNIS_GAME.UTIL.lerpColor(
                    ball.hitStartColor, ball.hitEndColor, alpha
                );
            }
            if (isSlow && alpha >= 1) {
                newPivot = [-1, -1];
            }
            else {
                ball.hitTimer++;
            }
        }
        if (TENNIS_GAME.UTIL.isPivotOutOfBounds(newPivot)) {
            // Ball moved out of bounds
        }
        else {
            // Ball still in bounds, keep moving
            ball.pivot = newPivot;
            newBalls.push(ball);
        }
    });
    TENNIS_GAME.balls = newBalls;
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

// Calculates racket cells which have collisions for the provided angle
TENNIS_GAME.HANDLER.calculateRacketCells = function(angle) {
    const racketPivot = TENNIS_GAME.UTIL.addOffset(TENNIS_GAME.playerPosition, TENNIS_GAME.CONSTANTS.RACKET_PIVOT_OFFSET);
    const racketVector = TENNIS_GAME.CONSTANTS.RACKET_VECTOR;
    let racketCells = [];
    for (let offset = 0; offset < TENNIS_GAME.CONSTANTS.RACKET_LENGTH; offset++) {
        const cellOffset = TENNIS_GAME.UTIL.rotatePivot(
            TENNIS_GAME.UTIL.scalePivot(racketVector, TENNIS_GAME.CONSTANTS.RACKET_GAP_DISTANCE + offset),
            TENNIS_GAME.CONSTANTS.RACKET_ANGLE_FACTOR * angle
        );
        const cell = TENNIS_GAME.UTIL.addOffset(racketPivot, cellOffset);
        racketCells.push(cell);
    }
    return racketCells;
}

// Handles hitting balls when moving between two racket angles with specified speed
TENNIS_GAME.HANDLER.handleRacketBallHits = function(racketSpeed, angleStart, angleEnd) {
    if (racketSpeed == 0) {
        // Cannot hit if no speed
        return;
    }
    const racketPivot = TENNIS_GAME.UTIL.floorPivot(
        TENNIS_GAME.UTIL.addOffset(TENNIS_GAME.playerPosition, TENNIS_GAME.CONSTANTS.RACKET_PIVOT_OFFSET)
    );
    const racketStartOffset = TENNIS_GAME.UTIL.scalePivot(
        TENNIS_GAME.CONSTANTS.RACKET_VECTOR, TENNIS_GAME.CONSTANTS.RACKET_GAP_DISTANCE
    );

    // For each ball, check if angle was hit
    TENNIS_GAME.balls.forEach(ball => {
        if (ball.hit) {
            // Already hit
            return;
        }

        const pivotFloored = TENNIS_GAME.UTIL.floorPivot(ball.pivot);
        const offset = TENNIS_GAME.UTIL.getOffset(racketPivot, pivotFloored);

        // Check if ball is in range of racket 
        const distance = TENNIS_GAME.UTIL.getPivotLength(offset);
        if (distance > TENNIS_GAME.CONSTANTS.RACKET_GAP_DISTANCE + TENNIS_GAME.CONSTANTS.RACKET_LENGTH) {
            return;
        }

        // Check if ball's angle is betweens angles we moved between
        const angle = TENNIS_GAME.UTIL.getAngleBetweenPivots(offset, racketStartOffset);
        const inRange = Math.min(angleStart, angleEnd) <= angle && Math.max(angleStart, angleEnd) >= angle;
        if (inRange) {
            ball.hit = true;

            if (racketSpeed >= TENNIS_GAME.CONSTANTS.RACKET_MIN_HIT_SPEED) {
                // If racket was fast enough, adjust trajectory
                const offsetAngle = Math.sign(angle - angleStart) * -Math.abs(TENNIS_GAME.CONSTANTS.BALL_FAST_DEFLECT_ANGLE);
                const direction = TENNIS_GAME.UTIL.normalizePivot(
                    TENNIS_GAME.UTIL.rotatePivot(offset, offsetAngle)
                );
                ball.speed = racketSpeed * TENNIS_GAME.CONSTANTS.BALL_FAST_DEFLECT_SPEED_FACTOR;
                ball.direction = direction;
            }
            else {
                // Stop ball if slow
                ball.speed = 0;
            }
        }
    })
}

// Updates racket position based on current velocity + angle
TENNIS_GAME.HANDLER.updateRacketPosition = function() {
    // Apply racket velocity to angle
    TENNIS_GAME.racketVelocity = TENNIS_GAME.UTIL.toward(
        TENNIS_GAME.racketVelocity, 0, TENNIS_GAME.CONSTANTS.RACKET_DECELERATION
    );
    const newAngle = TENNIS_GAME.racketAngle + TENNIS_GAME.racketVelocity;
    const clampedAngle = TENNIS_GAME.UTIL.clamp(
        newAngle, TENNIS_GAME.CONSTANTS.RACKET_ANGLE_MIN, TENNIS_GAME.CONSTANTS.RACKET_ANGLE_MAX
    );

    // With this racket movement, check if we hit any balls
    const racketSpeed = Math.abs(TENNIS_GAME.racketVelocity);
    TENNIS_GAME.HANDLER.handleRacketBallHits(
        racketSpeed, TENNIS_GAME.racketAngle, newAngle
    );
    if (clampedAngle != newAngle) {
        TENNIS_GAME.racketVelocity = 0;
    }

    // Update active angle
    TENNIS_GAME.racketAngle = clampedAngle;
    
    // Update racket cells for soft collisions and drawing
    TENNIS_GAME.racketCells = TENNIS_GAME.HANDLER.calculateRacketCells(TENNIS_GAME.racketAngle);
}

// Draws all balls
TENNIS_GAME.HANDLER.drawBalls = function() {
    TENNIS_GAME.balls.forEach(ball => {
        TENNIS_GAME.UTIL.fillPivot(ball.pivot, ball.color);
    });
}

// Draws player and their racket at current position
TENNIS_GAME.HANDLER.drawPlayer = function() {
    TENNIS_GAME.UTIL.drawSprite(TENNIS_GAME.playerPosition, TENNIS_GAME.CONSTANTS.PLAYER_SPRITE);
    TENNIS_GAME.racketCells.forEach(cell => {
        TENNIS_GAME.UTIL.fillPivot(cell, TENNIS_GAME.CONSTANTS.RACKET_COLOR);
    })
}

// Draws state every game start
TENNIS_GAME.HANDLER.draw = function() {
    TENNIS_GAME.HANDLER.drawPlayer();
    TENNIS_GAME.HANDLER.drawBalls();
}

// Called every game step
TENNIS_GAME.HANDLER.update = function() {

    // Update player
    TENNIS_GAME.HANDLER.updatePlayerPosition();
    TENNIS_GAME.HANDLER.updateRacketPosition();

    // Update balls
    TENNIS_GAME.HANDLER.updateBalls();

    // Draw screen
    PS.color(PS.ALL, PS.ALL, TENNIS_GAME.CONSTANTS.LEVEL_BG_COLOR);
    TENNIS_GAME.HANDLER.draw();
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

    TENNIS_GAME.balls = [
        {
            speed: 0.15,
            direction: [1, 0],
            pivot: [0, 16],
            color: 0x00ff00,
        },
        // {
        //     speed: 0,
        //     direction: [1, 0],
        //     pivot: [26, 8],
        //     color: 0x00ff00,
        // },
    ]

    // TODO:
    // - When ball goes off screen:
    //    if hit, give points
    //    if not hit, lose 1 heart

    
    // Set defaults
    TENNIS_GAME.playerMoveFlags = new Set();
    TENNIS_GAME.racketAngle = TENNIS_GAME.CONSTANTS.RACKET_ANGLE_INIT;
    TENNIS_GAME.playerPosition = [TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_X, TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_Y];
    
    // Start game loop
    TENNIS_GAME.UTIL.onStep(TENNIS_GAME.HANDLER.update);
}