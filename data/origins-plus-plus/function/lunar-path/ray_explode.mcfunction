execute unless block ~ ~ ~ #origins-plus-plus:non_solid run function origins-plus-plus:lunar-path/hit_block
execute if score #hit Lunar_Path matches 0 as @e[tag=!chainray,distance=..1.5] at @s run function origins-plus-plus:lunar-path/hit_entity
scoreboard players add #distance Lunar_Path 1
execute if score #hit Lunar_Path matches 0 if score #distance Lunar_Path matches ..400 positioned ^ ^ ^0.1 run function origins-plus-plus:lunar-path/ray_explode
particle minecraft:dust{color:[0,0,0],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.086,0,0],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.086,0.027,0.027],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.067,0.02,0.02],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.212,0.212,0.212],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.18,0.165,0.161],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0,0,0],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.188,0.165,0.165],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.145,0.118,0.114],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:dust{color:[0.047,0.024,0.024],scale:.7} ~ ~ ~ 0.1 0.1 0.1 1 1 normal
particle minecraft:wax_off ~ ~ ~ 0.1 0.1 0.1 1 1 normal
