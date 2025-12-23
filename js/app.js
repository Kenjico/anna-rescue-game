// --- SPIEL-EINSTELLUNGEN & VARIABLEN ---
let board, context;
let boardWidth, boardHeight;

// --- AUDIO SETTINGS ---
let jumpSound = new Audio("./soundeffect/action/jump.wav");
jumpSound.volume = 0.4;
let startMusic = new Audio("./soundeffect/start_screen/start-screen.mp3");
startMusic.loop = true;
startMusic.volume = 0.5;

let levelMusics = [
  new Audio("./soundeffect/levels/level1.mp3"),
  new Audio("./soundeffect/levels/level2.mp3"),
  new Audio("./soundeffect/levels/level3.mp3"),
  new Audio("./soundeffect/levels/level4.mp3"),
  new Audio("./soundeffect/levels/level5.mp3")
];
levelMusics.forEach(track => { track.loop = true; track.volume = 0.4; });
let currentPlayingTrack = null;

// --- STATUS ---
let gameStarted = false;
let showIntro = false;
let introPage = 0;
let currentStoryLevel = 0;
let gameOver = false;
let lastIntermissionTime = 0;

// --- STORY DATEN ---
const storyData = [
  {
    title: "Filmabend mit Folgen",
    background: null,
    pages: [
      ["Anna und Marike genießen ihren Girlsabend,", "als die Idylle explodiert: Ein Knall erschüttert", "den Raum und ein Axt-Mörder springt direkt", "aus dem Fernseher!"],
      ["Er schnappt sich Sahin und will mit ihm fliehen.", "Doch Anna lässt ihn nicht entkommen.", "Der Axt-Mörder entfesselt seine magischen Schöpfungen,", "um sie aufzuhalten:"],
      ["Popcorn-Geister, fliegende Fernbedienungen", "und gefährliche Wein-Schleime versperren den Weg.", "Die Jagd beginnt.", "Schnapp Ihn dir Anna – rette Sahin!"]
    ]
  },
  {
    title: "Level 2: Die Radjagd von Holland",
    pages: [
      ["Annas Jagd auf den Axt-Mörder führt sie ","über die Grenze in die Niederlande." , "Um keine Zeit zu verlieren, schwingt sie sich ","auf ihr Fahrrad und tritt kräftig in die Pedale."],
      ["Doch der Entführer lässt nicht locker ","und"," nutzt seine Magie, um das Land gegen sie aufzuwiegeln"],
      ["Fliegende Käserollen, Böse Tulpen,", "Besessene Mieträder...", "Anna gibt Gas – nichts bringt sie aus der Spur!"]
    ]
  },
  {
    title: "Level 3: Aufguss des Grauens",
    pages: [
      ["Die Verfolgung führt Anna tief in den Schwarzwald,", "bis in eine sagenumwobene Therme.","Der Axt-Mörder hat das Thermalbad","in eine Falle verwandelt."],
      ["Böse Seifengeister,", "Wutentbrannte Saunameister,", "Rutschige Seifen..."],
      ["Doch Anna lässt sich nicht einseifen,", "sie zieht gnadenlos durch!"]
    ]
  },
  {
    title: "Level 4: Den Blauen im Blick",
    pages: [
      ["Direkt aus der Therme jagt Anna den Entführer", "hinauf in die steilen Berge.","Der Axt-Mörder wirft ihr alles entgegen",", was der Berg zu bieten hat."],
      ["Axt-Mörder in Ausbildung,", "Wildschweine, nervige Wanderer,", "die völlig orientierungslos im Weg stehen."],
      ["Das Ziel ist zum Greifen nah.", "Anna lässt nicht locker!"]
    ]
  },
  {
    title: "Level 5: Das Finale",
    pages: [
      ["Endstation für den Schurken!", "Mit einer sauberen Links-Rechts-Kombination"," schickt Anna den Axt-Mörder schlafen."],
      ["Sahin ist frei und hat nur einen Wunsch:", "Urlaub mit dir!"],
      ["Auf nach Kappadokien!"]
    ]
  }
];

// --- RAHMEN & POSITIONIERUNG ---
let frameImg;
let framePadding = 60;

let dinoWidth = 80, dinoHeight = 85;
let dinoX = 80 + framePadding;
let dinoY;
let dinoImg;
let dino = { x: dinoX, y: 0, width: dinoWidth, height: dinoHeight };

