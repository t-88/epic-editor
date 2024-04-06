const PONG_SRC = {
    "type": "Scene",
    "comps":
    {
        "id": "Main-Scene",
        "size": { "type": "size", "w": 400, "h": 600 }, "color": { "type": "color", "r": 255, "g": 255, "b": 255 },
        "script": `func on_block_init(ID) { \n}\nfunc on_block_update(ID) {\n    pos = get_component(ID,Components.Position);  \n    size = get_component(ID,Components.Size);  \n    \n    ball_id = get_entity_by_id(\"ball\");\n    ball_pos = get_component(ball_id,Components.Position);\n    ball_size = get_component(ball_id,Components.Size);\n    ball_data = get_component(ball_id,Components.Storage);\n\n    if(ball_data.collided == 0) {\n      if(AABB(ball_pos.x + ball_data.vel_x,ball_pos.y + ball_data.vel_y,ball_size.w,ball_size.h,pos.x,pos.y,size.w,size.h)) {\n        \n        if(AABB(ball_pos.x + ball_data.vel_x,ball_pos.y,ball_size.w,ball_size.h,pos.x,pos.y,size.w,size.h)) { \n          ball_data.collided = 1;\n          ball_data.x_dir =  ball_data.x_dir * -1; \n        }\n        if(ball_data.collided == 0) {\n          if(AABB(ball_pos.x,ball_pos.y + ball_data.vel_y,ball_size.w,ball_size.h,pos.x,pos.y,size.w,size.h)) {\n            ball_data.collided = 1;\n            ball_data.y_dir =  ball_data.y_dir * -1; \n          }\n        }\n        \n          remove_entity(ID);\n      }\n    }\n}\n\n\nfunc on_init(ID) {\n    for(i in 0..10) {\nfor(j in 0..5) {\n    id = create_entity(\n          i * 30 + 60,\n          j * 30 + 10,\n          29,\n          29,\n          20,\n          120,\n          255,\n          on_block_init,\n          on_block_update\n        );\n}\n    }\n}`,

    },
    "children": [{
        "type": "Rect", "comps": {
            "id": "player",
            "pos": { "x": 160, "y": 580 },
            "size": { "w": 80, "h": 20 }, "color": { "r": 125, "g": 10, "b": 50 },
            "storage": [{ "key": "speed", "val": "5" }],
            "script": `func on_update(ID) {\n  pos = get_component(ID,Components.Position);    \n  size = get_component(ID,Components.Size);\n  data = get_component(ID,Components.Storage);\n  \n  scene_id = get_entity_by_id(\"Main-Scene\");\n  scene_size = get_component(scene_id,Components.Size);\n  \n\n  ball_id = get_entity_by_id(\"ball\");\n  ball_size = get_component(ball_id,Components.Size);\n  ball_pos = get_component(ball_id,Components.Position);\n  ball_data = get_component(ball_id,Components.Storage);\n  \n  if(pos.x > 0) {\n      if(is_pressed(Keys.Left)) {\n          pos.x = pos.x - data.speed;\n          if(AABB(pos.x,pos.y,size.w,size.h,ball_pos.x,ball_pos.y,ball_size.w,ball_size.h)) {\n              ball_pos.x = pos.x - ball_size.w;   \n              ball_data.x_dir = -1; \n          }\n      }\n  }\n  \n  if(pos.x < scene_size.w - size.w) {\n      if(is_pressed(Keys.Right)) {\n          pos.x = pos.x + data.speed;\n            if(AABB(pos.x,pos.y,size.w,size.h,ball_pos.x,ball_pos.y,ball_size.w,ball_size.h)) {\n              ball_pos.x = pos.x + size.w;\n              ball_data.x_dir =  1; \n              log(ball_data);\n          }\n      }    \n  }\n}    `,
        },
    },
    {
        "type": "Rect", "comps": {
            "id":
                "ball",
            "pos": { "x": 191, "y": 327 }, "size": { "w": 20, "h": 20 }, "color": { "r": 100, "g": 50, "b": 255 },
            "script": `func on_update(ID) {\n  pos = get_component(ID,Components.Position);  \n  size = get_component(ID,Components.Size);  \n  data = get_component(ID,Components.Storage);  \n  data.collided = 0;\n\n\n  scene_id = get_entity_by_id(\"Main-Scene\");\n  scene_size = get_component(scene_id,Components.Size);  \n  \n  if(pos.x < 0) {\n      r_factor = randint(-2,2);\n      r_factor = r_factor / 100;                   \n      data.x_dir =  data.x_dir * -1 + r_factor; \n  } \n  if(pos.x > scene_size.w - size.w) {\n      r_factor = randint(-2,2);\n      r_factor = r_factor / 100;                   \n      data.x_dir =  data.x_dir * -1 + r_factor; \n  } \n\n\n  if(pos.y < 0) {\n      r_factor = randint(-2,2);\n      r_factor = r_factor / 100;                   \n      data.y_dir =  data.y_dir * -1 + r_factor; \n  } \n  if(pos.y > scene_size.h - size.h) {\n      r_factor = randint(-2,2);\n      r_factor = r_factor / 100;                   \n      data.y_dir =  data.y_dir * -1 + r_factor; \n      \n      \n      clear_entities();\n      init();\n  }      \n  \n  player_id = get_entity_by_id(\"player\");\n  player_pos = get_component(player_id,Components.Position);\n  player_size = get_component(player_id,Components.Size);\n\n\n  sqrted = sqrt(data.x_dir*data.x_dir+data.y_dir*data.y_dir);   \n  data.vel_x = (data.x_dir / sqrted) * data.speed;\n  data.vel_y = (data.y_dir / sqrted) * data.speed;\n\n  \n  if(AABB(player_pos.x,player_pos.y,player_size.w,player_size.h,pos.x + data.vel_x,pos.y + data.vel_y,size.w,size.h)) {\n      x_collide = 1;\n      if(AABB(player_pos.x,player_pos.y,player_size.w,player_size.h,pos.x,pos.y + data.vel_y,size.w,size.h)) {\n        if(data.vel_y > 0) {\n          pos.y = player_pos.y - size.h;   \n        } \n        if(data.vel_y < 0) {\n          pos.y = player_pos.y + player_size.h;   \n        }\n        data.y_dir =  data.y_dir * -1; \n        x_collide = 0;\n      }\n\n        \n      if(x_collide) {\n      \n      if(AABB(player_pos.x,player_pos.y,player_size.w,player_size.h,pos.x + data.vel_x,pos.y,size.w,size.h)) {\n          if(data.vel_x > 0) {\n            pos.x = player_pos.x - size.w;   \n          } \n          if(data.vel_x < 0) {\n            pos.x = player_pos.x + player_size.w;   \n          }\n          data.x_dir =  data.x_dir * -1; \n      }\n      }\n      \n  } \n  \n  data.vel_x = (data.x_dir / sqrted) * data.speed;\n  data.vel_y = (data.y_dir / sqrted) * data.speed;\n  \n  pos.x = pos.x + data.vel_x;\n  pos.y = pos.y + data.vel_y;   \n  \n\n}`,
            "storage": [{ "key": "collided", "val": "0" }, { "key": "x_dir", "val": "0.5" }, { "key": "y_dir", "val": "-0.5" }, { "key": "speed", "val": "5" }, { "key": "vel_x", "val": "0" }, { "key": "vel_y", "val": "0" }]
        }
    },
    ]
};
export default PONG_SRC;


