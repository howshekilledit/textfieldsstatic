

let cvs = false;
let looping = true;
let prism_cluster = false;
let m;
let bg_image; //background image
let cvs_bg; //canvas background
let cvs_width;
let cvs_height;
let mobile = false;
let mobile_options;


function setup() {
  frameRate(12);
  cvs_width = windowWidth;
  cvs_height = windowHeight;
  cvs = SVG().addTo('main').size(cvs_width, cvs_height).attr({ background: random(colors), overflow: 'hidden' });
  cvs_bg = cvs.rect(cvs_width, cvs_height).fill('#fff');
  document.getElementById('bg').style.width = cvs_width + 'px';
  document.getElementById('bg').style.height = 'auto';
  document.getElementsByTagName('main')[0].style.width = cvs_width + 'px';
  document.getElementsByTagName('main')[0].style.height = cvs_height + 'px';
  bg_image = document.getElementById('bg');
  bg_image.style.visibility = 'hidden';

  m = placePrism(); //new prism
  if(windowWidth<windowHeight){ //if portrait, switch to appropraitely sized bg image
    img_file = p_img_file;
    bg_image.src = p_img_file;
    mobile = true; //so we can demo mobile in browser, comment this out for production
  }
  //if mobile
  if (navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)) {
     mobile = true ;


  }
  if(mobile){
    let dim = m.getDim();
    m.group.move(cvs_width/2 - dim.x / 2, cvs_height/2 - dim.y / 2)
    frameRate(0.5);
    mobile_options = [
      function(){m.sandwich()},
      function(){
        m.delete();
        m = new prismCluster(m, random(2, 5));
        m.drawRandomThrees(); //draw random threes
      },
      function(){
        m.drawAll();
      },
    ]
  }

  //create group with two circles and a square

}

function draw() {
  if (looping) {
    //m.group.facets[0].polygon.move(mouseX, mouseY);

    let dim = m.getDim();
    //on PC, move with mouse; on mobile, move to center
    if (mobile){
      m.delete();
      m = placePrism();
      m.updateBackfill('#fff');
      random(mobile_options)();
      dim = m.getDim();
      m.group.move(cvs_width/2 - dim.x / 2, cvs_height/2 - dim.y / 2);
    } else {
      m.group.move(mouseX - dim.x / 2, mouseY - dim.y / 2);
    }
    // if (prism_cluster) {
    //   prism_cluster.group.move(mouseX - dim.x / 2, mouseY - dim.y / 2);
    // }
  }
}


//place prism on click

//on cvs click

window.addEventListener('click', function (e) {
  //if mobile, toggle looping
if(!mobile){
   console.log(e);
    if (m.germ) {
      m = m.germ;
    }
    m = m.copyTranslated(createVector(0, 0));
    placePrism(m);
  }


});

function mousePressed(){
  if(mobile){
    if(isLooping()){
      looping = false;
      noLoop();
    } else {
      loop();
      looping = true;
    }
  }
}

