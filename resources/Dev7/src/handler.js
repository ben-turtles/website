// handler.js
// Handler functions for Tennis game
// Ben Reinherz 2026

TENNIS_GAME.HANDLER = {};

TENNIS_GAME.points = 0;
TENNIS_GAME.tutorial = false;
TENNIS_GAME.readyDisplayTimer = 0;
TENNIS_GAME.marks = 0;

TENNIS_GAME.playerPosition = null;   // [x, y] pos
TENNIS_GAME.playerMoveFlags = null;
TENNIS_GAME.playerVelocity = 0;
TENNIS_GAME.racketAngle = 0;     // angle in radians
TENNIS_GAME.racketVelocity = 0;
TENNIS_GAME.racketCells = null;

TENNIS_GAME.balls = [];
TENNIS_GAME.ballSpawnTimer = 0;
// TENNIS_GAME.pointDisplays = [];


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

// Returns [points, pointAlpha] based on where ball is positioned on the edge.
// Points is how many points ball earns overall. Point alpha is a value [0, 1] representing proportion
// of maximum possible points earned from ball (1 = max points, 0 = min points).
TENNIS_GAME.HANDLER.calculateBallPoints = function(ball, edgePivot) {
    // Points depend on speed of ball, and where it went out on X direction
    const speedPoints = Math.min(
        TENNIS_GAME.CONSTANTS.POINTS_SPEED_MAX,
        TENNIS_GAME.CONSTANTS.POINTS_SPEED_MIN + (
            (TENNIS_GAME.CONSTANTS.POINTS_SPEED_COEFFICIENT * (ball.speed - TENNIS_GAME.CONSTANTS.RACKET_MIN_HIT_SPEED)) /
                TENNIS_GAME.CONSTANTS.BALL_FAST_DEFLECT_SPEED_FACTOR
        )
    );
    const [edgeX] = edgePivot;
    const outXPoints = TENNIS_GAME.UTIL.lerp(
        TENNIS_GAME.CONSTANTS.POINTS_OUT_X_MIN,
        TENNIS_GAME.CONSTANTS.POINTS_OUT_X_MAX,
        1 - (edgeX / TENNIS_GAME.CONSTANTS.GRID_WIDTH)
    );
    const points = TENNIS_GAME.UTIL.floorToMultiple(speedPoints + outXPoints, TENNIS_GAME.CONSTANTS.POINTS_MULTIPLE);
    return [points, 0];
}

// Handles ball being hit, adjusting effects for it. Can return pivot to move ball to new position.
TENNIS_GAME.HANDLER.handleBallHit = function(ball) {
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
        return [-1, -1];
    }
    else {
        ball.hitTimer++;
    }
}

// Handles ball behavior when going out of bounds. Edge pivot is the closest in-bounds pivot
// where ball went out of bounds.
TENNIS_GAME.HANDLER.handleBallOutOfBounds = function(ball, edgePivot) {
    if (ball.hit) {
        if (ball.speed == 0) {
            // Caught slow ball, don't count for points
            return;    
        }

        // Give points
        const [points, pointAlpha] = TENNIS_GAME.HANDLER.calculateBallPoints(ball, edgePivot);
        TENNIS_GAME.points += points
        // TENNIS_GAME.pointDisplays.push({
        //     points: points,
        //     pointAlpha: pointAlpha,
        // });

        // End tutorial if active
        if (TENNIS_GAME.tutorial) {
            TENNIS_GAME.tutorial = false;
            TENNIS_GAME.readyDisplayTimer = TENNIS_GAME.CONSTANTS.LEVEL_TUTORIAL_READY_TIMER;
            PS.audioPlay("fx_airhorn", {path: "./", fileTypes: ["wav"]});
        }
    }
    else if (!TENNIS_GAME.tutorial) {
        // Not hit, and not tutorial; mark player
        TENNIS_GAME.marks += 1;
        PS.audioPlay("fx_scratch");
        if (TENNIS_GAME.ballSpawnTimer == 0) {
            TENNIS_GAME.ballSpawnTimer = 1;
        }
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
                newPivot = ball.pivot;
                PS.audioPlay("fx_bucket");
            }
        }
        if (ball.hit) {
            // Ball has been hit, do some effects
            const setPivot = TENNIS_GAME.HANDLER.handleBallHit(ball);
            if (setPivot != null) {
                newPivot = setPivot;
            }
        }
        if (TENNIS_GAME.UTIL.isPivotOutOfBounds(newPivot)) {
            // Ball moved out of bounds
            const edgePivot = TENNIS_GAME.UTIL.getInBoundsFromPivot(newPivot);
            TENNIS_GAME.HANDLER.handleBallOutOfBounds(ball, edgePivot);
        }
        else {
            // Ball still in bounds, keep moving
            ball.pivot = newPivot;
            newBalls.push(ball);
        }
    });
    TENNIS_GAME.balls = newBalls;
}

