forceload add ~ ~
summon minecraft:marker ~ ~ ~ {Tags:["back"]}
tag @e[distance=0..3,type=!minecraft:marker] add tppocket
execute in minecraft:the_nether run tp @e[tag=tppocket] 777 189 777
effect give @e[tag=tppocket] minecraft:blindness 8 1
$$(resource) change @s origins-plus-plus:light-mage/resource -50
