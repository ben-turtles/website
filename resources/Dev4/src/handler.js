// handler.js
// Handler functions for Perlenblocks game
// Ben Reinherz 2025

PB_GAME.HANDLER = {};

let currentLevelIndex = 0;
let currentLevelState = null;

// Clears level screen, erasing all actors and borders
PB_GAME.HANDLER.clearLevelScreen = function() {
    // Clear level
    PS.color(PS.ALL, PS.ALL, PB_GAME.CONSTANTS.LVL_BG_COLOR);
    PS.glyph(PS.ALL, PS.ALL, 0);
    
    // Refresh grid border
	PS.border(PS.ALL, PS.ALL, 0);
    PB_GAME.UTIL.fillRegionBorder(
        [0, 0], [PB_GAME.CONSTANTS.GRID_SIZE, PB_GAME.CONSTANTS.GRID_SIZE],
        PB_GAME.CONSTANTS.GRID_BORDER_SIZE, PB_GAME.CONSTANTS.GRID_BORDER_COLOR
    );
}

// Updates and draws current level state
PB_GAME.HANDLER.updateLevelState = function() {
    const levelState = currentLevelState;
    if (levelState == null) {
        return;
    }

    // Clear level
    PB_GAME.HANDLER.clearLevelScreen();
    const name = currentLevelState.name;
    PS.statusText(`Level ${currentLevelIndex + 1}${(name == null ? "" : " - " + name)}`);
    
    // Draw player + goal
    PB_GAME.UTIL.ACTOR.fillActor(levelState.player, PB_GAME.CONSTANTS.PLAYER_COLOR);
    PS.glyph(levelState.player.pivot[0], levelState.player.pivot[1], PB_GAME.CONSTANTS.PLAYER_PIVOT_GLYPH);
    PB_GAME.UTIL.ACTOR.fillActorBorder(levelState.goal, PB_GAME.CONSTANTS.GOAL_BORDER_SIZE, PB_GAME.CONSTANTS.PLAYER_COLOR);
    // PS.debug(levelState.player.shape.offsets);
    // PS.debug(PB_GAME.UTIL.ACTOR.getActorCells(levelState.player) + "\n");
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
        const [isValid] = PB_GAME.UTIL.getShapePivotValid(levelState.player.shape, newPivot, levelState.walls);
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
        let [newPlayer, blockingWalls] = PB_GAME.UTIL.ACTOR.getRotatedActor(
            levelState.player, PB_GAME.CONSTANTS.PLAYER_ROTATE_ANGLE
        );
        levelState.player = newPlayer;
        
    });
}

// Loads victory screen
PB_GAME.HANDLER.loadVictoryScreen = function() {
    currentLevelState = null;

    // Clear level
    PB_GAME.HANDLER.clearLevelScreen();
    PS.statusText("");

    PS.glyph(2, 4, 'T');
    PS.glyph(3, 4, 'H');
    PS.glyph(4, 4, 'E');
    PS.glyph(7, 4, 'E');
    PS.glyph(8, 4, 'N');
    PS.glyph(9, 4, 'D');

    // PS.glyph(1, 7, '[');
    PS.glyph(2, 7, 'F');
    PS.glyph(3, 7, 'O');
    PS.glyph(4, 7, 'R');
    PS.glyph(7, 7, 'N');
    PS.glyph(8, 7, 'O');
    PS.glyph(9, 7, 'W');
    // PS.glyph(10, 7, ']');
    
}

// Completes current level.
PB_GAME.HANDLER.completeLevel = function() {
    if (currentLevelState == null) {
        return;
    }

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

    // Some visuals for shining player on completion
    const goal = currentLevelState.goal;
    const colorMethod = (startColor, finalColor, alpha) => {
        const color = PB_GAME.UTIL.lerpColor(startColor, finalColor, alpha);
        PB_GAME.UTIL.ACTOR.fillActor(goal, color);
        PB_GAME.UTIL.ACTOR.fillActorBorder(goal, PB_GAME.CONSTANTS.GOAL_BORDER_SIZE, color);
    }
    PB_GAME.UTIL.tweenMethod(
        PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_IN_TIME,
        (alpha) => {
            colorMethod(
                PB_GAME.CONSTANTS.PLAYER_COLOR, PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_COLOR, alpha
            );
        },
        () => {
            PB_GAME.UTIL.delay(PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_OUT_DELAY, () => {
                PB_GAME.UTIL.tweenMethod(
                    PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_OUT_TIME,
                    (alpha) => {
                        colorMethod(
                            PB_GAME.CONSTANTS.PLAYER_GOAL_SHINE_COLOR, PB_GAME.CONSTANTS.PLAYER_COLOR, alpha
                        );
                    }
                );
            });
        }
    )

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
            shape: level.player.shape,
        },
        goal: {
            pivot: level.goal.pivot,
            shape: level.goal.shape
        }
    }
    currentLevelIndex = levelIndex;
    currentLevelState = levelState;

    // Draw level state
    PB_GAME.HANDLER.updateLevelState();
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
    PB_GAME.HANDLER.loadLevel(0);
}