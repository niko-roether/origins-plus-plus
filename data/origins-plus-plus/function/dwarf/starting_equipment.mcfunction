give @s minecraft:golden_pickaxe[enchantments={fortune:1,unbreaking:1}]
execute unless items entity @s armor.head * run item replace entity @s armor.head keep minecraft:golden_helmet[enchantments={unbreaking:1}]
execute if items entity @s armor.head * run give @s minecraft:golden_helmet[enchantments={unbreaking:1}]