// Gets current difficulty depending on how many points player has
TENNIS_GAME.HANDLER.getCurrentDifficulty = function() {
    const types = [TENNIS_GAME.CONSTANTS.BALL_TYPE_REGULAR];

    // Change speed based on difficulty
    var speed;
    if (TENNIS_GAME.points > 200000) {
        speed = 0.85;
    }
    else if (TENNIS_GAME.points > 150000) {
        speed = 0.8;
    }
    else if (TENNIS_GAME.points > 100000) {
        speed = 0.75;
    }
    else if (TENNIS_GAME.points > 75000) {
        speed = 0.6;
    }
    else if (TENNIS_GAME.points > 50000) {
        speed = 0.5;
    }
    else if (TENNIS_GAME.points > 25000) {
        speed = 0.4;
    }
    else if (TENNIS_GAME.points > 10000) {
        speed = 0.3;
    }
    else {
        speed = 0.2;
    }
    return {
        speed: speed,
        maxBalls: 1,
        spawnDelay: 60,
        ballTypes: types
    }
}

// Spawns balls this frame depending on current difficulty
TENNIS_GAME.HANDLER.spawnBalls = function() {
    if (TENNIS_GAME.ballSpawnTimer > 0) {
        TENNIS_GAME.ballSpawnTimer--;
        return;
    }
    const ballCount = TENNIS_GAME.balls.length;
    const difficulty = TENNIS_GAME.HANDLER.getCurrentDifficulty();
    if (ballCount < difficulty.maxBalls) {
        // We don't have the maximum amount of balls spawned; spawn a new one.
        const spawnY = TENNIS_GAME.UTIL.randomOnRange(
            TENNIS_GAME.CONSTANTS.BALL_SPAWN_MIN_Y,
            TENNIS_GAME.CONSTANTS.BALL_SPAWN_MAX_Y
        )
        const speed = difficulty.speed;
        const ballType = TENNIS_GAME.UTIL.randomArrayElement(difficulty.ballTypes);
        const ballDirection = TENNIS_GAME.UTIL.randomArrayElement(ballType.directions);
        const speedFactor = ballType.speedFactor;
        TENNIS_GAME.balls.push({
            speed: speed * (speedFactor != null ? speedFactor : 1),
            direction: ballDirection,
            pivot: [0, spawnY],
            color: ballType.color,
        });
        TENNIS_GAME.ballSpawnTimer = difficulty.spawnDelay;
        // PS.audioPlay("fx_swoosh");
    }
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
        if (distance > TENNIS_GAME.CONSTANTS.RACKET_GAP_DISTANCE + TENNIS_GAME.CONSTANTS.RACKET_LENGTH + 1) {
            return;
        }

        // Check if ball's angle is betweens angles we moved between
        const angle = TENNIS_GAME.UTIL.getAngleBetweenPivots(offset, racketStartOffset);
        const margin = TENNIS_GAME.CONSTANTS.RACKET_ANGLE_MARGIN;
        const min = Math.min(angleStart, angleEnd);
        const inRange = min - margin <= angle && Math.max(angleStart, angleEnd) >= angle;
        if (inRange) {
            ball.hit = true;
            if (racketSpeed >= TENNIS_GAME.CONSTANTS.RACKET_MIN_HIT_SPEED) {
                // If racket was fast enough, adjust trajectory
                const offsetAngle =  Math.sign(angle - angleStart) *
                    -Math.abs(TENNIS_GAME.CONSTANTS.BALL_FAST_DEFLECT_ANGLE);
                const direction = TENNIS_GAME.UTIL.normalizePivot(
                    TENNIS_GAME.UTIL.rotatePivot(offset, offsetAngle)
                );
                ball.speed += racketSpeed * TENNIS_GAME.CONSTANTS.BALL_FAST_DEFLECT_SPEED_FACTOR;
                ball.direction = direction;
                PS.audioPlay("fx_blast2");
            }
            else {
                // Stop ball if slow
                ball.speed = 0;
                PS.audioPlay("fx_bucket");
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

// Draws background
TENNIS_GAME.HANDLER.drawBackground = function() {
    PS.glyph(PS.ALL, PS.ALL, 0);
    TENNIS_GAME.UTIL.fillBackground(
        TENNIS_GAME.CONSTANTS.GRID_WIDTH, TENNIS_GAME.CONSTANTS.GRID_HEIGHT,
        TENNIS_GAME.CONSTANTS.LEVEL_BACKGROUND, TENNIS_GAME.CONSTANTS.COURT_COLOR
    );
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

// Draws marks, indicating how many times user got marked for missing balls
TENNIS_GAME.HANDLER.drawMarks = function() {
    for (let mark = 0; mark < TENNIS_GAME.CONSTANTS.MARK_COUNT; mark++) {
        const markPivot = TENNIS_GAME.CONSTANTS.MARK_PIVOTS[mark];
        TENNIS_GAME.UTIL.fillPivot(markPivot, TENNIS_GAME.CONSTANTS.MARK_COLOR);
        if (mark < TENNIS_GAME.marks) {
            TENNIS_GAME.UTIL.fillGlyph(markPivot, TENNIS_GAME.CONSTANTS.MARK_GLYPH, TENNIS_GAME.CONSTANTS.MARK_GLYPH_COLOR);
        }
    }
}

// Draws UI, including health and status bar.
TENNIS_GAME.HANDLER.drawUI = function() {

    // Update status
    if (TENNIS_GAME.tutorial) {
        // Display tutorial starting status
        PS.statusText(TENNIS_GAME.CONSTANTS.LEVEL_TUTORIAL_STATUS);
        PS.statusColor(TENNIS_GAME.CONSTANTS.LEVEL_TUTORIAL_STATUS_COLOR);
    }
    else {
        if (TENNIS_GAME.readyDisplayTimer > 0) {
            // Display ready status now that tutorial is over
            TENNIS_GAME.readyDisplayTimer--;
            PS.statusText(TENNIS_GAME.CONSTANTS.LEVEL_TUTORIAL_READY);
            PS.statusColor(TENNIS_GAME.CONSTANTS.LEVEL_TUTORIAL_READY_COLOR);
        }
        else {
            // Display points
            PS.statusText(`Points: ${TENNIS_GAME.points}`);
            PS.statusColor(TENNIS_GAME.CONSTANTS.LEVEL_STATUS_COLOR);
        }
    }

    // Update mark display
    TENNIS_GAME.HANDLER.drawMarks();
}

// Draws state every game start
TENNIS_GAME.HANDLER.draw = function() {
    TENNIS_GAME.HANDLER.drawBackground();
    TENNIS_GAME.HANDLER.drawPlayer();
    TENNIS_GAME.HANDLER.drawBalls();
    TENNIS_GAME.HANDLER.drawUI();
}

// Called every game step
TENNIS_GAME.HANDLER.update = function() {
    if (TENNIS_GAME.marks < 0) {
        // Game over state, no update
        return;
    }
    else if (TENNIS_GAME.marks >= TENNIS_GAME.CONSTANTS.MARK_COUNT) {
        // Now in game over, draw final state
        TENNIS_GAME.HANDLER.draw();
        PS.statusText(`GAME OVER! You got ${TENNIS_GAME.points} points!`);
        PS.statusColor(TENNIS_GAME.CONSTANTS.LEVEL_GAME_OVER_COLOR);
        PS.audioPlay("fx_wilhelm");
        TENNIS_GAME.marks = -1;
        return;
    }

    // Update player
    TENNIS_GAME.HANDLER.updatePlayerPosition();
    TENNIS_GAME.HANDLER.updateRacketPosition();

    // Update balls
    TENNIS_GAME.HANDLER.updateBalls();
    TENNIS_GAME.HANDLER.spawnBalls();

    // Draw screen
    TENNIS_GAME.HANDLER.draw();
}

// Starts game handling
TENNIS_GAME.HANDLER.start = function() {
    
    // Load and lock audio
	PS.audioLoad("fx_blast2", {lock: true});
	PS.audioLoad("fx_bucket", {lock: true});
	PS.audioLoad("fx_scratch", {lock: true});
	PS.audioLoad("fx_swoosh", {lock: true});
	PS.audioLoad("fx_wilhelm", {lock: true});
	PS.audioLoad("fx_airhorn", {lock: true, path: "./", fileTypes: ["wav"]});
    /*
    TODO STUFF
    - cover.png (use apple tennis racket emoji?)
    */
    
    // Set defaults
    TENNIS_GAME.balls = [];
    TENNIS_GAME.marks = 0;
    TENNIS_GAME.points = 0;
    TENNIS_GAME.tutorial = true;
    TENNIS_GAME.racketAngle = TENNIS_GAME.CONSTANTS.RACKET_ANGLE_INIT;
    TENNIS_GAME.playerMoveFlags = new Set();
    TENNIS_GAME.playerPosition = [TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_X, TENNIS_GAME.CONSTANTS.PLAYER_SPAWN_Y];
    
    // Start game loop
    TENNIS_GAME.UTIL.onStep(TENNIS_GAME.HANDLER.update);
}