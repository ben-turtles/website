// handler.js
// Handler functions for Perlenblocks game
// Ben Reinherz 2026

PB_GAME.HANDLER = {};

let currentLevelIndex = 0;
let currentLevelState = null;


// Player

// Gets list of all cells in the provided level state which should block the player
PB_GAME.HANDLER.getPlayerBlockerCells = function(levelState) {
    let blockerCells = [];
    if (levelState.walls != null) {
        blockerCells = blockerCells.concat(levelState.walls);
    }
    if (levelState.pickups != null) {
        blockerCells = blockerCells.concat(levelState.pickups);
    }
    return blockerCells;
}

// Runs the handler with level state, and then updates level state. Doesn't run if no level state.
// If handler returns true, the level state won't be updated.
PB_GAME.HANDLER.tryWithLevelStateUpdate = function(handler) {
    if (currentLevelState == null) {
        return;
    }
    const noUpdate = handler(currentLevelState);
    if (!noUpdate) {

        // Move to next level if overlapping goal
        if (PB_GAME.UTIL.ACTOR.doActorsOverlap(currentLevelState.player, currentLevelState.goal)) {
            PB_GAME.HANDLER.completeLevel();
        }
        // Else, update state
        else {
            PB_GAME.HANDLER.updateLevelState();
        }
    }
}

// Tries to move the player the offset. Can fail if wall is in the way
PB_GAME.HANDLER.tryMovePlayer = function(offset) {
    PB_GAME.HANDLER.tryWithLevelStateUpdate(levelState => {
        // Get new pivot we'd be at
        let newPivot = PB_GAME.UTIL.ACTOR.getOffsetMove(levelState.player, offset);

        // Check if move is valid
        const [isValid] = PB_GAME.UTIL.getShapePivotValid(
            levelState.player.shape, newPivot,
            PB_GAME.HANDLER.getPlayerBlockerCells(levelState)
        );
        if (!isValid) {
            // Invalid move!
            return true;
        }

        // Move player, valid movement
        levelState.player.pivot = newPivot;
    });
}

// Tries to rotate the player. Can fail if wall is in the way
PB_GAME.HANDLER.tryRotatePlayer = function() {
    PB_GAME.HANDLER.tryWithLevelStateUpdate(levelState => {
        // Rotate, updating actor when valid
        let [newPlayer, isValid, blockingWalls] = PB_GAME.UTIL.ACTOR.getRotatedActor(
            levelState.player, PB_GAME.CONSTANTS.PLAYER_ROTATE_ANGLE,
            PB_GAME.HANDLER.getPlayerBlockerCells(levelState)
        );
        levelState.player = newPlayer;
        if (isValid) {
            PS.audioPlay("fx_rip");
        }
        else {
            PS.audioPlay("fx_bloop");
        }
    });
}

// Tries to connect the player to nearby pickups. Can fail if none are near
PB_GAME.HANDLER.tryConnectPlayer = function() {
    PB_GAME.HANDLER.tryWithLevelStateUpdate(levelState => {
        if (levelState.pickups == null) {
            // None to pickup
            return true;
        }
        let adjacentPickups = [];
        let newPickups = [];
        const playerCells = PB_GAME.UTIL.ACTOR.getActorCells(levelState.player);
        levelState.pickups.forEach(pickup => {
            if (playerCells.some(playerCell => PB_GAME.UTIL.arePivotsAdjacent(pickup, playerCell))) {
                // At least one player cell is adjacent to this pivot. Connect!
                adjacentPickups.push(pickup);
            }
            else {
                // Else, keep as pickup
                newPickups.push(pickup);
            }
        });
        if (adjacentPickups.length == 0) {
            // No pickups
            return true;
        }
        levelState.pickups = newPickups;
        adjacentPickups.forEach(pickup => {
            const offset = PB_GAME.UTIL.getOffset(levelState.player.pivot, pickup);
            levelState.player.shape.offsets.push(offset);
        });
        PB_GAME.HANDLER.flashPlayer(PB_GAME.CONSTANTS.PLAYER_CONNECT_SHINE_COLOR, PB_GAME.CONSTANTS.PLAYER_CONNECT_SHINE_RATE);
        PS.audioPlay("fx_squink");
    });
}

