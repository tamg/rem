var videoFeed
var videoScale
var snaps = []
var multiSnaps = []
var multiFrameCounter = 0
var currentEffectList = ['choose effect!', 'emojify', 'emojiFaceSwap', 'emojiColorSwap', 'multiFrame']
var selectedEffect
var emojiPixel
var mainGui
var infoGui
var bgroundColor

//tracking
var colorTracker
var trackedFrame
var faceTracker
var trackedFace

//gif
var gif
var gifRecording = false
var gifBlob

function setup() {
  videoScale = 1
  bgroundColor = 'white'
  pixelDensity(1) //disregard retina display

  var canvas = createCanvas(640,480)
  videoFeed = createCapture(VIDEO)
  videoFeed.size(640/videoScale, 480/videoScale).id('myVideo')
  videoFeed.position(-1000,-1000) //hide original source instead of // videoFeed.hide()

  infoGui = QuickSettings.create(windowWidth/2 - 330, 750, "Info✌🏽")
             .setWidth(660)
             .addHTML("Created by"," <a href='http://tamrat.co' target='_blank'> @tamrrat</a> at the <a href='https://www.recurse.com/' target='_blank'>Recurse Center</a> 🐙. Don't feel comfortable turning on camera? No worries, here is the Github <a href='https://github.com/tamg/rem' target='_blank'>link</a>. No funny buisness going on here 😃💯")
             .addImage("Emojify", "/src/img/emojify2.png")
             .addImage("EmojiColorSwap", "/src/img/emojify1.png")
             .addImage("EmojiFaceSwap", "/src/img/emojify2.png")

  mainGui = QuickSettings.create(windowWidth/2 - 330, 10, "REM✌🏽")
             .setWidth(660)
             .addDropDown("💥  Allow webcam access first and choose a video effect  💥", currentEffectList, function(val){changeEffect(val.value)})
             .addElement("", canvas.elt)
             .addButton("💾 Save Photo", saveImage)
             .addButton("📹 Record GIF", recordGif)
             .addButton("🚀 Upload GIF to IMGUR", saveImage)




//Color tracking
 colorTracker = new tracking.ColorTracker(['magenta', 'yellow'])
 colorTracker.on('track', startColorTracking)
 if(videoFeed) { tracking.track('#myVideo', colorTracker) }

 //Face tracking
 faceTracker = new tracking.ObjectTracker('face')
 faceTracker.setInitialScale(4);
 faceTracker.setStepSize(2);
 faceTracker.setEdgesDensity(0.1);
 faceTracker.on('track', startFaceTracking)
 if(videoFeed) { tracking.track('#myvideo', faceTracker, { camera: true }) }

 //prepare for gif recording
 setupGif()

}//SETUP

function startColorTracking(event) {
 if (event.data.length === 0) {
   // No colors were detected in this frame.
 } else if (selectedEffect === 'emojiColorSwap'){
   event.data.forEach(function(frame) {
     trackedFrame = frame
   })
 }
}

function startFaceTracking(event) {
 if (event.data.length === 0) {
   // No colors were detected in this frame.
 } else if (selectedEffect === 'emojiFaceSwap'){
   event.data.forEach(function(frame) {
     trackedFace = frame
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

function setupGif() {
  gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: '/libraries/gif.worker.js'
  })

  gif.on('finished', function(blob) {
    // window.open(URL.createObjectURL(blob))
    gifBlob = URL.createObjectURL(blob)
    setupGif()
  })
}

function recordGif(){
  gifRecording = !gifRecording;
  console.log('gif recording is:', gifRecording);
  if (!gifRecording) {
    console.log('bout to render');
    gif.render();
  }
}

function displayGif() {
  if(!gifRecording && gifBlob) {
  createImg(gifBlob)
  }
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

        if(trackedFrame.width > 200) {
          fontSize = 200
        } else {
          fontSize = trackedFrame.width + trackedFrame.height
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

  if(selectedEffect === 'emojiFaceSwap') {
      push()
      scale(-1,1);
      image(videoFeed.get(), -width, 0)
      pop()

      if(trackedFace) {
        var fontSize
        var randEmoji = random(['😃', '😃','😃', '😃', '😃','😃','😆', '😁'])

        text( randEmoji , width - trackedFace.x - trackedFace.width, trackedFace.y + 150)
        textSize(trackedFace.width + 50)
        // rect(width - trackedFace.x - trackedFace.width, trackedFace.y , trackedFace.height, trackedFace.width)
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

      emojiPixel = text(emoji, x * videoScale, y * videoScale + fontSize)
      textSize(fontSize)

      } //XPixels
    } //YPixels

  }//EMOJIFY


  if (gifRecording && frameCount % 3 == 0) {
    // push()
    // scale(-1,1)
    // image(videoFeed.get(), -width, 0)
    // pop()
    // console.log(frameCount);
    gif.addFrame(canvas, {delay: 1, copy: true})
  }



  // if(selectedEffect === 'multiFrame' && videoFeed) {
  //   noTint()
  //   multiSnaps[multiFrameCounter] = videoFeed.get()
  //   multiFrameCounter ++
  //   //41 total no of multi frames possible
  //   if(multiFrameCounter == 41) { multiFrameCounter = 0}
  //   var w = width / 4
  //       h = height / 4
  //       x = 0
  //       y = 0
  //   for (var i = 0; i < multiSnaps.length; i++) {
  //     var index = (i + frameCount) % multiSnaps.length
  //     image(multiSnaps[index], x, y, w, h)
  //     //move to the next frame
  //     x += w
  //     if (x > width) {
  //       x = 0
  //       y = y + h
  //     }
  //   }
  // }
  //

}// DRAW
