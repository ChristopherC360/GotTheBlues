const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
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

const game = new Phaser.Game(config);
var platforms;

function preload()
{
    // Background Image
    this.load.image("background", "../assets/2 Background/Background.png");
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

    // Player
    this.load.spritesheet('player-idle', '../assets/3 Dude_Monster/Dude_Monster.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-run', '../assets/3 Dude_Monster/Dude_Monster_Run_6.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player-run-backwards', '../assets/3 Dude_Monster/Dude_Monster_Run_6_2.png', { frameWidth: 32, frameHeight: 32 });

}

function create()
{
    // Background Image
    this.add.image(450, 300, "background").setScale(2);
    // Floor Tiles
    platforms = this.physics.add.staticGroup();
    platforms.create(15, 500, "top-left-corner");
    platforms.create(15, 530, "left-floor");
    platforms.create(15, 560, "left-floor");
    platforms.create(15, 590, "bottom-left-corner");
    platforms.create(45, 500, "top-center-floor");
    platforms.create(45, 530, "center-floor");
    platforms.create(45, 560, "center-floor");
    platforms.create(45, 590, "bottom-center-floor");
    platforms.create(75, 500, "top-center-floor");
    platforms.create(75, 530, "center-floor");
    platforms.create(75, 560, "center-floor");
    platforms.create(75, 590, "bottom-center-floor");
    platforms.create(105, 500, "top-right-corner");
    platforms.create(105, 530, "right-floor");
    platforms.create(105, 560, "right-floor");
    platforms.create(105, 590, "bottom-right-corner");

    // Player
    player = this.physics.add.sprite(45, 450, 'player').setScale(1.4);
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

}

function update()
{
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