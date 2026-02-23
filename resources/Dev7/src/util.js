// util.js
// Utility functions for Tennis game
// Ben Reinherz 2026

/*
TYPES:

Sprite = [SpriteCell]
SpriteCell = {
    offset: [x, y]
    color: Color
}

*/

TENNIS_GAME.UTIL = {};

// Primitives

// Clamps num to be in range [min, max].
TENNIS_GAME.UTIL.clamp = function(num, min, max) {
    return Math.min(max, Math.max(min, num));
}

// Moved from toward to by delta value.
TENNIS_GAME.UTIL.toward = function(from, to, delta) {
    if (from == to) {
        return from;
    }
    if (from < to) {
        return Math.min(from + delta, to);
    }
    return Math.max(from - delta, to);
}

// Floors the number to the nearest of the multiple
TENNIS_GAME.UTIL.floorToMultiple = function(num, multiple) {
    return Math.floor(num / multiple) * multiple;
}

// Timers

// Runs handler every step, returning string to cancel with timerStop.
TENNIS_GAME.UTIL.onStep = function(handler) {
    let tickCount = 0;
    return PS.timerStart(1, () => {
        tickCount++;
        handler(tickCount);
    })
}

// Tweens over the duration (IN SECONDS), calling to handler each update with current alpha [0, 1].
// Calls onFinish if provided once done tweening.
TENNIS_GAME.UTIL.tweenMethod = function(duration, handler, onFinish) {
    const durationTicks = duration * 60;
    let stepTimer;
    stepTimer = TENNIS_GAME.UTIL.onStep((tickCount) => {
        const alpha = tickCount / durationTicks;
        if (alpha >= 1) {
            if (onFinish != null) {
                onFinish();
            }
            PS.timerStop(stepTimer);
        }
        else {
            handler(alpha);
        }
    })
}

// Runs the handler after the duration (IN SECONDS)
TENNIS_GAME.UTIL.delay = function(duration, handler) {
    let timer;
    timer = PS.timerStart(duration * 60, () => {
        PS.timerStop(timer);
        handler();
    });
}

// Interpolation

// interpolate(a, b, t)
TENNIS_GAME.UTIL.lerp = function(a, b, t) {
    return a + (t * (b - a));
}

// interpolate(color1, color2, t)
TENNIS_GAME.UTIL.lerpColor = function(color1, color2, t) {
    let [r1, g1, b1] = PS.unmakeRGB(color1, []);
    let [r2, g2, b2] = PS.unmakeRGB(color2, []);
    return PS.makeRGB(
        TENNIS_GAME.UTIL.lerp(r1, r2, t),
        TENNIS_GAME.UTIL.lerp(g1, g2, t),
        TENNIS_GAME.UTIL.lerp(b1, b2, t)
    );
}

// Random

// Returns random number on range [min, max]. If decimal places is supplied, changes how many decimals in number.
TENNIS_GAME.UTIL.randomOnRange = function(min, max, decimalPlaces = 0) {
    const factor = Math.pow(10, decimalPlaces);
    return min + ((PS.random( ((max - min) * factor) + 1 ) - 1) / factor);
}

// Returns random element within the array.
TENNIS_GAME.UTIL.randomArrayElement = function(array) {
    const length = array.length;
    if (length == 0) {
        return null;
    }
    else if (length == 1) {
        return array[0];
    }
    return array[TENNIS_GAME.UTIL.randomOnRange(0, length - 1)];
}

// Pivots

// Returns if the [x, y] pivot is outside of the grid.
TENNIS_GAME.UTIL.isPivotOutOfBounds = function(pivot) {
    return pivot[0] < 0 || pivot[0] >= TENNIS_GAME.CONSTANTS.GRID_WIDTH
        || pivot[1] < 0 || pivot[1] >= TENNIS_GAME.CONSTANTS.GRID_HEIGHT;
}

// Returns the closest [x, y] pivot to the out of bounds pivot. If pivot is in bounds, returns null.
TENNIS_GAME.UTIL.getInBoundsFromPivot = function(pivot) {
    if (!TENNIS_GAME.UTIL.isPivotOutOfBounds(pivot)) {
        // In bounds, null
        return null;
    }
    // Clamp x and y values
    return [
        TENNIS_GAME.UTIL.clamp(pivot[0], 0, TENNIS_GAME.CONSTANTS.GRID_WIDTH - 1),
        TENNIS_GAME.UTIL.clamp(pivot[1], 0, TENNIS_GAME.CONSTANTS.GRID_HEIGHT - 1)
    ];
}

// Returns whether the two pivots are overlapping (same position).
TENNIS_GAME.UTIL.doPivotsOverlap = function(pivot1, pivot2) {
    return pivot1[0] == pivot2[0] && pivot1[1] == pivot2[1];
}