//key functions
let keyFunctions = {
  'a': {
    fnctn: function () {
      //toggle background opaque, 50% invisible
      if (m.bg.opacity() == 1) {
        m.bg.opacity(0.5);
      } else {
        if (m.bg.opacity() == 0.5) {
          m.bg.opacity(0);
        } else {
          m.bg.opacity(1);
        }
      }
    }, desc: 'toggle background',
    bool: false
  },
  's': {
    fnctn: function () {

      if (this.bool) {
        for (let l of m.lines) {
          l.hide();
        }
        this.bool = false;
      } else {
        m.line_index = floor(random(m.lines.length));
        m.lines[m.line_index].show();
        this.bool = true;
      }
    }, desc: 'toggle line visibility/line group',
    bool: true
  },
  // 's': {fnctn: function () {
  //   m.delete();
  //   m.stackFull(0, m.c1, m.c2, 0.5);
  // }, desc: 'solid gradient stack prism',
  // bool: false},
  'd': {
    fnctn: function () {
      //toggle background opaque, 50% invisible
      if (m.stack.opacity() == 1) {
        m.stack.opacity(0.5);
      } else {
        if (m.stack.opacity() == 0.5) {
          m.stack.opacity(0);
        } else {
          m.stack.opacity(1);
        }
      }
    }, desc: 'toggle stack',
    bool: false
  },
  //cluster should inherit properties of germ and toggle
  // 'f': {
  //   fnctn: function () {
  //     //m.group.hide();
  //     m.cluster = new prismCluster(m, random(3, 6));
  //     m.cluster.drawRandomThrees(); //draw random threes
  //     // m.background();
  //     // m.drawRandomThrees();
  //   }, desc: 'draw cluster with random threes, creating broken geometry',
  //   bool: false
  // },


  'f': {
    fnctn: function () { //change background
      // let img_pattern = `<pattern id="img1" patternUnits="userSpaceOnUse" width="${cvs_width}" height="${cvs_height}">
      // <image href="${folder+img_file}" x="0" y="0" width="${cvs_width}" height="auto" />
      // </pattern>`;
      //let img_path = img_file;
      //maybe: https://stackoverflow.com/questions/3796025/fill-svg-path-element-with-a-background-image
      let stages = [{bg: 'white', stroke: 'black', fill: 'gray'},
                    {bg: 'black', stroke: 'white', fill: 'gray'},
                    {bg: 'image', stroke: 'black', fill: 'white'},
                    {bg: 'image', stroke: 'white', fill: 'black'},
                  ];
      this.stage = (this.stage + 1) % stages.length;
      let stage = stages[this.stage];
      if (stage.bg == 'image') {
        cvs_bg.hide();
        bg_image.style.visibility = 'visible';
      } else {
        cvs_bg.show();
        cvs_bg.fill(stage.bg);

      }
      //m.delete();
      m.updateStroke(stage.stroke);
      m.updateBackfill(stage.fill);



    }, desc: 'change canvas background',
    stage: 0
  },
  'g': {fnctn: function () {
    m.delete();
    m = placePrism();
  }, desc: 'change current prism for new',
  bool: false},

  // 'k': {
  //   fnctn: function () {
  //     // if (bg_image.style.filter != 'grayscale(100%)') {
  //     bg_image.style.filter = 'grayscale(100%)';
  //     // } else {
  //     //   bg_image.style.filter = 'grayscale(0%)';
  //     // }
  //   }, desc: 'toggle grayscale background', bool: false
  // },

}

//different actions on keypress
function keyPressed() {
  if (keyFunctions[key]) {

    keyFunctions[key].fnctn();

  }
}


function placePrism(p = false, stroke = "black", fill = "gray") {
  if (!p) {
    p = new prism([], cvs, colors, stroke, fill);
    p.genFacets();
    //make sure prism has at least two sets of front/back facets
    while (p.frontFacets().length < 2) {
      p = new prism([], cvs, colors, stroke, fill);
      p.genFacets();
    }
  }
  p.preload();
  // p.drawAll();
  // p.background();
  return p;
}

//creates a six sided prism in a two dimensional system
function threeD(main = createVector(200, 100), legs = [createVector(100, 500), createVector(100, -300)]) {
  let monolith = new prism();
  //nase facet, from which legs extrude
  let base_face = new facet(main, createVector(40, 60));
  base_face.sortCw();
  base_face.set_type('base');
  monolith.addFacet(base_face);
  var vs = base_face.vtcs;
  let n_legs;
  //determine if single or multiple legs
  if (legs.constructor != Array) {
    n_legs = 1;

  } else {
    n_legs = legs.length;
  }

  //for each consecutive vertex pair in facet, generate a side facet based on leg dimensions
  for (var j = 0; j < n_legs; j++) {//for each leg
    let lg = legs;
    if (n_legs > 1) {
      lg = legs[j];
      if (j > 0) {
        base_face = base_face.copyTranslated(legs[j - 1]);
        base_face.set_type('base');
        monolith.addFacet(base_face);
        vs = base_face.vtcs;
      }
    }

    for (var i = 0; i < vs.length; i++) {
      let v = vs[i];
      let nv;
      if (i == vs.length - 1) {
        nv = vs[0];
      } else {
        nv = vs[i + 1]
      }

      genFacet(v, nv, lg);


    }

  }
  if (n_legs == 1) {
    let end_face = base_face.copyTranslated(legs);
    end_face.set_type('base');
    monolith.addFacet(end_face);
  }

  function genFacet(v, nv, lg) {
    var nFace = new facet(
      [createVector(v.x, v.y), createVector(nv.x, nv.y)],
      createVector(lg.x, lg.y)
    );
    nFace.sortCw();
    nFace.set_type('leg');
    monolith.addFacet(nFace);

  }
  return monolith;

}

