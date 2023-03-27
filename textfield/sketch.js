let cvs = false;
let looping = true;
let prism_cluster = false;
let m;
let cvs_bg; //canvas background
let cvs_width;
let cvs_height;
let mobile = false;
let mobile_options;
let strk = '#000';
let fll = 'gray';
let img;
let l_img;
let p_img;
let bg_img; //background image
let img_pattern;
let bg_pattern; //background pattern

function preload() {
  l_img = loadImage(l_img_file);
  p_img = loadImage(p_img_file);
}

function setup() {
  frameRate(12);
  cvs_width = windowWidth;
  cvs_height = windowHeight;
  cvs = SVG().addTo('main').size(cvs_width, cvs_height).attr({ background: random(colors), overflow: 'hidden' });
  cvs_bg = cvs.rect(cvs_width, cvs_height).fill('#fff');

  document.getElementsByTagName('main')[0].style.width = cvs_width + 'px';
  document.getElementsByTagName('main')[0].style.height = cvs_height + 'px';


  let image_dim; //image dimensions

  image_dim = createVector();
  //if mobile, create pattern dimensions sclaed to image height
  if (windowWidth < windowHeight) { //if portrait, switch to appropraitely sized bg image
    img_file = p_img_file;
    bg_img = p_img;
    image_dim.x = cvs_height * p_img.width / p_img.height;
    image_dim.y = cvs_height;
    //mobile = true; //so we can demo mobile in browser, comment this out for production
  } else {
    img_file = l_img_file;
    bg_img = l_img;
    image_dim.x = cvs_width;
    //scale image height to image width
    image_dim.y = cvs_width * l_img.height / l_img.width;
  }

  //create svg pattern with image

  img_pattern = cvs.pattern(image_dim.x, image_dim.y, function (add) {
    add.image(img_file, 0, 0, image_dim.x, image_dim.y);
  });
  bg_pattern = cvs.pattern(image_dim.x, image_dim.y, function (add) {
    add.image(img_file, 0, 0, image_dim.x, image_dim.y);
  });

  //place initial prism 
  m = placePrism(); //new prism

  //if mobile
  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
    //mobile = true;
  }

  cvs_bg.attr('filter', 'grayscale(1)')
  if (mobile) {

    let dim = m.getDim();
    m.group.move(cvs_width / 2 - dim.x / 2, cvs_height / 2 - dim.y / 2)
    frameRate(1);
    content_div.innerHTML =
      `<p>Tap the screen to freeze and unfreeze the animation.</p>
    <p>Use link on upper right to save a still.</p>
    <p>Saved links are public.</p><br/>
    <p><em>Tag screenshots @howshekilledit.</em></p>`
    mobile_options = [
      function () { m.sandwich() },
      function () {
        let l = new prismCluster(m, random(2, 5));
        m.delete();
        m = l;
        m.background(); //draw background
        m.bg.opacity(0.5);
        m.drawRandomThrees(); //draw random threes
      },
      function () {
        m.drawAll();
        m.background(); //draw background
        m.bg.opacity(0.5);
      }, function () {
        if (cvs_bg.fill() == '#ffffff') {
          cvs_bg.fill(img_pattern);
          m.bg.opacity(0.5);
        } else {
          cvs_bg.fill('#ffffff');
        }
      }
    ]
  }
  //m.group.move(cvs_width / 2 - dim.x / 2, cvs_height / 2 - dim.y / 2);

}

function draw() {
  if (looping) {
    //m.group.facets[0].polygon.move(mouseX, mouseY);

    let dim = m.getDim();
    //on PC, move with mouse; on mobile, move to center
    if (mobile) {
      m.delete();
      m = placePrism();
      m.updateBackfill('#fff');
      random(mobile_options)();
      dim = m.getDim();
      m.group.move(cvs_width / 2 - dim.x / 2, cvs_height / 2 - dim.y / 2);
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
  if (mouseY > 50) {
    if (!mobile) {
      if (m.germ) {
        //m.delete();
        //if(mobile){
        m = new prismCluster(m.germ, random(3, 6));
        m.background();
        m.drawRandomThrees(); //draw random threes
        // } else {
        //   m.delete();
        //   m = m.germ.copyTranslated(createVector(0, 0));
        //   placePrism(m);
        // }

      } else {
        // m.delete(); 
        m = m.copyTranslated(createVector(0, 0));
        placePrism(m);
      }
    }

  }


});

// function mousePressed() {
//   if (mobile) {
//     if(document.getElementById('instructions').style.display != 'block'){
//       if (isLooping()) {
//         looping = false;
//         noLoop();
//       } else {
//         loop();
//         looping = true;
//       }
//   }
// }
// }

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
      if (this.bool) { //if lines are visible
        for (let l of m.lines) {
          l.hide();
        }
        this.bool = false;
      } else { //if lines are invisible
        if (m.germ) { //check if cluster
          for (let l of m.lines) {
            l.show();
          }
        } else {
          m.line_index = floor(random(m.lines.length));
          m.lines[m.line_index].show();
        }
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
      if (m.germ) { //if cluster move stack forward to visible
        m.stack.front();
      }
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
  'f': {
    fnctn: function () {
      //m.group.hide();
      if (this.bool == false) {
        let l = m;
        m = new prismCluster(l, random(3, 6));
        l.delete(); //delete germ
        m.background();
        m.drawRandomThrees(); //draw random threes

        this.bool = true;
      }
      else {
        let l = m.germ;
        m.delete();
        m = l.copyTranslated(createVector(0, 0));

        this.bool = false;

      }
      // m.background();
      // m.drawRandomThrees();
    }, desc: 'draw cluster with random threes, creating broken geometry',
    bool: false
  },


  'g': {
    fnctn: function () { //change background
      // let img_pattern = `<pattern id="img1" patternUnits="userSpaceOnUse" width="${cvs_width}" height="${cvs_height}">
      // <image href="${folder+img_file}" x="0" y="0" width="${cvs_width}" height="auto" />
      // </pattern>`;
      //let img_path = img_file;
      //maybe: https://stackoverflow.com/questions/3796025/fill-svg-path-element-with-a-background-image
      let stages = [{ bg: 'white', stroke: 'black', fill: 'gray' },
      { bg: 'black', stroke: 'white', fill: 'gray' },
      { bg: bg_pattern, stroke: 'black', fill: 'white' },
      { bg: bg_pattern, stroke: 'white', fill: 'black' },
      ];

      this.stage = (this.stage + 1) % stages.length;
      let stage = stages[this.stage];
      cvs_bg.fill(stage.bg);
      //cvs_bg.animate().attr({ fill: stage.bg });

      //m.delete();
      m.updateStroke(stage.stroke);
      m.updateBackfill(stage.fill);
      strk = stage.stroke;
      fll = stage.fill;



    }, desc: 'change canvas background',
    stage: 0
  },
  'h': {
    fnctn: function () {
      // if(m.bg.opacity() == 0){m.bg.opacity(1);}
      // m.toggleMask();
      m.delete();
      m = placePrism();
    }, desc: 'change current prism for new',
    bool: false
  },


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




function placePrism(p = false, stroke = strk, fill = fll) {
  let msk = { width: cvs_width, height: cvs_height, fill: img_pattern };

  if (!p) {
    p = new prism([], cvs, colors, stroke, fill);
    p.genFacets();
    //make sure prism has at least two sets of front/back facets
    while (p.frontFacets().length < 2) {
      p = new prism([], cvs, colors, stroke, fill);
      p.genFacets();
    }
    p.preload();
  }

  // p.drawAll();
  // p.background();
  return p;
}