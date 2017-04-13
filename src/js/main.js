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
var emoji = ''
var textEmoji
var mainGui
var outputGui

var bgroundColor
var fontSize = 15

function setup() {
  w = windowWidth
  h = windowHeight
  bgroundColor = '#a3f9c3'
  pixelDensity(1) //disregard retina display

  var canvas = createCanvas(640,480)
  videoFeed = createCapture(VIDEO)
  videoFeed.size(640/videoScale, 480/videoScale).id('myVideo')
  // videoFeed.hide()

  //center it
  mainGui = QuickSettings.create(w/2 - 330, 10, "REM✌🏽")
             .setWidth(660)
             .addDropDown("💥 Enable webcam first & choose a video effect 💥", currentEffect, function(val){changeEffect(val.value)})
             .addElement("", canvas.elt)
             .addButton("💾 Save Photo", saveImage)
             .addButton("📹 Save GIF", saveImage)
             //add a slider
             .addButton("🚀 Upload GIF to IMGUR", saveImage)
             .addHTML("Info","Created by <a href='http://tamrat.co' target='_blank'> @tamrrat</a> at the Recurse Center 🐙. Github <a href='https://github.com/tamg/rem' target='_blank'>link</a>.")

//examples ui double tap to see examples


 colorTracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow'])
 //tracking
 colorTracker.on('track', function(event) {
   if (event.data.length === 0) {
     // No colors were detected in this frame.
   } else {
     event.data.forEach(function(frame) {
       drawRect(frame)
     })
   }
 })

tracking.track('#myVideo', colorTracker)



// var img = document.getElementById('img');
// var faceTracker = new tracking.ObjectTracker(['face', 'eye', 'mouth'])
// faceTracker.setStepSize(1.7)
//
// faceTracker.on('track', function(event) {
//   event.data.forEach(function(frame) {
//     drawRect(frame)
//   })
// })
//
//
// tracking.track('#myvideo', faceTracker)


}//SETUP


// function drawR(x, y, w, h) {
//   var rect = document.createElement('div')
//   document.querySelector('.demo-container').appendChild(rect)
//   rect.classList.add('rect')
//   rect.style.width = w + 'px'
//   rect.style.height = h + 'px'
//   rect.style.left = (img.offsetLeft + x) + 'px'
//   rect.style.top = (img.offsetTop + y) + 'px'
// }


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

  background(bgroundColor)

  // if(!videoFeed)

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

        var bLevel = (r + g + b)/3 //brightnessLevel

          if (bLevel < 25) {
            emoji = '🍊'  //🌚
          } else if (bLevel >=25 && bLevel < 50) {
            emoji = '👽' //💩
          } else if (bLevel >=50 && bLevel < 75) {
            emoji = '🙊'
          } else if (bLevel >=75 && bLevel < 100) {
            emoji = '🐨'
          } else if (bLevel >=100 && bLevel < 125) {
            emoji = '🙈'
          } else if (bLevel >=125 && bLevel < 150) {
            emoji = '⛅️' //🐭
          } else if (bLevel >=150 && bLevel < 175) {
            emoji = '☁️'
          } else if (bLevel >=175 && bLevel < 200) {
            emoji = '☀️'
          } else if (bLevel >=200 && bLevel <= 225) {
            emoji = '😜'
          } else if (bLevel >=225) {
            emoji = '🔥'
          }

      // if(textEmoji) { textEmoji.remove()}
      textEmoji = text(emoji, x * videoScale, y * videoScale + fontSize)
      textSize(fontSize)

      } //XPixels
    } //YPixels

  }//EMOJIFY

  if(currentEffect === 'multiFrame' && videoFeed) {
    noTint()
    multiSnaps[multiFrameCounter] = videoFeed.get()
    multiFrameCounter ++
    //41 total no of multi frames possible
    if(multiFrameCounter == 41) { multiFrameCounter = 0}
    var w = width / 4
        h = height / 4
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