function testFronts(monolith, c1 = random(colors), c2 = random(colors)) {
  let d = monolith.getDim();//monolith size
  let f1 = monolith.fcts[0] //first facet
  let t_d = f1.getDim(); //first face tsize
  let start = createVector(50, 50);
  let trans = createVector(start.x, start.y);
  let group = cvs.group();
  let indent = false;
  let z = monolith.threeFacets(); //all three facet combinatiosn from original facets
  let fronts = monolith.frontFacets(); //front and back facet sets
  var txt = group.text(function (add) {
    add.tspan('CRASS').dx(f1.vtcs[0].x).dy(f1.vtcs[0].y).fill('#000');
  })
  //txt.skew(n.x, n.y);
  let row = 0;
  for (let [i, m] of z.entries()) {

    let pm = m.copyTranslated(trans); //3 sided fragment
    let om = monolith.copyTranslated(trans);


    //if(i%2){ //moves position every other iteration, to allwo for layering stacks
    if (trans.x + t_d.x < 500) {
      trans.x += t_d.x;
    } else {
      //if(indent){
      if (row % 2 == 0) {
        row++;
        start.x += (d.x - t_d.x / 2);

      }
      else {
        row++;
        start.x -= (d.x - t_d.x / 2);

      }
      indent = false;

      trans.x = start.x;
      trans.y += d.y - t_d.y / 2;
    }

    pm.sandwich(c1, c2, om);

  }

}

function testText(monolith, str) {
  let facet = monolith.fcts[0];

  let vtcs = facet.vtcs;
  monolith.drawAll();
  let ctr = facet.getCenter();
  let dim = facet.getDim();

  let a1 = vtcs[1];
  let a2 = vtcs[0];

  let angF = tan((a1.y - a2.y) / (a1.x - a2.x)) % PI;
  angF *= 180 / PI;
  var txt = cvs.text(function (add) {
    add.tspan(str).dx(ctr.x - dim.x / 5).dy(ctr.y).fill('#000');
  })
  skew = dim.x / dim.y;
  txt.rotate(angF);


}



//cluster copies of monoliths, different designs, option to add color stack
function cluster(monolith, stack = false, n = 5) {
  //to add color stack, 2nd argument is object with vector, color 1, color 2 elements
  let steps = monolith.fcts[0].getDim();
  let x_step = steps.x;
  let y_step = steps.y;
  let x = 0;
  let y = 0;
  for (let i = 0; i < n; i += 1) {
    switch (floor(random(3))) {
      case 0:
        x += x_step;
        break;
      case 1:
        y += y_step;
        break;
      case 2:
        y += y_step / 2;
        x += x_step / 2;
        break;
    }
    y += y_step;
    x += x_step;
    let m = monolith.copyTranslated(createVector(x, y));
    let z = m.frontFacets();

    z[i % 2].drawAll(cvs, 'none', '#ff0000');

    if (stack) {
      //console.log(m.fcts[0]);
      if (stack.v.constructor != Array) {  //if single leg
        //m.fcts[0].stackShape(stack.v, stack.c1, stack.c2);
      } else { //if multiple legs
        let v_i = 0;
        for (let [i, f] of m.fcts.entries()) {
          v = stack.v[v_i];
          console.log(f);
          if (i % 5 == 0) { //if base facet

            //f.stackShape(v, stack.c1, stack.c2);
            v_i++;
          }
        }
      }
    }



    //z[1].drawAll(cvs, 'none', {width: 1, color: '#00ff00' });



  }

}