// Clears level screen, erasing all actors and borders
PB_GAME.HANDLER.clearLevelScreen = function() {
    // Clear level
    PS.color(PS.ALL, PS.ALL, PB_GAME.CONSTANTS.LEVEL_BG_COLOR);
    PS.glyph(PS.ALL, PS.ALL, 0);
    
    // Refresh grid border
	PS.border(PS.ALL, PS.ALL, 0);
    PB_GAME.UTIL.fillRegionBorder(
        [0, 0], [PB_GAME.CONSTANTS.GRID_SIZE, PB_GAME.CONSTANTS.GRID_SIZE],
        PB_GAME.CONSTANTS.WALL_SIZE, PB_GAME.CONSTANTS.WALL_COLOR
    );
}

// Flashes player a certain color temporarily. If rate supplied, divides how much time should take by default
PB_GAME.HANDLER.flashPlayer = function(flashColor, rate) {
    if (currentLevelState == null) {
        return;
    }
    let player = currentLevelState.player;
    const useRate = rate != null ? rate : 1;
    const colorMethod = (startColor, finalColor, alpha) => {
        const color = PB_GAME.UTIL.lerpColor(startColor, finalColor, alpha);
        if (currentLevelState != null) {
            player = currentLevelState.player;
        }
        if (player != null) {

        }
        PB_GAME.UTIL.ACTOR.fillActor(player, color);
        PB_GAME.UTIL.ACTOR.fillActorBorder(player, PB_GAME.CONSTANTS.GOAL_BORDER_SIZE, color);
    }
    PB_GAME.UTIL.tweenMethod(
        PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_IN_TIME / useRate,
        (alpha) => {
            colorMethod(PB_GAME.CONSTANTS.PLAYER_COLOR, flashColor, alpha);
        },
        () => {
            PB_GAME.UTIL.delay(PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_OUT_DELAY, () => {
                PB_GAME.UTIL.tweenMethod(
                    PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_OUT_TIME / useRate,
                    (alpha) => {
                        colorMethod(flashColor, PB_GAME.CONSTANTS.PLAYER_COLOR, alpha);
                    }
                );
            });
        }
    )
    
}


// Levels

// Returns true if the level cannot be won in its current position
PB_GAME.HANDLER.getLevelStateImpossible = function(levelState) {
    if (levelState.pickups == null || levelState.pickups.length > 0) {
        // No pickups possible, shouldn't be impossible
        return false;
    }
    if (levelState.impossible) {
        // Already determined as impossible
        return true;
    }
    // Check if player could overlap with the could
    let isImpossible = !PB_GAME.UTIL.canShapesOverlap(levelState.player.shape, levelState.goal.shape);
    levelState.impossible = isImpossible;
    return isImpossible;
}

// Updates and draws current level state
PB_GAME.HANDLER.updateLevelState = function() {
    const levelState = currentLevelState;
    if (levelState == null) {
        return;
    }

    // Clear level
    PB_GAME.HANDLER.clearLevelScreen();

    // Change status
    if (PB_GAME.HANDLER.getLevelStateImpossible(levelState)) {
        // Level state impossible, display restart hot key
        PS.statusText(PB_GAME.CONSTANTS.LEVEL_RESTART_STATUS_TEXT);
    }
    else {
        // Set name of level
        const name = currentLevelState.name;
        PS.statusText(`Level ${currentLevelIndex + 1}${name != null ? " | " + name : ""}`);
    }
    
    // Draw player + goal
    const playerColor = PB_GAME.CONSTANTS.PLAYER_COLOR;
    PB_GAME.UTIL.ACTOR.fillActor(levelState.player, playerColor);
    PS.glyph(levelState.player.pivot[0], levelState.player.pivot[1], PB_GAME.CONSTANTS.PLAYER_PIVOT_GLYPH);
    PB_GAME.UTIL.ACTOR.fillActorBorder(levelState.goal, PB_GAME.CONSTANTS.GOAL_BORDER_SIZE, playerColor);

    // Draw walls
    if (currentLevelState.walls != null) {
        currentLevelState.walls.forEach(wall => {
            PS.color(wall[0], wall[1], PB_GAME.CONSTANTS.WALL_COLOR);
        });
    }

    // Draw pickups
    if (currentLevelState.pickups != null) {
        currentLevelState.pickups.forEach(pickup => {
            PS.color(pickup[0], pickup[1], playerColor);
        });
    }
    // PS.debug(levelState.player.shape.offsets);
    // PS.debug(PB_GAME.UTIL.ACTOR.getActorCells(levelState.player) + "\n");
}

