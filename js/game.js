const STAT_NAMES = ["Strength", "Dexterity", "Agility", "Vitality", "Wisdom", "Intelligence"];
const COMBAT_STYLES = {
  warrior: [
    { id: "vanguard", name: "Vanguard", passive: "power", moveName: "Driving Assault", move: "attack", description: "Hit harder and press the enemy with a heavy opening strike." },
    { id: "sentinel", name: "Sentinel", passive: "defense", moveName: "Shield Wall", move: "guard", description: "Take less damage and brace behind a strong defensive stance." },
    { id: "duelist", name: "Duelist", passive: "precision", moveName: "Riposte", move: "riposte", description: "Land sharper attacks and counter while protecting yourself." }
  ],
  mage: [
    { id: "elementalist", name: "Elementalist", passive: "magic", moveName: "Elemental Surge", move: "spell", description: "Deal extra spell damage with a focused blast." },
    { id: "arcanist", name: "Arcanist", passive: "mana", moveName: "Arcane Weave", move: "weave", description: "Turn mana into a flexible spell and a little protection." },
    { id: "channeler", name: "Channeler", passive: "mana", moveName: "Deep Channel", move: "channel", description: "Restore mana and build power for your next spell." }
  ],
  healer: [
    { id: "medic", name: "Field Medic", passive: "healing", moveName: "Greater Mending", move: "heal", description: "Focus on reliable healing while still pressuring a foe." },
    { id: "warden", name: "Light Warden", passive: "defense", moveName: "Sanctuary Ward", move: "ward", description: "Protect yourself with a ward and restore health." },
    { id: "exorcist", name: "Exorcist", passive: "magic", moveName: "Banishment", move: "smite", description: "Use a sharper burst of light against dangerous foes." }
  ],
  thief: [
    { id: "skirmisher", name: "Skirmisher", passive: "quick", moveName: "Opening Ambush", move: "ambush", description: "Act quickly and strike before an enemy can settle into a fight." },
    { id: "saboteur", name: "Saboteur", passive: "precision", moveName: "Dirty Trick", move: "disrupt", description: "Damage and weaken an enemy with a trick attack." },
    { id: "shadowguard", name: "Shadowguard", passive: "defense", moveName: "Smoke Feint", move: "smoke", description: "Use a feint to avoid harm and create a safe opening." }
  ],
  beastmaster: [
    { id: "packleader", name: "Pack Leader", passive: "companion", moveName: "Pack Order", move: "pack", description: "Your companion attacks with you and grows stronger as Wild Bond is upgraded." },
    { id: "wildguardian", name: "Wild Guardian", passive: "defense", moveName: "Guardian's Call", move: "companionGuard", description: "Your companion intercepts danger and helps you endure long fights." },
    { id: "bondkeeper", name: "Bondkeeper", passive: "taming", moveName: "Calming Call", move: "calm", description: "Improve animal taming and use your bond to steady the fight." }
  ],
  bard: [
    { id: "minstrel", name: "Minstrel", passive: "social", moveName: "Ballad of Mending", move: "ballad", description: "Support allies, heal, and use music to resolve tense encounters." },
    { id: "battlebard", name: "Battle Bard", passive: "power", moveName: "Rousing Chorus", move: "chorus", description: "Strengthen your next attack and unsettle the enemy." },
    { id: "disruptor", name: "Disruptor", passive: "precision", moveName: "Discordant Break", move: "disruptSong", description: "Break an enemy's rhythm, weaken its attack, and deal sound damage." }
  ]
};
const GEAR = {
  weapons: [
    { name: "Iron Sword", cost: 5, attack: 3, description: "A reliable iron blade. Adds 3 physical attack." }, { name: "Oak Staff", cost: 5, magic: 3, description: "A smooth staff that strengthens spell damage." },
    { name: "Balanced Dagger", cost: 5, attack: 2, dexterity: 1, description: "A quick dagger that adds attack and Dexterity." }, { name: "Hunter's Bow", cost: 6, attack: 2, agility: 1, description: "A light bow that adds attack and Agility." }
  ],
  armor: [
    { name: "Leather Armor", cost: 5, defense: 2, description: "Soft leather; reduces incoming physical damage by 2." }, { name: "Chain Shirt", cost: 8, defense: 4, agility: -1, description: "Strong links; high defense, but slightly lowers Agility." },
    { name: "Woven Robe", cost: 5, defense: 1, intelligence: 1, description: "A light robe that offers modest defense and improves Intelligence." }
  ]
};
const player = {
  name: "Adventurer", background: "wanderer", classKey: null, level: 1, xp: 0, statPoints: 0, classLevel: 1, classXP: 0, classPoints: 0, skillRanks: {}, professionPoints: {}, professionUpgrades: {}, health: 0, maxHealth: 0, mana: 0, maxMana: 0,
  baseStats: {}, potions: 1, meals: 0, coins: 5, weapon: null, armor: null, companion: null, professions: [], hiddenStats: { luck: 1 },
  flags: { metGuard: false, helpedHerbalist: false, bridgeResolved: false, gotStorePotion: false, foundMarker: false, stealAttempts: 0, failedSteals: 0, arrested: false, beastLore: false, journeyStarted: false, caveResolved: false, treatReady: false, mageStudy: false, warriorTraining: false },
  enemy: null, combatGuard: 0, enemySlowed: false, firstStrike: false, focusBonus: 0, weaponCharge: 0, attackBuff: 0, nextStrikeBonus: 0, enemyTrapUsed: false, enemyWeakened: false,
  reputation: { Valoria: 0, Silverbrook: 0, Bards: 0 }, memories: [], factions: [], professionRanks: {}, professionXP: {}, inventory: [], equipment: { head: null, body: null, hands: null, legs: null, feet: null, accessory: null }, combatStyle: null,
  world: { day: 1, hour: 8, season: "Spring", weather: "Clear" }, debt: 0, home: false, questLog: [], conditions: [], storyLog: [], discoveries: [], scars: 0
};
const $ = (selector) => document.querySelector(selector);
const sceneTitle = $("#scene-title"), storyText = $("#story-text"), choicesBox = $("#choices");
let identityDraft = { name: "Adventurer", background: "wanderer" };
let lastScene = { title: "Choose Your Adventurer", text: "Choose a class, then decide how your story unfolds." };

