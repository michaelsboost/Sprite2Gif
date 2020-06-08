// variables
var counter = 0, spriteFrame, spriteImage, canvas = document.querySelector("#canvas");

// Show Lightbox Video Onload
var playGuide = function() {
  $.fancybox.open({
    youtube : {
      controls : 0,
      showinfo : 0
    },
    src  : 'https://www.youtube.com/embed/Eu2WDTtZgEI',
    type : 'iframe'
  });
};

// Watch How To Video
alertify.message("<div class=\"grid\"><div class=\"centered grid__col--12 tc\"><h2>Instructional Guide!</h2><a class=\"pointer\" onclick=\"playGuide()\"><img src=\"imgs/playvideo.svg\" width=\"50%\"></a></div></div>");

// load svg file
function loadfile(input) {
  var reader = new FileReader();
  var path = input.value;
  reader.onload = function(e) {
    var img = new Image();
    img.src = e.target.result;
    sprite.src = e.target.result;
    imgframes.appendChild(img);
    imageLoaded();
  };
  reader.readAsDataURL(input.files[0]);
};
function dropfile(event) {
  var dt    = event.dataTransfer;
  var file = dt.files[0];
  
  var reader = new FileReader();  
  reader.onload = function(e) {
    if (file.type === "image/bmp" || "image/jpeg" || "image/jpg" || "image/png" || "image/tif" || "image/tiff" || "image/tiff-fx") {
      var img = new Image();
      img.src = e.target.result;
      sprite.src = e.target.result;
      imgframes.appendChild(img);
      imageLoaded();
    } else {
      alertify.error("Sorry that file type is not supported. Please only load .svg files.");
    }
  }
  reader.readAsDataURL(file);
};
function imageLoaded() {
  if (sprite.width > sprite.height) {
    alertify.message("<strong>NOTE</strong>: Sprite2Gif assumes the width and height are the same size in your sprite sheet!");
    
    read.classList.add("hide");
    btns.classList.remove("hide");
  } else {
    alertify.error("Error: Height is greater than the width; <a href=\"https://ezgif.com/sprite-cutter\" target=\"_blank\">Please fix your sprite sheet</a>.");
    return false;
  }
};

openfile.onchange = function() {
  loadfile(this);
  
  dropflash.classList.remove("hide");
  $("#dropflash").fadeOut();
};
read.ondragover   = function(e) {
  this.style.opacity = ".5";
  return false;
};
read.ondragend    = function() {
  read.style.opacity = "1";
  return false;
};
read.ondrop       = function(e) {
  e.preventDefault();
  read.style.opacity = "1";
  dropflash.classList.remove("hide");
  $("#dropflash").fadeOut();
//  var file = e.dataTransfer.files[0];
//  dropfile(file);
  dropfile(event);
  return false;
};

// add canvas to image src as base64
function grabFrameImg() {
  var ctx = canvas.getContext("2d");

  var img = new Image();
  img.src = canvas.toDataURL("image/png");
  imgframes.appendChild(img);
}
function spriteAnim(options) {
  var that = {},
      frameIndex     = 0,
      tickCount      = 0,
      ticksPerFrame  = options.ticksPerFrame || 0,
      numberOfFrames = options.numberOfFrames || 1;

  that.context = options.context;
  that.width   = options.width;
  that.height  = options.height;
  that.image   = options.image;

  that.update = function() {
    tickCount += 1;

    if (tickCount > ticksPerFrame) {
      tickCount = 0;

      // If the current frame index is in range
      if (frameIndex < numberOfFrames - 1) {
        // Go to the next frame
        frameIndex += 1;
      } else {
        frameIndex = 0;
      }
    }
  };

  that.render = function() {
    // Clear the canvas
    that.context.clearRect(0, 0, that.width, that.height);

    // Draw the animation
    that.context.drawImage(
      that.image,
      frameIndex * that.width / numberOfFrames,
      0,
      that.width / numberOfFrames,
      that.height,
      0,
      0,
      that.width / numberOfFrames,
      that.height);
  };

  return that;
}

// create the image sequence
createsequence.onclick = function() {
  // empty images for image sequence
  imgframes.innerHTML = "";
  
  // Get canvas
  canvas.width  = sprite.height;
  canvas.height = sprite.height;

  // Create sprite sheet
  spriteImage = new Image();	

  // Create sprite
  spriteFrame = spriteAnim({
    context: canvas.getContext("2d"),
    width:  sprite.width,
    height: sprite.height,
    image:  spriteImage,
    numberOfFrames: parseInt(sprite.width / sprite.height),
    ticksPerFrame: 0
  });

  // convert sprite sheet into image sequence
  window.intervalID = setInterval(function() {
    if (counter++ < parseInt(sprite.width / sprite.height)) {
      // console.log("frame " + counter + " from sprite created");
      spriteImage.src = sprite.src;
      spriteFrame.update();
      spriteFrame.render();
      grabFrameImg();
    } else {
      // move last frame to the front
      $("#imgframes").prepend($("#imgframes img:last"));
      clearInterval(window.intervalID);
    }
  }, 10);
  
  // hide this and show create gif
  this.style.display = "none";
  creategif.className = "btn--blue pointer w100p";
  scripttxt.classList.remove("hide");
  creategif.style.display = "block";
};

// create the gif animation
creategif.onclick = function() {
  // hide elements
  read.classList.add("hide");
  scripttxt.classList.add("hide");
  createsequence.classList.add("hide");
  this.style.display = "none";
  
  // show process and then display result
  showprocess.classList.remove("hide");
  var images = [];
  $("#imgframes img").each(function() {
    images.push($(this).attr("src"));
    $(this).removeAttr("onclick");
    $(this).removeClass("pointer");
  });
  
  gifshot.createGIF({
    images: images,
    gifWidth:  sprite.height,
    gifHeight: sprite.height,
    interval: animRate.value, // seconds
    progressCallback: function(captureProgress) { console.log('progress: ', captureProgress); },
    completeCallback: function() { console.log('completed!!!'); },
    numWorkers: 2,
  },function(obj) {
    if(!obj.error) {
      var image = obj.image;
      result.src = image;
      showit.classList.remove("hide");
      exportgif.classList.remove("hide");
      showprocess.classList.add("hide");
    }
  });
};

// export gif animation
exportgif.onclick = function() {
  this.href = result.src;
};

// initiate animation when values change
animRate.style.width    = ((animRate.value.length + 1) * 30) + "px";
animRate.onkeydown    = function(e) {
  this.style.width  = ((this.value.length + 1) * 22) + "px";
}