// Loads victory screen
PB_GAME.HANDLER.loadVictoryScreen = function() {
    currentLevelState = null;
    PS.audioPlay("fx_tada");

    // Clear level
    PB_GAME.HANDLER.clearLevelScreen();
    PS.statusText("");

    PS.glyph(3, 5, 'T');
    PS.glyph(4, 5, 'H');
    PS.glyph(5, 5, 'E');
    PS.glyph(8, 5, 'E');
    PS.glyph(9, 5, 'N');
    PS.glyph(10, 5, 'D');

    PS.glyph(3, 8, 'F');
    PS.glyph(4, 8, 'O');
    PS.glyph(5, 8, 'R');
    PS.glyph(8, 8, 'N');
    PS.glyph(9, 8, 'O');
    PS.glyph(10, 8, 'W');
}

// Completes current level.
PB_GAME.HANDLER.completeLevel = function() {
    if (currentLevelState == null) {
        return;
    }
    PS.audioPlay("fx_powerup8");

    // Update final level state
    PB_GAME.HANDLER.updateLevelState();

    // Move to next level after delay
    PB_GAME.UTIL.delay(PB_GAME.CONSTANTS.NEXT_LEVEL_LOAD_DELAY, () => {
        currentLevelIndex++;
        if (currentLevelIndex >= PB_GAME.LEVELS.length) {
            // Beat last level, victory!
            PB_GAME.HANDLER.loadVictoryScreen();
        }
        else {
            // Load next level
            PB_GAME.HANDLER.loadLevel(currentLevelIndex);
        }
    })

    // Shiny player flash on completion
    PB_GAME.HANDLER.flashPlayer(PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_COLOR);

    // Clear level state to disable inputs
    currentLevelState = null;
}

// Loads level of the index. Returns if loaded
PB_GAME.HANDLER.loadLevel = function(levelIndex) {
    if (levelIndex < 0) {
        // Trying to go to negative levels...
        return false
    }
    else if (levelIndex >= PB_GAME.LEVELS.length) {
        // Beat last level, victory!
        PB_GAME.HANDLER.loadVictoryScreen();
        return false;
    }
    const level = PB_GAME.LEVELS[levelIndex];

    // Set level state
    let levelState = {
        name: level.name,
        player: {
            pivot: level.player.pivot,
            shape: {
                offsets: level.player.shape.offsets.slice()
            },
        },
        goal: {
            pivot: level.goal.pivot,
            shape: level.goal.shape
        },
        walls: level.walls,
        pickups: level.pickups,
    }
    currentLevelIndex = levelIndex;
    currentLevelState = levelState;

    // Draw level state
    PB_GAME.HANDLER.updateLevelState();
    PS.audioPlay("fx_silencer");
    return true;
}

// Resets current level to original state
PB_GAME.HANDLER.resetLevel = function() {
    if (currentLevelState != null) {
        PB_GAME.HANDLER.loadLevel(currentLevelIndex);
    }
}

// Starts game handling
PB_GAME.HANDLER.start = function() {

    // Load and lock audio
	PS.audioLoad("fx_silencer", {lock: true});
	PS.audioLoad("fx_bloop", {lock: true});
	PS.audioLoad("fx_rip", {lock: true});
	PS.audioLoad("fx_squink", {lock: true});
	PS.audioLoad("fx_powerup8", {lock: true});
	PS.audioLoad("fx_tada", {lock: true});

    // Load starting level
    PB_GAME.HANDLER.loadLevel(
        PB_GAME.CONSTANTS.START_AT_LAST ? PB_GAME.LEVELS.length - 1 :
        PB_GAME.CONSTANTS.STARTING_LEVEL
    );
}