clear @s minecraft:dragon_breath 1
give @s minecraft:potion[custom_data={superempty:1b,display:{Name:'[{"translate":"origins-plus-plus.item.super_mana_potion","italic":false,"color":"dark_purple"}]',Lore:['[{"translate":"origins-plus-plus.item.super_mana_potion.capacity","italic":false}]']}}] 1
$$(resource) change @s origins-plus-plus:end-mage/resource -250
particle minecraft:enchant ~ ~ ~ 2 2 2 2 1000
particle minecraft:enchanted_hit ~ ~ ~ 3 3 3 3 1000
playsound minecraft:block.brewing_stand.brew player @a[distance=..10] ~ ~ ~ 100 0.9 1
