// handler.js
// Handler functions for Perlenblocks game
// Ben Reinherz 2025

PB_GAME.HANDLER = {};

PB_GAME.LEVEL_STATE = null;

// Tries to move the player the offset. Can fail if wall is in the way
PB_GAME.HANDLER.tryMovePlayer = function(offset) {
    let levelState = PB_GAME.LEVEL_STATE;
    if (levelState == null) {
        return;
    }

    let newPivot = PB_GAME.UTIL.ACTOR.getOffsetMove(levelState.player, offset);
    // TODO check if wall in the way...

    levelState.player.pivot = newPivot;
    PB_GAME.HANDLER.drawLevelState();
}

// Tries to rotate the player. Can fail if wall is in the way
PB_GAME.HANDLER.tryRotatePlayer = function() {
    PS.debug(`Rotate player!`);
}


// Draws current level state
PB_GAME.HANDLER.drawLevelState = function() {
    const levelState = PB_GAME.LEVEL_STATE;
    if (levelState == null) {
        return;
    }

    // Clear level
    PS.color(PS.ALL, PS.ALL, PB_GAME.CONSTANTS.LVL_BG_COLOR);
    
    // Draw player + goal
    PB_GAME.UTIL.ACTOR.fillActor(levelState.player, PB_GAME.CONSTANTS.PLAYER_COLOR);
    PB_GAME.UTIL.ACTOR.fillActorBorder(levelState.goal, PB_GAME.CONSTANTS.LVL_BORDER_SIZE, PB_GAME.CONSTANTS.PLAYER_COLOR);
}

// Loads level of the index. Returns if loaded
PB_GAME.HANDLER.loadLevel = function(levelIndex) {
    if (levelIndex < 0 || levelIndex >= PB_GAME.LEVELS.length) {
        // Invalid level
        return false;
    }
    const level = PB_GAME.LEVELS[levelIndex];

    // Set level state
    let levelState = {
        player: {
            pivot: level.player.pivot,
            shape: level.player.shape,
        },
        goal: {
            pivot: level.goal.pivot,
            shape: level.goal.shape
        }
    }
    PB_GAME.LEVEL_STATE = levelState;

    // Draw level state
    PB_GAME.HANDLER.drawLevelState();
    return true;
}

// Starts game handling
PB_GAME.HANDLER.start = function() {
    PS.debug("Starting game!");
    PB_GAME.HANDLER.loadLevel(0);
}