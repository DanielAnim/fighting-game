const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1320;
canvas.height = 776;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const game_background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/game_background.jpg'
});

const elementals = new Sprite({
    position: {
        x: 70,
        y: 0
    },
    imageSrc: './img/Elementals.png',
    scale: 0.3
});
const intro_background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/intro_background.png',
    framesMax: 40,
    scale: 2.7

    
});



const Sun = new Sprite({
    position: {
        x: 1200,
        y: 15
    },
    imageSrc: './img/Sun.png',
    scale: 0.2,
    framesMax: 2,
});

let player = new Fighter({
    position: {
        x: 25,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    scale: 2.5,
    offset: {
        x: 400,
        y: 235
    },
    imageSrc: './img/Fire/png/fire_knight/01_idle/Idle.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 215,
        y: 200
    },
    sprites: {
        idle: {
            imageSrc: './img/Fire/png/fire_knight/01_idle/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Fire/png/fire_knight/02_run/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Fire/png/fire_knight/03_jump/Jump.png',
            framesMax: 20
        },
        fall: {
            imageSrc: './img/Fire/png/fire_knight/03_jump_down/fall.png',
            framesMax: 3
        },
        attack: {
            imageSrc: './img/Fire/png/fire_knight/05_1_atk/attack.png',
            framesMax: 11
        },
        takeHit: {
            imageSrc: './img/Fire/png/fire_knight/10_take_hit/takeHit.png',
            framesMax: 6
        },
        death: {
            imageSrc: './img/Fire/png/fire_knight/11_death/death.png',
            framesMax: 13
        }
    },
    attackBox: {
        offset: {
            x: 90,
            y: -50,
        },
        width: 100,
        height: 50
    },
    jumpCount: 0 // Add this property
});

let enemy = new Fighter({
    position: {
        x: 1000,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    scale: 2.75,
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Crystal/animations/PNG/idle/IdleC.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 230,
        y: 200
    },
    sprites: {
        idle: {
            imageSrc: './img/Crystal/animations/PNG/idle/IdleC.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Crystal/animations/PNG/run/RunC.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Crystal/animations/PNG/j_up/JumpC.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './img/Crystal/animations/PNG/j_down/FallC.png',
            framesMax: 3
        },
        attack: {
            imageSrc: './img/Crystal/animations/PNG/2_atk/attackC.png',
            framesMax: 7
        },
        takeHit: {
            imageSrc: './img/Crystal/animations/PNG/take_hit/takeHitC.png',
            framesMax: 6
        },
        death: {
            imageSrc: './img/Crystal/animations/PNG/death/deathC.png',
            framesMax: 15
        }
    },
    attackBox: {
        offset: {
            x: -70,
            y: -50
        },
        width: 100,
        height: 50
    },
    jumpCount: 0 // Add this property
});

// console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

let intro_screen = true
let game_screen = false
let timer_started = false



function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (intro_screen) {
        intro_background.update();
        elementals.update();
        document.querySelector('#MenudisplayText').innerHTML = 'Press ENTER to start'
        document.querySelectorAll('.statusBars').forEach(bar => {  bar.style.display = "none";
        });
        document.querySelector('#Timer').style.display = "none"
        // intro components
        document.createElement('button')
    }
    if (game_screen) {
        document.querySelector('#MenudisplayText').innerHTML = ' '
        if (!timer_started){
            decreaseTimer();
            timer_started = true
        }
        game_background.update();
        Sun.update();
        player.update();
        enemy.update();

        player.velocity.x = 0;
        enemy.velocity.x = 0;

        //player movement
        if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 0) {
            player.velocity.x = -7;
            player.switchSprite('run');
        } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x + player.width < canvas.width) {
            player.velocity.x = 7;
            player.switchSprite('run');
        } else {
            player.switchSprite('idle');
        }
        //jumping
        if (player.velocity.y < 0) {
            player.switchSprite('jump');
        } //falling
        else if (player.velocity.y > 0) {
            player.switchSprite('fall');
        }

        //enemy movement//
        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 0) {
            enemy.velocity.x = -7;
            enemy.switchSprite('run');
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x + enemy.width < canvas.width) {
            enemy.velocity.x = 7;
            enemy.switchSprite('run');
        } else {
            enemy.switchSprite('idle');
        }

        //jumping
        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump');
        } //falling
        else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall');
        }

        //detect collision & enemy gets hit
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: enemy
            }) &&
            player.isAttacking && player.framesCurrent === 5
        ) {
            enemy.takeHit();
            player.isAttacking = false;

            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
            });
        }

        //if player misses
        if (player.isAttacking && player.framesCurrent === 5) {
            player.isAttacking = false;
        }
        // where player gets hit
        if (
            rectangularCollision({
                rectangle1: enemy,
                rectangle2: player
            }) &&
            enemy.isAttacking && enemy.framesCurrent === 4
        ) {
            player.takeHit();
            enemy.isAttacking = false;
            gsap.to('#playerHealth', {
                width: player.health + '%'
            });
        }

        if (enemy.isAttacking && enemy.framesCurrent === 4) {
            enemy.isAttacking = false;
        }

        //end game based on health
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy, timerId });
        }

        // Reset jump count when player is on the ground
        if (player.position.y + player.height >= canvas.height - 120) { // Adjust 96 based on your ground height
            player.jumpCount = 0;
        }

        // Reset jump count when enemy is on the ground
        if (enemy.position.y + enemy.height >= canvas.height - 120) { // Adjust 96 based on your ground height
            enemy.jumpCount = 0;
        }

        document.querySelectorAll('.statusBars').forEach(bar => { bar.style.display = "flex";
        });
        document.querySelector('#Timer').style.display = "flex"
    }
}

