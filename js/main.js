const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 50 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    }
};

var player;
var platforms;
var deathBlocks;
var spawnDoorBlock;
var spawnDoorBlockCancel;
var pf3DoorBlock;
var pf3DoorBlockCancel;
var pf19DoorBlock;
var pf19DoorBlockCancel;
var pf20DoorBlock;
var pf20DoorBlockCancel;
var jumper;
var x;
var deaths = 0;
var deathText;
var wallText;
var gameOver = false;
const game = new Phaser.Game(config);

function preload()
{
    // Music / Sound Effects
    this.load.audio('theme', [
        'assets/audio/party troll.mp3'
    ]);
    this.load.audio('boing', [
        'assets/audio/Boing.mp3'
    ]);
    

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
    this.load.image("full-platform", "../assets/1 Tiles/IndustrialTile_25.png");
    this.load.image("bottom-left-wall", "../assets/1 Tiles/IndustrialTile_16.png");
    this.load.image("bottom-right-wall", "../assets/1 Tiles/IndustrialTile_17.png");
    this.load.image("top-left-wall", "../assets/1 Tiles/IndustrialTile_07.png");
    this.load.image("top-right-wall", "../assets/1 Tiles/IndustrialTile_08.png");
    this.load.image("wall", "../assets/1 Tiles/IndustrialTile_02.png");
    this.load.image("jumper", "../assets/1 Tiles/IndustrialTile_45.png");
    this.load.image("screen", "../assets/1 Tiles/BlackScreen.png");
    this.load.image("deathBlock", "../assets/1 Tiles/IndustrialTile_09.png");
    
    this.load.image("ghost", "../assets/3 Objects/ghost.gif");
    
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


    var music = this.sound.add("theme");
    music.setVolume(.25);
    music.setLoop(true);
    music.play();

    var boing = this.sound.add("boing");
    boing.allowMultiple = true;


    //Groups
    platforms = this.physics.add.staticGroup();
    fakeWalls = this.physics.add.staticGroup();
    walls = this.physics.add.staticGroup();
    floors = this.physics.add.staticGroup();
    deathBlocks = this.physics.add.staticGroup();
    spawnDoorBlock = this.physics.add.staticGroup();
    spawnDoorBlockCancel = this.physics.add.staticGroup();
    pf3DoorBlock = this.physics.add.staticGroup();
    pf3DoorBlockCancel = this.physics.add.staticGroup();
    pf19DoorBlock = this.physics.add.staticGroup();
    pf19DoorBlockCancel = this.physics.add.staticGroup();
    pf20DoorBlock = this.physics.add.staticGroup();
    pf20DoorBlockCancel = this.physics.add.staticGroup();
    jumper = this.physics.add.staticGroup();
    ghosts = this.physics.add.group();

    //Function Calls
    blankWalls();
    bottomDeath();
    leftWalls();
    topWalls();
    rightWalls();
    theHole();

    //Start Platform
    platforms.create(15, 700, "top-left-corner");
    platforms.create(15, 730, "left-floor");
    platforms.create(15, 760, "left-floor");
    platforms.create(15, 790, "bottom-left-corner");
    spawnDoorBlock.create(47, 699.9, "top-center-floor"); //Spawn Door Block
    platforms.create(47, 730, "center-floor");
    platforms.create(47, 760, "center-floor");
    platforms.create(47, 790, "bottom-center-floor");
    spawnDoorBlockCancel.create(79, 699.9, "top-center-floor");
    platforms.create(79, 730, "center-floor");
    platforms.create(79, 760, "center-floor");
    platforms.create(79, 790, "bottom-center-floor");
    platforms.create(111, 700, "top-right-corner");
    platforms.create(111, 730, "right-floor");
    platforms.create(111, 760, "right-floor");
    platforms.create(111, 790, "bottom-right-corner");
    this.add.image(15, 670, "full-platform");
    this.add.image(15, 640, "full-platform");
    this.add.image(15, 610, "full-platform");
    this.add.image(15, 580, "full-platform");
    this.add.image(15, 550, "full-platform");
    this.add.image(15, 520, "full-platform");
    this.add.image(47, 652, "door");
    this.add.image(63, 745, "tag").setScale(.45);
    deathText = this.add.text(20, 688, 'Deaths: 0', { fontSize: '16px', fill: '#fff' });

    // Wall Screen
    this.add.image(111, 610, "top-left-wall");
    this.add.image(143, 610, "top-right-wall");
    this.add.image(111, 640, "bottom-left-wall");
    this.add.image(143, 640, "bottom-right-wall");
    this.add.image(127, 625, "screen").setScale(1.1);
    wallText = this.add.text(100, 598, "Doors can \nbe opened \nwith the \ndown \narrow.", { fontSize: "10px", fill: "#fff"});

    // 1st Platform
    this.add.image(207, 700, "full-platform");
    this.add.image(239, 700, "full-platform");
    platforms.create(271, 700, "full-platform");
    this.add.image(303, 700, "full-platform");

    // 2nd Platform
    this.add.image(399, 700, "full-platform");
    platforms.create(431, 700, "full-platform");
    platforms.create(463, 700, "full-platform");
    platforms.create(495, 700, "full-platform");

    // 3rd Platform
    floor1();
    platforms.create(879, 760, "full-platform");
    platforms.create(911, 760, "full-platform");
    pf3DoorBlock.create(943, 759.9, "full-platform"); //Door Block For Door Platform 3
    pf3DoorBlockCancel.create(975, 759.9, "full-platform"); //Door Block Cancel For Door Platform 3
    platforms.create(911, 730, "full-platform");
    this.add.image(943, 712, "door");
    platforms.create(911, 700, "full-platform");
    platforms.create(911, 670, "full-platform");
    platforms.create(911, 640, "full-platform");
    platforms.create(911, 610, "full-platform");
    platforms.create(911, 580, "full-platform");
    platforms.create(943, 580, "full-platform");
    platforms.create(975, 580, "full-platform");
    platforms.create(1007, 580, "full-platform");
    platforms.create(1039, 580, "full-platform");
    platforms.create(879, 580, "full-platform");
    platforms.create(847, 580, "full-platform");
    platforms.create(815, 580, "full-platform");
    platforms.create(783, 580, "full-platform");
    platforms.create(751, 580, "full-platform");
    platforms.create(719, 580, "full-platform");
    platforms.create(687, 580, "full-platform");
    

    // 4th Platform
    platforms.create(623, 700, "full-platform");
    platforms.create(655, 700, "full-platform");
    platforms.create(687, 700, "full-platform");
    this.add.image(719, 700, "full-platform");
    this.add.image(751, 700, "full-platform");
    platforms.create(783, 700, "full-platform");
    platforms.create(815, 700, "full-platform");
    platforms.create(623, 670, "full-platform");
    this.add.image(591, 670, "full-platform");
    this.add.image(591, 640, "full-platform");
    platforms.create(591, 610, "full-platform");
    platforms.create(559, 610, "full-platform");

    // 5th Platform
    this.add.image(495, 610, "full-platform");

    // 6th Platform
    this.add.image(367, 610, "full-platform");
    this.add.image(399, 610, "full-platform");
    platforms.create(431, 610, "full-platform");
    this.add.image(367, 580, "full-platform");
    this.add.image(367, 550, "full-platform");
    this.add.image(335, 550, "full-platform");
    platforms.create(303, 550, "full-platform");

    // 7th Platform
    this.add.image(207, 520, "full-platform");
    platforms.create(175, 520, "full-platform");
    this.add.image(143, 520, "full-platform");

    // 8th Platform
    platforms.create(79, 490, "full-platform");
    this.add.image(47, 490, "full-platform");

    // 9th Platform
    platforms.create(175, 430, "full-platform");
    this.add.image(207, 430, "full-platform");
    platforms.create(207, 400, "full-platform");
    platforms.create(207, 370, "full-platform");
    platforms.create(207, 340, "full-platform");
    platforms.create(207, 310, "full-platform");
    platforms.create(175, 310, "full-platform");
    platforms.create(207, 280, "full-platform");
    platforms.create(207, 250, "full-platform");
    this.add.image(239, 250, "full-platform");
    this.add.image(271, 250, "full-platform");
    platforms.create(303, 250, "full-platform");
    platforms.create(303, 280, "full-platform");
    platforms.create(303, 310, "full-platform");
    platforms.create(303, 340, "full-platform");

    // 10th Platform
    platforms.create(79, 370, "full-platform");
    this.add.image(47, 370, "full-platform");
    this.add.image(47, 322, "door");

    // 11th Platform
    platforms.create(399, 400, "full-platform");
    platforms.create(399, 370, "full-platform");
    this.add.image(431, 370, "full-platform");
    this.add.image(463, 370, "full-platform");
    this.add.image(495, 370, "full-platform");
    platforms.create(527, 370, "full-platform");
    platforms.create(559, 370, "full-platform");

    // Wall Screen
    this.add.image(943, 340, "top-left-wall");
    this.add.image(975, 340, "top-right-wall");
    this.add.image(943, 370, "bottom-left-wall");
    this.add.image(975, 370, "bottom-right-wall");
    this.add.image(959, 355, "screen").setScale(1.1);
    this.add.text(933, 335, "Jump on \nme, I \ngo boing!", { fontSize: "10px", fill: "#fff"});

    // 12th Platform
    deathBlocks.create(687, 550, "deathBlock");
    deathBlocks.create(719, 550, "deathBlock");
    platforms.create(751, 550, "full-platform");
    deathBlocks.create(785, 550, "deathBlock");
    deathBlocks.create(815, 550, "deathBlock");
    platforms.create(847, 550, "full-platform");
    platforms.create(847, 520, "full-platform");
    platforms.create(847, 490, "full-platform");
    deathBlocks.create(879, 550, "deathBlock");
    deathBlocks.create(911, 550, "deathBlock");
    platforms.create(943, 550, "full-platform");
    platforms.create(943, 520, "full-platform");
    platforms.create(943, 490, "full-platform");
    platforms.create(943, 460, "full-platform");
    platforms.create(943, 430, "full-platform");
    platforms.create(975, 550, "full-platform");
    platforms.create(975, 520, "full-platform");
    platforms.create(975, 490, "full-platform");
    platforms.create(975, 460, "full-platform");
    jumper.create(975, 430, "jumper");
    deathBlocks.create(1007, 550, "deathBlock");
    deathBlocks.create(1039, 550, "deathBlock");
    platforms.create(1071, 550, "full-platform");
    platforms.create(1071, 520, "full-platform");
    platforms.create(1071, 490, "full-platform");
    platforms.create(1071, 460, "full-platform");
    platforms.create(1071, 430, "full-platform");
    platforms.create(1071, 400, "full-platform");
    platforms.create(1071, 370, "full-platform");
    platforms.create(1071, 340, "full-platform");
    platforms.create(1071, 310, "full-platform");
    platforms.create(1071, 280, "full-platform");
    platforms.create(1071, 250, "full-platform");
    platforms.create(1071, 220, "full-platform");
    platforms.create(1071, 190, "full-platform");
    platforms.create(1071, 160, "full-platform");
    
    // 13th Platform
    platforms.create(1071, 580, "full-platform");
    deathBlocks.create(1103, 580, "deathBlock");
    deathBlocks.create(1135, 580, "deathBlock");
    deathBlocks.create(1167, 580, "deathBlock");
    platforms.create(1039, 610, "full-platform");
    platforms.create(1071, 610, "full-platform");
    platforms.create(1103, 610, "full-platform");
    platforms.create(1135, 610, "full-platform");
    platforms.create(1167, 610, "full-platform");
    platforms.create(1199, 610, "full-platform");
    platforms.create(1199, 580, "full-platform");
    platforms.create(1199, 550, "full-platform");

    // 14th Platform
    deathBlocks.create(1231, 550, "deathBlock");
    deathBlocks.create(1263, 550, "deathBlock");
    deathBlocks.create(1295, 550, "deathBlock");
    platforms.create(1327, 520, "full-platform");
    platforms.create(1327, 550, "full-platform");
    platforms.create(1327, 580, "full-platform");
    platforms.create(1295, 580, "full-platform");
    platforms.create(1263, 580, "full-platform");
    platforms.create(1231, 580, "full-platform");

    // 15th Platform
    platforms.create(1423, 640, "full-platform");
    platforms.create(1455, 640, "full-platform");

    // 16th Platform
    platforms.create(1359, 760, "full-platform");
    platforms.create(1327, 760, "full-platform");
    platforms.create(1295, 760, "full-platform");

    // 17th Platform
    platforms.create(1199, 760, "full-platform");
    platforms.create(1199, 730, "full-platform");
    platforms.create(1167, 760, "full-platform");
    platforms.create(1167, 730, "full-platform");
    platforms.create(1167, 700, "full-platform");

    // 18th Platform
    pf3DoorBlockCancel.create(1071, 760, "full-platform");

    // 19th Platform
    pf19DoorBlock.create(47, 129.9, "full-platform");
    this.add.image(47, 82, "door");
    pf19DoorBlockCancel.create(79, 129.9, "full-platform");
    platforms.create(111, 130, "full-platform");
    platforms.create(143, 130, "full-platform");
    this.add.image(175, 130, "full-platform");
    this.add.image(207, 130, "full-platform");
    this.add.image(239, 130, "full-platform");
    platforms.create(271, 130, "full-platform");
    platforms.create(303, 130, "full-platform");
    platforms.create(335, 130, "full-platform");
    platforms.create(367, 130, "full-platform");
    platforms.create(399, 130, "full-platform");
    platforms.create(431, 130, "full-platform");
    platforms.create(463, 130, "full-platform");
    platforms.create(495, 130, "full-platform");
    platforms.create(527, 130, "full-platform");
    platforms.create(559, 130, "full-platform");
    platforms.create(591, 130, "full-platform");
    platforms.create(623, 130, "full-platform");
    platforms.create(623, 160, "full-platform");
    platforms.create(623, 190, "full-platform");
    platforms.create(623, 220, "full-platform");
    platforms.create(655, 220, "full-platform");
    platforms.create(687, 220, "full-platform");
    platforms.create(719, 220, "full-platform");
    platforms.create(751, 220, "full-platform");
    platforms.create(783, 220, "full-platform");
    this.add.image(815, 220, "full-platform");
    this.add.image(847, 220, "full-platform");
    this.add.image(879, 220, "full-platform");
    platforms.create(879, 190, "full-platform");
    platforms.create(879, 160, "full-platform");
    platforms.create(879, 130, "full-platform");
    platforms.create(879, 100, "full-platform");
    platforms.create(879, 70, "full-platform");
    platforms.create(879, 40, "full-platform");
    deathBlocks.create(655, 190, "deathBlock");
    deathBlocks.create(687, 190, "deathBlock");
    deathBlocks.create(719, 190, "deathBlock");
    deathBlocks.create(751, 190, "deathBlock");
    platforms.create(783, 190, "full-platform");
    this.add.image(815, 190, "full-platform");
    this.add.image(847, 190, "full-platform");
    this.add.image(847, 142, "door");

    // 20th Platform
    platforms.create(1232, 40, "full-platform");
    platforms.create(1232, 70, "full-platform");
    platforms.create(1232, 100, "full-platform");
    platforms.create(1232, 130, "full-platform");
    platforms.create(1232, 160, "full-platform");
    platforms.create(1264, 160, "full-platform");
    this.add.image(1264, 112, "door");
    platforms.create(1296, 160, "full-platform");
    platforms.create(1328, 160, "full-platform");
    platforms.create(1360, 160, "full-platform");
    this.add.image(1392, 160, "full-platform");
    this.add.image(1424, 160, "full-platform");
    this.add.image(1456, 160, "full-platform");
    pf20DoorBlockCancel.create(1551, 160, "full-platform");
    pf20DoorBlock.create(1584, 160, "full-platform");
    this.add.image(1584, 112, "door");

    // Player
    player = this.physics.add.sprite(45, 650, 'player').setScale(1);
    player.body.setGravityY(1000)
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

    this.physics.add.collider(player, spawnDoorBlock, moveSp, null, this);
    this.physics.add.collider(player, spawnDoorBlockCancel, moveSpCancel, null, this);
    this.physics.add.collider(player, pf3DoorBlock, move3, null, this);
    this.physics.add.collider(player, pf3DoorBlockCancel, move3Cancel, null, this);
    this.physics.add.collider(player, pf19DoorBlock, move19, null, this);
    this.physics.add.collider(player, pf19DoorBlockCancel, move19Cancel, null, this);
    this.physics.add.collider(player, pf20DoorBlock, move20, null, this);
    this.physics.add.collider(player, pf20DoorBlockCancel, move20Cancel, null, this);
    this.physics.add.collider(player, jumper, jumpUp, null, this);
    this.physics.add.collider(player, deathBlocks, touchDeath, null, this);
    this.physics.add.collider(player, ghosts, touchghost, null, this);

    // Set camera zoom set to 3
    this.cameras.main.zoom = 3;
    this.cameras.main.setBounds(0, 0, 1600, 800, false);
}

