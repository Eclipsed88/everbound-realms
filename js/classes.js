// Class data, best stats, and skills learned as the hero levels up.
window.CLASS_DATA = {
  warrior: { name: "Warrior", health: 34, mana: 8, best: ["Strength", "Vitality"],
    skills: [
      { level: 1, name: "Power Strike", cost: 0, description: "A forceful weapon attack." },
      { level: 5, name: "Shield Bash", cost: 2, description: "Damage an enemy and stagger its next attack." },
      { level: 10, name: "Whirlwind", cost: 3, description: "A sweeping strike that hits hard." },
      { level: 15, name: "Last Stand", cost: 4, description: "A mighty strike that grows stronger when you are hurt." }
    ] },
  mage: { name: "Mage", health: 23, mana: 24, best: ["Intelligence", "Wisdom"],
    skills: [
      { level: 1, name: "Firebolt", cost: 3, description: "Launch a bolt of fire." },
      { level: 5, name: "Frostbind", cost: 4, description: "Damage and slow the enemy." },
      { level: 10, name: "Arcane Burst", cost: 6, description: "A powerful blast of magic." },
      { level: 15, name: "Meteor", cost: 9, description: "Call down devastating fire from above." }
    ] },
  healer: { name: "Healer", health: 28, mana: 20, best: ["Wisdom", "Vitality"],
    skills: [
      { level: 1, name: "Mending Light", cost: 3, description: "Restore your health or wound an enemy." },
      { level: 5, name: "Renewal", cost: 4, description: "Restore more health." },
      { level: 10, name: "Sanctuary", cost: 6, description: "Heal and guard yourself." },
      { level: 15, name: "Resurrection", cost: 8, description: "A powerful restoration that can turn a battle." }
    ] },
  thief: { name: "Thief", health: 26, mana: 10, best: ["Dexterity", "Agility"],
    skills: [
      { level: 1, name: "Quick Slash", cost: 0, description: "A fast, accurate attack." },
      { level: 5, name: "Smoke Bomb", cost: 2, description: "Strike and avoid the next hit." },
      { level: 10, name: "Ambush", cost: 3, description: "A devastating first strike." },
      { level: 15, name: "Shadow Dance", cost: 5, description: "A rapid series of attacks." }
    ] },
  beastmaster: { name: "Beastmaster", health: 29, mana: 16, best: ["Wisdom", "Agility"],
    skills: [
      { level: 1, name: "Wild Bond", cost: 2, description: "Call your companion to attack or calm a wild animal." },
      { level: 5, name: "Pack Tactics", cost: 3, description: "You and your companion attack together." },
      { level: 10, name: "Nature's Guard", cost: 4, description: "Your companion helps protect you." },
      { level: 15, name: "Call of the Wild", cost: 6, description: "Unleash the full strength of your bond." }
    ] },
  bard: { name: "Bard", health: 27, mana: 20, best: ["Wisdom", "Dexterity"],
    skills: [
      { level: 1, name: "Song of Courage", cost: 2, description: "Inspire yourself and allies, strengthening your next attacks." },
      { level: 5, name: "Discordant Note", cost: 3, description: "Disrupt an enemy and weaken its next attack." },
      { level: 10, name: "Ballad of Mending", cost: 5, description: "Restore health with a gentle song." },
      { level: 15, name: "Hero's Anthem", cost: 7, description: "A stirring song that empowers and heals your party." }
    ] }
};