animate();

window.addEventListener('keydown', (event) => {
    console. log(event.key); 
    if (intro_screen) {
        if (event.key === 'Enter') { 
            game_screen = true
            intro_screen = false
        }
    }

    if (player.dead || enemy.dead) {
        if (event.key === 'r') {
            restartGame();
        }
    }
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                if (player.jumpCount < 1) { // Allow double jump
                    player.velocity.y = -15;
                    player.jumpCount++;
                }
                break;
            case 's':
                player.attack();
                break;
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                if (enemy.jumpCount < 1) { // Allow double jump
                    enemy.velocity.y = -15;
                    enemy.jumpCount++;
                }
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //enemy keys//
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }
})

// Define resetSprites() function
function resetSprites() {
    player = new Fighter({
        position: {
            x: 25,
            y: 0
        },
        velocity: {
            x: 0,
            y: 10
        },
        offset: {
            x: 0,
            y: 0
        },
        scale: 2.5,
        offset: {
            x: 400,
            y: 235
        },
        imageSrc: './img/Fire/png/fire_knight/01_idle/Idle.png',
        framesMax: 8,
        scale: 2,
        offset: {
            x: 215,
            y: 200
        },
        sprites: {
            idle: {
                imageSrc: './img/Fire/png/fire_knight/01_idle/Idle.png',
                framesMax: 8
            },
            run: {
                imageSrc: './img/Fire/png/fire_knight/02_run/Run.png',
                framesMax: 8
            },
            jump: {
                imageSrc: './img/Fire/png/fire_knight/03_jump/Jump.png',
                framesMax: 20
            },
            fall: {
                imageSrc: './img/Fire/png/fire_knight/03_jump_down/fall.png',
                framesMax: 3
            },
            attack: {
                imageSrc: './img/Fire/png/fire_knight/05_1_atk/attack.png',
                framesMax: 11
            },
            takeHit: {
                imageSrc: './img/Fire/png/fire_knight/10_take_hit/takeHit.png',
                framesMax: 6
            },
            death: {
                imageSrc: './img/Fire/png/fire_knight/11_death/death.png',
                framesMax: 13
            },

        },
        attackBox: {
            offset: {
                x: 90,
                y: -50
            },
            width: 100,
            height: 50
        }
    })

    enemy = new Fighter({
        position: {
            x: 950,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'blue',
        offset: {
            x: -50,
            y: 0
        },
        scale: 2.75,
        offset: {
            x: 0,
            y: 0
        },
        imageSrc: './img/Crystal/animations/PNG/idle/IdleC.png',
        framesMax: 8,
        scale: 2,
        offset: {
            x: 215,
            y: 200
        },
        sprites: {
            idle: {
                imageSrc: './img/Crystal/animations/PNG/idle/IdleC.png',
                framesMax: 8
            },
            run: {
                imageSrc: './img/Crystal/animations/PNG/run/RunC.png',
                framesMax: 8
            },
            jump: {
                imageSrc: './img/Crystal/animations/PNG/j_up/JumpC.png',
                framesMax: 3
            },
            fall: {
                imageSrc: './img/Crystal/animations/PNG/j_down/FallC.png',
                framesMax: 3
            },
            attack: {
                imageSrc: './img/Crystal/animations/PNG/2_atk/attackC.png',
                framesMax: 7
            },
            takeHit: {
                imageSrc: './img/Crystal/animations/PNG/take_hit/takeHitC.png',
                framesMax: 6
            },
            death: {
                imageSrc: './img/Crystal/animations/PNG/death/deathC.png',
                framesMax: 15
            },
        },
        attackBox: {
            offset: {
                x: -70,
                y: -50
            },
            width: 100,
            height: 50
        }
    })
}

// Define restartGame() function
function restartGame() {
    // Reset game state
    resetSprites();
    intro_screen = true
    game_screen = false
    gsap.to('#playerHealth', {
        width: player.health + '%'
    })
    gsap.to('#enemyHealth', {
        width: enemy.health + '%'
    })
    document.querySelector('#displayText').innerHTML = ''
    // Start animation again

    timer = 180
    timer_started = false
}