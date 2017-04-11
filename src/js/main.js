var videoFeed
var videoContainer
var effectDisplay
var btn
var snaps = []
var multiSnaps = []
var multiFrameCounter = 0
var currentEffect = ''

function setup() {
  var canvas = createCanvas(640,480)
  videoFeed = createCapture(VIDEO)
  videoFeed.hide()
  // videoFeed.showControls()

  //create effect buttons
  var btnContainer = createDiv('').addClass('btn-container')

  var emojify = createP('Emogify').addClass('btn').id('emojify').parent(btnContainer)
  var snap = createP('Snap!').addClass('btn').id('takeSnap').parent(btnContainer)
  var multiFrame = createP('Multi-Frame').addClass('btn').id('multiFrame').parent(btnContainer)

  //attach effects to buttons
  emojify.mousePressed(changeEffect)
  snap.mousePressed(takeSnap)
  multiFrame.mousePressed(changeEffect)


  // var emoji = createP('😢').position(width / 2, height / 2).style('font-size', 24)
}


function changeEffect(event){
  currentEffect = event.target.id
  console.log(currentEffect);
}

function takeSnap(){
  currentEffect = 'takeSnap'
  snaps.push(videoFeed.get())
  image(snaps[snaps.length - 1], 0, 0)
}

//p5 draw function called everyframe
function draw() {


if(currentEffect === 'emojify') {
  clear()
  image(videoFeed, 0 ,0)
}


if(currentEffect === 'multiFrame' && videoFeed) {
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
}


// tint(random(255),random(255), random(255))