let level1Img, level2Img, level3Img, level4Img, level5Img, startScreenImg;
let annaCasualImg, annaBikeImg, annaTowelImg, annaHikingImg, annaDuoImg, annaDeadImg;
let birdImg, cloudImg;
let backgroundObject = { x: 0, y: 50 + framePadding, width: 60, height: 40, speed: -3 };

let cactusArray = [];
let monstersLevel1 = [], monstersLevel2 = [], monstersLevel3 = [], monstersLevel4 = [], monstersLevel5 = [];

let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let score = 0;
let lastScore = 0;
let highScore = 0;
let startScore = 0;

let btnW = 140;
let btnH = 55;
let playBtnSize = 150;

window.onload = function() {
  let savedHighScore = localStorage.getItem("dinoHighScore");
  if (savedHighScore) highScore = parseInt(savedHighScore);

  board = document.getElementById("board");
  boardWidth = window.innerWidth;
  boardHeight = window.innerHeight;
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  dinoY = boardHeight - dinoHeight - framePadding - 15;
  dino.y = dinoY;

  frameImg = new Image(); frameImg.src = "./img/start_screen/frame.png";
  annaCasualImg = new Image(); annaCasualImg.src = "./img/level_1/avatar/anna_casual.png";
  annaBikeImg = new Image(); annaBikeImg.src = "./img/level_2/avatar/anna_bike.png";
  annaTowelImg = new Image(); annaTowelImg.src = "./img/level_3/avatar/anna_towel.png";
  annaHikingImg = new Image(); annaHikingImg.src = "./img/level_4/avatar/anna_hiking.png";
  annaDuoImg = new Image(); annaDuoImg.src = "./img/level_5/avatar/anna_and_boyfriend.png";
  annaDeadImg = new Image(); annaDeadImg.src = "./img/dino-dead.png";

  startScreenImg = new Image(); startScreenImg.src = "./img/start_screen/start-screen.png";
  level1Img = new Image(); level1Img.src = "./img/level_1/background/level1.png";
  level2Img = new Image(); level2Img.src = "./img/level_2/background/level2.png";
  level3Img = new Image(); level3Img.src = "./img/level_3/background/level3.png";
  level4Img = new Image(); level4Img.src = "./img/level_4/background/level4.png";
  level5Img = new Image(); level5Img.src = "./img/level_5/background/level5.png";

  storyData[0].background = level1Img;
  storyData[1].background = level2Img;
  storyData[2].background = level3Img;
  storyData[3].background = level4Img;
  storyData[4].background = level5Img;

  introBtnImg = new Image(); introBtnImg.src = "./img/start_screen/intro.png";
  secretLockedImg = new Image(); secretLockedImg.src = "./img/start_screen/secret_locked.png";
  secretUnlockedImg = new Image(); secretUnlockedImg.src = "./img/start_screen/secret_unlocked.png";
  playBtnImg = new Image(); playBtnImg.src = "./img/start_screen/play.png";

  btn25kImg = new Image(); btn25kImg.src = "./img/start_screen/checkpoints/button2,5k.png";
  btn5kImg = new Image(); btn5kImg.src = "./img/start_screen/checkpoints/button5,0k.png";
  btn75kImg = new Image(); btn75kImg.src = "./img/start_screen/checkpoints/button7,5k.png";
  btn10kImg = new Image(); btn10kImg.src = "./img/start_screen/checkpoints/button10k.png";

  birdImg = new Image(); birdImg.src = "./img/bird1.png";
  cloudImg = new Image(); cloudImg.src = "./img/cloud.png";

  monstersLevel1 = loadMonsterSet(["./img/level_1/monster/flying_remote.png", "./img/level_1/monster/popcorn_ghost.png", "./img/level_1/monster/wine_slime.png"]);
  monstersLevel2 = loadMonsterSet(["./img/level_2/monster/evil_bike.png", "./img/level_2/monster/evil_tulp.png", "./img/level_2/monster/rolling_cheese.png"]);
  monstersLevel3 = loadMonsterSet(["./img/level_3/monster/grimmy_shoes.png", "./img/level_3/monster/sauna_master.png", "./img/level_3/monster/soap_monster.png"]);
  monstersLevel4 = loadMonsterSet(["./img/level_4/monster/annoying_hiker.png", "./img/level_4/monster/axt_murderer.png", "./img/level_4/monster/wild_boar.png"]);
  monstersLevel5 = loadMonsterSet(["./img/level_5/monster/happy_cats.png", "./img/level_5/monster/selfie_tourist.png", "./img/level_5/monster/turkish_tee.png"]);

  dinoImg = annaCasualImg;
  requestAnimationFrame(update);
  setInterval(placeCactus, 1000);

  document.addEventListener("mousedown", moveDino);
  document.addEventListener("touchstart", moveDino, {passive: false});
  document.addEventListener("keydown", moveDino);
};

