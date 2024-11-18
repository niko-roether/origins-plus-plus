forceload add ~ ~
summon minecraft:marker ~ ~ ~ {Tags:["back"]}
execute in minecraft:the_nether run tp @s 777 189 777
effect give @s minecraft:blindness 8 1
$$(resource) change @s origins-plus-plus:light-mage/resource -50
