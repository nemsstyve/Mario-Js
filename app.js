// tp mauvais
kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 1, 0.4],
})

// Speed identifiers
const MOVE_SPEED = 120
const JUMP_FORCE = 420
const BIG_JUMP_FORCE = 450
let CURRENT_JUMP_FORCE = JUMP_FORCE
const FALL_DEATH = 400
const ENEMY_SPEED = 20


// Game logic
let isJumping = true
let isBig = false

//penser au chateaux
loadRoot('images/')
loadSprite('link-left', '1Xq9biB.png')
loadSprite('cloud', 'Y0oHyRl.png')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('link-right', 'yZIb8O2.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')
loadSprite('ground', 'ground.png')
loadSprite('blueGround', 'blueGround.png')
loadSprite('castle', 'castle.png')


loadSprite('top-left', 'ReTPiWY.png')
loadSprite('top-right', 'hj2GK4n.png')
loadSprite('bottom-left', 'c1cYSbt.png')
loadSprite('bottom-right', 'nqQ79eI.png')

loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')



scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui', 'po'], 'obj')
        //12éè = fake
    const maps = [
        [
            '                                                                                                                                       ',
            '=      ~                                                                                                                               ',
            '=             ~                                                                                                                    ',
            '=                                                                                                                                ',
            '=                     %                                                                     666666666                             ',
            '=                                                                                                                                ',
            '=                                                6666                           12                      666*           66            C',
            '=               %   6*6%6                                      ==   =           ()     666                            666                   ',
            '=                                                             ===   ==    6%6   ()                                   6666        ',
            '=           12                        -+    12               ====   ===         ==                                  66666        ',
            '=           ()      ^          ^      ()    ()     ^    ^   =====   ====    ^  ====                             ^  666666         ',
            'G                  G                        G                       G                                 G                 G  ',

        ],
        [
            '£                                       £',
            '£                                       £',
            '£                                       £',
            '£                                       £',
            '£                                       £',
            '£                                       £',
            '£        @@@@@@              x x        £',
            '£                          x x x        £',
            'p                        x x x x  x   -+£',
            '£  z    z     z   z z  x x x xzx zx   ()£',
            'g            g      g',
        ]
    ];

    const levelCfg = {
        width: 20,
        height: 20,
        '~': [sprite('cloud'), scale(0.2)],
        '6': [sprite('brick'), solid(), 'bot'],
        '9': [sprite('block')],
        '=': [sprite('block'), solid(), 'bot'],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        'G': [sprite('ground'), solid()],
        'g': [sprite('blueGround'), solid()],
        'C': [sprite('castle'), solid(), 'fin'],
        //fake 
        '1': [sprite('top-left'), solid(), scale(0.5)],
        '2': [sprite('top-right'), solid(), scale(0.5)],
        //true
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5), 'bot'],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5), 'bot'],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(), 'dangerous', scale(0.9), body(), { dir: -1 }, 'bot'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],
        '!': [sprite('blue-block'), solid(), scale(0.5), 'bot'],
        '£': [sprite('blue-brick'), solid(), scale(0.5), 'bot'],
        'p': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.45), 'dangerous', body(), { dir: -1 }, 'bot'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
        'x': [sprite('blue-steel'), solid(), scale(0.5), 'bot'],

    };

    const gameLevel = addLevel(maps[level], levelCfg);

    const player = add([
        sprite('link-right'), solid(), scale(0.40),
        pos(100, 205),
        body(),
        origin('bot')
    ])

    const scoreLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
        }
    ]);
    add([
        text("Level-1"),
        pos(500, 6),
        layer('po')
    ]);

    add([text('level ' + parseInt(level + 1)), pos(40, 6)]);

    function toBig() {
        if (isBig == false) {
            isBig = true;
            player.scale = vec2(0.60);
            CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
        } else {
            scoreLabel.value += 500;
        };
    }

    function toSmall() {
        isBig = false;
        CURRENT_JUMP_FORCE = JUMP_FORCE;
    }

    player.action(() => {
        camPos(player.pos);
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value });
        };
    })

    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn('}', obj.gridPos.sub(0, 0));
        };
        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn('}', obj.gridPos.sub(0, 0));
        };
    });


    action('mushroom', (m) => {
        m.move(20, 0)
    });

    player.collides('mushroom', (m) => {
        destroy(m);
        toBig();
    });

    // action('dangerous', (d) => {
    //   if (ENEMY_SPEED == 0) {
    //     ENEMY_SPEED = -ENEMY_SPEED
    //   }else{
    //     d.move(-ENEMY_SPEED, 0);
    //   }

    // });
    // collides('dangerous', 'bot', (d)=>{
    //   d.move(ENEMY_SPEED,0);
    // })

    action('dangerous', (d) => {
        d.move(d.dir * ENEMY_SPEED, 0)
    })

    collides('dangerous', 'bot', (d) => {
        d.dir = -d.dir
    })

    player.collides('dangerous', (d) => {
        if (isJumping) {
            scoreLabel.value += 200;
            scoreLabel.text = scoreLabel.value;
            destroy(d);
        } else {
            if (isBig) {
                toSmall();
            } else {
                go('lose', { score: scoreLabel.value });
            };
        };
    });

    player.collides('coin', (c) => {
        destroy(c);
        scoreLabel.value++;
        scoreLabel.text = scoreLabel.value;
    });

    //pour retrecir
    // player.collides('dangerous', (d) =>{
    //   if (biggify) {
    //     player.smallify(1)
    //   } else{
    //     go('lose', { score: scoreLabel.value})
    //   }
    // })

    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            });
        });
    });

    keyDown('left', () => {
        if (isBig == false) {
            player.changeSprite('link-left');
        } else {
            player.changeSprite('link-left');
        }
        player.move(-MOVE_SPEED, 0);
    });

    keyDown('right', () => {
        if (isBig == false) {
            player.changeSprite('link-right');
        } else {
            player.changeSprite('link-right');
        }
        player.move(MOVE_SPEED, 0);
    });

    player.action(() => {
        if (player.grounded()) {
            isJumping = false;
        } else {
            isJumping = true;
        };
    });

    keyPress('space', () => {
        if (player.grounded()) {
            isJumping = true;
            player.jump(CURRENT_JUMP_FORCE);
        };
    });
});

// player.collides('fin', () => {
//   keyPress('top', () => {
//     go('win', { score: scoreLabel.value});
//   });
// });
// scene('win', ({score}) => {
//   add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)]);
// });
scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)]);
});

start("game", { level: 0, score: 0 });