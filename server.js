// server.js - KnifeDuels Backend
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const WebSocketServer = require('ws');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  if (fs.existsSync(HTML_FILE)) {
    res.sendFile(HTML_FILE);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const MATCHES_FILE = path.join(__dirname, 'matches.json');
const TICKETS_FILE = path.join(__dirname, 'tickets.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const BRAINROTS_FILE = path.join(__dirname, 'brainrots.json');
const GIVEAWAY_FILE = path.join(__dirname, 'giveaway.json');
const HTML_FILE = path.join(__dirname, 'KnifeDuels.html');

function loadFile(file, def = []) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {}
  return def;
}

function saveFile(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {}
}

const BRAINROT_VALUES = {
  "1x1x1x1": 1000,
  "25": 1000,
  "67": 500,
  "89": 1000,
  "Abyssaloco": 15000,
  "Agarrini la Palini": 5000,
  "Antonio": 700000,
  "Aquarino": 250000,
  "Arcadragon": 250000,
  "Bacuru and Egguru": 2000,
  "Bananito": 1000,
  "Baskito": 1000,
  "Bearito Cabinito": 5000,
  "Boppin Bunny": 65000,
  "Bumbatron": 10000,
  "Bunny and Eggy": 130000,
  "Burguro and Fryuro": 70000,
  "Camera Ramena": 5000,
  "Cangurato Gelato": 25000,
  "Capitano Americano": 10000,
  "Capitano Moby": 70000,
  "Cash or Card": 45000,
  "Caylusaurus": 12000,
  "Celularcini Viciosini": 30000,
  "Cerberus": 80000,
  "Chillin Chili": 10000,
  "Chipso and Queso": 10000,
  "Cloverat Clapat": 75000,
  "Coco and Mango": 8000,
  "Cooki and Milki": 130000,
  "Dragon Aquanini": 1200000,
  "Dragon Cannelloni": 1000000,
  "Dragon Gingerini": 1200000,
  "Dug dug dug": 300000,
  "Duggy Bros": 350000,
  "Elefanto Frigo": 3000000,
  "Eviledon": 5000,
  "Festive 67": 150000,
  "Fishino Clownino": 200000,
  "Fortunu and Cashuru": 250000,
  "Foxini Lanternini": 250000,
  "Fragola La La La": 150000,
  "Fragrama and Chocrama": 150000,
  "Garama and Madundung": 50000,
  "Ginger Gerat": 850000,
  "Globa Steppa": 350000,
  "Gobblino Uniciclino": 10000,
  "Gold Gold Gold": 5000,
  "Griffin": 1300000,
  "Guest 666": 10000,
  "Gym Bros": 15000,
  "Honey Honey Bear": 10000,
  "Honey Honey Narwhal": 10000,
  "Hopilikalika Hopilikalako": 50000,
  "Hydra Bunny": 600000,
  "Hydra Dragon Cannelloni": 1100000,
  "Jelly Moby": 450000,
  "Jolly Jolly Sahur": 100000,
  "Kalika Bros": 250000,
  "Ketchuru and Musturu": 25000,
  "Ketupat Bros": 500000,
  "Ketupat Kepat": 8000,
  "Kraken": 1500000,
  "La Anniversary Grande": 10000,
  "La Breakfast Combinasion": 376000,
  "La Casa Boo": 300000,
  "La Craft Machine": 250000,
  "La Extinct Grande": 8000,
  "La Food Combinasion": 300000,
  "La Fuse Machine": 250000,
  "La Ginger Sekolah": 25000,
  "La Grande Combinasion": 2000,
  "La Jolly Grande": 3000,
  "La Lucky Grande": 3000,
  "La Romantic Grande": 3000,
  "La Secret Combinasion": 75000,
  "La Spooky Grande": 3000,
  "La Summer Grande": 4000,
  "La Supreme Combinasion": 1200000,
  "La Taco Combinasion": 13500,
  "Las Sis": 10000,
  "Lavadorito Spinito": 7000,
  "Los Admins": 130000,
  "Los Amigos": 100000,
  "Los Bros": 8500,
  "Los Chillis": 75000,
  "Los Cupids": 7000,
  "Los Fruits": 4000,
  "Los Hackers": 100000,
  "Los Hotspotsitos": 20000,
  "Los Jolly Combinasionas": 10000,
  "Los Mariachis": 8000,
  "Los Planitos": 8000,
  "Los Primos": 12000,
  "Los Puggies": 6000,
  "Los Secret Combinasionas": 100000,
  "Los Sekolahs": 150000,
  "Los Spaghettis": 25000,
  "Los Tacoritas": 5000,
  "Los Tangcitos": 5000,
  "Los Tictacs": 7000,
  "Love Love Bear": 500000,
  "Lovin Rose": 25000,
  "Mariachi Corazoni": 3000,
  "Mieteteira Bicicleteira": 2000,
  "Moby Bros": 150000,
  "Money Money Bros": 27500,
  "Money Money Puggy": 3000,
  "Money Money Reindeer": 7000,
  "Nacho Spyder": 7000,
  "Nachorilla": 10000,
  "Noodle Noodle Poodle": 1500,
  "Orcaledon": 10000,
  "Pancake and Syrup": 150000,
  "Pizza and Ranch": 200000,
  "Popcuru and Fizzuru": 120000,
  "Reinito Sleighito": 220000,
  "Rosetti Tualetti": 18000,
  "Rubiko and Kubiko": 100000,
  "Rubrikiko": 80000,
  "S'more Serat": 150000,
  "Sammyni Cakini": 150000,
  "Sammyni Fattini": 70000,
  "Sammyni Truckini": 90000,
  "Steakini Fattini": 150000,
  "Spaghetti Tualetti": 1000,
  "Spooky and Pumpky": 100000,
  "Dragon Canelloni": 1000000,
  "Dragon Cannellloni": 1000000,
  "Hydra Dragon Canelloni": 1100000,
  "1x1x1x1x": 1000
};

const ALL_SECRET_NAMES = [
  "Griffin", "Dragon Aquanini", "Dragon Gingerini", "Hydra Dragon Cannelloni", "Signore Carapace",
  "Dragon Cannelloni", "Moby Bros", "Love Love Bear", "Arcadragon", "Kraken", "Digi Narwhal",
  "La Supreme Combinasion", "Elefanto Frigo", "Hydra Bunny", "Celestial Pegasus", "Cerberus",
  "Jelly Moby", "Venuspino", "Bumbatron", "Popcuru and Fizzuru", "Bunny and Eggy", "Rosey and Teddy",
  "La Breakfast Combinasion", "Capitano Moby", "Orchidox", "Cooki and Milki", "Burguro and Fryuro",
  "Los Secret Combinasionas", "Ketupat Bros", "Reinito Sleighito", "Pizza and Ranch", "Los Amigos",
  "Fortunu and Cashuru", "Pancake and Syrup", "La Secret Combinasion", "Antonio", "Fishino Clownino",
  "Kalika Bros", "Foxini Lanternini", "Los Sekolahs", "Sammyni Truckini", "Cash or Card",
  "Fragrama and Chocrama", "La Casa Boo", "La Fuse Machine", "Los Admins", "La Food Combinasion",
  "Duggy Bros", "Yetimatic", "S'more Serat", "Sammyni Cakini", "Boppin Bunny", "Spooky and Pumpky",
  "Cangurato Gelato", "Ginger Gerat", "Los Hackers", "Los Chillis", "La Ginger Sekolah",
  "Rubiko and Kubiko", "Capitano Americano", "Bearito Cabinito", "Sammyni Fattini", "Los Spaghettis",
  "Rubrikiko", "Examen Bros", "Festive 67", "Guest 666", "Ventoliero Pavonero", "Queen Bee",
  "Quackini Snackini", "Pop Pop Petalini", "Grabatron", "Spaghetti Tualetti", "La Summer Grande",
  "Cloverat Clapat", "Los Tictacs", "Candini Fluffini", "Polaroidini", "Hopilikalika Hopilikalako",
  "Caylusaurus", "Steakini Fattini", "La Easter Grande", "Garama and Madundung", "Rosetti Tualetti",
  "La Anniversary Grande", "Nacho Spyder", "Nachorilla", "Scorpino Coasterino", "Money Money Bros",
  "Lavadorito Spinito", "Gold Gold Gold", "Jolly Jolly Sahur", "Rico Dinero", "Ketchuru and Musturu",
  "Tirilikalika Tirilikalako", "Gym Bros", "Los Tangcitos", "Swaggy Bros", "Orcaledon",
  "La Lucky Grande", "La Romantic Grande", "Tictac Sahur", "Ketupat Kepat", "Dug dug dug",
  "La Taco Combinasion", "Tang Tang Keletang", "Coco and Mango", "Abyssaloco", "Noo my Resume",
  "Noo my Examen", "Esok Goala", "Fragola La La La", "Lovin Rose", "Los Tacoritas",
  "Bufalino Boomberino", "Honey Honey Bear", "Eviledon", "Puffino Builderino", "Los Primos",
  "Esok Sekolah", "Sand Sand Sand", "Los Mariachis", "La Jolly Grande", "Los Cupids",
  "W or L", "Los Puggies", "Noodle Noodle Poodle", "Gobblino Uniciclino", "Globa Steppa",
  "Tralaledon", "Tacoturbo Tacorito", "Tuff Toucan", "Mieteteira Bicicleteira", "Money Money Reindeer",
  "Chipso and Queso", "Chillin Chili", "La Spooky Grande", "Bacuru and Egguru", "Los Bros",
  "La Extinct Grande", "Los Candies", "Los Fruits", "Celularcini Viciosini", "Los 67",
  "Capitano Gullini", "Los Mobilis", "Money Money Puggy", "Churrito Bunnito", "Cigno Fulgoro",
  "Frullato Framingo", "Los Jolly Combinasionas", "Los Spooky Combinasionas", "Los Hotspotsitos",
  "Peschito Machito", "Chicleteira Champeona", "Snailo Clovero", "Los Planitos", "Girafini Raftini",
  "DJ Panda", "Chicleteira Cupideira", "Las Sis", "Spinny Hammy", "Camera Ramena", "Motorino Bumbino",
  "Tacorita Bicicleta", "Los Sweethearts", "Baskito", "Chicleteira Surfeiteira", "Bananito",
  "Los Combinasionas", "Nuclearo Dinossauro", "Chicleteira Noelteira", "Gattino Hydrantino",
  "Chimnino", "Noo my Gold", "Noo my Heart", "Swag Soda", "Mariachi Corazoni", "Pogo Pogo Penguin",
  "Tacorillo Crocodillo", "La Grande Combinasion", "Conetto Morsetto", "Los 25", "Los Burritos",
  "Sushi Inu", "Sir Mangus", "67", "John Doe", "Donkeyturbo Express", "Los Chicleteiras",
  "Noo my Eggs", "Burrito Bat", "Syrup Samurai", "Strawberrita", "Ombrello Topolino", "Los Mi Gatitos",
  "Rang Ring Bus", "Flipa Sandala", "Noo my Present", "Los Nooo My Hotspotsitos", "Serafinna Medusella",
  "Var Var Var", "Arcadopus", "Gub", "Noo my Candy", "Los Quesadillas", "Futbolini Skatini",
  "Los Bunitos", "Aquarino", "Chicleteirina Bicicleteirina", "Granny", "Burrito Bandito",
  "Chill Puppy", "Luck Luck Luck Sahur", "4th Bros", "Flancito", "Chicleteira Bicicleteira",
  "Brunito Marsito", "Quesadillo Vampiro", "Cupid Hotspot", "Eid Eid Eid Sahur", "Octoball",
  "Mi Gatito", "Ho Ho Ho Sahur", "Rosatops Triceratino", "Los Cornis", "Cupid Cupid Sahur",
  "Quesadilla Crocodila", "Bunito Bunito Spinito", "Rocketini Frostini", "Pot Pumpkin",
  "Naughty Naughty", "Buho De Volto", "Horegini Boom", "Ref Ref Ref Sahur", "Santa Hotspot",
  "Pot Hotspot", "25", "Pirulitoita Bicicleteira", "Gelatina Volatina", "Glaciator", "Los Sigmas",
  "To to to Sahur", "Toro Españolo", "Bunny Bunny Bunny Sahur", "Yess My Resume", "La Sahur Combinasion",
  "Telemorte", "List List List Sahur", "Nooo My Hotspot", "Berryno", "Los Jobcitos", "Bunnyman",
  "Gelato Lumacho", "Cuadramat and Pakrahmatmamat", "Craburger", "Please my Present",
  "Easter Easter Easter Sahur", "Hippo Golazo", "Los Cucarachas", "1x1x1x1", "La Vacca Lepre Lepreino",
  "Bombardiro Vaccariro", "Graipuss Medussi", "Love Love Love Sahur", "Perrito Burrito",
  "Giftini Spyderini", "Honey Honey Narwhal", "GOAT", "Paradiso Axolottino", "Trickolino",
  "Triplito Tralaleritos", "Buntteo", "La Vacca Jacko Linterino", "Fishboard", "Santteo",
  "Las Vaquitas Saturnitas", "Los Karkeritos", "Karker Sahur", "Job Job Job Sahur", "Los Trios",
  "Frankentteo", "Las Tralaleritas", "Rocco Disco", "Pumpkini Spyderini", "Extinct Matteo",
  "La Karkerkar Combinasion", "Reindeer Tralala", "La Vacca Prese Presente", "Yess my Examen",
  "Guerriro Digitale", "Boatito Auratito", "Los Tralaleritos", "Vulturino Skeletono", "Los Tortus",
  "Zombie Tralala", "La Cucaracha", "Extinct Tralalero", "Los Spyderinis", "Agarrini la Palini",
  "Chachechi", "Blackhole Goat", "Dul Dul Dul", "Torrtuginni Dragonfrutini", "Trenostruzzo Turbo 4000",
  "La Vacca Saturno Saturnita", "Bisonte Giuppitere", "Karkerkar Kurkur", "Los Matteos",
  "Sammyni Spyderini", "Jackorilla", "Leprotteo", "Luck Luck Sahur", "Tung Tung Tung Sahur",
  "Headless Horseman", "Wheelchair Granny", "Wombo Rollo", "Panda Popanda", "Deputy Leopard",
  "Los Dragons", "Gold and Diamond", "Chicli Chicla", "89", "Tax Tax Tax Sahur"
];

const UNIQUE_SECRETS = Array.from(new Set(ALL_SECRET_NAMES)).map((name, idx) => {
  const safeName = name.replace(/ /g, "_");
  const imgUrl = `https://stealabrainrot.fandom.com/wiki/Special:FilePath/${encodeURIComponent(safeName)}.png`;
  const cleanName = name.trim();
  const val = BRAINROT_VALUES[cleanName] || 0;
  return {
    id: `sec_${idx + 1}`,
    name: name,
    rarity: "Secret",
    value: val, // Değeri varsa kendi değeri, yoksa 0 (Not Value)
    img: imgUrl,
    image: imgUrl
  };
});

saveFile(BRAINROTS_FILE, UNIQUE_SECRETS);

// KALICI MAÇ VE VERİTABANI YÖNETİMİ (Sunucu yeniden başlasa bile silinmez)
let activeMatches = loadFile(MATCHES_FILE, []);
// Temizlik: Sunucu yeniden başladığında 'rolling' kalan maçları otomatik 'finished' yap
activeMatches = activeMatches.map(m => {
  if (m && m.status === 'rolling') {
    return { ...m, status: 'finished' };
  }
  return m;
});
saveFile(MATCHES_FILE, activeMatches);
let activeTickets = loadFile(TICKETS_FILE, []);
let usersDb = loadFile(USERS_FILE, {});

let activeGiveaway = loadFile(GIVEAWAY_FILE, null);
if (activeGiveaway && (Date.now() >= (activeGiveaway.endTime || 0))) {
  activeGiveaway = null;
  saveFile(GIVEAWAY_FILE, null);
}

let onlineUsers = 0;
let chatMessages = [];
const pendingVerifications = new Map();
const avatarCache = new Map();

const ROBLOX_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

async function getRobloxAvatar(username) {
  if (!username) return 'https://ui-avatars.com/api/?name=?&background=1e293b&color=fff&bold=true';
  const key = username.toLowerCase().trim();
  if (avatarCache.has(key)) return avatarCache.get(key);

  try {
    const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: ROBLOX_HEADERS,
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });
    const uData = await userRes.json();

    if (uData.data && uData.data.length > 0) {
      const uid = uData.data[0].id;
      const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${uid}&size=150x150&format=Png&isCircular=true`, {
        headers: ROBLOX_HEADERS
      });
      const tData = await thumbRes.json();
      if (tData.data && tData.data[0]?.imageUrl) {
        const img = tData.data[0].imageUrl;
        avatarCache.set(key, img);
        return img;
      }
    }
  } catch (e) {}

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1e293b&color=fff&bold=true`;
  avatarCache.set(key, fallback);
  return fallback;
}

function getOrCreateUser(username) {
  const key = String(username || '').toLowerCase().replace('@', '').trim();
  if (!key) return null;

  if (!usersDb[key]) {
    usersDb[key] = {
      username: key,
      inventory: [], // TÜM KULLANICILAR BOŞ ENVANTERLE BAŞLAR
      depositLogs: [],
      withdrawLogs: [],
      profit: 0,
      wins: 0,
      losses: 0
    };
    saveFile(USERS_FILE, usersDb);
  }
  return usersDb[key];
}

getOrCreateUser('emirwg');
getOrCreateUser('bennaref');
getOrCreateUser('26ktricky');

app.post('/api/join-match', (req, res) => {
  const { matchId, opponent, opponentItems } = req.body;
  const matchIdx = activeMatches.findIndex(m => m.id === matchId);
  if (matchIdx === -1) return res.json({ success: false, message: 'Match not found' });

  const match = activeMatches[matchIdx];
  if (match.status === 'rolling' || match.status === 'finished' || match.opponent) {
    return res.json({ success: false, message: 'Bu maça başka bir oyuncu katıldı!', match });
  }

  const winnerSide = Math.random() < 0.5 ? 'K' : 'D';
  const isCreatorWinner = winnerSide === match.side;
  const winnerName = isCreatorWinner ? match.creatorName : opponent.name;

  match.status = 'finished';
  match.opponent = opponent;
  match.opponentItems = opponentItems || [];
  match.winnerSide = winnerSide;
  match.winnerName = winnerName;
  match.finishedAt = Date.now();

  // Kazanç ve Kâr (Profit) Hesaplama ve Kalıcı Kaydetme
  const creatorItems = match.items || [];
  const oppItems = match.opponentItems || [];
  const creatorItemsVal = creatorItems.reduce((acc, i) => acc + (Number(i.value) || BRAINROT_VALUES[i.name] || 0), 0) || Number(match.value) || 0;
  const opponentItemsVal = oppItems.reduce((acc, i) => acc + (Number(i.value) || BRAINROT_VALUES[i.name] || 0), 0) || Number(match.value) || 0;

  const creatorAcc = getOrCreateUser(match.creatorName);
  const opponentAcc = getOrCreateUser(opponent.name);

  if (isCreatorWinner) {
    if (creatorAcc) {
      creatorAcc.profit = (Number(creatorAcc.profit) || 0) + opponentItemsVal;
      creatorAcc.wins = (Number(creatorAcc.wins) || 0) + 1;
      if (Array.isArray(oppItems) && oppItems.length > 0) {
        creatorAcc.inventory.push(...oppItems);
      }
    }
    if (opponentAcc) {
      opponentAcc.profit = (Number(opponentAcc.profit) || 0) - opponentItemsVal;
      opponentAcc.losses = (Number(opponentAcc.losses) || 0) + 1;
      const oppItemIds = new Set(oppItems.map(i => i.id));
      opponentAcc.inventory = (opponentAcc.inventory || []).filter(i => !oppItemIds.has(i.id));
    }
  } else {
    if (opponentAcc) {
      opponentAcc.profit = (Number(opponentAcc.profit) || 0) + creatorItemsVal;
      opponentAcc.wins = (Number(opponentAcc.wins) || 0) + 1;
      if (Array.isArray(creatorItems) && creatorItems.length > 0) {
        opponentAcc.inventory.push(...creatorItems);
      }
    }
    if (creatorAcc) {
      creatorAcc.profit = (Number(creatorAcc.profit) || 0) - creatorItemsVal;
      creatorAcc.losses = (Number(creatorAcc.losses) || 0) + 1;
      const creatorItemIds = new Set(creatorItems.map(i => i.id));
      creatorAcc.inventory = (creatorAcc.inventory || []).filter(i => !creatorItemIds.has(i.id));
    }
  }

  saveFile(USERS_FILE, usersDb);

  // Son 30 bitmiş maçı akışta tut
  const openOrRolling = activeMatches.filter(m => m.status !== 'finished');
  const finishedMatches = activeMatches.filter(m => m.status === 'finished').slice(0, 30);
  activeMatches = [...openOrRolling, ...finishedMatches];
  saveFile(MATCHES_FILE, activeMatches);

  // WebSocket ile herkese duyur
  broadcast({ type: 'duel_started', match: { ...match, status: 'rolling' } });
  broadcast({ type: 'sync_matches', matches: activeMatches });
  if (creatorAcc) {
    broadcast({
      type: 'user_data_updated',
      targetUser: match.creatorName,
      userData: creatorAcc,
      profit: creatorAcc.profit
    });
  }
  if (opponentAcc) {
    broadcast({
      type: 'user_data_updated',
      targetUser: opponent.name,
      userData: opponentAcc,
      profit: opponentAcc.profit
    });
  }

  res.json({ success: true, match, userWon: !isCreatorWinner });
});

app.post('/api/create-match', (req, res) => {
  const match = req.body.match;
  if (!match || !match.id) return res.json({ success: false, message: 'Invalid match data' });
  match.status = 'open';
  activeMatches = activeMatches.filter(m => m.id !== match.id);
  activeMatches.unshift(match);
  saveFile(MATCHES_FILE, activeMatches);
  broadcast({ type: 'match_created', match });
  res.json({ success: true, match });
});

app.get('/api/matches', (req, res) => {
  res.json({ success: true, matches: activeMatches });
});

app.get('/api/tickets', (req, res) => {
  res.json({ success: true, tickets: activeTickets });
});

app.get('/api/giveaway', (req, res) => {
  if (activeGiveaway && Date.now() >= activeGiveaway.endTime) {
    activeGiveaway = null;
    saveFile(GIVEAWAY_FILE, null);
  }
  res.json({ success: true, giveaway: activeGiveaway });
});

app.get('/api/leaderboard', async (req, res) => {
  const type = req.query.type || 'profit';
  const users = Object.values(usersDb).map(u => ({
    name: u.username,
    profit: typeof u.profit === 'number' ? u.profit : 0,
    wins: typeof u.wins === 'number' ? u.wins : 0,
    losses: typeof u.losses === 'number' ? u.losses : 0,
    totalVal: Array.isArray(u.inventory)
      ? u.inventory.reduce((s, i) => s + (i.value || 0), 0)
      : 0
  }));

  if (type === 'profit') users.sort((a, b) => b.profit - a.profit);
  else if (type === 'duels') users.sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));
  else if (type === 'val') users.sort((a, b) => b.totalVal - a.totalVal);

  const topUsers = users.slice(0, 20);
  const hydrated = await Promise.all(
    topUsers.map(async (u) => ({
      ...u,
      avatar: await getRobloxAvatar(u.name)
    }))
  );

  res.json(hydrated);
});

