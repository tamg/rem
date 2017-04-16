
var canvas
var mainGui
var bgroundColor

var videoFeed
var videoScale
var emojiPixel

var gif
var gifRecording = false
var gifBlob
var gifNumber = 0

function setup() {
  pixelDensity(1) //disregard retina display
  videoScale = 16 //draw 1/16 the size of the original video
  bgroundColor = 'white'

  canvas = createCanvas(640,480)

  //request video media access
  navigator.mediaDevices.getUserMedia({ audio: false, video: true})
                        .then(accessGranted)
                        .catch(error)

  mainGui = QuickSettings.create(windowWidth/2 - 330, 10, "REM✌🏽")
             .setWidth(660)
             .addHTML("💥  Allow webcam access first and emojify yourself!  💥", "Don't feel comfortable turning on camera? No worries, here is the Github <a href='https://github.com/tamg/rem' target='_blank'>link</a>. <br/> No funny buisness going on here 😃 <a href='http://www.tamrat.co/rem-emojifier' target='_blank'>Here are some of the example outputs</a> 💯 Created by <a href='http://tamrat.co' target='_blank'> @tamrrat</a> at the <a href='https://www.recurse.com/' target='_blank'>Recurse Center</a> 🐙")
             .addElement("", canvas.elt)
             .addButton("💾 Save Photo", saveImage)
             .addButton("📹 Record GIF", recordGif)
             .addHTML("Click Record GIF to start/stop recording and link to the gif will appear down here","")

 //prepare for gif recording
 setupGif()

}//SETUP

function accessGranted(stream) {
  videoFeed = createCapture(VIDEO)
  videoFeed.size(640/videoScale, 480/videoScale).id('myVideo')
  videoFeed.hide()
}

function error(error) {
  if (error.name === 'PermissionDeniedError') {
    console.error('Permissions have not been granted to use camera')
  }
  console.error('getUserMedia error: ' + error.name, error)
}

function saveImage() {
  saveCanvas(canvas, 'myCanvas', 'png')
}

function setupGif() {
  gif = new GIF({
    workers: 4,
    quality: 10,
    workerScript: '/libraries/gif.worker.js'
  })

  gif.on('finished', function(blob) {
    // window.open(URL.createObjectURL(blob))
    gifBlob = URL.createObjectURL(blob)
    displayGif(gifBlob)
    setupGif()
  })
}

function recordGif(){
  gifRecording = !gifRecording;
  console.log('gif recording is:', gifRecording);
  if (!gifRecording) {
    gif.render()
  }
}

function displayGif() {
  if(!gifRecording && gifBlob) {
    gifNumber++
    mainGui.addHTML("😎", "<a href='" + gifBlob + "' target='_blank'> Gif Number " + gifNumber + "</a>" )
  }

}

//p5 draw function called everyframe
function draw() {

  background(bgroundColor) //redraw/clear background every frame

  if(videoFeed) {

    videoFeed.loadPixels() //get pixels from video feed
    loadPixels() //load canvas pixels

    if(videoFeed.pixels.length) { // Check if videoFeed has loaded
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

      fontSize = 16

      emojiPixel = text(emoji, x * videoScale, y * videoScale + fontSize)
      textSize(fontSize)

        } //XPixels
      } //YPixels
    } else { // Check if videoFeed has loaded
      text('loading...😜😘', width/3, height/2)
      textSize(40)
    }

  } else { //start applying effect only if video access had been granted
    text('No Video...😐😡😏', width/3, height/2)
    textSize(40)
  }

  if (gifRecording && frameCount % 3 == 0) { //start adding gif frames to the current recording
    gif.addFrame(canvas, {delay: 1, copy: true})
  }

}// DRAW
