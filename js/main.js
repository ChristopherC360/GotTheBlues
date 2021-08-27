const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var deathBlocks;
var door1;
var x;
var gameOver = false;
const game = new Phaser.Game(config);

function preload()
{
    // Background Image
    this.load.image("background", "../assets/2 Background/Background.png");
    this.load.image("tag", "../assets/2 Background/tag.png");
    // Floor Tiles
    this.load.image("top-left-corner", "../assets/1 Tiles/IndustrialTile_04.png");
    this.load.image("top-center-floor", "../assets/1 Tiles/IndustrialTile_05.png");
    this.load.image("bottom-center-floor", "../assets/1 Tiles/IndustrialTile_23.png");
    this.load.image("top-right-corner", "../assets/1 Tiles/IndustrialTile_06.png");
    this.load.image("left-floor", "../assets/1 Tiles/IndustrialTile_13.png");
    this.load.image("right-floor", "../assets/1 Tiles/IndustrialTile_15.png");
    this.load.image("center-floor", "../assets/1 Tiles/IndustrialTile_14.png");
    this.load.image("bottom-left-corner", "../assets/1 Tiles/IndustrialTile_22.png");
    this.load.image("bottom-right-corner", "../assets/1 Tiles/IndustrialTile_24.png");
    this.load.image("wall", "../assets/1 Tiles/IndustrialTile_02.png");
    this.load.image("deathBlock", "../assets/1 Tiles/IndustrialTile_09.png");
    
    this.load.image("bomb", "../assets/3 Objects/bomb.png");
    
    this.load.image("door", "../assets/1 Tiles/door.png");

    // Player
    this.load.spritesheet('player-idle', '../assets/3 Dude_Monster/Dude_Monster.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-run', '../assets/3 Dude_Monster/Dude_Monster_Run_6.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-run-backwards', '../assets/3 Dude_Monster/Dude_Monster_Run_6_2.png', { frameWidth: 32, frameHeight: 32 });

}

function create()
{
    this.physics.world.setBounds(0, 0, 1600, 800);

    // Background Image
    this.add.image(750, 350, "background").setScale(4);

    //Groups
    platforms = this.physics.add.staticGroup();
    walls = this.physics.add.staticGroup();
    deathBlocks = this.physics.add.staticGroup();
    door1 = this.physics.add.staticGroup();
    bombs = this.physics.add.group();

    //Function Calls
    blankWalls();
    bottomDeath();

    //Start Platform
    platforms.create(15, 700, "top-left-corner");
    platforms.create(15, 730, "left-floor");
    platforms.create(15, 760, "left-floor");
    platforms.create(15, 790, "bottom-left-corner");
    platforms.create(47, 700, "top-center-floor");
    platforms.create(47, 730, "center-floor");
    platforms.create(47, 760, "center-floor");
    platforms.create(47, 790, "bottom-center-floor");
    platforms.create(79, 700, "top-center-floor");
    platforms.create(79, 730, "center-floor");
    platforms.create(79, 760, "center-floor");
    platforms.create(79, 790, "bottom-center-floor");
    platforms.create(111, 700, "top-right-corner");
    platforms.create(111, 730, "right-floor");
    platforms.create(111, 760, "right-floor");
    platforms.create(111, 790, "bottom-right-corner");
    this.add.image(47, 652, "door");
    this.add.image(63, 745, "tag").setScale(.45);

    //First Platform
    this.add.image(207, 670, "top-center-floor");
    this.add.image(239, 670, "top-center-floor");
    platforms.create(271, 670, "top-center-floor");
    this.add.image(303, 670, "top-center-floor");

    // Second Platform
    this.add.image(399, 700, "top-center-floor");
    platforms.create(431, 700, "top-center-floor");
    platforms.create(463, 700, "top-center-floor");
    platforms.create(495, 700, "top-center-floor");
    door1.create(463, 652, "door");



    this.add.image(367, 610, "top-center-floor");
    this.add.image(399, 610, "top-center-floor");
    platforms.create(431, 610, "top-center-floor");


    // Player
    player = this.physics.add.sprite(45, 650, 'player').setScale(1);
    player.body.setGravityY(800)
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player-run-backwards', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'idle',
        frames: [ { key: 'player-idle', frame: 0 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player-run', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, door1, move1, null, this);
    this.physics.add.collider(player, deathBlocks, touchDeath, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, touchBomb, null, this);

    // Set camera zoom set to 2
    // this.cameras.main.zoom = 2;
    // this.cameras.main.setBounds(0, 0, 1600, 800, false);
}

// Player Respawn
function resetBlue() {
    player.setPosition(45, 650);
}
var z = 0;
function update() {

    // this.cameras.main.scrollX = (player.x - 800);
    // this.cameras.main.scrollY = (player.y - 400);

    if (gameOver)
    {
        gameOver = false;
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var randomNum = Math.random();
        console.log(randomNum);
        if(randomNum > .75) {
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            z += 1;
            console.log(z);
        };
        resetBlue();        
    }

    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('idle');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-400);
    }
}

function blankWalls() {
    var y = 790;
    for(var i = 0; i < 11; i++) {
        y = y - 30;
        var x = -17;
        for(var j = 0; j < 50; j++) {
            x = x + 32;
            walls.create(x, y, "center-floor");
        };
    };
}

function bottomDeath() {
    var x = 111;
    for(var i = 0; i < 46; i++) {
        x = x + 32;
        deathBlocks.create(x, 790, "deathBlock");
    };
}

function touchDeath(player, deathBlock, bomb) {
    player.anims.play('idle');
    gameOver = true;
}

function touchBomb(player, bomb) {
    player.anims.play('idle');
    bomb.destroy();
    gameOver = true;
}

function move1() {
    document.addEventListener('keydown', move1Door);
    
}

function move1Door(e) {
    if(e.keyCode == 40){
        resetBlue();        
        document.removeEventListener("keydown", move1Door);
    }
}