var assert = require('assert');

describe('Player', function() {
  it('should return correct new position when LEFT', function() {
    var playerPos = {x: 0, y: 0};
    playerPos.x += 5;
    assert.equal(playerPos.x, 5);
  });
});

describe('Player', function() {
  it('should return correct new position when RIGHT', function() {
    var playerPos = {x: 0, y: 0};
    playerPos.x -= 5;
    assert.equal(playerPos.x, -5);
  });
});

describe('Player', function() {
  it('should return correct new position when UP', function() {
    var playerPos = {x: 0, y: 0};
    playerPos.y += 5;
    assert.equal(playerPos.y, 5);
  });
});

describe('Player', function() {
  it('should return correct new position when DOWN', function() {
    var playerPos = {x: 0, y: 0};
    playerPos.y -= 5;
    assert.equal(playerPos.y, -5);
  });
});

describe('Arrow', function() {
  it('should return return a correct arrow trajectory', function() {
    var arrow = {x: 0, y: 0};

    var arrowSpeed = 10;
    var direction = 180;

    arrow.x = Math.floor(arrowSpeed*Math.sin(direction));
    arrow.y = Math.floor(arrowSpeed*Math.cos(direction));

    assert.equal(arrow.x, -9);
    assert.equal(arrow.y, -6);
  });
});

describe('Collision', function() {
  it('should return TRUE when coordinates collide', function() {
    var playerPos = {x: 6, y: 6};
    var arrowPos = {x: 0, y: 0};

    var isCollided = false;
    if (arrowPos.x < playerPos.x + 12 &&
        arrowPos.x + 12 > playerPos.x &&
        arrowPos.y < playerPos.y + 12 &&
        arrowPos.y + 12 > playerPos.y) {
      isCollided = true;
    }

    playerPos.y -= 5;
    assert.equal(isCollided, true);
  });
});

describe('Collision', function() {
  it('should return FALSE when coordinates collide', function() {
    var playerPos = {x: 16, y: 16};
    var arrowPos = {x: 0, y: 0};

    var isCollided = false;
    if (arrowPos.x < playerPos.x + 12 &&
        arrowPos.x + 12 > playerPos.x &&
        arrowPos.y < playerPos.y + 12 &&
        arrowPos.y + 12 > playerPos.y) {
      isCollided = true;
    }

    assert.notEqual(isCollided, true);
  });
});