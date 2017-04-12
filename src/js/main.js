var videoFeed
var videoContainer
var videoScale = 16
var effectDisplay
var w
var h
var snaps = []
var tintColor = '#00ddff';
var multiSnaps = []
var multiFrameCounter = 0
var currentEffect = ['none', 'mirror', 'emojify', 'emojiHead', 'multiFrame']
// var effects =
var mainGui
var outputGui

var colors

function setup() {
  w = windowWidth
  h = windowHeight
  pixelDensity(1) //disregard retina display

  var canvas = createCanvas(640,480)
  videoFeed = createCapture(VIDEO)
  videoFeed.size(640/videoScale, 480/videoScale).id('myvideo')
  // videoFeed.hide()

  //center it
  mainGui = QuickSettings.create(w/2 - 330, h/2 - 330, "REM ✌🏽")
             .setWidth(660)
             .addDropDown("💥 Choose an Effect 💥", currentEffect, function(val){changeEffect(val.value)})
             .addElement("", canvas.elt)
             .addButton("📸 Save Photo", saveImage)
             .addButton("📹 Record a GIF", saveImage)
             .addButton("🚀 Upload GIF to IMGUR", saveImage)


 colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow'])
 //tracking
 colors.on('track', function(event) {
   if (event.data.length === 0) {
     // No colors were detected in this frame.
   } else {
     event.data.forEach(function(frame) {
       drawRect(frame)
     })
   }
 })

tracking.track('#myvideo', colors);

}//SETUP



function drawRect(frame) {
  noFill()
  stroke(frame.color)
  rect(frame.x, frame.y, frame.height, frame.width)
}



function saveImage() {
  saveCanvas(canvas, 'myCanvas', 'png');
}

function changeEffect(value){
  currentEffect = value
}

function takeSnap(){
  currentEffect = 'takeSnap'
  snaps.push(videoFeed.get())
  image(snaps[snaps.length - 1], 0, 0)
}



//p5 draw function called everyframe
function draw() {

  if(currentEffect === 'emojify' && videoFeed) {
    videoFeed.loadPixels()
    loadPixels()
    for(var y = 0; y < videoFeed.height; y++) {
      for(var x = 0; x < videoFeed.width; x++){
        var index = (videoFeed.width - x + 1 + (y * videoFeed.width))*4 //reverse image for mirror effect
        //1 pixel holds 4 values (rgba)
        var r = videoFeed.pixels[index + 0] //r
        var g = videoFeed.pixels[index + 1] //g
        var b = videoFeed.pixels[index + 2] //b

        var brightness = (r + g + b)/3

        var emoji = ''

        if (brightness < 100) {
          emoji = '🎱'
        } else if (brightness > 100 && brightness < 200) {
          emoji = '😢'
        } else if (brightness > 100 && brightness < 200) {
          emoji = '🔥'
        }

        text(emoji, x*videoScale,y*videoScale,videoScale,videoScale)
      }
    }
  }


  if(currentEffect === 'multiFrame' && videoFeed) {
    noTint()
    videoFeed.size(640, 480)
    multiSnaps[multiFrameCounter] = videoFeed.get()
    multiFrameCounter ++
    //41 total no of multi frames possible
    if(multiFrameCounter == 41) { multiFrameCounter = 0}
    var w = width / 6
        h = height / 6
        x = 0
        y = 0
    for (var i = 0; i < multiSnaps.length; i++) {
      var index = (i + frameCount) % multiSnaps.length
      image(multiSnaps[index], x, y, w, h)
      //move to the next frame
      x += w
      if (x > width) {
        x = 0
        y = y + h
      }
    }
  }
}// DRAW


// tint(random(255),random(255), random(255))
// mainGui.bindDropDown("designMode", ["on", "off"], document)
// mainGui.bindColor("backgroundColor", "#ffffff", document.body.style);


//black and white mirror
// pixels[index + 0] = brightness
// pixels[index + 1] = brightness
// pixels[index + 2] = brightness
// pixels[index + 3] = 255//a
