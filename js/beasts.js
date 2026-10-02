// Animals that may be met in the woods. Any hero can meet them; only a Beastmaster can tame them.
window.BEAST_DATA = {
  wolf: { name: "Forest Wolf", level: 2, taming: 9, attack: 5, guard: 2, personality: "loyal and watchful", story: "It once led a lost cub back to its den." },
  fox: { name: "Red Fox", level: 1, taming: 7, attack: 3, guard: 1, personality: "curious and quick", story: "It has hidden shiny things along its favorite trail." },
  bear: { name: "Young Bear", level: 4, taming: 13, attack: 8, guard: 3, personality: "shy but strong", story: "It was separated from its mother during a storm." },
  hawk: { name: "Hawk", level: 3, taming: 10, attack: 6, guard: 1, personality: "proud and keen-eyed", story: "It circles the hills looking for a familiar nesting ledge." }
};

// Astronomers can inspect these base drop rates. Luck shifts the actual roll slightly.
window.DROP_TABLES = {
  "Bridge Goblin": [
    { name: "Crimson Apple", chance: 45, value: 2, description: "A sweet apple from the goblin's basket. Useful as a gift or snack." },
    { name: "Iron Scraps", chance: 35, value: 3, description: "A few pieces of scrap iron that a blacksmith can use." },
    { name: "Lucky Button", chance: 12, value: 8, description: "A brass button the goblin insists is lucky." },
    { name: "Lesser Rune", chance: 8, value: 0, description: "A cracked rune fragment used for basic enchantments." }
  ],
  "Cave Guardian": [
    { name: "Cave Crystal", chance: 40, value: 7, description: "A blue crystal that hums faintly with magic." },
    { name: "Stone Scale", chance: 55, value: 4, description: "A resilient scale that could be used for armor." },
    { name: "Star Shard", chance: 10, value: 15, description: "A rare fragment of a fallen star." },
    { name: "Lesser Rune", chance: 14, value: 0, description: "A cracked rune fragment used for basic enchantments." }
  ],
  "Thornback Boar": [
    { name: "Thornhide", chance: 45, value: 5, description: "A tough hide lined with thorn-like bristles." },
    { name: "Wild Berries", chance: 30, value: 2, description: "A handful of tart berries, useful for food or traps." }
  ],
  "Cinderback Brute": [
    { name: "Emberglass Shard", chance: 50, value: 8, description: "A warm shard of volcanic glass, prized by Enchanters." },
    { name: "Iron Ore", chance: 38, value: 6, description: "Dense frontier ore ready for a smith's forge." },
    { name: "Lesser Rune", chance: 24, value: 0, description: "A cracked rune fragment used for basic enchantments." }
  ],
  "Archive Sentinel": [
    { name: "Imperial Memory Shard", chance: 48, value: 9, description: "A preserved fragment of the vanished empire's records." },
    { name: "Drowned Seal", chance: 24, value: 14, description: "A waterlogged token stamped with an unknown royal crest." },
    { name: "Greater Rune", chance: 10, value: 0, description: "A rare rune capable of a powerful weapon enchantment." }
  ],
  "Starfall Colossus": [
    { name: "Star-metal", chance: 55, value: 12, description: "A rare metal drawn from the sky, valued by smiths and enchanters." },
    { name: "Fallen Star Core", chance: 15, value: 25, description: "A pulsing core that still holds the echo of a distant signal." },
    { name: "Greater Rune", chance: 18, value: 0, description: "A rare rune capable of a powerful weapon enchantment." }
  ]
};