function stat(name) {
  const key = name.toLowerCase();
  return (player.baseStats[key] || 0) + (player.weapon?.[key] || 0) + (player.armor?.[key] || 0);
}
function luckBonus() { return Math.floor((player.hiddenStats.luck + professionMastery("Astronomer")) / 3); }
function professionMastery(name) { return player.professionUpgrades?.[name] || 0; }
function changeReputation(town, amount, memory) {
  player.reputation[town] = (player.reputation[town] || 0) + amount;
  if (memory) player.memories.push(memory);
}
function attackPower() { return 3 + stat("strength") + (player.weapon?.attack || 0) + (currentCombatStyle()?.passive === "power" ? 2 : 0) - (player.conditions.includes("Wounded") ? 2 : 0); }
function defensePower() { return (player.armor?.defense || 0) + (player.companion?.guard || 0) + (currentCombatStyle()?.passive === "defense" ? 2 : 0); }
function updateStatus() {
  const cls = player.classKey ? CLASS_DATA[player.classKey] : null;
  $("#hero-name").textContent = player.name;
  $("#hero-level").textContent = cls ? `${cls.name} · Character ${player.level} · Class ${player.classLevel || 1} (${player.classXP || 0}/${classXPNeeded()} class XP; ${player.classPoints || 0} skill points) · ${player.statPoints} stat points` : "Choose a class";
  $("#health-text").textContent = cls ? `${player.health} / ${player.maxHealth}` : "—";
  const bar = $("#health-bar"); bar.max = player.maxHealth || 100; bar.value = player.health || 100;
  $("#mana-text").textContent = cls ? `Mana: ${player.mana} / ${player.maxMana}` : "Mana: —";
  $("#xp-text").textContent = cls ? `XP: ${player.xp} / ${xpNeeded()}` : "XP: —";
  const skill = cls ? activeSkill() : null;
  $("#class-move").textContent = skill ? `Skill: ${skill.name} · Rank ${player.skillRanks[skill.name] || 1}/5 — ${skill.description}` : "Choose a class to begin.";
  const style = currentCombatStyle();
  $("#combat-style-status").textContent = style ? `Combat style: ${style.name} — ${style.description}` : "Combat style: choose one after selecting a class.";
  const luckDisplay = player.professions.includes("Astronomer") ? ` · LUCK ${player.hiddenStats.luck + (player.professionUpgrades.Astronomer || 0)}` : "";
  $("#stats-summary").textContent = cls ? `STR ${stat("strength")} · DEX ${stat("dexterity")} · AGI ${stat("agility")} · VIT ${stat("vitality")} · WIS ${stat("wisdom")} · INT ${stat("intelligence")}${luckDisplay}` : "Stats: —";
  $("#equipment").textContent = `Weapon: ${player.weapon?.name || "none"} · Armor: ${player.armor?.name || "none"}`;
  $("#inventory").textContent = `Inventory: ${player.potions} potion${player.potions === 1 ? "" : "s"} · ${player.meals} meal${player.meals === 1 ? "" : "s"} · ${player.coins} gold${player.flags.trailTentOwned ? " · Trail Tent" : ""}`;
  $("#companions").textContent = `Companion: ${player.companion ? `${player.companion.name} · Bond ${player.companion.bond || 1} · ${player.companion.personality || "new companion"}` : "none"}`;
  $("#profession-list").textContent = `Professions: ${player.professions.length ? player.professions.map((name) => `${name} Lv ${player.professionRanks[name] || 1} (${player.professionPoints[name] || 0} upgrade points)`).join(", ") : "none"}`;
  $("#world-time").textContent = `Day ${player.world.day} · ${timeOfDay()} · ${player.world.weather} · ${player.world.season}`;
  $("#conditions").textContent = `Conditions: ${player.conditions.length ? player.conditions.join(", ") : "none"}${player.scars ? ` · Scars ${player.scars}` : ""}`;
  renderInventoryPanel();
}
function showScene(title, text, choices) {
  lastScene = { title, text };
  player.storyLog ||= []; player.storyLog.push(`${title}: ${text}`); if (player.storyLog.length > 40) player.storyLog.shift();
  sceneTitle.textContent = title; storyText.textContent = text; choicesBox.replaceChildren();
  choices.forEach((choice) => { const b = document.createElement("button"); b.textContent = choice.label; b.addEventListener("click", choice.action); choicesBox.append(b); });
  const log = $("#story-log");
  if (log) { log.replaceChildren(); player.storyLog.slice(-12).forEach((entry) => { const li = document.createElement("li"); li.textContent = entry; log.append(li); }); }
  if (player.classKey) saveGame(true);
}
function timeOfDay() { return player.world.hour < 6 ? "Night" : player.world.hour < 12 ? "Morning" : player.world.hour < 18 ? "Afternoon" : "Evening"; }
function advanceTime(hours = 1) {
  player.world.hour += hours;
  while (player.world.hour >= 24) { player.world.hour -= 24; player.world.day++; player.world.weather = ["Clear", "Cloudy", "Rain", "Windy"][Math.floor(Math.random() * 4)]; if (player.debt > 0) player.debt++; if (player.world.day % 7 === 0) player.world.season = ["Spring", "Summer", "Autumn", "Winter"][(Math.floor(player.world.day / 7) - 1) % 4]; }
  updateStatus();
}
function renderInventoryPanel() {
  const slots = $("#equipment-slots"), pack = $("#backpack-items");
  if (!slots || !pack) return;
  slots.replaceChildren(); pack.replaceChildren();
  const equipped = [["Weapon", player.weapon], ["Body armor", player.armor], ["Head", player.equipment.head], ["Hands", player.equipment.hands], ["Legs", player.equipment.legs], ["Feet", player.equipment.feet], ["Accessory", player.equipment.accessory], ["Companion", player.companion]];
  equipped.forEach(([label, item]) => {
    const box = document.createElement("div"); box.className = "slot"; box.title = item?.description || (item ? `${item.name}: equipped` : `${label} slot is empty`);
    box.innerHTML = `<strong>${label}</strong>${item ? item.name : "Empty"}`; slots.append(box);
  });
  const entries = [...player.inventory];
  if (player.potions) entries.unshift({ name: `Healing Potion ×${player.potions}`, description: "Restores health during or after combat.", kind: "consumable" });
  if (player.meals) entries.unshift({ name: `Travel Meal ×${player.meals}`, description: "A Cook's hearty meal; restores health and mana.", kind: "consumable" });
  $("#pack-count").textContent = `${entries.length} item types`;
  if (!entries.length) { const box = document.createElement("div"); box.className = "slot"; box.textContent = "Your backpack is empty."; pack.append(box); }
  entries.forEach((item) => {
    const box = document.createElement("div"); box.className = "slot"; box.title = item.description || item.name;
    const name = document.createElement("span"); name.textContent = item.name; box.append(name);
    if (item.kind === "gear") { const b = document.createElement("button"); b.textContent = "Equip"; b.title = item.description || item.name; b.addEventListener("click", () => equipFromPack(item.id)); box.append(b); }
    pack.append(box);
  });
}
function equipFromPack(id) {
  const index = player.inventory.findIndex((item) => item.id === id); if (index < 0) return;
  const item = player.inventory.splice(index, 1)[0];
  if (item.slot === "weapon") { if (player.weapon) player.inventory.push(asPackItem(player.weapon)); player.weapon = item; }
  if (item.slot === "armor") { if (player.armor) player.inventory.push(asPackItem(player.armor)); player.armor = item; }
  updateStatus(); showScene("Equipment Changed", `You equip ${item.name}.`, [{ label: "Continue", action: returnToCurrentTown }]);
}
function asPackItem(item) { return { ...item, id: `${item.name}-${Date.now()}-${Math.random()}`, kind: "gear" }; }
function addPackItem(name, description, extra = {}) { player.inventory.push({ id: `${name}-${Date.now()}-${Math.random()}`, name, description, ...extra }); updateStatus(); }
function consumeItem(name) { const index = player.inventory.findIndex((item) => item.name === name); if (index < 0) return false; player.inventory.splice(index, 1); updateStatus(); return true; }
function addProfessionXP(name, amount) {
  if (!player.professions.includes(name)) return;
  const oldRank = player.professionRanks[name] || 1;
  player.professionXP[name] = (player.professionXP[name] || 0) + amount;
  player.professionRanks[name] = 1 + Math.floor(player.professionXP[name] / 20);
  const gained = player.professionRanks[name] - oldRank;
  if (gained > 0) player.professionPoints[name] = (player.professionPoints[name] || 0) + gained;
}
function classUpgradeMenu() {
  const skills = CLASS_DATA[player.classKey].skills.filter((skill) => skill.level <= player.level);
  const choices = skills.map((skill) => ({ label: `Upgrade ${skill.name} · rank ${player.skillRanks[skill.name] || 1}/5`, action: () => upgradeClassSkill(skill.name) }));
  choices.push({ label: "Return to Valoria", action: village });
  showScene("Class Skill Training", `Class level ${player.classLevel || 1} · ${player.classPoints || 0} class skill point(s). Every point raises one unlocked class skill by 15%, up to rank 5. Earn class levels by gaining adventure XP.`, choices);
}
function upgradeClassSkill(name) {
  if (!player.classPoints) return showScene("No Class Points", "Gain more adventure XP to earn a class level and a class skill point.", [{ label: "Return", action: classUpgradeMenu }]);
  const rank = player.skillRanks[name] || 1;
  if (rank >= 5) return showScene("Skill Fully Trained", `${name} is already at its maximum rank.`, [{ label: "Choose another skill", action: classUpgradeMenu }]);
  player.classPoints--; player.skillRanks[name] = rank + 1; updateStatus();
  const benefit = player.classKey === "beastmaster" && name === "Wild Bond" ? "Each rank strengthens Wild Bond, improves animal-taming odds, and improves new companions." : player.classKey === "beastmaster" ? "Each rank strengthens this Beastmaster skill's damage, guard, or companion effect." : "Each rank improves this skill's damage, healing, or protective effect.";
  showScene("Class Skill Improved", `${name} is now rank ${rank + 1}. ${benefit}`, [{ label: "Train another skill", action: classUpgradeMenu }, { label: "Return to Valoria", action: village }]);
}
function professionUpgradeMenu() {
  const choices = player.professions.map((name) => ({ label: `${name}: Lv ${player.professionRanks[name] || 1}, ${player.professionPoints[name] || 0} point(s), mastery ${player.professionUpgrades[name] || 0}/3`, action: () => upgradeProfession(name) }));
  choices.push({ label: "Return", action: returnToCurrentTown });
  showScene("Profession Training", "Use profession points to improve a career's special benefit. Profession levels rise as you practice that profession; each new level gives 1 point. Mastery is capped at 3.", choices);
}
function upgradeProfession(name) {
  const points = player.professionPoints[name] || 0, rank = player.professionUpgrades[name] || 0;
  if (!points) return showScene("No Profession Points", `Practice as a ${name} to earn profession XP. Every 20 profession XP earns a level and an upgrade point.`, [{ label: "Return", action: professionUpgradeMenu }]);
  if (rank >= 3) return showScene("Mastery Reached", `${name} mastery is already at its maximum.`, [{ label: "Choose another profession", action: professionUpgradeMenu }]);
  player.professionPoints[name]--; player.professionUpgrades[name] = rank + 1; updateStatus();
  showScene("Profession Improved", `${name} mastery is now ${rank + 1}/3. Its signature services are more effective.`, [{ label: "Upgrade another profession", action: professionUpgradeMenu }, { label: "Return", action: returnToCurrentTown }]);
}
function xpNeeded() { return player.level * 20; }
function activeSkill() { return [...CLASS_DATA[player.classKey].skills].reverse().find((s) => player.level >= s.level); }
function bestStats(cls) { return `${cls.best[0]} and ${cls.best[1]}`; }
function chooseClass() {
  identityDraft.name = $("#name-input")?.value.trim() || identityDraft.name;
  identityDraft.background = $("#background-select")?.value || identityDraft.background;
  const choices = Object.entries(CLASS_DATA).map(([key, c]) => ({ label: `${c.name} · Best at ${bestStats(c)} · Starts with ${c.skills[0].name}`, action: () => beginAdventure(key) }));
  try { if (localStorage.getItem("everboundRealmsSave") || localStorage.getItem("empireEternalsSave") || localStorage.getItem("lostKingdomSave")) choices.push({ label: "Continue saved adventure", action: loadGame }); } catch { /* Saving may be unavailable in private browser modes. */ }
  showScene("Choose Your Class", "Each class is especially good at two stats. Every character level gives you 2 stat points. You will then choose a personalized combat style, and new class skills unlock every 5 levels.",
    choices);
}
function beginAdventure(key) {
  const c = CLASS_DATA[key]; player.classKey = key; player.level = 1; player.xp = 0; player.statPoints = 0; player.classLevel = 1; player.classXP = 0; player.classPoints = 0; player.skillRanks = {};
  player.baseStats = Object.fromEntries(STAT_NAMES.map((s) => [s.toLowerCase(), c.best.includes(s) ? 4 : 2]));
  player.name = identityDraft.name || "Adventurer"; player.background = identityDraft.background || "wanderer";
  const backgroundStat = { local: "vitality", scholar: "intelligence", streetwise: "dexterity", caravan: "wisdom" }[player.background];
  if (backgroundStat) player.baseStats[backgroundStat]++;
  player.maxHealth = c.health + (stat("vitality") - 2) * 3; player.health = player.maxHealth;
  player.maxMana = c.mana + (stat("wisdom") - 2) * 2; player.mana = player.maxMana;
  player.potions = 1; player.meals = 0; player.mealTypes = []; player.coins = 5; player.weapon = null; player.armor = null; player.companion = null; player.enemy = null; player.professions = []; player.hiddenStats = { luck: 1 + Math.floor(Math.random() * 10) }; player.reputation = { Valoria: 0, Silverbrook: 0, Bards: 0 }; player.memories = []; player.factions = []; player.inventory = []; player.equipment = { head: null, body: null, hands: null, legs: null, feet: null, accessory: null };
  player.professionRanks = {}; player.professionXP = {}; player.professionPoints = {}; player.professionUpgrades = {}; player.tameFailureCounts = {};
  player.flags = { metGuard: false, helpedHerbalist: false, bridgeResolved: false, gotStorePotion: false, foundMarker: false, stealAttempts: 0, failedSteals: 0, arrested: false, beastLore: false, journeyStarted: false, caveResolved: false, treatReady: false, mageStudy: false, warriorTraining: false, smithOrder: false, riverTask: false, bardShow: false, valoriaGig: false, silverbrookGig: false, factionTaskAccepted: false, factionErrand: false, factionTaskComplete: false };
  Object.assign(player.flags, { frontierUnlocked: false, frontierSurveyClaimed: false, thorncache: false, thornAnimalFreed: false, quarryCache: false, quarryHelped: false, archiveDecoded: false, archiveSentinelDefeated: false, cinderbackDefeated: false, basinColossusDefeated: false, starMetalFound: false, basinStudyDone: false, veiledReachUnlocked: false, saltwindSeen: false, saltwindSecret: false, whisperfenSeen: false, whisperfenSecret: false, fenCrossed: false, sunkenVaultSeen: false, vaultSealSolved: false, vaultGuardianDefeated: false, lanternQuaySeen: false, lanternQuaySecret: false, villageSecret: false, silverbrookSecret: false, gatheringDay: 0, gatheringCount: 0, trailTentOwned: false, smithRecipeLearned: false, bardSongLearned: false, animalTracksStudied: false });
  player.world = { day: 1, hour: 8, season: "Spring", weather: "Clear" }; player.debt = 0; player.home = false; player.storage = []; player.questLog = ["Help the Valoria herbalist (optional)", "Find a safe route past the forest and reach Silverbrook"]; player.storyLog = []; player.scars = 0;
  player.reputation = { Valoria: 0, Silverbrook: 0, Bards: 0 }; player.memories = []; player.factions = []; player.inventory = []; player.equipment = { head: null, body: null, hands: null, legs: null, feet: null, accessory: null };
  player.combatStyle = null; player.discoveries = []; player.clues = []; player.currentTown = "Valoria"; updateStatus(); combatStyleMenu();
}
function applyIdentity() {
  identityDraft.name = $("#name-input").value.trim().slice(0, 24) || "Adventurer";
  identityDraft.background = $("#background-select").value;
  if (player.classKey) { player.name = identityDraft.name; updateStatus(); }
  storyText.textContent = `Identity set: ${identityDraft.name}, ${identityDraft.background.replaceAll("-", " ")}. Your background bonus applies when you start a new adventure.`;
}
function saveGame(silent = false) {
  try { localStorage.setItem("everboundRealmsSave", JSON.stringify({ player, lastScene })); if (!silent) storyText.textContent = `Saved ${player.name}'s adventure on Day ${player.world.day}.`; }
  catch { if (!silent) storyText.textContent = "The browser could not save this game. Check that local storage is available."; }
}
function loadGame() {
  try {
    const save = JSON.parse(localStorage.getItem("everboundRealmsSave") || localStorage.getItem("empireEternalsSave") || localStorage.getItem("lostKingdomSave") || "null");
    if (!save?.player?.classKey) return showScene("No Save Found", "Start a new adventure by choosing a class.", Object.entries(CLASS_DATA).map(([key, c]) => ({ label: c.name, action: () => beginAdventure(key) })));
    Object.assign(player, save.player);
    if (!COMBAT_STYLES[player.classKey]?.some((style) => style.id === player.combatStyle)) player.combatStyle = COMBAT_STYLES[player.classKey]?.[0]?.id || null;
    player.world ||= { day: 1, hour: 8, season: "Spring", weather: "Clear" };
    player.inventory ||= []; player.professions ||= []; player.professionRanks ||= {}; player.professionXP ||= {}; player.professionPoints ||= {}; player.professionUpgrades ||= {}; player.tameFailureCounts ||= {}; player.mealTypes ||= []; player.classLevel ||= 1; player.classXP ||= 0; player.classPoints ||= 0; player.skillRanks ||= {}; player.reputation ||= { Valoria: 0, Silverbrook: 0, Bards: 0 }; player.memories ||= []; player.factions ||= []; player.conditions ||= []; player.clues ||= []; player.discoveries ||= []; player.equipment ||= { head: null, body: null, hands: null, legs: null, feet: null, accessory: null }; player.hiddenStats ||= { luck: 1 }; player.storyLog ||= []; player.flags ||= {}; player.world.weather ||= "Clear"; player.world.season ||= "Spring"; if (player.flags.trailTentOwned === undefined) player.flags.trailTentOwned = false; lastScene = save.lastScene || lastScene;
    updateStatus();
    if (player.enemy) return combatTurn("Your saved battle resumes.");
    player.storyLog ||= [];
    showScene("Adventure Restored", `Welcome back, ${player.name}. You saved at: ${save.lastScene?.title || player.currentTown || "Valoria"}.`, [
      { label: "Resume the journey", action: resumeAdventure },
      { label: "Open the map", action: showMap }
    ]);
  } catch { showScene("Save Could Not Be Loaded", "The save data could not be read. You can start a fresh adventure.", [{ label: "Choose a class", action: chooseClass }]); }
}
function showJournal() {
  const lines = [
    `Main journey: ${player.flags.bridgeResolved ? "The road to Silverbrook is open." : "Find a way past the forest obstacle, or discover another route."}`,
    `Herbalist request: ${player.flags.helpedHerbalist ? "Complete" : "Optional — gather moonleaf by the creek."}`,
    `Cave: ${player.flags.caveResolved ? "First chamber explored." : "Rumors point to the eastern cliffs beyond Silverbrook."}`,
    `Suggested frontier route: ${!player.flags.frontierUnlocked ? "Beyond the highlands, not yet explored" : !player.flags.thornwakeSeen ? "Scout-marked path to Thornwake Woods" : !player.flags.quarrySeen ? "Ore trail to Emberglass Quarry" : !player.flags.archiveSeen ? "Old road to the Drowned Archive" : !player.flags.basinSeen ? "High ridge to Starfall Basin" : "All four Elderwild landmarks discovered"}.`,
    `Elderwild survey: ${player.flags.frontierUnlocked ? `${["thornwakeSeen", "quarrySeen", "archiveSeen", "basinSeen"].filter((flag) => player.flags[flag]).length}/3 landmarks mapped` : "Beyond the highlands, not yet explored"}.`,
    `Suggested next destination: ${nextRouteHint()}.`,
    `Veiled Reach: ${player.flags.veiledReachUnlocked ? `${["saltwindSeen", "whisperfenSeen", "sunkenVaultSeen", "lanternQuaySeen"].filter((flag) => player.flags[flag]).length}/4 places discovered` : "Unknown coast beyond Starfall"}.`,
    `Reputation: Valoria ${player.reputation.Valoria || 0}, Silverbrook ${player.reputation.Silverbrook || 0}, performers ${player.reputation.Bards || 0}.`,
    `Factions: ${player.factions.length ? player.factions.join(", ") : "none joined"}.`,
    `Promises remembered: ${player.memories.length ? player.memories.join("; ") : "no notable promises yet"}.`,
    `Clues: ${player.clues?.length ? player.clues.join("; ") : "none collected yet"}.`,
    `Debt: ${player.debt || 0} gold.`,
    `Time: Day ${player.world.day}, ${timeOfDay()}, ${player.world.weather}.`
  ];
  showScene("Journal and Relationships", lines.join("\n\n"), [{ label: "Return", action: returnToCurrentTown }, { label: "Open map", action: showMap }]);
}
function showMap() {
  const route = ["Valoria (open town)", player.flags.bridgeResolved ? "Forest road (open)" : "Forest road (find a way through)", player.flags.journeyStarted ? "Silverbrook (reached)" : "Silverbrook (ahead)", player.flags.caveResolved ? "Eastern Cave (explored)" : "Eastern Cave (ahead)", player.flags.caveResolved ? "Highland Pass (open)" : "Highland Pass (beyond cave)", ...(player.flags.frontierUnlocked ? ["Elderwild Frontier", ...(player.discoveries || []).map((name) => `  • ${name}`)] : [])];
  const choices = [{ label: "Valoria", action: village }, { label: "Forest", action: forest }];
  if (player.flags.journeyStarted) choices.push({ label: "Silverbrook", action: silverbrook });
  if (player.flags.journeyStarted) choices.push({ label: "Eastern Cave", action: caveEntrance });
  if (player.flags.caveResolved) choices.push({ label: "Highland Pass", action: highlandPass });
  if (player.flags.frontierUnlocked) choices.push({ label: "Elderwild Outpost", action: elderwildOutpost }, { label: "Frontier region map", action: frontierMap });
  if (player.flags.veiledReachUnlocked) { route.push("The Veiled Reach"); choices.push({ label: "The Veiled Reach map", action: veiledReachMap }); }
  showScene("Travel Map", `Your known route:\n${route.map((x) => `• ${x}`).join("\n")}\n\nSuggested next step: ${nextRouteHint()}\nWeather: ${player.world.weather}. It changes as days pass.`, choices);
}
function nextRouteHint() { return !player.flags.bridgeResolved ? "Find a way through the forest road" : !player.flags.journeyStarted ? "Continue to Silverbrook" : !player.flags.caveResolved ? "Explore the eastern cave" : !player.flags.frontierUnlocked ? "Climb into the Highlands" : !player.flags.thornwakeSeen ? "Follow the Elderwild scout marks" : !player.flags.quarrySeen ? "Take the Emberglass ore trail" : !player.flags.archiveSeen ? "Follow the old road to the Drowned Archive" : !player.flags.basinSeen ? "Climb toward Starfall Basin" : !player.flags.veiledReachUnlocked ? "Study the signal beyond Starfall" : !player.flags.saltwindSeen ? "Cross the saltwind shore" : !player.flags.whisperfenSeen ? "Follow the old coast road into Whisperfen" : !player.flags.sunkenVaultSeen ? "Find the submerged vault entrance" : !player.flags.lanternQuaySeen ? "Reach Lantern Quay to resupply" : "Explore any known place or search for hidden paths"; }
function resumeAdventure() { const place = player.currentTown; const title = lastScene?.title; if (place === "Silverbrook") return silverbrook(); if (place === "Highlands") return highlandPass(); if (place === "Elderwild Outpost") return elderwildOutpost(); if (place === "Lantern Quay") return lanternQuay(); if (place === "Saltwind Shore") return saltwindShore(); if (place === "Whisperfen") return whisperfen(); if (place === "Sunken Star Vault") return sunkenStarVault(); if (title === "Forest Trail") return forest(); if (title === "Sunny Clearing") return clearing(); if (title === "By the Creek") return creek(); if (title === "The Old Bridge") return bridge(); return village(); }
$("#identity-button").addEventListener("click", applyIdentity);
$("#save-button").addEventListener("click", saveGame);
$("#load-button").addEventListener("click", loadGame);
$("#export-save-button").addEventListener("click", exportSaveBackup);
$("#import-save-input").addEventListener("change", importSaveBackup);
$("#display-button").addEventListener("click", toggleDisplayOptions);
$("#journal-button").addEventListener("click", showJournal);
$("#map-button").addEventListener("click", showMap);
$("#progression-button").addEventListener("click", openProgression);
function exportSaveBackup() { try { const blob = new Blob([JSON.stringify({ player, lastScene }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `everbound-realms-save-day-${player.world.day}.json`; link.click(); URL.revokeObjectURL(url); storyText.textContent = "Save backup downloaded. Keep the JSON file somewhere safe to move your progress between browsers."; } catch { storyText.textContent = "Your browser could not download a save backup."; } }
function importSaveBackup(event) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(reader.result); if (!data?.player?.classKey) throw new Error("Invalid save"); localStorage.setItem("everboundRealmsSave", JSON.stringify(data)); loadGame(); } catch { showScene("Save Backup Not Recognized", "Choose a save backup file exported by Everbound Realms.", [{ label: "Return", action: showMap }]); } event.target.value = ""; }; reader.readAsText(file); }
function displayPrefs() { try { return JSON.parse(localStorage.getItem("everboundDisplayPrefs") || "{}"); } catch { return {}; } }
function applyDisplayPrefs(prefs = displayPrefs()) { const scale = Math.max(0, Math.min(2, prefs.scale || 0)); document.documentElement.style.setProperty("--text-scale", String(1 + scale * 0.12)); document.body.classList.toggle("high-contrast", Boolean(prefs.highContrast)); document.body.classList.toggle("reduced-motion", Boolean(prefs.reducedMotion)); }
function updateDisplayPref(key, value) { const prefs = displayPrefs(); prefs[key] = value; try { localStorage.setItem("everboundDisplayPrefs", JSON.stringify(prefs)); } catch { /* Display settings still apply for this tab if storage is blocked. */ } applyDisplayPrefs(prefs); }
function toggleDisplayOptions() { const panel = $("#display-options"); panel.hidden = !panel.hidden; if (panel.hidden) return; const prefs = displayPrefs(); panel.replaceChildren(); const title = document.createElement("p"); title.textContent = "Choose text and reading options:"; panel.append(title); const controls = [["Smaller text", () => updateDisplayPref("scale", Math.max(0, (prefs.scale || 0) - 1))], ["Larger text", () => updateDisplayPref("scale", Math.min(2, (prefs.scale || 0) + 1))], [prefs.highContrast ? "Use standard contrast" : "Use high contrast", () => updateDisplayPref("highContrast", !prefs.highContrast)], [prefs.reducedMotion ? "Allow motion" : "Reduce motion", () => updateDisplayPref("reducedMotion", !prefs.reducedMotion)]]; controls.forEach(([label, action]) => { const button = document.createElement("button"); button.type = "button"; button.textContent = label; button.addEventListener("click", () => { action(); toggleDisplayOptions(); }); panel.append(button); }); }
applyDisplayPrefs();
function currentCombatStyle() { return (COMBAT_STYLES[player.classKey] || []).find((style) => style.id === player.combatStyle) || null; }
function combatStyleCost(style = currentCombatStyle()) {
  if (!style) return 0;
  if (player.classKey === "mage") return style.id === "channeler" ? 1 : 3;
  return ["healer", "bard", "beastmaster"].includes(player.classKey) ? 2 : 0;
}
function combatStyleMenu() {
  if (!player.classKey) return chooseClass();
  const choices = COMBAT_STYLES[player.classKey].map((style) => ({
    label: `${style.name} — ${style.moveName}`,
    action: () => { player.combatStyle = style.id; updateStatus(); showScene("Combat Style Chosen", `${style.name}: ${style.description} Signature move: ${style.moveName}. A combat trainer in town can teach you another style later.`, [{ label: "Continue", action: village }]); }
  }));
  showScene("Choose Your Starting Combat Style", "Pick your starting approach. Each style has a passive benefit and a unique move. Changing it later requires a paid lesson from a designated combat trainer.", choices);
}
function combatStyleTrainer(trainer, cost) {
  const choices = COMBAT_STYLES[player.classKey].map((style) => ({
    label: `Learn ${style.name} · ${style.moveName} (${cost} gold)`,
    action: () => {
      if (player.combatStyle === style.id) return showScene("Already Your Style", `You already train as a ${style.name}; ${trainer} will not charge you again.`, [{ label: "Return", action: returnToCurrentTown }]);
      if (player.coins < cost) return showScene("Lesson Costs More", `${trainer} charges ${cost} gold for a full combat-style lesson. You have ${player.coins}. Earn gold through work, quests, trading, or exploration and come back.`, [{ label: "Return", action: returnToCurrentTown }]);
      player.coins -= cost; player.combatStyle = style.id; advanceTime(3); updateStatus();
      showScene("New Style Learned", `${trainer} teaches you ${style.name}. ${style.description} The lesson cost ${cost} gold.`, [{ label: "Continue", action: returnToCurrentTown }]);
    }
  }));
  choices.push({ label: "Leave without a lesson", action: returnToCurrentTown });
  showScene(trainer, `A change in fighting school takes a long lesson and a hefty fee of ${cost} gold. Your current style is ${currentCombatStyle()?.name || "untrained"}. Choose what you want to learn.`, choices);
}
function openProgression() {
  if (!player.classKey) return chooseClass();
  const choices = [{ label: "Upgrade class skills", action: classUpgradeMenu }, { label: "Spend stat points", action: statsMenu }];
  if (player.professions.length) choices.push({ label: "Upgrade professions", action: professionUpgradeMenu });
  choices.push({ label: "Return to your current place", action: returnToCurrentTown });
  showScene("Progression", `Character level ${player.level} improves your stats. Class level ${player.classLevel} grants points for class-skill ranks. Each profession levels separately and grants points for its mastery.`, choices);
}
function village() {
  player.currentTown = "Valoria";
  const cls = player.classKey;
  const special = {
    warrior: { label: "Train with the village guard", action: warriorTrain },
    mage: { label: "Study a spell with the village scholar", action: mageStudy },
    healer: { label: "Offer healing at the village clinic", action: healerClinic },
    thief: { label: "Look for a mark at the market", action: marketSteal },
    beastmaster: { label: "Listen for animals near the village", action: wildlife },
    bard: { label: "Play a song for the village", action: () => townGig("Valoria") }
  }[cls];
  showScene("Valoria Village", `You arrive in Valoria as a ${CLASS_DATA[cls].name}. The forest offers several routes, and the goblin by the bridge is only one problem you might choose to handle. ${player.reputation.Valoria > 0 ? "The guard nods; your past help has not been forgotten." : player.reputation.Valoria < 0 ? "A few townsfolk watch you warily after your earlier choices." : "The villagers are still forming an opinion of you."}`, [
    { label: "Visit the market and gear shop", action: market }, special,
    { label: "Talk with the village guard", action: guard }, { label: "Ask the animal keeper about taming", action: animalKeeper }, { label: "Visit the village square", action: square },
    { label: "Sign up for a town profession", action: starterProfessionBoard }, { label: "Train with Captain Arven to change combat style (40 gold)", action: () => combatStyleTrainer("Captain Arven, Valoria's combat instructor", 40) }, { label: "Explore the forest trail", action: forest }, ...(!player.flags.villageSecret ? [{ label: "Inspect the faded milestone by the gate", action: villageSecret }] : []), { label: "Review stats and spend points", action: statsMenu }, { label: "Upgrade class skills", action: classUpgradeMenu }, ...(player.professions.length ? [{ label: "Upgrade professions", action: professionUpgradeMenu }] : [])
  ]);
}
function square() {
  showScene("Village Square", "People trade stories around the well. The herbalist is searching for moonleaf, and the notice board lists a few local requests.", [
    { label: "Help the herbalist gather moonleaf", action: creek }, { label: "Visit the clinic", action: healerClinic },
    { label: "Read the notice board", action: notices }, { label: "Return to the village", action: village }
  ]);
}
function villageSecret() { if (player.flags.villageSecret) return showScene("Old Milestone", "The hidden notch is empty. The worn grooves still point east, along the old road.", [{ label: "Return to Valoria", action: village }]); const chance = Math.min(90, 38 + stat("intelligence") * 5 + stat("dexterity") * 3 + luckBonus()); if (Math.random() * 100 < chance) { player.flags.villageSecret = true; addPackItem("Wayfarer's Note", "A secret route note marked with old road symbols.", { kind: "clue", value: 4 }); player.coins += 4; player.clues.push("A faint notch below Valoria's milestone points toward a forgotten forest clearing."); addXP(5); updateStatus(); return showScene("A Note in the Milestone", `You find a folded travel note and 4 gold behind the loose stone. It describes a quiet clearing used by old road wardens. Chance: ${chance}%.`, [{ label: "Explore the forest", action: forest }, { label: "Return to village", action: village }]); } showScene("A Worn Stone", `You notice the milestone has been moved before; a shallow notch might hide something. Chance: ${chance}%.`, [{ label: "Look again after a journey", action: village }, { label: "Return", action: village }]); }
function animalKeeper() {
  player.flags.beastLore = true;
  showScene("The Animal Keeper", "An older keeper tends a limping fox. ‘Wild beasts fear a rushed approach. Beastmasters say a calm greeting and a little food help a bond take root. A wolf den lies beyond the creek.’", [
    ...(player.companion ? [{ label: "Ask about your companion's past", action: companionStory }] : []),
    { label: "Buy feed for the trail", action: prepareTreat }, { label: "Look for the forest wolf", action: encounterWolf }, { label: "Return to the village", action: village }
  ]);
}
function companionStory() {
  if (!player.companion) return animalKeeper();
  if ((player.companion.bond || 1) >= 3) return showScene("A Trusted Companion", `${player.companion.name} has come to trust you deeply. The keeper says it will stay by your side.`, [{ label: "Return to the village", action: village }]);
  const beast = BEAST_DATA[Object.keys(BEAST_DATA).find((key) => BEAST_DATA[key].name === player.companion.name)];
  showScene("A Companion's Story", `${player.companion.name} (${player.companion.personality}) reacts to the keeper's gentle voice. ${beast?.story || "The keeper thinks it has more of its past to share."}`, [
    { label: "Spend time following its favorite trail", action: () => { player.companion.bond = (player.companion.bond || 1) + 1; player.companion.attack += 1; addXP(5); changeReputation("Valoria", 1, `Learned more about ${player.companion.name}`); advanceTime(2); updateStatus(); showScene("A Stronger Bond", `${player.companion.name} returns from the trail more relaxed. Your bond grows, and the companion's attacks improve.`, [{ label: "Return to the village", action: village }, { label: "Explore together", action: forest }]); } },
    { label: "Let the companion rest", action: village }
  ]);
}
function starterProfessionBoard() {
  showScene("Valoria Trades Hall", "The guild clerk explains that professions are extra careers alongside your class. Blacksmith and Cook are available here; the other guilds are in later towns.", [
    { label: "Sign up as a Blacksmith", action: () => enrollProfession("Blacksmith") },
    { label: "Sign up as a Cook", action: () => enrollProfession("Cook") },
    { label: "Ask about later professions", action: () => showScene("Guild Notice", "Alchemists, Enchanters, and Bards have guilds in Silverbrook. The Astronomer's observatory is beyond the cave, in the highlands.", [{ label: "Return to the village", action: village }]) },
    { label: "Return to the village", action: village }
  ]);
}
function enrollProfession(name) {
  if (player.professions.includes(name)) return showScene("Already Enrolled", `You are already signed up as a ${name}.`, [{ label: "Open your profession menu", action: professionMenu }, { label: "Return", action: village }]);
  player.professions.push(name); player.professionRanks[name] = 1; player.professionXP[name] = 0; player.professionPoints[name] = 0; player.professionUpgrades[name] = 0; updateStatus();
  showScene("Profession Registered", `You sign the guild ledger and become an apprentice ${name}. You can now use the profession's services.`, [
    { label: `Practice ${name}`, action: professionMenu }, { label: `Return to ${player.currentTown || "Valoria"}`, action: returnToCurrentTown }
  ]);
}
function returnToCurrentTown() { return player.currentTown === "Silverbrook" ? silverbrook() : player.currentTown === "Highlands" ? highlandPass() : player.currentTown === "Elderwild Outpost" ? elderwildOutpost() : player.currentTown === "Lantern Quay" ? lanternQuay() : village(); }
function professionMenu() {
  const actions = [];
  if (player.professions.includes("Blacksmith")) actions.push({ label: `Blacksmith rank ${player.professionRanks.Blacksmith || 1}: work an order`, action: blacksmithWork }, { label: "Improve your weapon (2 gold + Iron Ore or Iron Scraps)", action: improveWeapon }, { label: "Mine the quarry for ore", action: mineForOre }, { label: "Craft gear with a trade-off", action: smithRecipeMenu });
  if (player.professions.includes("Cook")) actions.push({ label: `Cook rank ${player.professionRanks.Cook || 1}: choose a travel recipe`, action: cookMenu });
  if (player.professions.includes("Alchemist")) actions.push({ label: `Alchemist rank ${player.professionRanks.Alchemist || 1}: brew a healing potion (2 coins)`, action: alchemistWork });
  if (player.professions.includes("Enchanter")) actions.push({ label: `Enchanter rank ${player.professionRanks.Enchanter || 1}: use the enchanting room`, action: enchantWeapon });
  if (player.professions.includes("Bard") || player.classKey === "bard") actions.push({ label: `Performer rank ${player.professionRanks.Bard || 1}: play a paid gig`, action: bardPerformance }, { label: "Learn or perform a town song", action: bardSongBook });
  if (player.professions.includes("Astronomer")) actions.push({ label: "Read the stars and reveal hidden stats", action: readStars });
  actions.push({ label: "Spend profession upgrade points", action: professionUpgradeMenu });
  actions.push({ label: "Return", action: returnToCurrentTown });
  showScene("Profession Skills", "Your profession gives you extra ways to earn, prepare, and improve your gear.", actions);
}
function smithRecipeMenu() { const choices = [{ label: "Forge a Bulwark Coat · 2 Iron Ore + Thornhide + 8 gold", action: () => craftSmithGear("bulwark") }]; if (player.flags.smithRecipeLearned) choices.push({ label: "Forge the Swift Starblade · Iron Ore + Star-metal + 6 gold", action: () => craftSmithGear("swift") }); choices.push({ label: "Return", action: professionMenu }); showScene("The Smith's Pattern Board", "Crafting asks for materials and gold, and each recipe makes a real trade-off. The Bulwark Coat gives higher defense but slows Agility. The secret Starblade is quicker and sharper, but offers no armor.", choices); }
function craftSmithGear(pattern) { const recipe = pattern === "bulwark" ? { ore: 2, thorn: 1, star: 0, gold: 8, name: "Bulwark Coat", item: { name: "Bulwark Coat", defense: 6, agility: -1, description: "A heavy layered coat with strong protection; its weight reduces Agility." } } : { ore: 1, thorn: 0, star: 1, gold: 6, name: "Swift Starblade", item: { name: "Swift Starblade", attack: 7, agility: 2, description: "A narrow star-metal weapon that raises attack and Agility but offers no armor." } }; const count = (name) => player.inventory.filter((item) => item.name === name).length; if (player.coins < recipe.gold || count("Iron Ore") < recipe.ore || count("Thornhide") < recipe.thorn || count("Star-metal") < recipe.star) return showScene("Materials for the Pattern", `To craft ${recipe.name}, bring ${recipe.ore} Iron Ore${recipe.thorn ? ", one Thornhide" : ""}${recipe.star ? ", one Star-metal" : ""} and ${recipe.gold} gold. Mining, exploration, and monster drops supply the materials.`, [{ label: "Review the pattern", action: smithRecipeMenu }, { label: "Return to your professions", action: professionMenu }]); player.coins -= recipe.gold; for (let i = 0; i < recipe.ore; i++) consumeItem("Iron Ore"); if (recipe.thorn) consumeItem("Thornhide"); if (recipe.star) consumeItem("Star-metal"); const old = pattern === "bulwark" ? player.armor : player.weapon; if (old) player.inventory.push(asPackItem(old)); if (pattern === "bulwark") player.armor = { ...recipe.item, slot: "armor", kind: "gear" }; else player.weapon = { ...recipe.item, slot: "weapon", kind: "gear" }; addProfessionXP("Blacksmith", 12); updateStatus(); showScene("A New Piece of Gear", `You spend ${recipe.gold} gold and the required materials to craft ${recipe.name}. ${recipe.item.description}`, [{ label: "Craft another pattern", action: smithRecipeMenu }, { label: "Return to the forge", action: professionMenu }]); }
function blacksmithWork() {
  if (player.flags.smithOrder) return showScene("Smithy", "You have completed today's work order. The smith says to come back after your next journey.", [{ label: "Improve your weapon", action: improveWeapon }, { label: "Return", action: professionMenu }]);
  player.flags.smithOrder = true; player.coins += 3; addXP(8); addProfessionXP("Blacksmith", 10); updateStatus();
  showScene("Smithy Work Order", "You help fit a new handle and repair a farmer's plough. The smith pays 3 coins and you gain 8 XP.", [{ label: "Return to profession skills", action: professionMenu }, { label: "Return to village", action: village }]);
}
function improveWeapon() {
  if (!player.weapon) return showScene("The Smith's Advice", "Bring or buy a weapon first. The smith needs ore or scrap plus a gold forge fee to improve it.", [{ label: "Visit the market", action: market }, { label: "Return", action: professionMenu }]);
  const material = player.inventory.find((item) => ["Iron Ore", "Iron Scraps"].includes(item.name));
  if (player.coins < 2 || !material) return showScene("The Forge Needs Materials", "An improvement takes 2 gold for fuel and one Iron Ore or Iron Scraps. Mine at Emberglass Quarry, search enemy drops, or buy ore from a town smith.", [{ label: "Mine at Emberglass Quarry", action: mineForOre }, { label: "Return to profession skills", action: professionMenu }]);
  player.coins -= 2; consumeItem(material.name); player.weapon.attack = (player.weapon.attack || 0) + 2 + professionMastery("Blacksmith"); player.weapon.name = `Improved ${player.weapon.name}`; addProfessionXP("Blacksmith", 5); updateStatus();
  showScene("Weapon Improved", `The smith sharpens and balances your ${player.weapon.name}. Its attack has increased.`, [{ label: "Return to profession skills", action: professionMenu }, { label: "Return to village", action: village }]);
}
function mineForOre() {
  if (!player.flags.frontierUnlocked) return showScene("A Smith's Reminder", "The safer Iron Scraps in Valoria's forest can help with small repairs. Better ore lies in the Emberglass Quarry, along the frontier trail beyond the Highlands.", [{ label: "Gather in the Valoria forest", action: gatherResources }, { label: "Return", action: professionMenu }]);
  const result = Math.random();
  advanceTime(3);
  if (result < 0.62) { addPackItem("Iron Ore", "Dense iron ore mined from the Emberglass Quarry; required for smithing upgrades.", { kind: "material", value: 6 }); addProfessionXP("Blacksmith", 4); updateStatus(); return showScene("Ore Vein Found", "After clearing loose glass from the seam, you mine one Iron Ore. The work costs three hours but trains your Blacksmith craft.", [{ label: "Mine again", action: mineForOre }, { label: "Return to profession skills", action: professionMenu }, { label: "Return to the outpost", action: elderwildOutpost }]); }
  addPackItem("Iron Scraps", "Useful for smithing and setting a trap.", { kind: "material", value: 3 }); addProfessionXP("Blacksmith", 2); updateStatus();
  showScene("Scraps Salvaged", "The exposed seam is poor, but you salvage Iron Scraps and learn from the work.", [{ label: "Mine again", action: mineForOre }, { label: "Return to profession skills", action: professionMenu }, { label: "Return to the outpost", action: elderwildOutpost }]);
}
function cookMeal() { return cookMenu(); }
function cookMenu() { showScene("Cook's Recipe Book", "Choose what you prepare. Some recipes need gathered ingredients; you can pay a supply fee when you are short.", [{ label: "Hearty stew · 2 gold or Wild Berries · restores health", action: () => cookRecipe("hearty") }, { label: "Trail spice ration · 3 gold or Wild Berries + Moonleaf · strengthens next attack", action: () => cookRecipe("trail") }, { label: "Focus broth · 3 gold or Moonleaf · restores extra mana", action: () => cookRecipe("focus") }, { label: "Return to profession skills", action: professionMenu }]); }
function cookRecipe(kind) { const recipes = { hearty: { name: "Hearty Stew", cost: 2, ingredients: ["Wild Berries"] }, trail: { name: "Trail Spice", cost: 3, ingredients: ["Wild Berries", "Moonleaf"] }, focus: { name: "Focus Broth", cost: 3, ingredients: ["Moonleaf"] } }; const recipe = recipes[kind]; const count = (name) => player.inventory.filter((item) => item.name === name).length; const enough = recipe.ingredients.every((name) => count(name) > 0); if (!enough && player.coins < recipe.cost) return showScene("Kitchen Pantry", `${recipe.name} needs ${recipe.ingredients.join(" and ")} or ${recipe.cost} gold for market ingredients. Gather at the creek or buy supplies.`, [{ label: "Gather supplies", action: gatherResources }, { label: "Return to recipes", action: cookMenu }]); if (enough) recipe.ingredients.forEach((name) => consumeItem(name)); else player.coins -= recipe.cost; player.meals++; player.mealTypes ||= []; player.mealTypes.push(kind); addProfessionXP("Cook", 5); updateStatus(); showScene("Meal Packed", `You prepare ${recipe.name} and pack it for a later fight. You now have ${player.meals} meal(s).`, [{ label: "Prepare another recipe", action: cookMenu }, { label: "Return to town", action: returnToCurrentTown }]); }
function notices() {
  showScene("Notice Board", "A request offers a reward for moonleaf. A note warns travelers that the goblin near the bridge may be hungry. Someone also reported tracks near a quiet grove.", [
    { label: "Find moonleaf at the creek", action: creek }, { label: "Explore the wildlife grove", action: wildlife },
    { label: "Visit the bridge", action: bridge }, { label: "Back to village", action: village }
  ]);
}
function guard() {
  player.flags.metGuard = true;
  const hotGoods = player.inventory.filter((item) => item.hot);
  const greeting = hotGoods.length ? `The guard notices ${hotGoods[0].name} in your pack and raises an eyebrow. You may explain, surrender it, or pay for discretion.` : "The guard offers an iron key for the storehouse. ‘The goblin mostly wants food. You can bargain, sneak, fight, or take the creek path around.’";
  showScene("The Village Guard", greeting, [
    ...(hotGoods.length ? [{ label: "Surrender the marked goods", action: surrenderHotGoods }, { label: "Try to hide them (Dexterity check)", action: hideHotGoods }] : []),
    { label: "Take the key and open the storehouse", action: storehouse }, { label: "Offer the guard a 5-gold bribe for a road pass", action: bribeGuard }, { label: "Ask more about the goblin", action: goblinAdvice },
    { label: "Return to the village", action: village }
  ]);
}
function surrenderHotGoods() {
  const item = player.inventory.find((entry) => entry.hot); if (item) player.inventory.splice(player.inventory.indexOf(item), 1);
  changeReputation("Valoria", 1, "Returned suspicious goods to the guard"); updateStatus();
  showScene("Goods Returned", "The guard takes the marked item and lets you go with a warning. Your honesty improves your standing in Valoria.", [{ label: "Return to the guard", action: guard }, { label: "Return to town", action: village }]);
}
function hideHotGoods() {
  const chance = Math.min(90, 30 + stat("dexterity") * 6 + luckBonus());
  if (Math.random() * 100 < chance) return showScene("A Clean Escape", `You conceal the goods before the guard can inspect them. Chance: ${chance}%.`, [{ label: "Continue speaking", action: guard }, { label: "Leave", action: village }]);
  changeReputation("Valoria", -1, "The guard caught you hiding suspicious goods"); updateStatus();
  showScene("Caught Hiding Goods", `The guard spots your movement and confiscates ${player.inventory.find((entry) => entry.hot)?.name || "the item"}. Chance: ${chance}%.`, [{ label: "Return to guard", action: surrenderHotGoods }, { label: "Leave", action: village }]);
}
function bribeGuard() {
  if (player.coins < 5) return showScene("The Guard Refuses", "The guard quietly asks for 5 gold to arrange a temporary road pass. You do not have enough.", [{ label: "Earn gold at the creek", action: creek }, { label: "Return", action: guard }]);
  player.coins -= 5; player.flags.bridgeResolved = true; changeReputation("Valoria", -1, "Paid the Valoria guard for a road pass"); updateStatus();
  showScene("A Quiet Arrangement", "The guard pockets the coins and gives you a stamped pass. You can cross without confronting the goblin; word of the bribe may reach the town council.", [{ label: "Take the King's Road", action: journey }, { label: "Return to the village", action: village }]);
}
function storehouse() {
  if (player.flags.gotStorePotion) return showScene("Storehouse", "You already took the healing potion from here.", [{ label: "Return", action: village }]);
  player.flags.gotStorePotion = true; player.potions++; updateStatus();
  showScene("Storehouse", "The old key turns. You find a healing potion and stow it in your bag.", [{ label: "Return to the village", action: village }, { label: "Explore the forest", action: forest }]);
}
function goblinAdvice() {
  showScene("A Few Ideas", "The merchant sometimes sells trail food. A Thief could try a quiet hand at the market. The creek path avoids the bridge completely.", [
    { label: "Visit the market", action: market }, { label: "Take the creek path", action: creekPath }, { label: "Return to the guard", action: guard }
  ]);
}
function market() {
  if (timeOfDay() === "Night") return showScene("Market Closed", "The shopkeeper has closed for the night. The market reopens in the morning.", [{ label: "Rest at a town inn", action: restAtInn }, { label: "Return to town", action: returnToCurrentTown }]);
  const choices = [];
  GEAR.weapons.forEach((g) => { if (player.coins >= shopPrice(g)) choices.push({ label: `Buy ${g.name} (${shopPrice(g)} coins)`, action: () => buyGear("weapon", g) }); });
  GEAR.armor.forEach((g) => { if (player.coins >= shopPrice(g)) choices.push({ label: `Buy ${g.name} (${shopPrice(g)} coins)`, action: () => buyGear("armor", g) }); });
  if (player.coins >= 2 && player.potions < 5) choices.push({ label: "Buy healing potion (2 coins)", action: buyPotion });
  if (player.coins >= 1 && !player.flags.treatReady) choices.push({ label: "Buy dried meat for the trail (1 coin)", action: prepareTreat });
  if (!player.flags.trailTentOwned) choices.push({ label: "Buy a reusable Trail Tent (15 gold)", action: buyTrailTent });
  else choices.push({ label: "Your Trail Tent is packed and ready", action: () => showScene("Packed Trail Tent", "The tent is reusable. In wilderness areas, choose ‘Set up your Trail Tent’ to sleep eight hours and recover health and mana.", [{ label: "Return to the market", action: market }]) });
  if (player.flags.haggleDay !== player.world.day) choices.push({ label: "Haggle for a lower price", action: haggleMarket });
  if (player.home) choices.push({ label: "Open your home storage", action: storageMenu });
  if (player.classKey === "thief") choices.push({ label: "Try to steal from the market", action: marketSteal });
  if (player.professions.includes("Blacksmith") && player.coins >= 6) choices.push({ label: "Buy Iron Ore (6 coins)", action: () => buyCraftMaterial("Iron Ore", "Dense iron ore for the forge.", 6) });
  if (player.professions.includes("Blacksmith") || player.professions.includes("Cook") || player.professions.includes("Alchemist") || player.professions.includes("Enchanter") || player.professions.includes("Bard") || player.professions.includes("Astronomer")) choices.push({ label: "Open profession skills", action: professionMenu });
  choices.push({ label: "Ask for local rumors", action: rumors }, { label: "Leave the market", action: returnToCurrentTown });
  showScene("Market and Gear Shop", `The merchant sells weapons, armor, and potions. You have ${player.coins} coins. Your equipped gear is shown above.`, choices);
}
function buyTrailTent() { if (player.coins < 15) return showScene("Tent Seller", "A reusable Trail Tent costs 15 gold. Save up in town through work, trading, or exploration.", [{ label: "Return to market", action: market }]); player.coins -= 15; player.flags.trailTentOwned = true; addXP(2); updateStatus(); showScene("Trail Tent Purchased", "You buy a sturdy, reusable tent, ground pegs, and a weatherproof bedroll. It stays in your pack after each camp.", [{ label: "Return to market", action: market }, { label: "Return to town", action: returnToCurrentTown }]); }
function campChoice(returnAction) { return player.flags.trailTentOwned ? [{ label: "Set up your Trail Tent and rest", action: () => campInWilds(returnAction) }] : []; }
function campInWilds(returnAction) { const before = player.health; advanceTime(8); const heal = Math.ceil(player.maxHealth * 0.7); const mana = Math.ceil(player.maxMana * 0.7); player.health = Math.min(player.maxHealth, player.health + heal); player.mana = Math.min(player.maxMana, player.mana + mana); updateStatus(); showScene("Camp in the Wilds", `You pitch your reusable tent and rest through the changing weather. You recover ${player.health - before} health and regain mana. The surrounding wilds remain quiet.`, [{ label: "Pack up and continue", action: returnAction }, { label: "Check the map", action: showMap }]); }
function shopPrice(item) { const guildDiscount = player.factions.includes("Market Guild") ? Math.min(2, Math.floor((player.reputation["Market Guild"] || 0) / 2)) : 0; return Math.max(1, item.cost - Math.floor((player.reputation[player.currentTown] || 0) / 5) - guildDiscount - (player.flags.haggleDiscount || 0) + (player.world.weather === "Rain" ? 1 : 0)); }
function restAtInn() { advanceTime(8); player.health = player.maxHealth; player.mana = player.maxMana; updateStatus(); showScene("Morning at the Inn", "You sleep safely and wake refreshed. The market is open again.", [{ label: "Visit the market", action: market }, { label: "Return to town", action: returnToCurrentTown }]); }
function haggleMarket() {
  player.flags.haggleDay = player.world.day;
  const chance = Math.min(90, 35 + stat("dexterity") * 5 + Math.floor((player.reputation[player.currentTown] || 0) / 2) + luckBonus());
  if (Math.random() * 100 < chance) {
    player.flags.haggleDiscount = 2; player.reputation[player.currentTown] = (player.reputation[player.currentTown] || 0) + 1; updateStatus();
    showScene("A Better Price", `Your quick bargaining wins you a 2-gold discount on your next purchase. Chance: ${chance}%.`, [{ label: "Shop with the discount", action: market }]);
  } else {
    player.reputation[player.currentTown] = (player.reputation[player.currentTown] || 0) - 1;
    showScene("The Merchant Holds Firm", `The merchant refuses to lower the price. Your chance was ${chance}%.`, [{ label: "Shop anyway", action: market }, { label: "Leave", action: returnToCurrentTown }]);
  }
}
function buyGear(type, item) {
  const price = shopPrice(item);
  if (player.coins < price) return market();
  player.coins -= price; player.flags.haggleDiscount = 0;
  const owned = { ...item, id: `${item.name}-${Date.now()}`, kind: "gear", slot: type, description: item.description || item.name };
  if (player[type]) player.inventory.push({ ...player[type], id: `${player[type].name}-${Date.now()}-old`, kind: "gear", slot: type });
  player[type] = owned; updateStatus();
  showScene("Gear Equipped", `You buy and equip the ${item.name}.`, [{ label: "Browse more", action: market }, { label: "Return to the village", action: village }]);
}
function buyPotion() { player.coins -= 2; player.potions++; updateStatus(); market(); }
function buyCraftMaterial(name, description, cost) { if (player.coins < cost) return market(); player.coins -= cost; addPackItem(name, description, { kind: "material", value: cost }); updateStatus(); market(); }
function rumors() {
  showScene("Market Rumors", "A merchant says the creek path loops around the bridge. The herbalist pays for moonleaf, and animal tracks are common near the grove.", [
    { label: "Find the herbalist's moonleaf", action: creek }, { label: "Go to the grove", action: wildlife }, { label: "Back to the market", action: market }
  ]);
}
function marketSteal() {
  if (player.classKey !== "thief") return market();
  if (player.flags.arrested) return showScene("Under Guard", "The guard has forbidden you from trying to steal in this market again.", [{ label: "Return to village", action: village }]);
  player.flags.stealAttempts++;
  const successChance = Math.max(10, Math.min(90, 45 + stat("dexterity") * 5 + luckBonus() - (player.flags.stealAttempts - 1) * 12));
  if (Math.random() * 100 < successChance) {
    player.coins += 4; player.flags.failedSteals = 0; addPackItem("Marked Silver Brooch", "A silver brooch stolen from a market stall. It is hot goods; a fence can sell it discreetly.", { kind: "stolen", value: 7, hot: true }); changeReputation(player.currentTown, -1, "A market purse went missing while you were nearby"); updateStatus();
    showScene("A Nimble Hand", `You lift 4 coins from an unattended purse and slip away. Your Dexterity gives you about a ${successChance}% chance this attempt. Repeated attempts are riskier because the merchant is watching.`, [
      { label: "Browse the shop", action: market }, { label: "Leave the market", action: village }
    ]);
  } else {
    player.flags.failedSteals++; player.coins = Math.max(0, player.coins - 2); changeReputation(player.currentTown, -2, "Caught attempting a market theft"); updateStatus();
    if (player.flags.failedSteals >= 3) {
      player.flags.arrested = true;
      showScene("Caught and Arrested", "After three failed thefts in a row, the guard arrests you and escorts you out of the market. You lose 2 coins and cannot try stealing here again this visit.", [
        { label: "Serve your time and return to town", action: () => { player.flags.arrested = false; player.flags.stealAttempts = 0; player.flags.failedSteals = 0; returnToCurrentTown(); } }
      ]);
      return;
    }
    showScene("Caught in the Act", `The merchant catches your hand and demands a fine. You lose 2 coins. ${3 - player.flags.failedSteals} more consecutive failed attempt${player.flags.failedSteals === 1 ? "" : "s"} will bring the guard. Your next attempt is less likely to work.`, [
      { label: "Apologize and leave", action: returnToCurrentTown }, { label: "Risk another attempt", action: marketSteal }
    ]);
  }
}
function healerClinic() {
  if (player.classKey !== "healer") return showScene("Village Clinic", "The healer is tending to the townsfolk. You can rest here, or pay for a treatment.", [
    ...(player.conditions.includes("Wounded") && player.coins >= 4 ? [{ label: "Pay 4 gold to treat Wounded", action: clinicTreatment }] : []),
    { label: "Rest and recover", action: rest }, { label: "Return to the village", action: village }
  ]);
  if (player.flags.clinicWork) return showScene("Village Clinic", "You have already helped at the clinic today. The grateful patients have paid you.", [{ label: "Return to village", action: village }]);
  player.flags.clinicWork = true; player.coins += 6; addXP(8); player.mana = Math.min(player.maxMana, player.mana + 3); player.conditions = player.conditions.filter((condition) => condition !== "Wounded"); updateStatus();
  showScene("A Healer's Work", "You treat a farmer's injured hand and ease a child's fever with Mending Light. The clinic pays you 6 coins, you gain 8 XP, and the healer tends any wound you are carrying.", [
    { label: "Spend any new stat points", action: statsMenu }, { label: "Return to the village", action: village }
  ]);
}
function clinicTreatment() { if (player.coins >= 4) { player.coins -= 4; player.conditions = player.conditions.filter((condition) => condition !== "Wounded"); player.health = player.maxHealth; updateStatus(); } showScene("Treated at the Clinic", "The healer cleans and wraps your wounds. You can fight at full strength again.", [{ label: "Return to the village", action: village }]); }
function warriorTrain() {
  if (player.flags.warriorTraining) return showScene("Training Yard", "You have already trained with the guard on this visit. They suggest putting your new skills to use on the road.", [{ label: "Return to the village", action: village }, { label: "Head into the forest", action: forest }]);
  if (player.coins < 2) return showScene("Training Yard", "The guard offers to train you, but asks for 2 coins for the practice gear. You can come back after earning some.", [{ label: "Return", action: village }]);
  player.flags.warriorTraining = true; player.coins -= 2; addXP(8); player.health = player.maxHealth; updateStatus();
  showScene("Training Yard", "You practice footwork and shield technique with the guard. You gain 8 XP and recover your health.", [
    { label: "Review new points", action: statsMenu }, { label: "Return", action: village }
  ]);
}
function mageStudy() {
  if (player.flags.mageStudy) return showScene("The Scholar's Study", "You have already studied with the scholar. The next lesson will come from experience on the road.", [{ label: "Return to the village", action: village }, { label: "Begin the journey", action: forest }]);
  player.flags.mageStudy = true;
  player.mana = player.maxMana; addXP(5); updateStatus();
  showScene("The Scholar's Study", "You study the shape of a new spell. Your mana is restored and you gain 5 XP. At level 5, you will learn Frostbind.", [
    { label: "Review stats", action: statsMenu }, { label: "Return", action: village }
  ]);
}
function statsMenu() {
  updateStatus();
  const desc = "Strength raises physical attack; Dexterity helps stealing and tricky actions; Agility helps you act first; Vitality raises maximum health; Wisdom raises maximum mana; Intelligence improves mana regeneration and magic damage.";
  const choices = player.statPoints > 0 ? STAT_NAMES.map((name) => ({ label: `Add 1 ${name}`, action: () => spendPoint(name) })) : [{ label: "You have no unspent points yet", action: () => village() }];
  choices.push({ label: "Back to the village", action: village });
  showScene("Character and Stats", `${desc}\n\nYou have ${player.statPoints} points to spend. Class bonuses and equipped gear are included in the stats shown above.`, choices);
}
function spendPoint(name) {
  if (player.statPoints < 1) return statsMenu();
  const key = name.toLowerCase(); player.baseStats[key]++; player.statPoints--;
  if (key === "vitality") { player.maxHealth += 3; player.health += 3; }
  if (key === "wisdom") { player.maxMana += 2; player.mana += 2; }
  updateStatus(); statsMenu();
}
function forest() {
  advanceTime(1);
  const onward = player.flags.bridgeResolved ? [{ label: "Follow the road toward the next town", action: journey }] : [];
  showScene("Forest Trail", "The forest opens into several routes. You hear water to the west, and see animal tracks disappearing into the grove. The bridge lies east.", [
    { label: "Look for the forest wolf", action: encounterWolf }, { label: "Search for other wildlife", action: wildlife }, { label: "Investigate a sound off the trail", action: wildernessEvent }, { label: "Follow the creek", action: creek },
    { label: "Gather useful plants and stones", action: gatherResources }, { label: "Approach the bridge", action: bridge }, { label: "Rest in the clearing", action: clearing }, ...onward, ...campChoice(forest), ...(!player.flags.villageSecret ? [{ label: "Look for an old trail mark beneath the roots", action: villageSecret }] : []), { label: "Return to village", action: village }
  ]);
}
function gatherResources() {
  if (player.flags.gatheringDay !== player.world.day) { player.flags.gatheringDay = player.world.day; player.flags.gatheringCount = 0; }
  if (player.flags.gatheringCount >= 3) return showScene("The Forest Has Given What It Can", "You have gathered three times from this patch today. Give the plants and shallow seams time to recover, or look for new gathering grounds in another region.", [{ label: "Continue along the forest", action: forest }, { label: "Rest until tomorrow", action: rest }, { label: "Return to Valoria", action: village }]);
  player.flags.gatheringCount++;
  advanceTime(2);
  const weatherPenalty = player.world.weather === "Rain" ? 10 : player.world.weather === "Windy" ? 5 : 0;
  const result = Math.random() * 100 + player.hiddenStats.luck * 2 - weatherPenalty;
  if (result > 70) addPackItem("Iron Scraps", "Useful iron pieces for a Blacksmith's repairs and weapon upgrades.", { kind: "material", value: 2 });
  else if (result > 35) addPackItem("Moonleaf", "A silvery herb used by Alchemists and cooks. The Valoria herbalist also buys it.", { kind: "ingredient", value: 3 });
  else addPackItem("Wild Berries", "A handful of edible berries. They can be cooked into a meal.", { kind: "ingredient", value: 1 });
  addProfessionXP("Alchemist", 2); addProfessionXP("Blacksmith", result > 70 ? 2 : 0);
  showScene("Gathered Supplies", `You search in ${player.world.weather.toLowerCase()} weather and find a useful resource. This patch can yield ${3 - player.flags.gatheringCount} more times today.`, [{ label: "Gather again", action: gatherResources }, { label: "Continue exploring", action: forest }, ...campChoice(forest), { label: "Return to town", action: village }]);
}
function encounterWolf() { encounterAnimal("wolf"); }
function wildlife() {
  const animals = Object.keys(BEAST_DATA);
  encounterAnimal(animals[Math.floor(Math.random() * animals.length)]);
}
function encounterAnimal(key) {
  const beast = BEAST_DATA[key];
  player.pendingBeast = key;
  const tame = player.classKey === "beastmaster" && player.flags.beastLore && !player.companion;
  const clue = player.flags.animalStudyKey === key ? ` Your earlier study helps you read its temperament. ${player.world.weather === "Rain" ? "Rain softens your approach." : "It is wary of sudden movement."}` : ` You notice ${player.world.weather === "Windy" ? "tracks pressed into the sheltered side of the trail" : player.world.weather === "Rain" ? "fresh tracks and a scent carried from the creek" : "light tracks curving toward cover"}. Taking time to study them may help.`;
  showScene("An Animal Encounter", `A ${beast.name.toLowerCase()} steps into your path. It watches you carefully, ready to flee or defend itself.${clue}`, [
    ...(tame ? [{ label: `Try to tame the ${beast.name.toLowerCase()} with Wild Bond`, action: tameAnimal }] : []),
    { label: "Study its tracks and temperament", action: () => observeAnimal(beast) },
    ...(player.classKey === "beastmaster" && !player.flags.beastLore ? [{ label: "Ask someone in Valoria about the animal", action: animalKeeper }] : []),
    { label: "Leave it in peace", action: forest }
  ]);
}
function tameAnimal() {
  if (player.classKey !== "beastmaster" || !player.flags.beastLore || player.companion) return encounterAnimal(player.pendingBeast);
  const beast = BEAST_DATA[player.pendingBeast];
  const prepared = player.flags.treatReady;
  const wildBondRank = player.skillRanks["Wild Bond"] || 1;
  const styleTamingBonus = currentCombatStyle()?.passive === "taming" ? 8 : 0;
  player.tameFailureCounts ||= {};
  const priorFailures = player.tameFailureCounts[player.pendingBeast] || 0;
  const studied = player.flags.animalStudyKey === player.pendingBeast;
  const weatherBonus = player.world.weather === "Rain" ? 4 : 0;
  const chance = Math.max(8, Math.min(80, 28 + stat("wisdom") * 3 - beast.taming + (prepared ? 18 : 0) + (studied ? 10 : 0) + weatherBonus + luckBonus() + (wildBondRank - 1) * 3 + styleTamingBonus - priorFailures * 8));
  if (Math.random() * 100 < chance) {
    player.companion = { ...beast, attack: beast.attack + wildBondRank - 1, guard: beast.guard + Math.floor((wildBondRank - 1) / 2), bond: 1 }; player.flags.treatReady = false; player.tameFailureCounts[player.pendingBeast] = 0; addXP(5); updateStatus();
    showScene("A Bond Formed", `${beast.name} accepts your bond and joins you. The animal can help attack and defend in combat. You gain 5 XP.`, [
      { label: "Continue exploring", action: forest }, { label: "Return to the village", action: village }
    ]);
  } else { player.tameFailureCounts[player.pendingBeast] = priorFailures + 1; advanceTime(2); updateStatus(); showScene("The Animal Keeps Its Distance", `${beast.name} is not ready to trust you. The animal keeper's advice may help. This attempt had about a ${chance}% chance. Repeated attempts against the same animal become less likely to work, so give it time before trying again.`, [
    { label: "Give it space and continue exploring", action: forest }, { label: "Prepare the keeper's treat for a later encounter", action: prepareTreat }, { label: "Return to the village", action: village }
  ]); }
}
function prepareTreat() {
  if (player.coins < 1) return showScene("No Coins for a Treat", "The market sells a small bundle of dried meat for 1 coin. You can earn coins by helping the herbalist or searching the clearing.", [{ label: "Help the herbalist", action: creek }, { label: "Search the clearing", action: clearing }, { label: "Return", action: village }]);
  player.coins--; player.flags.treatReady = true; updateStatus();
  showScene("Trail Rations", "You buy dried meat for 1 coin and pack it away with your supplies.", [
    { label: "Look for the forest wolf", action: encounterWolf }, { label: "Search for other animals", action: wildlife }, { label: "Return to village", action: village }
  ]);
}
function observeAnimal(beast) {
  player.flags.animalStudyKey = player.pendingBeast; player.flags.animalTracksStudied = true;
  showScene("A Moment in the Wild", `You study the ${beast.name.toLowerCase()}'s tracks. It favors ${beast.personality}; its old trail follows ${player.world.weather === "Rain" ? "the creek bank under the rain" : "a sheltered path away from the main road"}. This knowledge may improve your next approach.`, [
    ...(player.classKey === "beastmaster" && player.flags.beastLore && !player.companion ? [{ label: "Make a patient taming attempt", action: tameAnimal }] : []), { label: "Follow its tracks later", action: forest }, ...(player.classKey === "beastmaster" && !player.flags.beastLore ? [{ label: "Ask the animal keeper what you observed", action: animalKeeper }] : []), { label: "Return to village", action: village }
  ]);
}
function wildernessEvent() { if (player.flags.wildEventDay === player.world.day) return showScene("A Quiet Stretch", "The forest is quiet for now. Give the trail time to change, or explore a different path.", [{ label: "Follow the creek", action: creek }, { label: "Search for wildlife", action: wildlife }, { label: "Return to the trail", action: forest }]); player.flags.wildEventDay = player.world.day; const events = ["courier", "camp", "stones"]; const event = events[Math.floor(Math.random() * events.length)]; if (event === "courier") return showScene("A Stranded Courier", "A courier's handcart is stuck beside the creek. Their sealed letter is damp, but they offer a small reward if you help.", [{ label: "Help lift the cart (2 hours)", action: () => { advanceTime(2); player.coins += 5; changeReputation("Valoria", 1, "Helped a stranded courier"); addXP(5); updateStatus(); showScene("The Cart Is Free", "The courier remembers your help and shares a rumor about an unmarked stone circle in the woods.", [{ label: "Search for the stone circle", action: forest }, { label: "Return to Valoria", action: village }]); } }, { label: "Ask for a map instead", action: () => { player.clues.push("The creek courier mentioned a stone circle east of the old oak."); showScene("A Woodland Rumor", "The courier marks the old oak on your map. They cannot pay much, but promise to remember your kindness.", [{ label: "Continue", action: forest }]); } }, { label: "Leave them be", action: forest }]); if (event === "camp") return showScene("An Abandoned Fire Ring", "A cold fire ring holds a few unburned branches. The stones are arranged in a pattern rather than a circle.", [{ label: "Study the arrangement", action: villageSecret }, { label: "Gather useful supplies", action: gatherResources }, { label: "Leave the site", action: forest }]); return showScene("The Three Stones", "Three stones lie in a line, though no trail connects them. The middle stone is warm even in the rain.", [{ label: "Trace the stones and search", action: villageSecret }, { label: "Mark the place in your journal", action: () => { player.clues.push("Three warm stones mark an old path east of Valoria."); showJournal(); } }, { label: "Move on", action: forest }]); }
function creek() {
  let text = "You find moonleaf by the water.";
  if (!player.flags.helpedHerbalist) {
    player.flags.helpedHerbalist = true; player.coins += 4; player.potions++; addXP(12); changeReputation("Valoria", 2, "Helped the Valoria herbalist"); advanceTime(2); updateStatus();
    text += " You bring it back to the herbalist, who pays 4 coins, gives you a potion, and awards 12 XP.";
  } else text = "The creek is peaceful. You already completed the herbalist's request.";
  showScene("By the Creek", text, [{ label: "Take the path around the bridge", action: creekPath }, { label: "Return to forest trail", action: forest }]);
}
function creekPath() {
  player.flags.bridgeResolved = true;
  if (player.flags.factionTaskAccepted && player.factions[0] === "Riverwardens") player.flags.riverRouteMarked = true;
  showScene("The Creek Path", "You follow the creek around the bridge without meeting the goblin. The path leads to a quiet clearing. Beyond it, the King's Road continues toward Silverbrook.", [
    { label: "Explore the clearing", action: clearing }, { label: "Follow the road toward Silverbrook", action: journey }, { label: "Return to the village", action: village }
  ]);
}
function clearing() {
  const onward = player.flags.bridgeResolved ? [{ label: "Follow the King's Road toward Silverbrook", action: journey }] : [];
  showScene("Sunny Clearing", "A stone marker stands in the grass. You can rest, search around it, or continue exploring. A well-worn road leads onward to Silverbrook.", [
    { label: "Rest and recover", action: rest }, { label: "Search the stone marker", action: marker },
    { label: "Look for the forest wolf", action: encounterWolf }, { label: "Search for other wildlife", action: wildlife }, ...onward, ...campChoice(clearing), { label: "Return to the village", action: village }
  ]);
}
function rest() { const amount = player.maxHealth - player.health; player.health = player.maxHealth; player.mana = player.maxMana; updateStatus(); showScene("A Safe Rest", `You rest until you recover ${amount} health and restore your mana.`, [{ label: "Keep exploring", action: forest }, { label: "Return to village", action: village }]); }
function marker() {
  if (player.flags.foundMarker) return showScene("The Stone Marker", "You already searched here; there is nothing else to find.", [{ label: "Return to clearing", action: clearing }]);
  player.flags.foundMarker = true; player.coins += 3; addXP(5); updateStatus();
  showScene("The Stone Marker", "You find 3 old coins beneath the marker and gain 5 XP.", [{ label: "Return to clearing", action: clearing }, { label: "Visit the market", action: market }]);
}
function bridge() {
  if (player.flags.bridgeResolved) return showScene("The Old Bridge", "You have already made it across. The goblin is gone from the bridge.", [{ label: "Explore the clearing", action: clearing }, { label: "Return to village", action: village }]);
  showScene("The Old Bridge", "A goblin blocks the narrow bridge, clutching a basket of apples. It looks nervous, not cruel. What will you do?", [
    { label: "Offer 1 coin for a peaceful passage", action: offerFood }, { label: "Use Dexterity to sneak past", action: sneak },
    { label: "Challenge it to a fight", action: bridgeCombat },
    { label: "Leave and take another path", action: forest }
  ]);
}
function offerFood() {
  if (player.coins < 1) return showScene("Short on Coins", "You need a coin to offer the goblin food. You could earn some at the creek or search the clearing.", [{ label: "Take another path", action: forest }, { label: "Return to village", action: village }]);
  player.coins--; player.flags.bridgeResolved = true; changeReputation("Valoria", 1, "Resolved the bridge dispute peacefully"); updateStatus();
  showScene("A Peaceful Bargain", "You offer an apple. The goblin steps aside and points toward the sunny clearing. No fight needed. Beyond the clearing, the King's Road leads to Silverbrook.", [{ label: "Cross the bridge", action: clearing }, { label: "Begin the journey to Silverbrook", action: journey }, { label: "Return to village", action: village }]);
}
function sneak() {
  const chance = Math.min(95, 35 + stat("dexterity") * 6 + stat("agility") * 3 + luckBonus());
  if (Math.random() * 100 < chance) {
    player.flags.bridgeResolved = true;
    showScene("A Quiet Crossing", `You slip over the bridge unnoticed. Your Dexterity and Agility gave you a ${chance}% chance. On the far side, the King's Road winds toward Silverbrook.`, [{ label: "Explore the clearing", action: clearing }, { label: "Begin the journey to Silverbrook", action: journey }, { label: "Return to village", action: village }]);
  } else showScene("A Loose Board Creaks", "The goblin notices you, but you can back away or decide to fight.", [{ label: "Back away", action: forest }, { label: "Try to fight", action: bridgeCombat }]);
}
function bridgeCombat() {
  startCombat({ name: "Bridge Goblin", health: 18 + player.level * 3, attack: 5 + player.level, xp: 18, coins: 2, magic: false, storyKey: "bridge", weaknesses: ["fire", "magic"] });
}
function journey() {
  if (!player.flags.bridgeResolved) return showScene("The King's Road", "The road beyond the forest is difficult to reach while the bridge is blocked. Find a peaceful way across, sneak by, fight, or take the creek path.", [{ label: "Return to the forest", action: forest }]);
  if (!player.flags.journeyStarted) advanceTime(6);
  player.flags.journeyStarted = true;
  showScene("The King's Road", `With Valoria behind you, the road runs through rolling hills. ${player.world.weather === "Rain" ? "Rain clouds gather over the hills." : "A sign points toward Silverbrook."} Travelers speak of an old cave in the eastern cliffs.`, [
    { label: "Walk the King's Road to Silverbrook", action: roadEvent }, { label: "Pay 3 gold for the river coach", action: () => { if (player.coins < 3) return roadEvent(); player.coins -= 3; advanceTime(3); silverbrook(); } }, { label: "Make camp and rest", action: restOnRoad },
    { label: "Take a detour to the forest clearing", action: clearing }, { label: "Return to Valoria", action: village }
  ]);
}
function roadEvent() {
  advanceTime(5);
  showScene("Along the Road", "A caravan is stopped beside a broken wheel. You can help them, continue alone, or take a rough shortcut through the hills.", [
    { label: "Help the caravan repair its wheel", action: () => { player.coins += 2; changeReputation("Silverbrook", 1, "Helped a caravan on the King's Road"); advanceTime(2); silverbrook(); } },
    { label: "Keep walking to Silverbrook", action: silverbrook },
    { label: "Take the hill shortcut (Agility check)", action: hillShortcut }
  ]);
}
function hillShortcut() {
  const chance = Math.min(90, 40 + stat("agility") * 5 + luckBonus() - (player.world.weather === "Rain" ? 15 : 0));
  if (Math.random() * 100 < chance) { advanceTime(2); silverbrook(); }
  else { player.health = Math.max(1, player.health - 3); advanceTime(3); showScene("A Slippery Shortcut", `You slip on the wet hill and lose 3 health. Your chance was ${chance}%. Silverbrook is still ahead.`, [{ label: "Continue to Silverbrook", action: silverbrook }, { label: "Rest first", action: restOnRoad }]); }
}
function restOnRoad() {
  const healed = player.maxHealth - player.health; player.health = player.maxHealth; player.mana = player.maxMana; updateStatus();
  advanceTime(7);
  showScene("Roadside Camp", `You rest by the road, recovering ${healed} health and restoring your mana. ${player.companion ? `${player.companion.name} keeps watch nearby.` : "You take the first watch yourself."} In the distance, Silverbrook's lanterns glow.`, [
    ...(player.companion ? [{ label: "Share a quiet moment with your companion", action: companionCamp }] : []),
    { label: "Continue to Silverbrook", action: silverbrook }, { label: "Return to Valoria", action: village }
  ]);
}
function companionCamp() {
  if (player.companion) { player.companion.bond = Math.min(3, (player.companion.bond || 1) + 1); updateStatus(); }
  showScene("Stories by the Campfire", `You share the quiet with ${player.companion?.name || "your companion"}. The night passes peacefully, and your trust grows.`, [{ label: "Continue to Silverbrook", action: silverbrook }, { label: "Return to Valoria", action: village }]);
}
function silverbrook() {
  player.currentTown = "Silverbrook";
  showScene("Silverbrook", `You reach a busy river town. Locals welcome travelers, and a map-maker mentions an old cave in the eastern cliffs. ${player.reputation.Silverbrook > 0 ? "The ferryman remembers your help and offers a fairer crossing." : "A ferryman is tightening a rope beneath the bridge."} There is time to look around before setting out.`, [
    { label: "Visit the town market", action: market }, { label: "Ask the map-maker about the cave", action: caveRumor },
    ...(player.classKey === "bard" ? [{ label: "Play a paid set at the riverside inn", action: () => townGig("Silverbrook") }] : []),
    { label: "Sign up for a town profession", action: silverbrookProfessionBoard }, { label: "Train with Arena Master Nera to change style (65 gold)", action: () => combatStyleTrainer("Arena Master Nera, Silverbrook's combat instructor", 65) }, { label: "Visit the faction hall", action: factionHall }, { label: "Visit the Copper Cup Inn", action: silverbrookInn }, { label: "Ask the moneylender about a loan", action: moneylender }, { label: "Visit the riverside room", action: housing }, { label: "Find the back-alley fence", action: fence }, { label: "Help at the riverside", action: riversideTask }, { label: "Visit the Starwell Observatory", action: observatory }, { label: "Follow the eastern trail to the cave", action: caveEntrance },
    ...(!player.flags.silverbrookSecret ? [{ label: "Look around the old ferry ropework", action: silverbrookSecret }] : []), { label: "Travel back to Valoria", action: village }
  ]);
}
function silverbrookSecret() { if (player.flags.silverbrookSecret) return showScene("The Ferry Post", "The hidden spool is gone. The faint mark beneath the post points toward the old coast road.", [{ label: "Return to Silverbrook", action: silverbrook }]); const chance = Math.min(88, 35 + stat("dexterity") * 5 + stat("intelligence") * 2 + luckBonus()); if (Math.random() * 100 < chance) { player.flags.silverbrookSecret = true; addPackItem("Ferryman's Spool", "A brass spool engraved with the tide mark used along the far coast.", { kind: "key", value: 6 }); player.clues.push("A ferry post bears the same three-mark tide sign as the northern shore."); player.coins += 5; addXP(7); updateStatus(); return showScene("A Spool in the Ferry Post", `You uncover a brass spool and 5 gold beneath the old rope post. Its symbols point toward a road no longer used. Chance: ${chance}%.`, [{ label: "Record the clue", action: showJournal }, { label: "Return to town", action: silverbrook }]); } advanceTime(1); showScene("A Loose Knot", `You find a loose knot but no hidden object. A ferry worker mentions the post is older than the town. Chance: ${chance}%.`, [{ label: "Return later", action: silverbrook }, { label: "Ask the ferryman", action: riversideTask }]); }
function factionHall() {
  showScene("Silverbrook Faction Hall", `Three groups recruit here: the Riverwardens protect creek routes and travelers, the Market Guild supports trade and fair deals, and the Lantern Wardens investigate dangerous old places. Choose one to represent for now. Current allegiance: ${player.factions[0] || "none"}.`, [
    { label: "Join the Riverwardens", action: () => joinFaction("Riverwardens", "They protect ferries and woodland paths. Members earn trust through rescue and exploration.") },
    { label: "Join the Market Guild", action: () => joinFaction("Market Guild", "The guild offers trade contacts, better prices, and work for people with useful skills.") },
    { label: "Join the Lantern Wardens", action: () => joinFaction("Lantern Wardens", "The Wardens investigate dangerous ruins and pay for reliable reports.") },
    { label: "Ask about a faction errand", action: factionErrand }, { label: "Return to Silverbrook", action: silverbrook }
  ]);
}
function joinFaction(name, detail) {
  if (player.factions.includes(name)) return showScene("Already a Member", `You already serve the ${name}. ${detail}`, [{ label: "Faction errands", action: factionErrand }, { label: "Return", action: silverbrook }]);
  if (player.factions.length) return showScene("An Oath Already Taken", `You have joined the ${player.factions[0]}. The factions ask for one public allegiance at a time. You may change later, but your old allies will remember.`, [{ label: "Keep your oath", action: silverbrook }, { label: "Change allegiance", action: () => { player.reputation[player.factions[0]] = (player.reputation[player.factions[0]] || 0) - 3; player.memories.push(`Left ${player.factions[0]}`); player.factions = []; joinFaction(name, detail); } }]);
  player.factions = [name]; player.reputation[name] = (player.reputation[name] || 0) + 1; player.memories.push(`Joined ${name}`); updateStatus();
  showScene("Oath Taken", `${detail} A clerk records your name and remembers the promise.`, [{ label: "Take a faction errand", action: factionErrand }, { label: "Return to Silverbrook", action: silverbrook }]);
}
function factionErrand() {
  if (!player.factions.length) return showScene("No Faction Yet", "Join one of the groups in Silverbrook's faction hall to receive an errand.", [{ label: "Visit the hall", action: factionHall }]);
  const faction = player.factions[0];
  if (player.flags.factionErrand) return showScene("Errand Complete", `You already completed the ${faction} errand for this chapter. The officer says more work will open as the story grows.`, [{ label: "Return", action: silverbrook }]);
  if (player.flags.factionTaskAccepted) {
    const done = faction === "Riverwardens" ? player.flags.bridgeResolved : player.flags.caveResolved;
    if (done) return showScene("Report Back", `You have what the ${faction} asked for. Return the report to claim your reward.`, [{ label: "Claim the errand reward", action: () => { player.flags.factionErrand = true; player.flags.factionTaskAccepted = false; player.coins += 6; player.reputation[faction] = (player.reputation[faction] || 0) + 2; addXP(10); updateStatus(); player.memories.push(`Completed an errand for ${faction}`); showScene("Errand Complete", `The ${faction} pays 6 gold and improves your standing.`, [{ label: "Return to Silverbrook", action: silverbrook }]); } }, { label: "Return", action: silverbrook }]);
    return showScene("Errand in Progress", `Your ${faction} assignment is still open. ${faction === "Riverwardens" ? "Find a safe way past the forest bridge or mark the creek route." : "Reach the eastern cave and learn what is inside."}`, [{ label: "Continue the journey", action: forest }, { label: "Return to Silverbrook", action: silverbrook }]);
  }
  showScene(`${faction} Errand`, faction === "Riverwardens" ? "The Riverwardens want a safe route marked along the creek." : faction === "Market Guild" ? "The Market Guild asks you to inspect the eastern cave's old trade route." : "The Lantern Wardens want a reliable report about the eastern cave guardian.", [
    { label: "Accept the errand", action: () => { player.flags.factionTaskAccepted = true; showScene("Errand Accepted", "The officer records the task but holds the reward until you return with proof.", [{ label: "Continue", action: forest }, { label: "Return to Silverbrook", action: silverbrook }]); } },
    { label: "Not yet", action: silverbrook }
  ]);
}
function silverbrookInn() {
  showScene("The Copper Cup Inn", "The innkeeper has a dice table and a warm common room. A traveling singer is looking for a room, and the bartender knows the town's gossip.", [
    { label: "Play dice (2 gold)", action: gamble }, ...(player.classKey === "bard" || player.professions.includes("Bard") ? [{ label: "Perform for the inn (earn gold)", action: () => townGig("Silverbrook") }] : []),
    { label: "Ask for local gossip", action: rumors }, { label: "Return to Silverbrook", action: silverbrook }
  ]);
}
function gamble() {
  if (player.coins < 2) return showScene("No Stake", "The dice game needs a 2-gold stake.", [{ label: "Return to the inn", action: silverbrookInn }]);
  player.coins -= 2;
  const chance = Math.min(80, 35 + player.hiddenStats.luck * 4 + (player.classKey === "thief" ? 8 : 0));
  if (Math.random() * 100 < chance) { player.coins += 6; updateStatus(); showScene("Lucky Roll", `You roll a winning pair and collect 6 gold. Chance: ${chance}%.`, [{ label: "Play again", action: gamble }, { label: "Leave the table", action: silverbrookInn }]); }
  else { updateStatus(); showScene("Bad Luck", `The dice turn against you and you lose your 2-gold stake. Chance: ${chance}%.`, [{ label: "Try again", action: gamble }, { label: "Leave the table", action: silverbrookInn }]); }
}
function moneylender() {
  showScene("The Moneylender", `The moneylender offers a 10-gold loan. Your current debt is ${player.debt} gold. Unpaid debt grows by 1 gold each new day.`, [
    ...(player.debt === 0 ? [{ label: "Borrow 10 gold", action: () => { player.coins += 10; player.debt = 12; updateStatus(); showScene("Loan Recorded", "You receive 10 gold and owe 12. The moneylender records your name in a heavy ledger.", [{ label: "Return", action: silverbrook }]); } }] : []),
    ...(player.debt > 0 && player.coins >= player.debt ? [{ label: `Repay debt (${player.debt} gold)`, action: () => { player.coins -= player.debt; player.debt = 0; player.reputation.Silverbrook += 2; updateStatus(); silverbrook(); } }] : []),
    { label: "Return to Silverbrook", action: silverbrook }
  ]);
}
function housing() {
  if (player.home) return showScene("Your Riverside Room", "You have a small room above the old ferry office. It is safe to rest and store extra belongings here.", [{ label: "Rest at home", action: rest }, { label: "Manage storage", action: storageMenu }, { label: "Return to Silverbrook", action: silverbrook }]);
  showScene("A Room of Your Own", "A modest riverside room is for sale for 30 gold. Owning it gives you a safe place to rest and keep extra gear.", [
    ...(player.coins >= 30 ? [{ label: "Buy the room (30 gold)", action: () => { player.coins -= 30; player.home = true; updateStatus(); housing(); } }] : []),
    { label: "Return to Silverbrook", action: silverbrook }
  ]);
}
function storageMenu() {
  if (!player.home) return housing();
  const choices = player.inventory.map((item) => ({ label: `Store ${item.name}`, action: () => { player.inventory.splice(player.inventory.findIndex((x) => x.id === item.id), 1); player.storage ||= []; player.storage.push(item); updateStatus(); storageMenu(); } }));
  (player.storage || []).forEach((item) => choices.push({ label: `Retrieve ${item.name}`, action: () => { player.storage.splice(player.storage.findIndex((x) => x.id === item.id), 1); player.inventory.push(item); updateStatus(); storageMenu(); } }));
  choices.push({ label: "Return to your room", action: housing });
  showScene("Home Storage", `You have ${(player.storage || []).length} stored items.`, choices);
}
function fence() {
  const hot = player.inventory.filter((item) => item.hot);
  showScene("The Back-Alley Fence", "A hooded fence buys marked goods for discreet prices. Carrying hot goods near a guard could attract attention.", [
    ...hot.map((item) => ({ label: `Sell ${item.name} (${item.value || 4} gold)`, action: () => { player.inventory.splice(player.inventory.findIndex((x) => x.id === item.id), 1); player.coins += item.value || 4; updateStatus(); fence(); } })),
    { label: "Ask what goods are wanted", action: () => showScene("Fence's Rumor", "The fence is looking for old cave crystals and small silver trinkets. A careful thief could find a way to get some.", [{ label: "Return", action: silverbrook }]) },
    { label: "Leave the alley", action: silverbrook }
  ]);
}
function silverbrookProfessionBoard() {
  showScene("Silverbrook Guild Hall", "The guilds here accept apprentices in Alchemy, Enchanting, and Bardic performance. You can keep every profession you have already learned.", [
    { label: "Sign up as an Alchemist", action: () => enrollProfession("Alchemist") },
    { label: "Sign up as an Enchanter", action: () => enrollProfession("Enchanter") },
    { label: "Sign up as a Bard", action: () => enrollProfession("Bard") },
    { label: "Return to Silverbrook", action: silverbrook }
  ]);
}
function alchemistWork() {
  const hasHerb = player.inventory.some((item) => item.name === "Moonleaf");
  if (!hasHerb && player.coins < 2) return showScene("Alchemist's Bench", "You need 2 coins for herbs and a glass vial, or you can gather Moonleaf in the forest.", [{ label: "Gather supplies", action: gatherResources }, { label: "Return", action: professionMenu }]);
  if (hasHerb) consumeItem("Moonleaf"); else player.coins -= 2;
  player.potions++; addProfessionXP("Alchemist", 4); updateStatus();
  showScene("Potion Brewed", "You mix a healing potion at the alchemist's bench and pack it for the road.", [{ label: "Brew another", action: professionMenu }, { label: "Return to Silverbrook", action: silverbrook }]);
}
function enchantWeapon() {
  if (!player.flags.enchantingRoomOwned) return showScene("Silverbrook Enchanting Rooms", "The guild offers a permanent key to a private enchanting room for 25 gold. Each enchantment still consumes a rune, materials, and a service fee.", [
    { label: "Buy the room key (25 gold)", action: () => { if (player.coins < 25) return showScene("Not Enough Gold", "Save 25 gold for the room key. You can earn coin through work, selling finds, or town opportunities.", [{ label: "Return", action: professionMenu }]); player.coins -= 25; player.flags.enchantingRoomOwned = true; updateStatus(); showScene("Room Key Purchased", "You now have a private room at the Silverbrook guild. Its runic circle is ready, but every enchantment needs one Rune and 8 gold in reagents.", [{ label: "Prepare an enchantment", action: enchantWeapon }, { label: "Return to Silverbrook", action: silverbrook }]); } },
    { label: "Return", action: professionMenu }
  ]);
  if (!player.weapon) return showScene("Enchanter's Advice", "Bring a weapon to enchant. You can buy one at the market.", [{ label: "Visit the market", action: market }, { label: "Return", action: professionMenu }]);
  const rune = player.inventory.find((item) => ["Lesser Rune", "Greater Rune", "Marsh Rune"].includes(item.name));
  if (player.coins < 8 || !rune) return showScene("The Circle Is Dormant", `A weapon enchantment costs 8 gold and one Rune. ${rune ? "You have a rune; save enough gold." : "Runes are rare enemy drops, not sold at the market."}`, [{ label: "Review the Astronomer's drop forecast", action: forecastKnownDrops }, { label: "Return to Silverbrook", action: silverbrook }, { label: "Return to profession skills", action: professionMenu }]);
  showScene("Choose an Element", `The circle holds one ${rune.name}. Choose a lasting element for ${player.weapon.name}. Each enchantment costs 8 gold and one rune.`, [{ label: "Ember · fire", action: () => enchantWithElement("fire", rune) }, { label: "Rime · frost", action: () => enchantWithElement("frost", rune) }, { label: "Aether · arcane", action: () => enchantWithElement("arcane", rune) }, { label: "Leave the rune untouched", action: professionMenu }]);
}
function enchantWithElement(element, rune) { if (player.coins < 8 || !player.inventory.some((item) => item.id === rune.id)) return enchantWeapon(); player.coins -= 8; consumeItem(rune.name); player.weapon.element = element; player.weapon.magic = (player.weapon.magic || 0) + (rune.name === "Greater Rune" ? 4 : 2) + professionMastery("Enchanter"); player.weapon.name = `${element[0].toUpperCase()}${element.slice(1)}-bound ${player.weapon.name.replace(/^(Fire|Frost|Arcane)-bound /, "")}`; addProfessionXP("Enchanter", 8); updateStatus(); showScene("An Elemental Edge", `The ${element} rune binds to ${player.weapon.name}. Its attacks now carry ${element} energy; enemies may resist or be vulnerable to it.`, [{ label: "Return to the enchanting room", action: enchantWeapon }, { label: "Return to town", action: returnToCurrentTown }]); }
function bardPerformance() {
  if (player.flags.bardShow) return showScene("The Riverside Inn", "You already performed tonight. The crowd hums your tune as you pack up.", [{ label: "Return to Silverbrook", action: silverbrook }]);
  player.flags.bardShow = true; player.coins += 4 + professionMastery("Bard"); addXP(8); addProfessionXP("Bard", 8); updateStatus();
  showScene("A Song for Silverbrook", "You perform a lively ballad. The innkeeper pays 4 coins, and a traveler mentions strange lights above the eastern cave. You gain 8 XP.", [{ label: "Return to Silverbrook", action: silverbrook }, { label: "Visit the cave", action: caveEntrance }]);
}
function townGig(town) {
  const key = town === "Valoria" ? "valoriaGig" : town === "Lantern Quay" ? "quayGig" : "silverbrookGig";
  if (player.flags[key]) return showScene("Encore Later", "You already played here today. The crowd asks you to return another evening.", [{ label: "Return", action: returnToCurrentTown }]);
  const pay = town === "Silverbrook" || town === "Lantern Quay" ? 7 : 4;
  player.flags[key] = true; player.coins += pay + professionMastery("Bard"); addProfessionXP("Bard", 8); player.reputation.Bards = (player.reputation.Bards || 0) + 1; player.reputation[town] = (player.reputation[town] || 0) + 1; advanceTime(2); updateStatus();
  showScene("A Song for the Town", `You play a lively set in ${town}. The crowd joins the chorus and leaves ${pay} gold in your case. Your name becomes better known among local performers.`, [
    { label: "Accept an audience request", action: () => showScene("A Request from the Crowd", "You play an old road song. A traveler hums along and shares a rumor about the next stop.", [{ label: "Return", action: returnToCurrentTown }]) },
    { label: "Return", action: returnToCurrentTown }
  ]);
}
function bardSongBook() { showScene("Songs and Small Gigs", "Songs take practice and a little gold for strings, candles, or refreshments. Their effects are modest; a Bard can improve them through profession practice.", [{ label: "Learn the Wayfarer's Refrain (6 gold)", action: learnRoadSong }, { label: "Perform a Healing Hymn (2 gold; restore health)", action: performHealingSong }, { label: "Play a paid set for local gold", action: () => townGig(player.currentTown === "Lantern Quay" ? "Lantern Quay" : player.currentTown === "Silverbrook" ? "Silverbrook" : "Valoria") }, { label: "Return to profession skills", action: professionMenu }]); }
function learnRoadSong() { if (player.flags.bardSongLearned) return showScene("Wayfarer's Refrain", "You already know the road song. Singing it before a journey prepares a modest combat buff.", [{ label: "Perform the refrain", action: performRoadSong }, { label: "Return", action: bardSongBook }]); if (player.coins < 6) return showScene("A Song Needs Strings", "The traveling teacher asks for 6 gold for lesson materials.", [{ label: "Return", action: bardSongBook }]); player.coins -= 6; player.flags.bardSongLearned = true; addProfessionXP("Bard", 8); updateStatus(); showScene("A New Refrain", "You learn a traveling song that can steady you before a fight. The melody changes slightly with each town that joins in.", [{ label: "Perform it now", action: performRoadSong }, { label: "Return", action: bardSongBook }]); }
function performRoadSong() { player.flags.roadSongReady = true; advanceTime(1); if (player.professions.includes("Bard") || player.classKey === "bard") addProfessionXP("Bard", 3); showScene("The Wayfarer's Refrain", "The tune settles your breathing and turns the road into a steady rhythm. You will begin the next fight with a small attack bonus.", [{ label: "Continue journey", action: returnToCurrentTown }]); }
function performHealingSong() { if (player.coins < 2) return showScene("No Coin for the Common Room", "The inn asks 2 gold to cover the room and refreshments.", [{ label: "Return", action: bardSongBook }]); player.coins -= 2; const restored = Math.min(7 + professionMastery("Bard"), player.maxHealth - player.health); player.health += restored; addProfessionXP("Bard", 5); updateStatus(); showScene("A Healing Hymn", `Your song calms the room and restores ${restored} health. The audience remembers your kindness.`, [{ label: "Perform again", action: bardSongBook }, { label: "Return", action: returnToCurrentTown }]); }
function observatory() {
  if (!player.flags.caveResolved) return showScene("Starwell Observatory", "The observatory is closed while the cliff trail is unsafe. The astronomer is staying in the eastern cave region.", [{ label: "Return to Silverbrook", action: silverbrook }]);
  showScene("Starwell Observatory", "A small observatory overlooks the mountains. The astronomer offers a place in the guild to anyone willing to study the night sky.", [
    { label: "Sign up as an Astronomer", action: () => enrollProfession("Astronomer") }, { label: "Read the night sky", action: readStars }, { label: "Return to Silverbrook", action: silverbrook }
  ]);
}
function readStars() {
  if (!player.professions.includes("Astronomer")) return showScene("The Starwell Observatory", "The astronomer explains that guild members learn to read hidden signs in the sky. You can sign up after reaching the observatory beyond the cave.", [{ label: "Return", action: silverbrook }]);
  if (player.flags.lastStarStudyDay !== player.world.day) { player.flags.lastStarStudyDay = player.world.day; addProfessionXP("Astronomer", 5); }
  updateStatus();
  const clue = player.flags.veiledReachUnlocked ? !player.flags.saltwindSecret ? "The northern star points toward a hollow at the Saltwind tide line." : !player.flags.whisperfenSecret ? "Three dim stars form an arrow above Whisperfen's reed circle." : "The star chart suggests a hidden recess below the Sunken Star Vault's empty plinth." : player.flags.frontierUnlocked ? "The Elderwild surveyors report a gap in the Drowned Archive's outer wall." : "A faint trail mark lies beneath the old milestone outside Valoria.";
  showScene("A Fortunate Alignment", `You chart Luck ${player.hiddenStats.luck + professionMastery("Astronomer")}, read the weather as ${player.world.weather.toLowerCase()}, and see a ${player.hiddenStats.luck >= 6 ? "slightly favorable" : "uncertain"} sign for your next risky action. Astronomer records suggest: ${clue} Daily study gives profession experience.`, [{ label: "Forecast known enemy drops", action: forecastKnownDrops }, { label: "Return to the observatory", action: observatory }, { label: "Open profession skills", action: professionMenu }]);
}
function caveRumor() {
  showScene("The Map-maker's Hint", "The cave door is marked with old symbols. ‘There may be more than one way in. A clever mind, a steady hand, or a little force could open it.’", [
    { label: "Head for the eastern cave", action: caveEntrance }, { label: "Look around Silverbrook first", action: silverbrook }
  ]);
}
function riversideTask() {
  if (player.flags.riverTask) return showScene("Riverside", "You already helped secure the ferry ropes. The ferryman thanks you again.", [{ label: "Return to Silverbrook", action: silverbrook }]);
  player.flags.riverTask = true; player.coins += 3; addXP(8); updateStatus();
  showScene("A Small Favor", "You help the ferryman secure a loose rope before the next boat arrives. They pay you 3 coins and you gain 8 XP.", [
    { label: "Continue to the cave", action: caveEntrance }, { label: "Back to town", action: silverbrook }
  ]);
}
function caveEntrance() {
  advanceTime(2);
  if (player.flags.caveResolved) return showScene("The Eastern Cave", "The cave is quiet now. You have already explored its first chamber.", [
    { label: "Continue along the cliff trail", action: highlandPass }, { label: "Return to Silverbrook", action: silverbrook }
  ]);
  showScene("The Eastern Cave", "Carved symbols cover a stone door. You hear a scrape from somewhere in the darkness beyond it. Choose how to enter.", [
    { label: "Study the runes and solve the door", action: solveCaveRunes },
    { label: "Pick the old lock (Thief bonus)", action: pickCaveLock },
    { label: "Force the door open (Warrior bonus)", action: forceCaveDoor },
    { label: "Ask your companion to scout", action: scoutCave },
    { label: "Return to Silverbrook", action: silverbrook }
  ]);
}
function solveCaveRunes() {
  const bonus = player.classKey === "mage" || player.classKey === "healer" ? 25 : 0;
  const chance = Math.min(95, 35 + stat("intelligence") * 7 + bonus + luckBonus());
  if (Math.random() * 100 < chance) return openCave("The runes glow as you trace their pattern. The stone door slides open without a sound.");
  showScene("The Runes Resist", `The symbols flare and go dark. Your chance was ${chance}%. Try another way in or return later.`, [
    { label: "Try to pick the lock", action: pickCaveLock }, { label: "Force the door", action: forceCaveDoor }, { label: "Return to town", action: silverbrook }
  ]);
}
function pickCaveLock() {
  const bonus = player.classKey === "thief" ? 30 : 0;
  const chance = Math.min(95, 25 + stat("dexterity") * 7 + bonus + luckBonus());
  if (Math.random() * 100 < chance) return openCave("Your tools find the hidden catch. The stone door unlocks with a click.");
  showScene("The Lock Holds", `The lock is stubborn. Your chance was ${chance}%. Try the runes, force the door, or come back later.`, [
    { label: "Study the runes", action: solveCaveRunes }, { label: "Force the door", action: forceCaveDoor }, { label: "Return to town", action: silverbrook }
  ]);
}
function forceCaveDoor() {
  if (player.classKey === "warrior") return openCave("You brace your shoulder and heave. The stone door grinds open under your strength.");
  player.health = Math.max(1, player.health - 4); updateStatus();
  openCave("You push with all your strength. The door opens, though the effort leaves you sore (4 health lost).");
}
function scoutCave() {
  if (player.classKey === "beastmaster" && player.companion) return openCave(`${player.companion.name} sniffs around the door and finds a side passage. You enter quietly.`);
  showScene("No Companion to Scout", "This path works best with a tamed animal companion. You can use another way into the cave.", [
    { label: "Study the runes", action: solveCaveRunes }, { label: "Pick the lock", action: pickCaveLock }, { label: "Return to town", action: silverbrook }
  ]);
}
function openCave(text) {
  showScene("Inside the Cave", `${text} In the first chamber, a cave guardian blocks a chest. It watches you, waiting to see whether you threaten it.`, [
    { label: "Offer a peaceful greeting", action: befriendGuardian },
    { label: "Challenge the guardian", action: () => startCombat({ name: "Cave Guardian", health: 26 + player.level * 4, attack: 7 + player.level, xp: 28, coins: 5, magic: true, storyKey: "cave", resistances: ["physical"], weaknesses: ["fire", "sound"] }) },
    { label: "Leave the guardian and return to town", action: silverbrook }
  ]);
}
function befriendGuardian() {
  const chance = Math.min(90, 30 + stat("wisdom") * 6 + (player.classKey === "healer" || player.classKey === "beastmaster" ? 20 : 0));
  if (Math.random() * 100 < chance) {
    player.flags.caveResolved = true; player.coins += 5; const leveled = addXP(20); updateStatus();
    showScene("A Peaceful Discovery", `You calm the guardian and share food. It lets you open the chest. Your approach had a ${chance}% chance. You find 5 coins and gain 20 XP${leveled ? `, reaching level ${player.level} and earning 2 stat points` : ""}.`, [
      { label: "Continue along the cliff trail", action: highlandPass }, { label: "Return to Silverbrook", action: silverbrook }
    ]);
  } else showScene("The Guardian Is Wary", `Your greeting does not earn its trust yet. Your chance was ${chance}%. Choose another approach.`, [
    { label: "Fight the guardian", action: () => startCombat({ name: "Cave Guardian", health: 26 + player.level * 4, attack: 7 + player.level, xp: 28, coins: 5, magic: true, storyKey: "cave", resistances: ["physical"], weaknesses: ["fire", "sound"] }) },
    { label: "Leave the cave", action: silverbrook }
  ]);
}
function highlandPass() {
  player.currentTown = "Highlands";
  showScene("The Highland Pass", "Beyond the cave, the trail climbs toward distant mountains. The next stretch of the journey lies ahead; you can pause here before another chapter.", [
    { label: "Visit the Starwell Observatory", action: observatory }, { label: "Train with Ridge Mentor Ysra to change style (90 gold)", action: () => combatStyleTrainer("Ridge Mentor Ysra", 90) }, { label: "Enter the Elderwild Frontier", action: elderwildOutpost }, { label: "Return to Silverbrook", action: silverbrook }, { label: "Travel back to Valoria", action: village }, { label: "Rest before continuing", action: rest }
  ]);
}
function rememberDiscovery(flag, name) {
  if (player.flags[flag]) return;
  player.flags[flag] = true; player.discoveries ||= []; player.discoveries.push(name); addXP(3);
}
function elderwildOutpost() {
  player.flags.frontierUnlocked = true; player.currentTown = "Elderwild Outpost";
  rememberDiscovery("frontierOutpostSeen", "Elderwild Frontier Outpost");
  showScene("Elderwild Frontier Outpost", "A timber palisade guards a busy settlement at the edge of unmapped country. The scout captain marks a safer trail through Thornwake first, then the quarry road, the drowned archive, and finally Starfall. Side discoveries and detours are yours to choose along the way.", [
    { label: "Study the frontier map", action: frontierMap }, { label: "Report discoveries to the survey board", action: frontierSurvey },
    { label: "Explore the next marked trail", action: frontierMap },
    { label: "Train with Veteran Senn to change style (120 gold)", action: () => combatStyleTrainer("Veteran Senn, the outpost's combat instructor", 120) },
    { label: "Rest at the bunkhouse", action: frontierRest }, { label: "Return to the Highland Pass", action: highlandPass }
  ]);
}
function frontierRest() {
  const healed = player.maxHealth - player.health, mana = player.maxMana - player.mana;
  player.health = player.maxHealth; player.mana = player.maxMana; advanceTime(8); updateStatus();
  showScene("Outpost Bunkhouse", `You sleep safely inside the palisade, restoring ${healed} health and ${mana} mana. The outpost remains a place to resupply between expeditions.`, [{ label: "Choose an expedition", action: frontierMap }, { label: "Return to the outpost", action: elderwildOutpost }]);
}
function frontierMap() {
  const places = ["Thornwake Woods", "Emberglass Quarry", "Drowned Archive", "Starfall Basin"];
  const known = player.discoveries.filter((name) => places.includes(name));
  const choices = [];
  if (!player.flags.thornwakeSeen) choices.push({ label: "Follow the scout marks into Thornwake Woods · gentler danger", action: thornwakeWoods });
  else choices.push({ label: "Revisit Thornwake Woods", action: thornwakeWoods });
  if (player.flags.thornwakeSeen) choices.push({ label: player.flags.quarrySeen ? "Revisit Emberglass Quarry" : "Follow the ore trail to Emberglass Quarry · moderate danger", action: emberglassQuarry });
  if (player.flags.quarrySeen) choices.push({ label: player.flags.archiveSeen ? "Revisit the Drowned Archive" : "Follow the old road to the Drowned Archive · challenging", action: drownedArchive });
  if (player.flags.archiveSeen) choices.push({ label: player.flags.basinSeen ? "Revisit Starfall Basin" : "Take the high ridge toward Starfall Basin · high danger", action: starfallBasin });
  choices.push({ label: "Return to the outpost", action: elderwildOutpost });
  const next = !player.flags.thornwakeSeen ? "Thornwake Woods" : !player.flags.quarrySeen ? "Emberglass Quarry" : !player.flags.archiveSeen ? "Drowned Archive" : !player.flags.basinSeen ? "Starfall Basin" : "any landmark you want to revisit";
  showScene("Elderwild Region Map", `Scout marks suggest a steady route: Thornwake → Emberglass → the Drowned Archive → Starfall. Your next suggested stop is ${next}; optional discoveries and returning to the outpost remain open. Mapped: ${known.join(", ") || "none yet"}.`, choices);
}
function frontierSurvey() {
  const targets = ["thornwakeSeen", "quarrySeen", "archiveSeen", "basinSeen"];
  const found = targets.filter((flag) => player.flags[flag]).length;
  if (player.flags.frontierSurveyClaimed) return showScene("Survey Reward Claimed", "The outpost survey is complete. Scouts are already mapping new country beyond these landmarks; future expeditions will bring more reports.", [{ label: "Choose an expedition", action: frontierMap }]);
  if (found >= 3) return showScene("Frontier Survey Complete", "You have charted three major landmarks. The surveyor pays 25 gold and 30 XP, and adds your map to the growing archive.", [{ label: "Claim the reward", action: () => { player.flags.frontierSurveyClaimed = true; player.coins += 25; addXP(30); player.memories.push("Mapped three Elderwild landmarks"); updateStatus(); showScene("Survey Paid", "Your map earns 25 gold, 30 XP, and the trust of the outpost scouts. New territory can be added beyond this frontier.", [{ label: "Return to the outpost", action: elderwildOutpost }]); } }, { label: "Return", action: elderwildOutpost }]);
  showScene("Outpost Survey Board", `The scouts will pay for a map of three landmarks. You have found ${found} of 3: ${targets.map((flag, index) => `${["Thornwake", "Emberglass", "Drowned Archive", "Starfall"][index]} ${player.flags[flag] ? "✓" : "?"}`).join(" · ")}.`, [{ label: "Choose an expedition", action: frontierMap }, { label: "Return", action: elderwildOutpost }]);
}
function thornwakeWoods() {
  player.currentTown = "Elderwild Outpost"; advanceTime(2); rememberDiscovery("thornwakeSeen", "Thornwake Woods");
  showScene("Thornwake Woods", "Pale trees twist over an old hunting trail. You hear a trapped animal nearby, see a marked supply cache, and notice heavy tracks deeper in the wood.", [
    ...(!player.flags.thornbackBoarDefeated ? [{ label: "Protect the hunters from a Thornback Boar", action: () => startCombat({ name: "Thornback Boar", health: 20 + player.level * 3, attack: 6 + player.level, xp: 22, coins: 6, magic: false, weaknesses: ["fire"], regionFlag: "thornbackBoarDefeated" }) }] : []),
    ...(!player.flags.thorncache ? [{ label: "Search the marked supply cache", action: searchThornCache }] : []),
    ...(!player.flags.thornAnimalFreed ? [{ label: "Free the trapped animal", action: freeThornAnimal }] : []), ...campChoice(thornwakeWoods), { label: "Return to the region map", action: frontierMap }
  ]);
}
function searchThornCache() {
  const chance = Math.min(90, 45 + stat("dexterity") * 5 + luckBonus());
  player.flags.thorncache = true;
  if (Math.random() * 100 < chance) { player.coins += 7; addPackItem("Moonleaf", "A fragrant frontier herb used by Alchemists.", { kind: "material", value: 4 }); addXP(7); updateStatus(); return showScene("Scout's Cache", `You find 7 gold and Moonleaf. Your search chance was ${chance}%.`, [{ label: "Continue in Thornwake", action: thornwakeWoods }, { label: "Return to the outpost", action: elderwildOutpost }]); }
  showScene("An Empty Cache", `The cache has already been picked clean. Your search chance was ${chance}%; you lose no supplies.`, [{ label: "Return to Thornwake", action: thornwakeWoods }, { label: "Leave the woods", action: frontierMap }]);
}
function freeThornAnimal() {
  const chance = Math.min(85, 40 + stat("dexterity") * 4 + stat("wisdom") * 3 + (player.classKey === "beastmaster" ? 15 : 0));
  if (Math.random() * 100 < chance) { player.flags.thornAnimalFreed = true; player.coins += 4; addXP(8); changeReputation("Elderwild Outpost", 1, "Freed an animal from a hunter's trap"); updateStatus(); return showScene("A Quiet Rescue", `You free the animal and it vanishes into the brush. The hunters give you 4 gold for helping, and the outpost will remember it. Chance: ${chance}%.`, [{ label: "Return to Thornwake", action: thornwakeWoods }, { label: "Return to the outpost", action: elderwildOutpost }]); }
  showScene("The Animal Bolts", `The animal escapes before you can reach the snare. You can try another route or return later. Chance: ${chance}%.`, [{ label: "Try another approach", action: thornwakeWoods }, { label: "Return to the map", action: frontierMap }]);
}
function emberglassQuarry() {
  if (!player.flags.thornwakeSeen) return showScene("A Faint Trail", "The quarry route is overgrown. The outpost scout recommends learning the local trails in Thornwake before heading farther into the frontier.", [{ label: "Follow the marks to Thornwake", action: thornwakeWoods }, { label: "Return to the map", action: frontierMap }]);
  player.currentTown = "Elderwild Outpost"; advanceTime(2); rememberDiscovery("quarrySeen", "Emberglass Quarry");
  showScene("Emberglass Quarry", "A glassy ravine glows red in the late light. Miners have left a cache near the lift, while a heavy shape moves beneath the slag piles.", [
    ...(!player.flags.quarryCache ? [{ label: "Collect the abandoned ore cache", action: () => { player.flags.quarryCache = true; addPackItem("Iron Scraps", "Useful for smithing and setting a trap.", { kind: "material", value: 3 }); addPackItem("Emberglass Shard", "A warm shard that may interest an Enchanter.", { kind: "material", value: 7 }); addXP(5); updateStatus(); showScene("Quarry Cache", "You recover Iron Scraps and an Emberglass Shard from the old lift station.", [{ label: "Return to the quarry", action: emberglassQuarry }, { label: "Return to the map", action: frontierMap }]); } }] : []),
    ...(!player.flags.cinderbackDefeated ? [{ label: "Challenge the Cinderback Brute", action: () => startCombat({ name: "Cinderback Brute", health: 30 + player.level * 4, attack: 8 + player.level, xp: 32, coins: 10, magic: true, resistances: ["physical"], weaknesses: ["frost", "arcane"], regionFlag: "cinderbackDefeated" }) }] : []),
    { label: "Help the miners stabilize the lift", action: helpQuarryMiners }, ...campChoice(emberglassQuarry), { label: "Return to the region map", action: frontierMap }
  ]);
}
function helpQuarryMiners() {
  if (player.flags.quarryHelped) return showScene("The Miners Remember", "The lift is steady now. The foreman says more work will come when new tunnels are opened.", [{ label: "Return to the quarry", action: emberglassQuarry }, { label: "Return to the map", action: frontierMap }]);
  player.flags.quarryHelped = true; const bonus = player.classKey === "warrior" || player.professions.includes("Blacksmith") ? 4 : 0; player.coins += 6 + bonus; addXP(10); if (player.professions.includes("Blacksmith")) addProfessionXP("Blacksmith", 5); updateStatus();
  showScene("The Lift Is Secure", `You help the miners brace the lift. They pay ${6 + bonus} gold and you gain 10 XP.`, [{ label: "Return to the quarry", action: emberglassQuarry }, { label: "Return to the outpost", action: elderwildOutpost }]);
}
function drownedArchive() {
  if (!player.flags.quarrySeen) return showScene("The Road Is Unclear", "The drowned archive lies beyond the quarry road. The scouts suggest visiting Emberglass and learning the safe crossing first.", [{ label: "Take the ore trail", action: emberglassQuarry }, { label: "Return to the map", action: frontierMap }]);
  player.currentTown = "Elderwild Outpost"; advanceTime(3); rememberDiscovery("archiveSeen", "Drowned Archive");
  showScene("The Drowned Archive", "An ancient library lies half below a still black pool. Sealed doors bear symbols from the old empire. You can study the seal, search the outer hall, or challenge its sentinel.", [
    ...(!player.flags.archiveDecoded ? [{ label: "Study the seal", action: () => decodeArchive("study") }, { label: "Search for a mechanical release", action: () => decodeArchive("mechanism") }, { label: "Use an old spell on the markings", action: () => decodeArchive("magic") }] : []),
    ...(!player.flags.archiveSentinelDefeated ? [{ label: "Challenge the Archive Sentinel", action: () => startCombat({ name: "Archive Sentinel", health: 34 + player.level * 4, attack: 8 + player.level, xp: 36, coins: 12, magic: true, resistances: ["physical"], weaknesses: ["sound", "light"], regionFlag: "archiveSentinelDefeated" }) }] : []),
    ...campChoice(drownedArchive), { label: "Return to the region map", action: frontierMap }
  ]);
}
function decodeArchive(method) {
  const bonus = method === "study" ? stat("intelligence") * 6 + (player.classKey === "mage" || player.professions.includes("Astronomer") ? 15 : 0) : method === "mechanism" ? stat("dexterity") * 6 + (player.classKey === "thief" ? 15 : 0) : stat("wisdom") * 6 + (player.classKey === "healer" ? 15 : 0);
  const chance = Math.min(95, 25 + bonus + luckBonus());
  if (Math.random() * 100 >= chance) return showScene("The Seal Resists", `Your ${method} approach does not work yet. You have learned part of the pattern, and can try another approach without losing anything. Chance: ${chance}%.`, [{ label: "Try another way", action: drownedArchive }, { label: "Return to the outpost", action: elderwildOutpost }]);
  player.flags.archiveDecoded = true; player.coins += 9; addPackItem("Imperial Memory Shard", "A record fragment from the vanished empire. Scholars may recognize the seal on it.", { kind: "lore", value: 9 }); addXP(18); player.clues.push("The old empire built a road beneath Starfall Basin."); updateStatus();
  showScene("The Archive Opens", `Your ${method} approach releases the seal. You find 9 gold, an Imperial Memory Shard, and a clue to a buried road. Chance: ${chance}%.`, [{ label: "Face the sentinel", action: () => startCombat({ name: "Archive Sentinel", health: 34 + player.level * 4, attack: 8 + player.level, xp: 36, coins: 12, magic: true, resistances: ["physical"], weaknesses: ["sound", "light"], regionFlag: "archiveSentinelDefeated" }) }, { label: "Leave the sentinel alone", action: frontierMap }]);
}
function starfallBasin() {
  if (!player.flags.archiveSeen) return showScene("A Ridge Not Yet Mapped", "The high ridge to Starfall is unstable. Scout reports point to the Drowned Archive as the next safe landmark.", [{ label: "Follow the old road to the archive", action: drownedArchive }, { label: "Return to the map", action: frontierMap }]);
  player.currentTown = "Elderwild Outpost"; advanceTime(3); rememberDiscovery("basinSeen", "Starfall Basin");
  showScene("Starfall Basin", "A bowl-shaped valley is scattered with black glass and luminous stones. The ground hums underfoot. There are star-metal fragments near the ridge and something immense asleep in the basin.", [
    ...(!player.flags.starMetalFound ? [{ label: "Gather star-metal fragments", action: () => { player.flags.starMetalFound = true; addPackItem("Star-metal", "Rare frontier material that smiths and enchanters prize.", { kind: "material", value: 12 }); addXP(8); updateStatus(); showScene("Star-metal Found", "You collect a few star-metal fragments. The stones are warm despite the cold air.", [{ label: "Return to the basin", action: starfallBasin }, { label: "Return to the outpost", action: elderwildOutpost }]); } }] : []),
    ...(!player.flags.basinColossusDefeated ? [{ label: "Wake the fallen colossus", action: () => startCombat({ name: "Starfall Colossus", health: 42 + player.level * 5, attack: 10 + player.level, xp: 48, coins: 18, magic: true, resistances: ["physical", "fire"], weaknesses: ["arcane", "nature"], regionFlag: "basinColossusDefeated" }) }] : []),
    ...(!player.flags.basinStudyDone ? [{ label: "Study the fallen stars", action: () => { player.flags.basinStudyDone = true; player.flags.veiledReachUnlocked = true; player.clues.push("The starfall was drawn toward a signal from beyond the northern sea."); addXP(8); showScene("A Far-Off Signal", "The star patterns map a coastline beyond the known frontier. A scout remembers an old salt road that may lead there. The larger realm is open to exploration; the notes suggest starting at Saltwind Shore.", [{ label: "Trace the route on a map", action: veiledReachMap }, { label: "Return to the surveyor", action: frontierSurvey }, { label: "Return to Starfall Basin", action: starfallBasin }]); } }] : []),
    ...campChoice(starfallBasin), { label: "Return to the region map", action: frontierMap }
  ]);
}
function veiledReachMap() {
  if (!player.flags.veiledReachUnlocked) return showScene("Uncharted Coast", "A route to the far coast has not been found. The Starfall signal may reveal one.", [{ label: "Return to Elderwild", action: elderwildOutpost }]);
  const choices = [{ label: "Cross into Saltwind Shore · wild coast", action: saltwindShore }];
  if (player.flags.saltwindSeen) choices.push({ label: "Follow the drowned road to Whisperfen · untamed marsh", action: whisperfen });
  if (player.flags.whisperfenSeen) choices.push({ label: "Descend into the Sunken Star Vault · optional dungeon", action: sunkenStarVault });
  if (player.flags.sunkenVaultSeen) choices.push({ label: "Reach Lantern Quay · the first settlement of this realm", action: lanternQuay });
  choices.push({ label: "Return to Elderwild Outpost", action: elderwildOutpost });
  showScene("The Veiled Reach · Regional Map", `Beyond the known lands lie a dangerous shore, a silent marsh, and an old vault. The route hints at Saltwind → Whisperfen → the Sunken Vault → Lantern Quay, but side discoveries are yours. Suggested next stop: ${nextRouteHint()}.`, choices);
}
function saltwindShore() {
  if (!player.flags.veiledReachUnlocked) return veiledReachMap();
  player.currentTown = "Saltwind Shore"; advanceTime(2); rememberDiscovery("saltwindSeen", "Saltwind Shore");
  showScene("Saltwind Shore", `The sea draws back across a field of black glass. No town stands on this coast; a distant bell is the only sign of people. ${player.world.weather === "Windy" ? "Wind carries a thin, three-note whistle from the cliffs." : "Tiny shells form a line toward the western rocks."}`, [
    { label: "Search the shell-line below the cliffs", action: saltwindSecret },
    { label: "Follow the road into Whisperfen", action: whisperfen },
    { label: "Study the old tide posts", action: readTidePosts },
    ...(!player.flags.saltwindThreatDefeated ? [{ label: "Drive off the shore stalker", action: () => startCombat({ name: "Saltglass Stalker", health: 26 + player.level * 3, attack: 7 + player.level, xp: 28, coins: 8, weaknesses: ["sound", "fire"], drops: [{ name: "Saltglass", chance: 48, value: 5, description: "A clear coastal shard used by craftsfolk." }], regionFlag: "saltwindThreatDefeated" }) }] : []),
    ...campChoice(saltwindShore), { label: "Open the Veiled Reach map", action: veiledReachMap }
  ]);
}
function readTidePosts() { player.flags.tidePostsRead = true; player.clues.push("At the lowest tide, three shells point beneath the western cliff."); showScene("The Tide Posts", "Weather-worn marks record the tide, but one line is newer: three shells point west when the water reaches its lowest mark. A hidden entrance may appear at dawn.", [{ label: "Wait for morning at camp", action: () => player.flags.trailTentOwned ? campInWilds(saltwindShore) : saltwindShore }, { label: "Return to shore", action: saltwindShore }]); }
function saltwindSecret() {
  if (player.flags.saltwindSecret) return showScene("Empty Shell Hollow", "The small hollow has been searched already. A tide mark inside it resembles the astronomer's old star chart.", [{ label: "Return to shore", action: saltwindShore }]);
  const chance = Math.min(88, 34 + stat("dexterity") * 5 + luckBonus() + (player.world.hour < 12 ? 12 : 0) + (player.flags.tidePostsRead ? 14 : 0));
  if (Math.random() * 100 < chance) { player.flags.saltwindSecret = true; player.coins += 9; addPackItem("Moon-Bone Charm", "A hidden charm from an older shoreline traveler; improves the sense for secret finds.", { kind: "trinket", value: 8, luck: 1 }); updateStatus(); addXP(10); return showScene("A Hollow Beneath the Tide", `Following the shell line at low tide, you find a moon-bone charm and 9 gold behind a loose stone. Chance: ${chance}%.`, [{ label: "Return to the shore", action: saltwindShore }, { label: "Follow the road into Whisperfen", action: whisperfen }]); }
  advanceTime(1); showScene("The Tide Shifts", `The water rises before you find the hollow. You find no cache this time; the line of shells will be clear again on another morning. Chance: ${chance}%.`, [{ label: "Return to shore", action: saltwindShore }]);
}
function whisperfen() {
  if (!player.flags.saltwindSeen) return showScene("The Marsh Road", "The drowned road disappears into mist. Scouts say to follow the coast first and watch for three shell marks.", [{ label: "Cross Saltwind Shore", action: saltwindShore }, { label: "Return to the realm map", action: veiledReachMap }]);
  player.currentTown = "Whisperfen"; advanceTime(2); rememberDiscovery("whisperfenSeen", "Whisperfen");
  const choices = [
    { label: "Find a safe way across the drowned causeway", action: crossFen },
    { label: "Search the reed-circle for a hidden marker", action: whisperfenSecret },
    { label: "Listen to the marsh and learn its patterns", action: studyFen },
    ...(!player.flags.fenWardenDefeated ? [{ label: "Challenge the Fen Warden", action: () => startCombat({ name: "Fen Warden", health: 38 + player.level * 4, attack: 9 + player.level, xp: 40, coins: 12, magic: true, weaknesses: ["fire", "sound"], drops: [{ name: "Marsh Rune", chance: 32, value: 0, description: "A water-dark rune; enchanters can use it as a Lesser Rune." }], regionFlag: "fenWardenDefeated" }) }] : []),
    ...campChoice(whisperfen), { label: "Return to the coast", action: saltwindShore }, ...(player.flags.fenCrossed ? [{ label: "Descend to the Sunken Star Vault", action: sunkenStarVault }] : [])
  ];
  showScene("Whisperfen", "Reeds rise taller than a person around the drowned road. A bell rings beneath the mud. There is no inn here; the ground is firm only on a few narrow ridges.", choices);
}
function crossFen() {
  const approaches = [
    { label: "Brace the old causeway with Strength", stat: stat("strength"), classBonus: player.classKey === "warrior" ? 14 : 0 },
    { label: "Pick a careful path with Dexterity", stat: stat("dexterity"), classBonus: player.classKey === "thief" ? 14 : 0 },
    { label: "Read the water with Wisdom", stat: stat("wisdom"), classBonus: ["healer", "beastmaster"].includes(player.classKey) ? 14 : 0 }
  ];
  const choices = approaches.map((approach) => ({
    label: approach.label,
    action: () => {
      const chance = Math.min(92, 35 + approach.stat * 7 + approach.classBonus + luckBonus());
      if (Math.random() * 100 < chance) {
        player.flags.fenCrossed = true; addXP(12);
        showScene("Across the Fen", `Your ${approach.label.includes("Strength") ? "strength" : approach.label.includes("Dexterity") ? "dexterity" : "wisdom"} finds a safe crossing. Chance: ${chance}%. The stone steps descend toward an old sealed vault.`, [{ label: "Follow the lower steps", action: sunkenStarVault }, { label: "Return to Whisperfen", action: whisperfen }]);
      } else {
        advanceTime(2); player.coins = Math.max(0, player.coins - 2); updateStatus();
        showScene("A Cold Detour", `The route sinks under you. You retreat, lose 2 gold to damaged supplies, and can try another approach. Chance: ${chance}%.`, [{ label: "Try another method", action: crossFen }, ...campChoice(whisperfen), { label: "Return", action: whisperfen }]);
      }
    }
  }));
  choices.push({ label: "Study the causeway first", action: studyFen }, { label: "Back to Whisperfen", action: whisperfen });
  showScene("The Drowned Causeway", "A flooded stone road splits around a deep sinkhole. The wrong step could cost supplies, but the raised stones reveal more than one safe crossing.", choices);
}
function studyFen() { player.flags.fenPatternKnown = true; player.clues.push("The Whisperfen stepping stones align with the stars visible after rain."); addProfessionXP("Astronomer", 5); const clue = player.professions.includes("Astronomer") ? `Your chart reveals hidden Luck ${player.hiddenStats.luck} and a ${player.world.weather === "Rain" ? "clear" : "better after rain"} reading of the stones.` : "You learn that the safest stones align after rain; an Astronomer might also see a pattern in the sky."; showScene("The Marsh's Rhythm", clue, [{ label: "Try the causeway", action: crossFen }, { label: "Return to Whisperfen", action: whisperfen }]); }
function whisperfenSecret() {
  if (player.flags.whisperfenSecret) return showScene("The Reed Circle", "The marker's shallow bowl is empty now. Its carving resembles a star with the center scratched away.", [{ label: "Return to Whisperfen", action: whisperfen }]);
  const chance = Math.min(90, 30 + stat("wisdom") * 5 + stat("intelligence") * 3 + (player.flags.fenPatternKnown ? 20 : 0) + luckBonus());
  if (Math.random() * 100 < chance) { player.flags.whisperfenSecret = true; player.flags.fenCrossed = true; addPackItem("Reedglass Lens", "A secret lens showing faint routes in old stonework.", { kind: "tool", value: 12 }); player.clues.push("The lens reveals a side entrance to the Sunken Star Vault."); addXP(14); updateStatus(); return showScene("The Hidden Reedglass", `The reeds part around an old lens and a side stair. It offers a second route into the vault, bypassing the flooded causeway. Chance: ${chance}%.`, [{ label: "Explore the vault", action: sunkenStarVault }, { label: "Return to the marsh", action: whisperfen }]); }
  advanceTime(1); showScene("A Reed-Wrapped Stone", `You find a carved stone but no hidden object. A line of tiny marks points deeper into the reeds. Chance: ${chance}%.`, [{ label: "Study the marsh first", action: studyFen }, { label: "Search again another day", action: whisperfen }]);
}
function sunkenStarVault() {
  if (!player.flags.whisperfenSeen) return showScene("Vault Beneath the Marsh", "The vault's upper door is buried beneath the fen. Find Whisperfen and learn its crossing before descending.", [{ label: "Explore Whisperfen", action: whisperfen }, { label: "Open map", action: veiledReachMap }]);
  player.currentTown = "Sunken Star Vault"; player.flags.fenCrossed = true; rememberDiscovery("sunkenVaultSeen", "Sunken Star Vault"); advanceTime(2);
  showScene("Sunken Star Vault", "A dry chamber survives beneath the flooded road. A sealed wheel bears three symbols: tide, root, and star. A silent guardian waits beyond it.", [
    ...(!player.flags.vaultSealSolved ? [{ label: "Solve the three-symbol seal", action: solveVaultSeal }, { label: "Force the wheel with Strength", action: () => forceVaultSeal("strength") }, { label: "Decode the runes with Intelligence", action: () => forceVaultSeal("intelligence") }] : []),
    ...(!player.flags.vaultGuardianDefeated ? [{ label: "Face the silent guardian", action: () => startCombat({ name: "Vault Astral Guardian", health: 48 + player.level * 5, attack: 10 + player.level, xp: 52, coins: 17, magic: true, resistances: ["physical"], weaknesses: ["arcane", "nature"], drops: [{ name: "Greater Rune", chance: 24, value: 0, description: "A pure rune suitable for advanced enchantment." }, { name: "Star-metal", chance: 35, value: 12, description: "A rare metal prized by smiths and enchanters." }], regionFlag: "vaultGuardianDefeated" }) }] : []),
    ...(!player.flags.vaultSecret ? [{ label: "Examine the empty plinth's underside", action: vaultSecret }] : []),
    { label: "Climb toward Lantern Quay", action: lanternQuay }, { label: "Return to Whisperfen", action: whisperfen }
  ]);
}
function solveVaultSeal() { const known = player.flags.fenPatternKnown || player.flags.tidePostsRead; const chance = Math.min(92, 25 + stat("intelligence") * 5 + stat("wisdom") * 3 + luckBonus() + (known ? 20 : 0)); if (Math.random() * 100 < chance) { player.flags.vaultSealSolved = true; player.coins += 12; addXP(16); updateStatus(); showScene("The Seal Opens", `You turn tide, root, and star into the right order. The wheel opens, revealing 12 gold and an old coast chart. Chance: ${chance}%.`, [{ label: "Explore the chamber", action: sunkenStarVault }, { label: "Continue to Lantern Quay", action: lanternQuay }]); } else { advanceTime(1); showScene("The Symbols Reorder", `The seal shifts but does not open. You notice that one mark resembles a tide post. Chance: ${chance}%.`, [{ label: "Study the tide clue", action: readTidePosts }, { label: "Try again", action: sunkenStarVault }]); } }
function forceVaultSeal(statName) { const chance = Math.min(82, 30 + stat(statName) * 6 + luckBonus()); if (Math.random() * 100 < chance) { player.flags.vaultSealSolved = true; player.conditions = player.conditions.filter((entry) => entry !== "Wounded"); addXP(12); showScene("The Wheel Gives Way", `Your ${statName} approach opens the seal. The mechanism is damaged but reveals the passage. Chance: ${chance}%.`, [{ label: "Enter the chamber", action: sunkenStarVault }, { label: "Climb to Lantern Quay", action: lanternQuay }]); } else { player.coins = Math.max(0, player.coins - 3); advanceTime(1); showScene("A Costly Attempt", `The mechanism bites back; you lose 3 gold in damaged tools. Chance: ${chance}%.`, [{ label: "Try another way", action: sunkenStarVault }, { label: "Retreat to Whisperfen", action: whisperfen }]); } }
function vaultSecret() { player.flags.vaultSecret = true; addPackItem("Star-etched Blueprint", "A hidden pattern for a light but durable weapon. Bring it to a Blacksmith.", { kind: "blueprint", value: 0 }); player.flags.smithRecipeLearned = true; addXP(10); showScene("The Underside of the Plinth", "A folded blueprint rests in a hollow beneath the stone: an edge of star-metal and a narrow grip designed for speed. Your Blacksmith can craft the Swift Starblade.", [{ label: "Search the vault", action: sunkenStarVault }, { label: "Travel to Lantern Quay", action: lanternQuay }]); }
function lanternQuay() {
  if (!player.flags.sunkenVaultSeen) return showScene("The Coast Settlement", "A lantern shines beyond the marsh, but the safe road has not been marked yet. The vault steps are the surest route through.", [{ label: "Explore the Sunken Star Vault", action: sunkenStarVault }, { label: "Return to map", action: veiledReachMap }]);
  player.currentTown = "Lantern Quay"; rememberDiscovery("lanternQuaySeen", "Lantern Quay"); player.flags.lanternQuayUnlocked = true;
  showScene("Lantern Quay", "A small stilt-town faces the storm sea. It is the only settlement for days of travel: a market, a repair shed, and a quiet room above the lighthouse. People here remember the strangers who helped or harmed them.", [
    { label: "Visit the quay market", action: market }, { label: "Rent a lighthouse room and fully recover (5 gold)", action: lighthouseRest },
    { label: "Ask the keeper about old sea routes", action: quayKeeper }, { label: "Search under the lantern stairs", action: lanternQuaySecret }, { label: "Hire the wardens' skiff to Elderwild (6 gold)", action: paySkiffToElderwild },
    { label: "Speak to the coast wardens", action: reachFactionHall }, { label: "Learn a profession or craft", action: professionMenu },
    { label: "Return to the Sunken Star Vault", action: sunkenStarVault }, { label: "Travel back through Whisperfen", action: whisperfen }
  ]);
}
function paySkiffToElderwild() { if (player.coins < 6) return showScene("The Wardens' Skiff", "The six-gold fare covers a safe crossing and the skiff's lantern oil.", [{ label: "Return to Lantern Quay", action: lanternQuay }]); player.coins -= 6; advanceTime(5); player.currentTown = "Elderwild Outpost"; updateStatus(); showScene("Across the Northern Sound", "You pay the wardens' skiff fare and make a safe crossing back to the Elderwild. The coast road will still be there when you return.", [{ label: "Return to Elderwild", action: elderwildOutpost }, { label: "Review your map", action: showMap }]); }
function lighthouseRest() { if (player.coins < 5) return showScene("The Lighthouse Room", "A dry room costs 5 gold. You can use a Trail Tent in the wilderness instead.", [{ label: "Return to Lantern Quay", action: lanternQuay }]); player.coins -= 5; advanceTime(8); player.health = player.maxHealth; player.mana = player.maxMana; player.conditions = player.conditions.filter((entry) => entry !== "Wounded"); updateStatus(); showScene("Rest at the Lighthouse", "The keeper lends you a room above the lantern. You recover fully and wake to a clear sea breeze.", [{ label: "Return to Lantern Quay", action: lanternQuay }]); }
function quayKeeper() { const known = player.memories.filter((memory) => /Quay|Lantern|Reach/.test(memory)); showScene("The Lighthouse Keeper", `The keeper remembers the names of travelers who helped the coast. ${known.length ? `They recall: ${known.join("; ")}.` : "They ask what sort of traveler you mean to be."} ‘The northern reefs hide a road at the lowest tide. Listen for a bell with no tower.’`, [{ label: "Promise to help the coast wardens", action: reachFactionHall }, { label: "Ask about the bell", action: lanternQuaySecret }, { label: "Return to town", action: lanternQuay }]); }
function lanternQuaySecret() { if (player.flags.lanternQuaySecret) return showScene("Below the Lantern Stairs", "The hidden compartment is empty; a tide-map is already in your journal.", [{ label: "Return to town", action: lanternQuay }]); const chance = Math.min(92, 30 + stat("dexterity") * 5 + stat("intelligence") * 3 + luckBonus() + (player.flags.tidePostsRead ? 12 : 0)); if (Math.random() * 100 < chance) { player.flags.lanternQuaySecret = true; player.coins += 15; addPackItem("Sea-King's Token", "A secret token accepted by the coast wardens; it can open future routes.", { kind: "key", value: 15 }); player.clues.push("The bell without a tower rings at the northern reef during the lowest tide."); changeReputation("Coast Wardens", 1, "Found the hidden token beneath the lighthouse"); updateStatus(); return showScene("A Hollow Behind the Stone", `You uncover a sea-king token and 15 gold. The keeper recognizes it and offers a future route beyond the reef. Chance: ${chance}%.`, [{ label: "Show the token to the wardens", action: reachFactionHall }, { label: "Return to town", action: lanternQuay }]); } advanceTime(1); showScene("A Cold Stone Stair", `You find a loose stone but no compartment. The tide notes may explain what you missed. Chance: ${chance}%.`, [{ label: "Ask the keeper about the tide", action: quayKeeper }, { label: "Try again tomorrow", action: lanternQuay }]); }
function reachFactionHall() { showScene("Coast Wardens", `The wardens watch the sea roads. They remember your standing: ${player.reputation["Coast Wardens"] || 0}. They offer pay for useful reports and give better work to people who keep their promises.`, [{ label: "Report the starfall signal", action: () => { if (!player.flags.coastSignalReported) { player.flags.coastSignalReported = true; player.coins += 12; addXP(10); changeReputation("Coast Wardens", 2, "Reported the Starfall signal to the Coast Wardens"); updateStatus(); } showScene("A Useful Report", "The wardens mark your name in their log and reward you for a reliable report. The northern reef remains unexplored.", [{ label: "Return to Lantern Quay", action: lanternQuay }]); } }, { label: "Return", action: lanternQuay }]); }
function startCombat(enemy) {
  const fairAttack = Math.max(2, enemy.attack - 1);
  player.enemy = { ...enemy, attack: fairAttack, maxHealth: enemy.health };
  player.combatGuard = 0; player.enemySlowed = false; player.enemyWeakened = false; player.enemyBurning = 0; player.focusBonus = 0; player.weaponCharge = 0; player.attackBuff = player.flags.roadSongReady ? 6 : 0; player.flags.roadSongReady = false; player.nextStrikeBonus = 0; player.enemyTrapUsed = false; player.parryReady = false; player.dodgeReady = false; player.protectCompanion = false;
  const speedFirst = stat("agility") >= 5 || player.classKey === "thief" || currentCombatStyle()?.passive === "quick";
  const intro = speedFirst ? `Your quick instincts give you the first move. ${enemy.name} has ${enemy.health} health.` : `${enemy.name} squares up. You have the first move; it has ${enemy.health} health.`;
  combatTurn(intro);
}
function combatTurn(text) {
  const enemy = player.enemy;
  const skills = CLASS_DATA[player.classKey].skills.filter((skill) => skill.level <= player.level);
  const choices = [
    { label: `Attack with ${player.weapon?.name || "your weapon"}`, action: basicAttack },
    ...skills.map((skill) => ({ label: `${skill.name} · Rank ${player.skillRanks[skill.name] || 1} (${skill.cost} mana)`, action: () => useSkill(skill.name) })),
    { label: `${currentCombatStyle()?.moveName || "Combat Style Move"}${combatStyleCost() ? ` (${combatStyleCost()} mana)` : ""}`, action: useCombatStyleMove },
    { label: `Use a ${CLASS_DATA[player.classKey].name} tactic`, action: classTactic },
    { label: `Drink a potion (${player.potions} available)`, action: usePotionCombat },
    ...(player.professions.includes("Cook") && player.meals > 0 ? [{ label: `Eat a packed meal (${player.meals} available)`, action: eatMeal }] : []),
    ...(player.professions.includes("Bard") ? [{ label: "Sing a disarming verse", action: bardCombat }] : []),
    ...(player.professions.includes("Blacksmith") ? [{ label: "Use a smith's parrying technique", action: smithCombat }] : []),
    ...(player.professions.includes("Alchemist") && player.potions > 0 ? [{ label: "Throw a flash flask (uses a potion)", action: alchemistCombat }] : []),
    ...(player.professions.includes("Enchanter") ? [{ label: "Charge your weapon with magic", action: chargeWeapon }] : []),
    ...(player.professions.includes("Astronomer") ? [{ label: "Read a combat omen", action: combatOmen }] : []),
    ...(player.professions.includes("Astronomer") ? [{ label: "Forecast this creature's drops", action: forecastDrops }] : []),
    { label: "Prepare a focused strike", action: prepareFocusedStrike },
    { label: "Parry and counter", action: parryTurn }, { label: "Attempt a dodge", action: dodgeTurn },
    ...(player.companion ? [{ label: `Protect ${player.companion.name}`, action: protectCompanion }] : []),
    ...(!player.enemyTrapUsed && (player.classKey === "thief" || player.classKey === "beastmaster" || player.inventory.some((item) => ["Iron Scraps", "Wild Berries"].includes(item.name))) ? [{ label: "Set a snare to slow the enemy", action: setCombatSnare }] : []),
    { label: "Study the enemy", action: inspectEnemy },
    { label: "Try to talk it down", action: parley },
    { label: "Use the surroundings", action: useSurroundings },
    { label: "Guard and recover a little mana", action: guardTurn },
    { label: "Try to flee", action: fleeCombat }
  ];
  showScene(`Combat · ${enemy.name}`, `${text}\n\n${enemy.name}: ${Math.max(0, enemy.health)} / ${enemy.maxHealth} health.\nYour health: ${player.health} / ${player.maxHealth} · Mana: ${player.mana} / ${player.maxMana}.`, choices);
}
function prepareFocusedStrike() {
  let bonus = 4 + Math.floor(stat("dexterity") / 2);
  if (player.classKey === "mage") bonus += Math.floor(stat("intelligence") / 2);
  if (player.classKey === "thief") bonus += 3;
  if (player.classKey === "beastmaster" && player.companion) bonus += Math.floor(player.companion.attack / 2);
  player.nextStrikeBonus = bonus;
  enemyTurn(`You study ${player.enemy.name}'s movement and prepare your next strike for +${bonus} damage.`);
}
function parryTurn() { player.parryReady = true; enemyTurn("You set your feet and wait for the next blow, ready to turn it aside."); }
function dodgeTurn() { player.dodgeReady = true; enemyTurn("You watch the foe's movement and prepare to roll clear."); }
function protectCompanion() { player.protectCompanion = true; player.combatGuard += 3; enemyTurn(`You move between ${player.companion.name} and the enemy, ready to take the next strike yourself.`); }
function setCombatSnare() {
  if (player.enemyTrapUsed) return combatTurn("You have already set a snare in this fight.");
  const material = player.inventory.find((item) => ["Iron Scraps", "Wild Berries"].includes(item.name));
  const freeSnare = player.classKey === "thief" || player.classKey === "beastmaster";
  if (!freeSnare && !material) return combatTurn("You need Iron Scraps or Wild Berries to set a snare.");
  if (material) consumeItem(material.name);
  player.enemyTrapUsed = true;
  const chance = Math.min(90, 45 + stat("dexterity") * 4 + stat("agility") * 2 + (freeSnare ? 10 : 0));
  if (Math.random() * 100 < chance) { player.enemySlowed = true; const damage = 4 + Math.floor(stat("dexterity") / 2); player.enemy.health -= damage; if (player.enemy.health <= 0) return victory(`Your snare catches the foe for ${damage} damage.`); return enemyTurn(`Your snare catches ${player.enemy.name} for ${damage} damage and disrupts its next move. Chance: ${chance}%.`); }
  enemyTurn(`The enemy avoids your snare. You used ${material ? material.name : "your prepared kit"}. Chance: ${chance}%.`);
}
function inspectEnemy() {
  const e = player.enemy;
  const clue = player.professions.includes("Astronomer") ? ` Weaknesses: ${(e.weaknesses || []).join(", ") || "unknown"}; resistances: ${(e.resistances || []).join(", ") || "none known"}.` : " Watch its movements for clues to its defenses.";
  combatTurn(`${e.name} has ${e.health} health and strikes for about ${e.attack} damage. ${e.magic ? "Its attacks carry a trace of magic." : "It relies on physical attacks."}${clue}`);
}
function classTactic() {
  let damage = 0, note = "";
  switch (player.classKey) {
    case "warrior": player.combatGuard = 7; damage = 4 + stat("strength"); note = "You brace behind your guard and answer with a counterblow."; break;
    case "mage": { const restored = Math.min(5, player.maxMana - player.mana); player.mana += restored; player.focusBonus = 6; note = `You focus on magic, recovering ${restored} mana and strengthening your next spell.`; break; }
    case "healer": { const healed = Math.min(6, player.maxHealth - player.health); player.health += healed; player.combatGuard = 4; note = `You raise a ward and restore ${healed} health.`; break; }
    case "thief": player.combatGuard = 5; damage = 3 + stat("dexterity") + Math.floor(stat("agility") / 2); note = "You feint, slip past the enemy's guard, and strike."; break;
    case "bard": player.attackBuff = 4; player.enemyWeakened = true; note = "You play a quick chorus that steadies you and unsettles your foe."; break;
    case "beastmaster":
      if (player.companion) { damage = player.companion.attack + stat("wisdom"); player.combatGuard = player.companion.guard; note = `You signal ${player.companion.name} to distract the foe while you strike.`; }
      else { player.combatGuard = 6; note = "You call on nearby wildlife to distract your foe."; }
      break;
  }
  if (damage) player.enemy.health -= damage;
  if (player.enemy.health <= 0) return victory(`${note} Your tactic deals ${damage} damage.`);
  enemyTurn(`${note}${damage ? ` It deals ${damage} damage.` : ""}`);
}
function useCombatStyleMove() {
  const style = currentCombatStyle();
  if (!style) return combatTurn("You need to choose a starting combat style before using this move.");
  const cost = combatStyleCost(style);
  if (player.mana < cost) return combatTurn(`You need ${cost} mana for ${style.moveName}. Pick another action or guard to recover mana.`);
  player.mana -= cost;
  const skillName = player.classKey === "beastmaster" ? "Wild Bond" : activeSkill().name;
  const rank = player.skillRanks[skillName] || 1, extra = rank - 1;
  let damage = 0, healing = 0, type = "physical", note = "";
  switch (style.move) {
    case "attack": damage = attackPower() + 5 + Math.floor(stat("strength") / 2) + extra * 2; note = "You drive forward with a heavy assault."; break;
    case "guard": player.combatGuard = 9 + extra * 2; player.enemyWeakened = true; note = "You lock into a shield wall, blunting the incoming strike."; break;
    case "riposte": damage = attackPower() + 4 + extra * 2; player.combatGuard = 5 + extra * 2; note = "You catch the foe's movement and answer with a guarded riposte."; break;
    case "spell": type = "fire"; damage = 9 + stat("intelligence") + player.level + extra * 2; note = "You shape raw elements into a focused surge."; break;
    case "weave": type = "arcane"; damage = 5 + stat("intelligence") + extra * 2; player.combatGuard = 4 + extra; note = "You weave an arcane pattern that strikes and shields you."; break;
    case "channel": { const restored = Math.min(7 + extra, player.maxMana - player.mana); player.mana += restored; player.focusBonus = 5 + extra * 2; player.combatGuard = 3; note = `You draw in energy, restoring ${restored} mana and empowering your next spell.`; break; }
    case "heal": type = "light"; healing = 10 + Math.floor(stat("wisdom") / 2) + extra * 2; damage = 3 + Math.floor(stat("intelligence") / 2); note = "You mend your wounds with a steady pulse of light."; break;
    case "ward": type = "light"; healing = 7 + extra * 2; player.combatGuard = 8 + extra * 2; player.enemyWeakened = true; note = "You raise a sanctuary ward that heals and guards you."; break;
    case "smite": type = "light"; damage = 11 + stat("intelligence") + extra * 2; note = "You focus a bright judgment into a clean strike."; break;
    case "ambush": damage = attackPower() + stat("agility") + 5 + extra * 2; note = "You slip to the enemy's blind side and ambush it."; break;
    case "disrupt": damage = attackPower() + stat("dexterity") + 3 + extra * 2; player.enemyWeakened = true; note = "A dirty trick breaks the enemy's rhythm."; break;
    case "smoke": damage = attackPower() + 2 + extra; player.combatGuard = 9 + extra * 2; note = "You strike through a veil of smoke and disappear from the counterattack."; break;
    case "pack": type = "nature"; damage = player.companion ? player.companion.attack * (2 + Math.floor(extra / 2)) + stat("wisdom") : 6 + stat("wisdom"); damage += extra * 2; note = player.companion ? `${player.companion.name} answers your Pack Order with a coordinated strike.` : "You call a nearby animal to harry the foe while you strike."; break;
    case "companionGuard": healing = player.companion ? 4 + extra : 3; player.combatGuard = 8 + (player.companion?.guard || 0) + extra * 2; player.enemyWeakened = true; note = player.companion ? `${player.companion.name} intercepts the enemy while you recover.` : "You whistle for nearby wildlife to distract the foe."; break;
    case "calm": type = "nature"; player.enemyWeakened = true; player.combatGuard = 4 + extra; healing = player.companion ? 6 + extra * 2 : 0; damage = player.companion ? Math.floor(player.companion.attack / 2) : 4 + stat("wisdom"); if (player.companion) player.companion.bond = Math.min(5, (player.companion.bond || 1) + 1); note = "You use a familiar call to steady your companion and calm the fight."; break;
    case "ballad": type = "sound"; healing = 10 + Math.floor(stat("wisdom") / 2) + extra * 2; player.attackBuff = 4 + extra * 2; note = "A warm ballad restores your strength and lifts your next attack."; break;
    case "chorus": type = "sound"; player.attackBuff = 7 + extra * 2; player.enemyWeakened = true; damage = 3 + Math.floor(stat("wisdom") / 2); note = "Your chorus rallies you and throws the enemy off beat."; break;
    case "disruptSong": type = "sound"; damage = 9 + stat("wisdom") + extra * 2; player.enemyWeakened = true; note = "A discordant break shatters the enemy's rhythm."; break;
  }
  if (damage && player.nextStrikeBonus) { damage += player.nextStrikeBonus; player.nextStrikeBonus = 0; }
  if (style.passive === "magic" && damage) damage += 2;
  if (style.passive === "healing" && healing) healing += 3;
  player.health = Math.min(player.maxHealth, player.health + healing);
  if (damage && ((player.enemy.weaknesses || []).includes(type) || (type !== "physical" && (player.enemy.weaknesses || []).includes("magic")))) { damage = Math.ceil(damage * 1.5); note += ` The foe is vulnerable to ${type}.`; }
  if (damage && (player.enemy.resistances || []).includes(type)) { damage = Math.max(1, Math.floor(damage * 0.6)); note += ` The foe resists ${type}.`; }
  player.enemy.health -= damage;
  if (player.enemy.health <= 0) return victory(`${note} ${style.moveName} deals ${damage} damage and restores ${healing} health.`);
  enemyTurn(`${note}${damage ? ` It deals ${damage} damage.` : ""}${healing ? ` You recover ${healing} health.` : ""}`);
}
function eatMeal() {
  if (!player.meals) return combatTurn("You have no packed meals left.");
  player.meals--; player.mealTypes ||= []; const meal = player.mealTypes.shift() || "hearty"; let healed = 0, mana = 0, note = "";
  if (meal === "trail") { player.attackBuff += 6 + professionMastery("Cook"); note = "The trail spice sharpens your next strike."; }
  else if (meal === "focus") { mana = Math.min(8 + professionMastery("Cook") * 2, player.maxMana - player.mana); player.mana += mana; note = `The focus broth restores ${mana} mana.`; }
  else { healed = Math.min(12 + professionMastery("Cook") * 2, player.maxHealth - player.health); mana = Math.min(3 + professionMastery("Cook"), player.maxMana - player.mana); player.health += healed; player.mana += mana; note = `The hearty stew restores ${healed} health and ${mana} mana.`; }
  addProfessionXP("Cook", 1); updateStatus(); enemyTurn(`You eat a ${meal} meal. ${note}`);
}
function bardCombat() { player.enemyWeakened = true; enemyTurn("You sing a sharp, disarming verse. The enemy hesitates, and its next attack will be weaker."); }
function smithCombat() {
  const damage = player.weapon ? 4 + stat("strength") : 2;
  player.enemy.health -= damage; player.combatGuard = 6;
  if (player.enemy.health <= 0) return victory(`You turn a smith's parry into a counterattack for ${damage} damage.`);
  enemyTurn(`You catch the blow on your weapon and counter for ${damage} damage.`);
}
function alchemistCombat() {
  if (!player.potions) return combatTurn("You have no flask ready.");
  player.potions--; const damage = 6 + Math.floor(stat("intelligence") / 2); player.enemy.health -= damage; player.enemySlowed = true;
  if (player.enemy.health <= 0) return victory(`Your flash flask bursts for ${damage} damage.`);
  enemyTurn(`The flash flask bursts for ${damage} damage and leaves the foe reeling.`);
}
function chargeWeapon() {
  if (!player.weapon) return combatTurn("You need an equipped weapon to charge. Buy one from a market before your next fight.");
  player.weaponCharge = 7; enemyTurn("You trace an enchantment across your weapon. Its next strike will carry extra force.");
}
function combatOmen() {
  const e = player.enemy;
  combatTurn(`The stars suggest ${e.name} is about to ${e.magic ? "gather a spell" : "lunge forward"}. Its attack is near ${e.attack} damage. You spot no guaranteed outcome, but can prepare.`);
}
function forecastDrops() {
  const table = [...(DROP_TABLES[player.enemy.name] || []), ...(player.enemy.drops || [])];
  if (!player.enemy.forecastRead) { player.enemy.forecastRead = true; addProfessionXP("Astronomer", 4); updateStatus(); }
  const details = table.length ? table.map((drop) => `${drop.name}: ${drop.chance}% base chance; about ${Math.max(1, Math.min(95, drop.chance + (player.hiddenStats.luck + professionMastery("Astronomer") - 5) * 2))}% with your Luck`).join("\n") : "No known drop record for this creature yet.";
  combatTurn(`The Astronomer's chart predicts these possible drops:\n${details}`);
}
function forecastKnownDrops() {
  if (!player.professions.includes("Astronomer")) return showScene("A Sealed Rune Ledger", "Only a trained Astronomer can read exact recorded drop chances. You can still discover runes by defeating creatures and checking what they leave behind.", [{ label: "Return to Silverbrook", action: silverbrook }, { label: "Return to profession skills", action: professionMenu }]);
  const targets = ["Bridge Goblin", "Cave Guardian", "Cinderback Brute", "Archive Sentinel", "Starfall Colossus", "Saltglass Stalker", "Fen Warden", "Vault Astral Guardian"];
  const inlineDrops = { "Saltglass Stalker": [{ name: "Saltglass", chance: 48 }, { name: "Lesser Rune", chance: 8 }], "Fen Warden": [{ name: "Marsh Rune", chance: 32 }], "Vault Astral Guardian": [{ name: "Greater Rune", chance: 24 }, { name: "Star-metal", chance: 35 }] };
  const lines = targets.map((name) => { const table = [...(DROP_TABLES[name] || []), ...(inlineDrops[name] || [])]; return `${name}: ${table.map((drop) => `${drop.name} ${drop.chance}%`).join(", ") || "no recorded drop"}`; });
  showScene("Astronomer's Rune Ledger", `These are base chances; Luck shifts actual drops slightly. The guild has recorded:\n${lines.join("\n")}`, [{ label: "Return to Silverbrook", action: silverbrook }, { label: "Profession skills", action: professionMenu }]);
}
function parley() {
  const classBonus = player.professions.includes("Bard") ? 20 : player.classKey === "healer" || player.classKey === "beastmaster" ? 10 : 0;
  const styleBonus = currentCombatStyle()?.passive === "social" ? 10 : 0;
  const chance = Math.min(85, 20 + stat("wisdom") * 5 + luckBonus() + classBonus + styleBonus);
  if (Math.random() * 100 < chance) return victory(`You lower your weapon and speak calmly. ${player.enemy.name} agrees to stand down. Your chance was ${chance}%.`);
  enemyTurn(`You try to reason with ${player.enemy.name}, but it is not ready to listen. Your chance was ${chance}%.`);
}
function useSurroundings() {
  const terrain = player.enemy.name.includes("Saltglass") ? "shore" : player.enemy.name.includes("Fen") ? "marsh" : player.enemy.name.includes("Vault") || player.enemy.name.includes("Guardian") ? "ruins" : "wilds";
  const terrainText = terrain === "shore" ? "kick up glassy sand to blind the stalker" : terrain === "marsh" ? "pull the marsh roots across its path" : terrain === "ruins" ? "use a stone pillar to break its line of attack" : "use nearby trees, rocks, and uneven ground";
  const terrainBonus = terrain === "shore" && player.world.weather === "Windy" || terrain === "marsh" && player.world.weather === "Rain" ? 16 : 0;
  const chance = Math.min(90, 35 + stat("agility") * 5 + luckBonus() + terrainBonus);
  if (Math.random() * 100 < chance) {
    const damage = 5 + Math.floor(Math.random() * 5) + (terrainBonus ? 3 : 0); player.enemy.health -= damage; player.combatGuard = 2; if (terrain === "marsh") player.enemySlowed = true;
    if (player.enemy.health <= 0) return victory(`You use the surroundings to create an opening, dealing ${damage} damage.`);
    enemyTurn(`You ${terrainText}, dealing ${damage} damage${terrain === "marsh" ? " and slowing it" : ""}. Chance: ${chance}%.`);
  } else enemyTurn(`You try to ${terrainText}, but the enemy keeps its footing. Your chance was ${chance}%.`);
}
function basicAttack() {
  const enemy = player.enemy;
  let damage = attackPower() + Math.floor(Math.random() * 4) + player.weaponCharge + player.attackBuff + player.nextStrikeBonus;
  const element = player.weapon?.element;
  if (player.weaponCharge) player.weaponCharge = 0;
  if (player.attackBuff) player.attackBuff = 0;
  player.nextStrikeBonus = 0;
  if (player.classKey === "thief") damage += Math.floor(stat("agility") / 2);
  if (player.companion) damage += player.companion.attack;
  if (currentCombatStyle()?.passive === "precision") damage += 2;
  if (currentCombatStyle()?.passive === "companion" && player.companion) damage += Math.ceil(player.companion.attack / 2);
  if (element) { damage += player.weapon.magic || 0; if ((enemy.weaknesses || []).includes(element)) damage = Math.ceil(damage * 1.5); if ((enemy.resistances || []).includes(element)) damage = Math.max(1, Math.floor(damage * 0.6)); }
  enemy.health -= damage;
  if (enemy.health <= 0) return victory(`You land a ${damage}-damage ${element || "physical"} strike${player.companion ? `, and ${player.companion.name} joins in` : ""}.`);
  enemyTurn(`Your ${element || "physical"} attack deals ${damage} damage.`);
}
function useSkill(skillName = null) {
  const skill = CLASS_DATA[player.classKey].skills.find((entry) => entry.name === skillName) || activeSkill(), enemy = player.enemy;
  if (player.mana < skill.cost) return combatTurn(`You do not have enough mana for ${skill.name}. Choose another action.`);
  player.mana -= skill.cost;
  let damage = 0, healing = 0, narrative = "", damageType = "physical";
  const intBonus = Math.floor(stat("intelligence") / 2) + (player.weapon?.magic || 0);
  switch (player.classKey) {
    case "warrior":
      damage = attackPower() + 7 + Math.floor(Math.random() * 4);
      if (skill.name === "Shield Bash") { player.combatGuard = 5; narrative = "You slam your shield into the foe, staggering it and bracing for its counterattack."; }
      else if (skill.name === "Whirlwind") narrative = "You spin through a powerful sweeping attack.";
      else if (skill.name === "Last Stand") { damage += Math.max(0, Math.floor((player.maxHealth - player.health) / 3)); narrative = "With your strength tested, you deliver a Last Stand strike."; }
      else narrative = "You drive forward with a crushing Power Strike.";
      break;
    case "mage":
      damageType = skill.name === "Frostbind" ? "frost" : skill.name === "Arcane Burst" ? "arcane" : "fire";
      damage = 8 + intBonus + player.level + Math.floor(Math.random() * 5);
      if (skill.name === "Frostbind") { damage += 3; player.enemySlowed = true; narrative = "Frostbind wraps the foe in ice and slows its next attack."; }
      else if (skill.name === "Arcane Burst") { damage += 9; narrative = "Arcane energy erupts in a brilliant burst."; }
      else if (skill.name === "Meteor") { damage += 16; narrative = "A blazing meteor crashes down around your foe."; }
      else narrative = "A Firebolt streaks from your hand.";
      break;
    case "healer":
      damageType = "light";
      healing = skill.name === "Mending Light" ? 7 : skill.name === "Renewal" ? 13 : skill.name === "Sanctuary" ? 10 : 18;
      player.health = Math.min(player.maxHealth, player.health + healing);
      if (skill.name === "Sanctuary") player.combatGuard = 6;
      damage = 4 + intBonus + Math.floor(Math.random() * 3);
      narrative = `${skill.name} restores your strength and sends a pulse of light at the enemy.`;
      if (skill.name === "Resurrection") { damage += 10; narrative = "Resurrection floods you with life and searing light."; }
      break;
    case "thief":
      damage = attackPower() + 5 + stat("dexterity") + Math.floor(Math.random() * 5);
      if (skill.name === "Smoke Bomb") { player.combatGuard = 6; narrative = "You burst a smoke bomb, slash from the haze, and disappear from the counterattack."; }
      else if (skill.name === "Ambush") { damage += 8; narrative = "You find an opening and strike with a sudden Ambush."; }
      else if (skill.name === "Shadow Dance") { damage += 12; narrative = "You weave through a rapid Shadow Dance of blades."; }
      else narrative = "Quick Slash finds a gap in the enemy's defense.";
      break;
    case "bard":
      damageType = "sound";
      if (skill.name === "Song of Courage") { player.attackBuff = 5; player.enemyWeakened = true; narrative = "You sing a bold refrain. Courage rises in your heart and the foe falters."; }
      else if (skill.name === "Discordant Note") { damage = 6 + intBonus + player.level; player.enemyWeakened = true; narrative = "A discordant note rattles the foe and weakens its next attack."; }
      else if (skill.name === "Ballad of Mending") { healing = 12; player.health = Math.min(player.maxHealth, player.health + healing); narrative = "Your gentle ballad mends your wounds."; }
      else { healing = 16; player.health = Math.min(player.maxHealth, player.health + healing); player.attackBuff = 8; player.enemyWeakened = true; narrative = "Your Hero's Anthem restores your spirit and steels you for the next strike."; }
      break;
    case "beastmaster":
      damageType = "nature";
      damage = 5 + stat("wisdom") + player.level;
      if (player.companion) damage += player.companion.attack * (skill.name === "Call of the Wild" ? 3 : skill.name === "Pack Tactics" ? 2 : 1);
      if (skill.name === "Nature's Guard") player.combatGuard = 5;
      if (skill.name === "Call of the Wild") damage += 12;
      narrative = player.companion ? `${skill.name}: you signal ${player.companion.name}, and you attack together.` : `${skill.name}: you call on the wild to strike your foe.`;
  }
  const skillRank = player.skillRanks[skill.name] || 1;
  const skillScale = 1 + (skillRank - 1) * 0.15;
  damage = Math.floor(damage * skillScale) + player.nextStrikeBonus;
  player.nextStrikeBonus = 0;
  const rankBonus = skillRank - 1;
  if (player.combatGuard > 0) player.combatGuard += rankBonus * 2;
  if (player.attackBuff > 0) player.attackBuff += rankBonus * 2;
  const upgradedHealing = Math.floor(healing * skillScale);
  if (upgradedHealing > healing) player.health = Math.min(player.maxHealth, player.health + upgradedHealing - healing);
  healing = upgradedHealing;
  if (player.companion && player.classKey !== "beastmaster") damage += Math.ceil(player.companion.attack / 2);
  if (player.classKey === "beastmaster" && currentCombatStyle()?.passive === "companion" && player.companion) damage += Math.ceil(player.companion.attack / 2);
  if (player.classKey === "mage" && player.focusBonus) { damage += player.focusBonus; narrative += " Your focused magic adds power to the spell."; player.focusBonus = 0; }
  if (currentCombatStyle()?.passive === "magic" && damage) damage += 2;
  if (currentCombatStyle()?.passive === "healing" && healing) { const bonus = Math.min(3, player.maxHealth - player.health); player.health += bonus; healing += bonus; }
  if ((enemy.weaknesses || []).includes(damageType) || (damageType !== "physical" && (enemy.weaknesses || []).includes("magic"))) { damage = Math.ceil(damage * 1.5); narrative += ` The foe is vulnerable to ${damageType}.`; }
  if ((enemy.resistances || []).includes(damageType)) { damage = Math.max(1, Math.floor(damage * 0.6)); narrative += ` The foe resists ${damageType}.`; }
  if (damageType === "fire" && !enemy.resistances?.includes("fire")) player.enemyBurning = 2;
  enemy.health -= damage;
  if (enemy.health <= 0) return victory(`${narrative} The skill deals ${damage} damage.`);
  enemyTurn(`${narrative} It deals ${damage} damage${healing ? ` and restores ${healing} health` : ""}.`);
}
function enemyTurn(lastAction) {
  const enemy = player.enemy;
  if (enemy.health <= 0) return victory(lastAction);
  let ongoing = "";
  if (player.enemyBurning > 0) { enemy.health -= 2; player.enemyBurning--; ongoing = " Flames continue to burn the foe for 2 damage."; if (enemy.health <= 0) return victory(`${lastAction}${ongoing}`); }
  if (enemy.storyKey === "cave" && !enemy.bossPhase && enemy.health <= enemy.maxHealth / 2) { enemy.bossPhase = true; enemy.attack += 3; ongoing += " The Cave Guardian enters a second phase, glowing with ancient magic."; }
  const regen = Math.max(1, Math.floor(stat("intelligence") / 3)) + (currentCombatStyle()?.passive === "mana" ? 1 : 0);
  player.mana = Math.min(player.maxMana, player.mana + regen);
  if (player.enemySlowed) { player.enemySlowed = false; updateStatus(); return combatTurn(`${lastAction}\nThe foe is slowed by frost and loses its turn. You recover ${regen} mana.`); }
  if (enemy.magic) player.mana = Math.max(0, player.mana - 1);
  const companionGuard = player.companion?.guard || 0;
  const weakened = player.enemyWeakened ? 3 : 0;
  let damage = Math.max(1, enemy.attack - weakened - defensePower() - player.combatGuard - Math.min(2, companionGuard));
  let defenseText = "";
  if (player.parryReady) { damage = Math.max(0, damage - 5); enemy.health -= 3 + Math.floor(stat("strength") / 2); defenseText += " Your parry turns some force aside and lands a counter."; player.parryReady = false; if (enemy.health <= 0) return victory(`${lastAction}${defenseText}`); }
  if (player.dodgeReady) { const chance = Math.min(85, 35 + stat("agility") * 6 + luckBonus()); if (Math.random() * 100 < chance) { damage = 0; defenseText += ` You evade the attack (${chance}% chance).`; } else { damage = Math.ceil(damage / 2); defenseText += ` Your dodge is late, but softens the hit (${chance}% chance).`; } player.dodgeReady = false; }
  if (player.protectCompanion && player.companion) { damage = Math.max(0, damage - 6); player.companion.bond = Math.min(5, (player.companion.bond || 1) + 1); defenseText += ` You keep ${player.companion.name} safe and your bond grows.`; player.protectCompanion = false; }
  player.enemyWeakened = false;
  player.combatGuard = 0;
  player.health -= damage;
  if (player.health <= 0) {
    player.scars++; if (!player.conditions.includes("Wounded")) player.conditions.push("Wounded"); player.coins = Math.max(0, player.coins - 2);
    player.health = Math.max(1, Math.floor(player.maxHealth / 2)); player.enemy = null; updateStatus();
    return showScene("You Wake at the Healer's", "The fight went badly, but your story continues. The village healer patches you up. You lose 2 gold and gain a Wounded condition; your attacks are weaker until a Healer treats it.", [
      { label: "Visit the clinic", action: healerClinic }, { label: "Rest and continue", action: rest }, { label: "Review the journal", action: showJournal }
    ]);
  }
  updateStatus();
  combatTurn(`${lastAction}${ongoing}${defenseText}\n${enemy.name} attacks for ${damage} damage${companionGuard ? `; your companion's watchfulness helps defend you` : ""}. You recover ${regen} mana.`);
}
function usePotionCombat() {
  if (!player.potions) return combatTurn("Your potion pouch is empty. Choose another action.");
  player.potions--; const healed = Math.min(12 + professionMastery("Alchemist") * 2, player.maxHealth - player.health); player.health += healed;
  enemyTurn(`You drink a potion and recover ${healed} health.`);
}
function guardTurn() {
  player.combatGuard = 5;
  const restored = Math.min(3, player.maxMana - player.mana); player.mana += restored;
  enemyTurn(`You brace for impact and restore ${restored} mana.`);
}
function fleeCombat() {
  const chance = Math.min(90, 35 + stat("agility") * 6);
  if (Math.random() * 100 < chance) { player.enemy = null; showScene("You Escape", `You slip away safely. Your Agility gave you a ${chance}% chance to flee.`, [{ label: "Return to the forest", action: forest }, { label: "Return to the village", action: village }]); }
  else enemyTurn("You try to flee, but the foe blocks your path.");
}
function victory(text) {
  const enemy = player.enemy;
  if (enemy.storyKey === "bridge") player.flags.bridgeResolved = true;
  if (enemy.storyKey === "cave") player.flags.caveResolved = true;
  if (enemy.regionFlag) player.flags[enemy.regionFlag] = true;
  player.coins += enemy.coins || 0; const leveled = addXP(enemy.xp || 0);
  const dropTable = [...(DROP_TABLES[enemy.name] || []), ...(enemy.drops || [])];
  const drops = dropTable.filter((drop) => Math.random() * 100 < Math.max(1, Math.min(95, drop.chance + (player.hiddenStats.luck + professionMastery("Astronomer") - 5) * 2)));
  drops.forEach((drop) => addPackItem(drop.name, drop.description, { kind: "material", value: drop.value, hot: false }));
  player.enemy = null;
  updateStatus();
  const dropText = drops.length ? ` Items found: ${drops.map((drop) => drop.name).join(", ")}.` : " No extra item dropped this time.";
  showScene("Victory", `${text}\n\nYou gain ${enemy.xp || 0} XP and find ${enemy.coins || 0} coins.${dropText}${leveled ? ` You reached level ${player.level} and earned 2 stat points.` : ""}`, [
    ...(player.statPoints ? [{ label: `Spend ${player.statPoints} stat points`, action: statsMenu }] : []),
    ...(enemy.storyKey === "bridge" ? [{ label: "Follow the King's Road to Silverbrook", action: journey }] : []),
    ...(enemy.storyKey === "cave" ? [{ label: "Continue along the cliff trail", action: highlandPass }] : []),
    ...(enemy.regionFlag ? [{ label: "Return to the Elderwild Outpost", action: elderwildOutpost }] : []),
    { label: "Continue exploring", action: forest }, { label: "Return to the village", action: village }
  ]);
}
function gainLevel() {
  let leveled = false;
  while (player.xp >= xpNeeded()) {
    player.xp -= xpNeeded(); player.level++; player.statPoints += 2; player.maxHealth += 3 + Math.floor(stat("vitality") / 3);
    player.maxMana += 2 + Math.floor(stat("wisdom") / 4); player.health = player.maxHealth; player.mana = player.maxMana; leveled = true;
  }
  return leveled;
}
function classXPNeeded() { return 35 + (player.classLevel || 1) * 25; }
function gainClassXP(amount) {
  player.classXP = (player.classXP || 0) + amount;
  while (player.classXP >= classXPNeeded()) { player.classXP -= classXPNeeded(); player.classLevel++; player.classPoints = (player.classPoints || 0) + 1; }
}
// Wrap XP awards so every activity can trigger level-ups consistently.
const originalUpdateStatus = updateStatus;
const oldVictory = victory;
function addXP(amount) { player.xp += amount; gainClassXP(amount); const leveled = gainLevel(); updateStatus(); return leveled; }
// A short status note communicates newly learned 5-level skills after XP gains.
function completeAdventure() {
  showScene("Everbound Realms", "Your journey is still open. Follow the suggested route, revisit old places, build your professions, or search for paths the maps have not recorded.", [
    { label: "Continue exploring", action: forest }, { label: "Visit the village", action: village }
  ]);
}
updateStatus();
chooseClass();