function loadMonsterSet(paths) {
  return paths.map(path => { let img = new Image(); img.src = path; return img; });
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  if (showIntro) {
    drawIntroScreen();
    return;
  }

  if (!gameStarted) {
    drawStartScreen();
    stopAllLevelMusic();
    if (startMusic.paused) startMusic.play().catch(() => {});
    return;
  }

  if (!startMusic.paused) { startMusic.pause(); startMusic.currentTime = 0; }

  if (gameOver) {
    if (score > highScore) { highScore = score; localStorage.setItem("dinoHighScore", highScore); }
    lastScore = score;
    gameStarted = false;
    currentStoryLevel = 0;
    stopAllLevelMusic();
    resetGame();
    return;
  }

  // --- LEVEL LOGIK & AUTOMATISCHE INTERMISSIONS ---
  let currentBg, levelIndex = 0;
  if (score < 2500) { currentBg = level1Img; dinoImg = annaCasualImg; levelIndex = 0; }
  else if (score < 5000) { if (currentStoryLevel < 1) triggerIntermission(1); currentBg = level2Img; dinoImg = annaBikeImg; levelIndex = 1; }
  else if (score < 7500) { if (currentStoryLevel < 2) triggerIntermission(2); currentBg = level3Img; dinoImg = annaTowelImg; levelIndex = 2; }
  else if (score < 10000) { if (currentStoryLevel < 3) triggerIntermission(3); currentBg = level4Img; dinoImg = annaHikingImg; levelIndex = 3; }
  else { if (currentStoryLevel < 4) triggerIntermission(4); currentBg = level5Img; dinoImg = annaDuoImg; levelIndex = 4; }

  updateLevelMusic(levelIndex);

  if (isImageValid(currentBg)) context.drawImage(currentBg, 0, 0, board.width, board.height);

  let currentBgObjImg = (score >= 2500 && score < 5000) ? birdImg : (score >= 7500) ? cloudImg : null;
  if (isImageValid(currentBgObjImg)) {
    backgroundObject.x += backgroundObject.speed;
    if (backgroundObject.x + backgroundObject.width < framePadding) {
      backgroundObject.x = board.width - framePadding;
      backgroundObject.y = framePadding + Math.random() * (boardHeight / 3);
    }
    context.drawImage(currentBgObjImg, backgroundObject.x, backgroundObject.y, backgroundObject.width, backgroundObject.height);
  }

  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY);
  if (isImageValid(dinoImg)) context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  for (let i = 0; i < cactusArray.length; i++) {
    let monster = cactusArray[i];
    monster.x += velocityX;
    if (isImageValid(monster.img) && monster.x > framePadding - 20) {
      context.drawImage(monster.img, monster.x, monster.y, monster.width, monster.height);
    }
    if (detectCollision(dino, monster)) { gameOver = true; dinoImg = annaDeadImg; }
  }

  if (isImageValid(frameImg)) context.drawImage(frameImg, 0, 0, board.width, board.height);

  score++;
  context.fillStyle = "white";
  context.font = "bold 22px courier";
  context.textAlign = "right";
  context.fillText("Punkte: " + score, board.width - framePadding - 60, framePadding + 60);
}

function triggerIntermission(levelIdx) {
  showIntro = true;
  introPage = 0;
  currentStoryLevel = levelIdx;
  cactusArray = [];
  lastIntermissionTime = Date.now();
}

