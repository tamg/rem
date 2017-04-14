var videoFeed
var videoScale
var snaps = []
var multiSnaps = []
var multiFrameCounter = 0
var currentEffectList = ['none', 'emojify', 'emojiFaceSwap', 'emojiColorSwap', 'multiFrame']
var selectedEffect
var emoji = ''
var emojiPixel
var mainGui
var infoGui

var bgroundColor
var fontSize

var colorTracker
var trackedFrame

function setup() {
  videoScale = 1
  bgroundColor = 'white'
  pixelDensity(1) //disregard retina display

  var canvas = createCanvas(640,480)
  videoFeed = createCapture(VIDEO)
  videoFeed.size(640/videoScale, 480/videoScale).id('myVideo')
  // videoFeed.hide()
  videoFeed.position(-1000,-1000) //hide original source

  //center it
  mainGui = QuickSettings.create(windowWidth/2 - 330, 10, "REM✌🏽")
             .setWidth(660)
             .addDropDown("💥 Enable webcam first & choose a video effect 💥", currentEffectList, function(val){changeEffect(val.value)})
             .addElement("", canvas.elt)
             .addButton("💾 Save Photo", saveImage)
             .addButton("📹 Save GIF", saveImage)
             //add a slider
             .addButton("🚀 Upload GIF to IMGUR", saveImage)
             .addHTML("Info","Created by <a href='http://tamrat.co' target='_blank'> @tamrrat</a> at the <a href='https://www.recurse.com/' target='_blank'>Recurse Center</a> 🐙. Don't feel comfortable turning on camera? No worries, here is the Github <a href='https://github.com/tamg/rem' target='_blank'>link</a>. No funny buisness going on here 😃💯")

//examples ui double tap to see examples


 colorTracker = new tracking.ColorTracker(['magenta', 'yellow'])
 //tracking
 colorTracker.on('track', startTracking)

 if(videoFeed) tracking.track('#myVideo', colorTracker)



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

function startTracking(event) {
 if (event.data.length === 0) {
   // No colors were detected in this frame.
 } else if (selectedEffect === 'emojiColorSwap'){
   event.data.forEach(function(frame) {
     trackedFrame = frame
    //  drawEmoji(frame)
   })
 }
}



function saveImage() {
  saveCanvas(canvas, 'myCanvas', 'png');
}

function changeEffect(value){
  // if(value == 'emojify') { videoScale = 16 }
  // videoFeed.size(640/videoScale, 480/videoScale)
  selectedEffect = value
}

function takeSnap(){
  selectedEffect = 'takeSnap'
  snaps.push(videoFeed.get())
  image(snaps[snaps.length - 1], 0, 0)
}


//p5 draw function called everyframe
function draw() {

  background(bgroundColor)

  if(selectedEffect === 'emojiColorSwap') {

      push()
      scale(-1,1);
      image(videoFeed.get(), -width, 0)
      pop()

      var fontSize
      var randEmoji
      if(trackedFrame) {

        if(trackedFrame > 150) {
          fontSize = 150
        } else {
          fontSize = (trackedFrame.width + trackedFrame.height) / 2
        }

        if(trackedFrame.color === 'yellow') {
          randEmoji = random(['😃', '😃','😃', '😃', '😃','😃','😆', '😁'])
        } else if(trackedFrame.color === 'magenta') {
          randEmoji = random(['😃', '😃','😃', '😃', '😃','😃','😆', '😁'])
        }

        text( randEmoji, width - trackedFrame.x - 150, trackedFrame.y + 150)
        textSize(fontSize)
        // rect(trackedFrame.x, trackedFrame.y, trackedFrame.height, trackedFrame.width)
    }
  }



  if(selectedEffect === 'emojify' && videoFeed) {

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
            emoji = '😆'  //🌚
          } else if (bLevel >=25 && bLevel < 50) {
            emoji = '👽' //💩
          } else if (bLevel >=50 && bLevel < 75) {
            emoji = '🙊'
          } else if (bLevel >=75 && bLevel < 100) {
            emoji = '💯'
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

      fontSize = 12

      // if(emojiPixel) { emojiPixel.remove()}
      emojiPixel = text(emoji, x * videoScale, y * videoScale + fontSize)
      textSize(fontSize)

      } //XPixels
    } //YPixels

  }//EMOJIFY

  if(selectedEffect === 'multiFrame' && videoFeed) {
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