// Player Respawn
function resetBlue() {
    player.setPosition(45, 650);
    
}
var z = 0;
function update() {

    this.cameras.main.scrollX = (player.x - 800);
    this.cameras.main.scrollY = (player.y - 400);

    if (gameOver)
    {
        gameOver = false;
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var randomNum = Math.random();
        console.log(randomNum);
        if(randomNum > .5) {
            var ghost = ghosts.create(x, 16, 'ghost');
            ghost.setBounce(1);
            ghost.setCollideWorldBounds(true);
            ghost.setVelocity(Phaser.Math.Between(-200, 200), 20);
            z += 1;
            console.log(z);
        };
        deaths += 1;
        deathText.setText('Deaths: ' + deaths);
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
    for(var i = 0; i < 25; i++) {
        y = y - 30;
        var x = -17;
        for(var j = 0; j < 50; j++) {
            x = x + 32;
            walls.create(x, y, "center-floor");
        };
    };
}

function floor1() {
    var x = 559;
    for(var i = 0; i < 10; i++) {
        x = x + 32;
        platforms.create(x, 790, "full-platform");
    }; 
}

function leftWalls() {
    var y = 700;
    for(var i = 0; i < 23; i++) {
        y = y - 30;
        fakeWalls.create(15, y, "full-platform");
    };
}

function topWalls() {
    var x = 15;
    for(var i = 0; i < 48; i++) {
        x = x + 32;
        fakeWalls.create(x, 10, "full-platform");
    };
}

function rightWalls() {
    var y = 820;
    for(var i = 0; i < 27; i++) {
        y = y - 30;
        fakeWalls.create(1583, y, "full-platform");
    };
}

function theHole() {
    var y = 790;
    for(var i = 0; i < 21; i++) {
        y = y - 30;
        platforms.create(1487, y, "full-platform");
    };
    platforms.create(1519, 160, "full-platform");
}

function bottomDeath() {
    var x = 111;
    for(var i = 0; i < 46; i++) {
        x = x + 32;
        deathBlocks.create(x, 790, "deathBlock");
    };
}

function touchDeath(player, deathBlock, ghost) {
    player.anims.play('idle');
    gameOver = true;
}

function touchghost(player, ghost) {
    player.anims.play('idle');
    ghost.destroy();
    gameOver = true;
}

function jumpUp(player, jumper) {
    player.setVelocityY(-800);
    this.sound.play("boing");
}

function moveSp() {
    document.addEventListener('keydown', spawnDoor);
    
}
function moveSpCancel() {
    document.removeEventListener('keydown', spawnDoor);
}
function spawnDoor(e) {
    if(e.keyCode == 40){
        player.setPosition(1550, 200);        
        document.removeEventListener("keydown", spawnDoor);
    }
}

function move3() {
    document.addEventListener('keydown', pf3Door);
    
}
function move3Cancel() {
    document.removeEventListener('keydown', pf3Door);
}
function pf3Door(e) {
    if(e.keyCode == 40){
        player.setPosition(47, 90);        
        document.removeEventListener("keydown", pf3Door);
    }
}

function move19() {
    document.addEventListener('keydown', pf19Door);
    
}
function move19Cancel() {
    document.removeEventListener('keydown', pf19Door);
}
function pf19Door(e) {
    if(e.keyCode == 40){
        player.setPosition(1264, 112);        
        document.removeEventListener("keydown", pf19Door);
    }
}

function move20() {
    document.addEventListener('keydown', pf20Door);
    
}
function move20Cancel() {
    document.removeEventListener('keydown', pf20Door);
}
function pf20Door(e) {
    if(e.keyCode == 40){
        resetBlue();
        wallText.setText('Thanks \nfor \nplaying \nlevel 1!');
        document.removeEventListener("keydown", pf20Door);
    }
}