let hair;
let red_hair;
let cvs; //svg canvas
let svg; //svg DOM object
let rectangle;
let start;
let hair_width;
let end_writhe = 0.2;
let panning = false; //is 'camera' panning?
let i_lists = []; //list of lists of indices for each hair
let i = 0;  //index of circle to remove
let red_left = false; //direction of red hair motion

//note that right now width is the range for control points
//and height is the range for the bezier curve full length
function setup() {
  document.body.style.zoom = 1.0;

  //svg canvas to draw on with svg.js/p5.js

  cvs = SVG().addTo('main').size(windowWidth, windowHeight).attr({ fill: '#000' });
  //svg DOM object to manipulate with javascript
  svg = document.getElementsByTagName('svg')[0];

  let incr = 30;

  let max_hair_width = windowWidth * 0.8;

  hair = new medusa(incr, max_hair_width, 200, 5);
  red_hair = new medusa(incr, max_hair_width, 200, 5, '#000', '#f00');
  hair.gen_curves(0);
  hair.gen_circles();
  let dimensions = hair.get_dimensions();
  let corners = hair.get_corners();
  //get offset to center hair
  var offset = new pt((windowWidth - dimensions.x) / 2 - corners[0].x, (windowHeight - dimensions.y) / 2 - corners[0].y);
  hair.set_offset(offset);
  red_hair.set_offset(offset);
  red_hair.gen_curves(0);
  red_hair.gen_circles();
  window.scrollTo(0, 0); //scroll to top left of page
  //toggle_pan(); //first call, as of now needs to calls to work
  //toggle_pan();
  frameRate(12);
  //set i_lists to two shuffled lists of indices
  for (let i = 0; i < 2; i++) {
    let i_list = [];
    for (let j = 0; j < hair.circles.length; j++) {
      i_list.push(j);
    }
    i_list = shuffle(i_list);
    i_lists.push(i_list);
  }
  if (floor(random(2)) == 1) {
    red_left = true;
    //toggle_pan();
  }
  if ((floor(random(2)) == 1) && instructions.style.display != 'block' && document.getElementById('cookieNotice').style.display != 'block') {
    toggle_pan();
  }
  document.body.style.backgroundColor = 'black';

  //red_hair.draw_all_circles(cvs);
  //hair.draw_all_circles(cvs);

  //noLoop();
  //hair.draw_all_circles(cvs, '#fff', '#000');
  //hair.bounding_box(cvs, 'yellow');
  // for(let i = 0; i < corners.length; i++){
  //    cvs.line(corners[i].x + offset.x, corners[i].y + offset.y, corners[(i+1)%corners.length].x + offset.x, corners[(i+1)%corners.length].y + offset.y).stroke({ width: 1, color: '#f00' });
  // }
}


function draw() {
  if(instructions.style.display == 'block'){
    noLoop();
  } else {
    loop();
  }
  if (frameCount%(hair.circles.length*2) < hair.circles.length) { //while hair is growing

    if (panning) {
      svg.style.left = -frameCount % windowWidth;
    }
    let ellipse = hair.draw_circle(cvs, frameCount%(hair.circles.length*2));
    let r_loc =frameCount%(hair.circles.length*2)-1;
    if (red_left) { r_loc = hair.circles.length - frameCount%(hair.circles.length*2)-1; }
    let red_ellipse;
    try{
      red_ellipse = red_hair.draw_circle(cvs, r_loc, '#f00', '#000');
      red_ellipse.mouseover(function () {
        red_hair.writhe(2);
      });
    } catch(e){
      console.log(e);
      console.log(r_loc);
    }
    ellipse.mouseover(function () {
      hair.writhe(2);
    });

  } else { //when hair is done growing
    if (panning) {
      toggle_pan();
    }
    //noLoop();
    //if(getFrameRate() != 6){frameRate(6)}
    let ri = i_lists[0][i];
    let bi = i_lists[1][i];
    red_hair.writhe(end_writhe);
    hair.writhe(end_writhe);
    //if(frameCount % 2 == 0){
    hair.circle_fades(bi, 40);
    // } else {
    red_hair.circle_fades(ri, 40);
    // }
    end_writhe += 0.005;
    i++;
  }
  if(frameCount%hair.circles.length*2 == hair.circles.length*2-1){
    noLoop();
    cvs.remove();
    end_writhe = 0.2;
    i=0;
    setup();
    loop();
  }
}

function keyTyped() {
  console.log(key);
  switch (key) {
    case 'a': { //toggle zoom and pan
      let fll = hair.stroke;
      let strk = hair.fill;
      hair.fill = fll;
      hair.stroke = strk;
      hair.update_colors(true); //update circles
      break;
    }
    case 's': {
      let r_fll = red_hair.stroke;
      let r_strk = red_hair.fill;
      red_hair.fill = r_fll;
      red_hair.stroke = r_strk;
      red_hair.update_colors(true); //update circles
      break;
    }
    case 'd': {
      //toggle black/white body background
      if (document.body.style.backgroundColor == 'black') {
        document.body.style.backgroundColor = 'white';
        document.getElementById('menu-toggle').style.color = 'black';
      } else {
        document.body.style.backgroundColor = 'black';
        document.getElementById('menu-toggle').style.color = 'white';

      }
      break;
    }
    case 'f': {
      toggle_pan();
      break;
    }
    default: {
      break;
    }

  }




  }

function toggle_pan() {
  if (!panning) {
    try{
      document.getElementById('menu').style.display = 'none';
    }catch{}
    panning = true;
    svg.style.top = -windowHeight / 3;
    document.body.style.zoom = 3.0;
  } else {
    document.body.style.zoom = 1.0;
    try{
      document.getElementById('menu').style.display = 'block';
    }catch{}
    svg.style.left = 0;
    svg.style.top = 0;
    panning = false;
  }
}