// Returns whether the two pivots are adjacent (orthogonally connected).
TENNIS_GAME.UTIL.arePivotsAdjacent = function(pivot1, pivot2) {
    const xDiff = Math.abs(pivot1[0] - pivot2[0]);
    const yDiff = Math.abs(pivot1[1] - pivot2[1]);
    return (xDiff + yDiff) <= 1;
}

// Returns [x, y] adding the offset [x, y] to the pivot
TENNIS_GAME.UTIL.addOffset = function(pivot, offset) {
    return [pivot[0] + offset[0], pivot[1] + offset[1]];
}

// Returns [x, y] getting the offset pivot2 - pivot1 between the two [x, y] pivots
TENNIS_GAME.UTIL.getOffset = function(pivot1, pivot2) {
    return [pivot2[0] - pivot1[0], pivot2[1] - pivot1[1]];
}

// Returns [x, y] where each pivot is multiple by scalar c, e.g. [cx, cy]
TENNIS_GAME.UTIL.scalePivot = function(pivot, scalar) {
    return [pivot[0] * scalar, pivot[1] * scalar];
}

// Returns the [x, y] floored the nearest integer.
TENNIS_GAME.UTIL.floorPivot = function(pivot) {
    return [Math.floor(pivot[0]), Math.floor(pivot[1])];
}

// Returns the pivot rotated around (0, 0) by the angle (IN RADIANS) by applying a 2D rotation matrix
TENNIS_GAME.UTIL.rotatePivot = function(pivot, angle) {
    const [x, y] = pivot;
    return [
        // Make sure to round to avoid float rounding errors
        Math.round((x * Math.cos(angle)) - (y * Math.sin(angle))),
        Math.round((x * Math.sin(angle)) + (y * Math.cos(angle)))
    ];
}

// Returns length of the pivot
TENNIS_GAME.UTIL.getPivotLength = function(pivot) {
    const [x, y] = pivot;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

// Returns pivot normalized ([x, y] where the length is 1)
TENNIS_GAME.UTIL.normalizePivot = function(pivot) {
    const length = TENNIS_GAME.UTIL.getPivotLength(pivot);
    return [pivot[0] / length, pivot[1] / length];
}

// Returns the dot product between two pivots
TENNIS_GAME.UTIL.dotPivots = function(pivot1, pivot2) {
    return (pivot1[0] * pivot2[0]) + (pivot1[1] * pivot2[1])
}

// Returns the angle in radians between the two pivots
TENNIS_GAME.UTIL.getAngleBetweenPivots = function(pivot1, pivot2) {
    return Math.acos(
        (TENNIS_GAME.UTIL.dotPivots(pivot1, pivot2)) / (
            TENNIS_GAME.UTIL.getPivotLength(pivot1) * TENNIS_GAME.UTIL.getPivotLength(pivot2)
        )
    );
}

// Fills the pivot with the color, if in bounds
TENNIS_GAME.UTIL.fillPivot = function(pivot, color) {
    if (TENNIS_GAME.UTIL.isPivotOutOfBounds(pivot)) {
        return;
    }
    PS.color(pivot[0], pivot[1], color);
}

// Fills the pivot with the glyph, if in bounds. Optionally can change color of glyph too
TENNIS_GAME.UTIL.fillGlyph = function(pivot, glyph, glyphColor) {
    if (TENNIS_GAME.UTIL.isPivotOutOfBounds(pivot)) {
        return;
    }
    const [x, y] = pivot;
    PS.glyph(x, y, glyph);
    if (glyphColor != null) {
        PS.glyphColor(x, y, glyphColor);
    }
}

// Fills the width and height with the background rows.
TENNIS_GAME.UTIL.fillBackground = function(width, height, background, defaultColor) {
    for (let y = 0; y < height; y++) {
        const row = y < background.length ? background[y] :
                background.length > 0 ? background[background.length - 1] : defaultColor;
        const rowType = typeof(row);
        const isArray = rowType == "object";
        if (isArray && row.length > 0) {
            for (let x = 0; x < width; x++) {
                const cell = x < row.length ? row[x] : row[row.length - 1];
                PS.color(x, y, cell);
            }
        }
        else {
            PS.color(PS.ALL, y, isArray ? defaultColor : row);
        }
    }
}

// Sprites (Pseudosprites, not Perlenspiel supported ones)

// Draws the sprite cell at the pivot
TENNIS_GAME.UTIL.drawSpriteCell = function(pivot, spriteCell) {
    const cellPivot = TENNIS_GAME.UTIL.addOffset(pivot, spriteCell.offset);
    TENNIS_GAME.UTIL.fillPivot(cellPivot, spriteCell.color);
    if (spriteCell.glyph) {
        TENNIS_GAME.UTIL.fillGlyph(cellPivot, spriteCell.glyph);
    }
}

// Fills shape at the pivot with a color
TENNIS_GAME.UTIL.drawSprite = function(pivot, sprite) {
    sprite.forEach(spriteCell => {
        TENNIS_GAME.UTIL.drawSpriteCell(pivot, spriteCell);
    });
}