function drawIntroScreen() {
  const data = storyData[currentStoryLevel];
  context.globalAlpha = 0.5;
  if (isImageValid(data.background)) context.drawImage(data.background, 0, 0, board.width, board.height);
  context.globalAlpha = 1.0;
  if (isImageValid(frameImg)) context.drawImage(frameImg, 0, 0, board.width, board.height);

  context.fillStyle = "white";
  context.textAlign = "center";
  context.font = "bold 28px 'Courier New', Courier, monospace";
  context.fillText(data.title, board.width / 2, framePadding + 50);

  context.font = "bold 20px 'Courier New', Courier, monospace";
  let textBlock = data.pages[introPage];
  let yOffset = framePadding + 100;
  textBlock.forEach(line => { context.fillText(line, board.width / 2, yOffset); yOffset += 35; });

  context.font = "14px courier";
  context.fillText((introPage + 1) + " / 3", board.width / 2, board.height - framePadding - 40);
}

function updateLevelMusic(index) {
  let targetTrack = levelMusics[index];
  if (currentPlayingTrack !== targetTrack) {
    stopAllLevelMusic();
    currentPlayingTrack = targetTrack;
    currentPlayingTrack.play().catch(() => {});
  }
}

function stopAllLevelMusic() {
  levelMusics.forEach(track => { track.pause(); track.currentTime = 0; });
  currentPlayingTrack = null;
}

function placeCactus() {
  if (gameOver || !gameStarted || showIntro) return;

  let currentSet;
  if (score < 2500) currentSet = monstersLevel1;
  else if (score < 5000) currentSet = monstersLevel2;
  else if (score < 7500) currentSet = monstersLevel3;
  else if (score < 10000) currentSet = monstersLevel4;
  else currentSet = monstersLevel5;

  let selectedImg = currentSet[Math.floor(Math.random() * currentSet.length)];

  // --- INDIVIDUELLE GRÖSSEN-LOGIK ---
  let w = 65; // Standardbreite
  let h = 70; // Standardhöhe

  // Beispiel-Abfragen für Dateinamen
  if (selectedImg.src.includes("wine_slime.png")) { w = 50; h = 45; }
  else if (selectedImg.src.includes("flying_remote.png")) { w = 60; h = 40; }
  else if (selectedImg.src.includes("rolling_cheese.png")) { w = 75; h = 75; }
  else if (selectedImg.src.includes("axt_murderer.png")) { w = 85; h = 95; }
  else if (selectedImg.src.includes("wild_boar.png")) { w = 80; h = 60; }
  else if (selectedImg.src.includes("happy_cats.png")) { w = 70; h = 60; }
  else if (selectedImg.src.includes("evil_bike.png")) { w = 180; h = 100; }
  else if (selectedImg.src.includes("sauna_master.png")) { w = 180; h = 100; }

  let monster = {
    img: selectedImg,
    x: boardWidth - framePadding,
    y: boardHeight - h - framePadding - 15,
    width: w,
    height: h
  };

  cactusArray.push(monster);
  if (cactusArray.length > 5) cactusArray.shift();
}

function detectCollision(a, b) {
  return a.x < b.x + b.width * 0.7 && a.x + a.width * 0.7 > b.x && a.y < b.y + b.height * 0.7 && a.y + a.height * 0.7 > b.y;
}

function isImageValid(img) { return img && img.complete && img.naturalWidth !== 0; }

function resetGame() {
  score = startScore;
  if (score >= 10000) currentStoryLevel = 4;
  else if (score >= 7500) currentStoryLevel = 3;
  else if (score >= 5000) currentStoryLevel = 2;
  else if (score >= 2500) currentStoryLevel = 1;
  else currentStoryLevel = 0;

  cactusArray = []; gameOver = false; velocityY = 0; dino.y = dinoY; backgroundObject.x = board.width - framePadding;
}