app.get('/api/user-data/:username', (req, res) => {
  const user = getOrCreateUser(req.params.username);
  if (!user) return res.json({ success: false });
  res.json({ success: true, userData: user });
});

app.post('/api/sync-user', (req, res) => {
  const { username, inventory, profit, wins, losses } = req.body;
  const user = getOrCreateUser(username);
  if (!user) return res.json({ success: false });

  if (Array.isArray(inventory)) user.inventory = inventory;
  if (profit !== undefined && profit !== null && !isNaN(Number(profit))) {
    user.profit = Math.round(Number(profit));
  }
  if (wins !== undefined && wins !== null && !isNaN(Number(wins))) {
    user.wins = Math.round(Number(wins));
  }
  if (losses !== undefined && losses !== null && !isNaN(Number(losses))) {
    user.losses = Math.round(Number(losses));
  }
  saveFile(USERS_FILE, usersDb);
  res.json({ success: true, profit: user.profit, userData: user });
});

app.get('/api/avatar/:username', async (req, res) => {
  const avatarUrl = await getRobloxAvatar(req.params.username);
  res.json({ success: true, avatarUrl });
});

const WORD_BANK = ["thursday", "tuesday", "heart", "plastic", "files", "fun", "galaxy", "banana", "dragon", "rocket", "crystal", "winter", "shadow", "legend"];
function generateSecurityWords() {
  return [...WORD_BANK].sort(() => 0.5 - Math.random()).slice(0, 6).join(' ');
}

