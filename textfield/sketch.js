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
let m_crd; //mobile coordinates 

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
  //put ldng text in center
  document.getElementsByTagName('main')[0].style.width = cvs_width + 'px';
  document.getElementsByTagName('main')[0].style.height = cvs_height + 'px';

  let image_dim; //image dimensions

  image_dim = createVector();
  //if portrait create pattern dimensions sclaed to image height
  if (windowWidth < windowHeight) { //if portrait, switch to appropraitely sized bg image
    img_file = p_img_file;
    bg_img = p_img;
    image_dim.x = cvs_height * p_img.width / p_img.height;
    image_dim.y = cvs_height;
    //mobile = true; //so we can demo mobile in browser, comment this out for production
  } else { //if landscape, switch to appropraitely sized bg image
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
  let dim = m.getDim();
  m_crd = createVector(cvs_width / 2 - dim.x / 2, cvs_height / 2 - dim.y / 2); //mobile coordinates

  //if mobile
  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
    mobile = true;
  }

  cvs_bg.attr('filter', 'grayscale(1)')
  
  m.group.move(m_crd.x, m_crd.y);




}

function draw() {
  let loading = document.getElementById('loading');
  if(loading.style.display != 'none'){
    loading.style.display = 'none';


  }
  if (looping) {
 
    //m.group.facets[0].polygon.move(mouseX, mouseY);

    let dim = m.getDim();
    //on PC, move with mouse; on mobile, move to center
    if (mobile) {
      m.group.move(m_crd.x, m_crd.y);
    } else {
      if(mouseX > 0 && mouseX < cvs_width && mouseY > 0 && mouseY < cvs_height){
        m.group.move(mouseX - dim.x / 2, mouseY - dim.y / 2);
      } else {
        m.group.move(m_crd.x, m_crd.y);
      }
    }
    // if (prism_cluster) {
    //   prism_cluster.group.move(mouseX - dim.x / 2, mouseY - dim.y / 2);
    // }
  }
}


//place prism on click

//on cvs click

window.addEventListener('click', function (e) {
  if ((mouseY > 80 || mouseX > 400) & !mobile) { //if not in button area and on PC
      if (m.germ) {
        m = new prismCluster(m.germ, random(3, 6));
        m.background();
        m.drawRandomThrees(); //draw random threes
      } else {
        // m.delete(); 
        m = m.copyTranslated(createVector(0, 0));
        placePrism(m);
      }
    

  }


});


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
        } else { //flip coin to show random linegroup or back/front
          let coin = floor(random(2));
          if (coin == 0) { //random
            m.line_index = floor(random(m.lines.length));
            m.lines[m.line_index].show();
          } else { //front/back
            m.lines[0].show();
            m.lines[m.lines.length - 1].show();
            m.line_index = [0, m.lines.length-1]; //set current line group index to front/back
          }
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
      if (!m.germ) {
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