function drawStartScreen() {
  if (isImageValid(startScreenImg)) context.drawImage(startScreenImg, 0, 0, board.width, board.height);
  else { context.fillStyle = "black"; context.fillRect(0, 0, board.width, board.height); }

  context.fillStyle = "white";
  context.textAlign = "center";
  context.font = "bold 32px courier";
  context.fillText("ANNA TO THE RESCUE", board.width / 2, board.height / 2 - 160);

  if (isImageValid(playBtnImg)) {
    context.drawImage(playBtnImg, board.width / 2 - playBtnSize/2, board.height / 2 - playBtnSize/2, playBtnSize, playBtnSize);
  }

  context.font = "bold 20px courier";
  context.fillText("START AB: " + startScore, board.width / 2, board.height / 2 + 100);
  if (lastScore > 0) context.fillText("LETZTER SCORE: " + lastScore, board.width / 2, board.height / 2 + 130);

  let leftX = 100, startY = board.height / 2 - 110, gap = 70;
  let checkpointData = [{ s: 2500, img: btn25kImg }, { s: 5000, img: btn5kImg }, { s: 7500, img: btn75kImg }, { s: 10000, img: btn10kImg }];

  checkpointData.forEach((data, index) => {
    let isUnlocked = highScore >= data.s;
    let yPos = startY + (index * gap);
    context.globalAlpha = isUnlocked ? 1.0 : 0.4;
    if (isImageValid(data.img)) context.drawImage(data.img, leftX - btnW/2, yPos, btnW, btnH);
    context.globalAlpha = 1.0;
    if (startScore === data.s) { context.strokeStyle = "gold"; context.lineWidth = 5; context.strokeRect(leftX - btnW/2 - 2, yPos - 2, btnW + 4, btnH + 4); }
  });

  let rightX = board.width - 100;
  if (isImageValid(introBtnImg)) context.drawImage(introBtnImg, rightX - btnW/2, startY + 20, btnW, btnH + 10);
  let sImg = (highScore >= 10000) ? secretUnlockedImg : secretLockedImg;
  if (isImageValid(sImg)) context.drawImage(sImg, rightX - btnW/2, startY + 100, btnW, btnH + 20);
}

function moveDino(e) {
  // Verhindert das lästige Zoomen/Scrollen beim Tippen
  if (e.cancelable) e.preventDefault();

  // --- KOORDINATEN FÜR TOUCH ODER MAUS HOLEN ---
  let clientX, clientY;
  if (e.type === "touchstart") {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  // --- LOGIK FÜR INTRO & STARTMENÜ ---
  if (showIntro) {
    if (Date.now() - lastIntermissionTime < 500) return;
    if (introPage < 2) {
      introPage++;
      lastIntermissionTime = Date.now();
    } else {
      showIntro = false;
      introPage = 0;
      if (!gameStarted) {
        gameStarted = true;
        resetGame();
      }
    }
    return;
  }

  if (!gameStarted) {
    let rect = board.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Skalierung anpassen (falls das Canvas auf dem Handy gestreckt wird)
    let scaleX = board.width / rect.width;
    let scaleY = board.height / rect.height;
    x *= scaleX;
    y *= scaleY;

    let rightX = board.width - 100, startY = board.height / 2 - 110;

    // Intro-Button
    if (x > rightX - btnW/2 && x < rightX + btnW/2 && y > startY + 20 && y < startY + 20 + btnH + 10) {
      currentStoryLevel = 0; showIntro = true; introPage = 0; startScore = 0; lastIntermissionTime = Date.now(); return;
    }

    // Checkpoints
    if (x < 200) {
      let cp_startY = board.height / 2 - 110, cp_gap = 70;
      if (y > cp_startY && y < cp_startY + btnH && highScore >= 2500) startScore = 2500;
      else if (y > cp_startY + cp_gap && y < cp_startY + cp_gap + btnH && highScore >= 5000) startScore = 5000;
      else if (y > cp_startY + cp_gap*2 && y < cp_startY + cp_gap*2 + btnH && highScore >= 7500) startScore = 7500;
      else if (y > cp_startY + cp_gap*3 && y < cp_startY + cp_gap*3 + btnH && highScore >= 10000) startScore = 10000;
      else startScore = 0;
      return;
    }

    // Play-Button
    let pRadius = playBtnSize / 2;
    if (x > board.width / 2 - pRadius && x < board.width / 2 + pRadius && y > board.height / 2 - pRadius && y < board.height / 2 + pRadius) {
      startMusic.pause(); startMusic.currentTime = 0; gameStarted = true; resetGame();
    }
    return;
  }

  // --- SPRUNG-LOGIK IM SPIEL ---
  // Reagiert auf Tastatur (Space/Up) ODER Tippen auf das Display
  if (e.code === "Space" || e.code === "ArrowUp" || e.type === "touchstart" || e.type === "mousedown") {
    if (dino.y >= dinoY - 5) {
      velocityY = -10;
      jumpSound.currentTime = 0;
      jumpSound.play();
    }
  }
}