app.post('/api/start-auth', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.json({ success: false, message: "Username is required." });

  let userId = "12345678";
  let canonicalName = username;
  let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1e293b&color=fff&bold=true`;

  try {
    const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: ROBLOX_HEADERS,
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });
    const userData = await userRes.json();
    if (userData.data && userData.data.length > 0) {
      const user = userData.data[0];
      userId = String(user.id);
      canonicalName = user.name;
      const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`, {
        headers: ROBLOX_HEADERS
      });
      const thumbData = await thumbRes.json();
      if (thumbData.data?.[0]?.imageUrl) avatarUrl = thumbData.data[0].imageUrl;
    }
  } catch (e) {}

  const securityWords = generateSecurityWords();
  pendingVerifications.set(userId, { words: securityWords, username: canonicalName, avatar: avatarUrl });

  res.json({
    success: true,
    user: { id: userId, username: canonicalName, displayName: canonicalName, avatar: avatarUrl },
    words: securityWords
  });
});

app.post('/api/verify', async (req, res) => {
  const { userId } = req.body;
  const uidStr = String(userId);
  if (!uidStr || !pendingVerifications.has(uidStr)) return res.json({ success: false, message: "Verification session expired. Please retry." });

  const expected = pendingVerifications.get(uidStr);
  try {
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${uidStr}`, {
      headers: ROBLOX_HEADERS
    });
    const profile = await profileRes.json();
    const aboutText = profile.description || "";

    if (aboutText.toLowerCase().includes(expected.words.toLowerCase())) {
      pendingVerifications.delete(uidStr);
      return res.json({ success: true, user: { id: uidStr, username: expected.username, avatar: expected.avatar } });
    }
    return res.json({ success: false, message: "Security phrase not found in your Roblox 'About' description! Please save it and retry." });
  } catch (err) {
    res.json({ success: false, message: "Profile verification failed." });
  }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(msgObj) {
  const msg = JSON.stringify(msgObj);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

setInterval(() => { broadcast({ type: 'heartbeat' }); }, 5000);

function checkGiveawayExpiry() {
  if (activeGiveaway && Date.now() >= activeGiveaway.endTime) {
    const users = activeGiveaway.joinedUsers || [];
    let winner = 'No participants';

    if (users.length > 0) {
      winner = users[Math.floor(Math.random() * users.length)];
      const winnerAcc = getOrCreateUser(winner);
      if (winnerAcc) {
        const itemVal = BRAINROT_VALUES[activeGiveaway.itemName] || activeGiveaway.itemVal || 0;
        const wonItem = {
          id: 'gw_' + Date.now(),
          name: activeGiveaway.itemName,
          value: itemVal,
          img: activeGiveaway.img
        };
        winnerAcc.inventory.push(wonItem);
        saveFile(USERS_FILE, usersDb);

        broadcast({
          type: 'user_data_updated',
          targetUser: winner,
          userData: winnerAcc,
          toast: `🎉 Tebrikler! Çekilişten ${activeGiveaway.itemName} kazandın!`,
          toastType: 'success'
        });
      }
    }

    const endedData = {
      winner: winner,
      itemName: activeGiveaway.itemName,
      itemVal: activeGiveaway.itemVal || BRAINROT_VALUES[activeGiveaway.itemName] || 0,
      img: activeGiveaway.img
    };

    activeGiveaway = null;
    saveFile(GIVEAWAY_FILE, null);
    broadcast({ type: 'giveaway_ended', ...endedData });
    broadcast({ type: 'sync_giveaway', giveaway: null });
  }
}
setInterval(checkGiveawayExpiry, 2000);


wss.on('connection', (ws) => {
  onlineUsers++;
  broadcast({ type: 'online_count', count: onlineUsers });

  ws.send(JSON.stringify({ type: 'sync_matches', matches: activeMatches }));
  ws.send(JSON.stringify({ type: 'sync_tickets', tickets: activeTickets }));
  ws.send(JSON.stringify({ type: 'sync_chat', messages: chatMessages }));

  if (activeGiveaway) {
    ws.send(JSON.stringify({ type: 'sync_giveaway', giveaway: activeGiveaway }));
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'send_chat') {
        const isOwner = (data.senderName.toLowerCase() === 'emirwg' || data.senderName.toLowerCase() === 'bennaref');
        const chatMsg = {
          id: Date.now() + Math.random().toString(36).substring(2, 6),
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          isOwner: isOwner,
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        chatMessages.push(chatMsg);
        if (chatMessages.length > 50) chatMessages.shift();
        broadcast({ type: 'new_chat_message', message: chatMsg });

      } else if (data.type === 'create_ticket') {
        activeTickets.unshift(data.ticket);
        saveFile(TICKETS_FILE, activeTickets);
        broadcast({ type: 'ticket_created', ticket: data.ticket });

      } else if (data.type === 'ticket_message') {
        const target = activeTickets.find(t => t.id === data.ticketId);
        if (target) {
          if (!target.messages) target.messages = [];
          target.messages.push(data.message);
          saveFile(TICKETS_FILE, activeTickets);
          broadcast({ type: 'new_ticket_message', ticketId: data.ticketId, message: data.message });
        }

      } else if (data.type === 'close_ticket') {
        const target = activeTickets.find(t => t.id === data.ticketId);
        if (target) {
          target.status = 'Closed';
          saveFile(TICKETS_FILE, activeTickets);
          broadcast({ type: 'sync_tickets', tickets: activeTickets });
        }

      } else if (data.type === 'admin_grant_gems') {
        const isOwner = (data.senderName.toLowerCase() === 'emirwg' || data.senderName.toLowerCase() === 'bennaref');
        if (!isOwner) return;

        const cleanUser = String(data.targetUser || '').replace('@', '').trim().toLowerCase();
        let targetSecret = UNIQUE_SECRETS[0];
        if (data.brainrotName) {
          const found = UNIQUE_SECRETS.find(s => s.name.toLowerCase() === data.brainrotName.toLowerCase());
          if (found) targetSecret = found;
        }

        const qty = Math.max(1, parseInt(data.quantity) || 1);
        const targetAccount = getOrCreateUser(cleanUser);
        for (let q = 0; q < qty; q++) {
          targetAccount.inventory.push({
            ...targetSecret,
            id: targetSecret.id + '_' + Date.now() + '_' + q
          });
        }
        saveFile(USERS_FILE, usersDb);

        broadcast({
          type: 'user_data_updated',
          targetUser: cleanUser,
          userData: targetAccount,
          logType: 'deposit',
          toast: `Admin credited ${qty > 1 ? qty + 'x ' : ''}${targetSecret.name} to your inventory!`,
          toastType: 'success'
        });

      } else if (data.type === 'create_match') {
        data.match.status = 'open';
        activeMatches.unshift(data.match);
        saveFile(MATCHES_FILE, activeMatches);
        broadcast({ type: 'match_created', match: data.match });

      } else if (data.type === 'cancel_match') {
        const matchToCancel = activeMatches.find(m => m.id === data.matchId);
        if (matchToCancel && (matchToCancel.opponent || matchToCancel.status === 'rolling' || matchToCancel.status === 'finished')) {
          ws.send(JSON.stringify({
            type: 'cancel_rejected',
            matchId: data.matchId,
            match: matchToCancel
          }));
          return;
        }
        activeMatches = activeMatches.filter(m => m.id !== data.matchId);
        saveFile(MATCHES_FILE, activeMatches);
        broadcast({ type: 'match_cancelled', matchId: data.matchId });

      } else if (data.type === 'join_match') {
        const matchIdx = activeMatches.findIndex(m => m.id === data.matchId);
        if (matchIdx !== -1) {
          const match = activeMatches[matchIdx];

          // Atomik kilit: Zaten katılmış veya oynanıyorsa anında reddet
          if (match.status === 'rolling' || match.status === 'finished' || match.opponent) {
            ws.send(JSON.stringify({ type: 'join_rejected', matchId: data.matchId, message: 'Bu maça başka bir oyuncu katıldı!' }));
            return;
          }

          const winnerSide = Math.random() < 0.5 ? 'K' : 'D';
          const isCreatorWinner = winnerSide === match.side;
          const winnerName = isCreatorWinner ? match.creatorName : data.opponent.name;

          match.status = 'rolling';
          match.opponent = data.opponent;
          match.opponentItems = data.opponentItems || [];
          match.winnerSide = winnerSide;
          match.winnerName = winnerName;
          saveFile(MATCHES_FILE, activeMatches);

          broadcast({ type: 'duel_started', match: { ...match, status: 'rolling' } });

          setTimeout(() => {
            match.status = 'finished';

            // Kazanç ve Kâr (Profit) Hesaplama ve Kalıcı Kaydetme
            const creatorItems = match.items || [];
            const opponentItems = match.opponentItems || [];
            const creatorItemsVal = creatorItems.reduce((acc, i) => acc + (Number(i.value) || BRAINROT_VALUES[i.name] || 0), 0) || Number(match.value) || 0;
            const opponentItemsVal = opponentItems.reduce((acc, i) => acc + (Number(i.value) || BRAINROT_VALUES[i.name] || 0), 0) || Number(match.value) || 0;

            const creatorAcc = getOrCreateUser(match.creatorName);
            const opponentAcc = getOrCreateUser(data.opponent?.name || 'Player');

            if (isCreatorWinner) {
              if (creatorAcc) {
                creatorAcc.profit = (Number(creatorAcc.profit) || 0) + opponentItemsVal;
                creatorAcc.wins = (creatorAcc.wins || 0) + 1;
                if (Array.isArray(opponentItems) && opponentItems.length > 0) {
                  creatorAcc.inventory.push(...opponentItems);
                }
              }
              if (opponentAcc) {
                opponentAcc.profit = (Number(opponentAcc.profit) || 0) - opponentItemsVal;
                opponentAcc.losses = (opponentAcc.losses || 0) + 1;
                const oppItemIds = new Set(opponentItems.map(i => i.id));
                opponentAcc.inventory = (opponentAcc.inventory || []).filter(i => !oppItemIds.has(i.id));
              }
            } else {
              if (opponentAcc) {
                opponentAcc.profit = (Number(opponentAcc.profit) || 0) + creatorItemsVal;
                opponentAcc.wins = (opponentAcc.wins || 0) + 1;
                if (Array.isArray(creatorItems) && creatorItems.length > 0) {
                  opponentAcc.inventory.push(...creatorItems);
                }
              }
              if (creatorAcc) {
                creatorAcc.profit = (Number(creatorAcc.profit) || 0) - creatorItemsVal;
                creatorAcc.losses = (creatorAcc.losses || 0) + 1;
                const creatorItemIds = new Set(creatorItems.map(i => i.id));
                creatorAcc.inventory = (creatorAcc.inventory || []).filter(i => !creatorItemIds.has(i.id));
              }
            }

            saveFile(USERS_FILE, usersDb);

            // Biten maçları silmek yerine son 30 maçı akışta tut (böylece login yapmayan misafirler de görür)
            const openOrRolling = activeMatches.filter(m => m.status !== 'finished');
            const finishedMatches = activeMatches.filter(m => m.status === 'finished').slice(0, 30);
            activeMatches = [...openOrRolling, ...finishedMatches];
            saveFile(MATCHES_FILE, activeMatches);

            // Maçın bittiğini ve kazananı tüm kullanıcılara duyur
            broadcast({
              type: 'match_finished',
              matchId: match.id,
              winnerName: match.winnerName,
              winnerSide: match.winnerSide
            });

            // Oyuncuların kâr ve envanter güncellemesini anında ilet
            if (creatorAcc) {
              broadcast({
                type: 'user_data_updated',
                targetUser: match.creatorName,
                userData: creatorAcc,
                profit: creatorAcc.profit,
                wins: creatorAcc.wins,
                losses: creatorAcc.losses
              });
            }
            if (opponentAcc) {
              broadcast({
                type: 'user_data_updated',
                targetUser: data.opponent?.name,
                userData: opponentAcc,
                profit: opponentAcc.profit,
                wins: opponentAcc.wins,
                losses: opponentAcc.losses
              });
            }
          }, 4300);
        }
      }
    } catch (e) {}
  });

  ws.on('close', () => {
    onlineUsers = Math.max(0, onlineUsers - 1);
    broadcast({ type: 'online_count', count: onlineUsers });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`KnifeDuels running on http://localhost:${PORT}`);
});
