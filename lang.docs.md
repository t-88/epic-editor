# Op Language Docs
op syntax is the similar to js or c syntax but no the same. its missing some sugary features but its works.    

## Recap
- transpiled to other languages
- op is a semi colon language
- not staticly typed 
- lacks a lot of basic featuresm but wont destory dev (its good enough)
- engine consts, Components, Keys
- sys calls are functions that call the engine internals, they all start with "$."
- if you want basic examples about the languages check out [basics](https://github.com/t-88/epic.rs/tree/master/src/op_lang/test/basics)

## Arth and Boolean Ops
- \+ , \-, * , / are supported
- &&, ||, > , < , == , != , >= , <= are supported
- no a++ or ++a ops
- cant do a += 1 like ops, use the default a = a + 1 for that

## Variables
- all variables must be decalred before being used, you will get a semetic error if a variable is used but not declared
- declaration: let a = 69;

## Types
there are 4 main types: numbers, strings, hashmaps, arrays    
its supportes dot notation, so if you want to change the position of entity you get the position component and modify the x attribute `pos.x = pos.x - 10` 

## Consts
global consts the engine defines before the start of the game.
- Components: to access entity components
    - contains Position, Color, Size, Id 
- Keys: those 4 keys that are supported
    - contains Left , Right, Up, Down 

## Sys Calls
sys calls call the engine internals, they are connected to js and python functions, they allow you to access or update engine state, u can call these function using  , **and they are:**
- $.get_component(ID,Components.*) : gets the entity components
- $.get_entity_by_id(ID) :           return entity uuid that has the id components, so u can change its components from another entity
- $.clear_entities() :               removes all entities
- $.is_pressed(Keys.*) :             checks if keys are pressed 
- $.remove_entity(ID) :              removes the entity with ID 
- $.log(*) :                         prints to console.log or terminal
- $.restart() :                      restarts the scene 
- $.randint(start,end) :             random number from start to end 
- $.sqrt(number) :                   returns the 
- $.AABB(x1,y1,w1,h1,x2,y2,w2,h2) :  checks AABB collision 