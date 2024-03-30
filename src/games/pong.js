const PONG_SRC = '{"type":"Scene","comps":{"id":{"type":"id","id":"Main-Scene"},"size":{"type":"size","w":400,"h":600},"color":{"type":"color","r":255,"g":255,"b":255}},"children":[{"type":"Rect","comps":{"id":{"type":"id","id":"player"},"pos":{"type":"pos","x":108,"y":457},"size":{"type":"size","w":50,"h":50},"color":{"type":"color","r":125,"g":125,"b":125},"script":{"type":"script","script":"func on_update(ID) {\\n  pos = get_component(ID,Components.Position);    \\n  size = get_component(ID,Components.Size);\\n  data = get_component(ID,Components.Storage);\\n  \\n  scene_id = get_entity_by_id(\\"Main-Scene\\");\\n  scene_size = get_component(scene_id,Components.Size);\\n  \\n  \\n  if(pos.x > 0) {\\n      if(is_pressed(Keys.Left)) {\\n          pos.x = pos.x - data.speed;\\n      }\\n  }\\n  \\n  if(pos.x < scene_size.w - size.w) {\\n      if(is_pressed(Keys.Right)) {\\n          pos.x = pos.x + data.speed;\\n      }    \\n  }\\n}    "},"storage":{"type":"storage","map":[{"key":"speed","val":"5"}]}}},{"type":"Rect","comps":{"id":{"type":"id","id":"ball"},"pos":{"type":"pos","x":107,"y":143},"size":{"type":"size","w":20,"h":20},"color":{"type":"color","r":100,"g":50,"b":255},"script":{"type":"script","script":"func on_update(ID) {\\n  pos = get_component(ID,Components.Position);  \\n  size = get_component(ID,Components.Size);  \\n  data = get_component(ID,Components.Storage);  \\n  data.collided = 0;\\n  \\n  if(pos.x < 0) {\\n      r_factor = randint(-2,2);\\n      r_factor = r_factor / 100;                   \\n      data.x_dir =  data.x_dir * -1 + r_factor; \\n  } \\n  if(pos.x > 400 - 15) {\\n      r_factor = randint(-2,2);\\n      r_factor = r_factor / 100;                   \\n      data.x_dir =  data.x_dir * -1 + r_factor; \\n  } \\n\\n\\n  if(pos.y < 0) {\\n      r_factor = randint(-2,2);\\n      r_factor = r_factor / 100;                   \\n      data.y_dir =  data.y_dir * -1 + r_factor; \\n  } \\n  if(pos.y > 600 - 15) {\\n      r_factor = randint(-2,2);\\n      r_factor = r_factor / 100;                   \\n      data.y_dir =  data.y_dir * -1 + r_factor; \\n      \\n      \\n      clear_entities();\\n      init();\\n  }      \\n  \\n  player_id = get_entity_by_id(\\"player\\");\\n  player_pos = get_component(player_id,Components.Position);\\n  player_size = get_component(player_id,Components.Size);\\n  \\n  if(AABB(player_pos.x,player_pos.y,player_size.w,player_size.h,pos.x + data.x_dir,pos.y + data.y_dir,size.w,size.h)) {\\n      data.y_dir =  data.y_dir * -1; \\n  }\\n  \\n  sqrted = sqrt(data.x_dir*data.x_dir+data.y_dir*data.y_dir);   \\n  pos.x = pos.x + (data.x_dir / sqrted) * data.speed;\\n  pos.y = pos.y + (data.y_dir / sqrted) * data.speed; \\n}"},"storage":{"type":"storage","map":[{"key":"collided","val":"0"},{"key":"x_dir","val":"0.5"},{"key":"y_dir","val":"-0.5"},{"key":"speed","val":"5"}]}}}]}'

console.log(JSON.parse(PONG_SRC))

export default PONG_SRC;