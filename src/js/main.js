var videoFeed
var videoContainer
var effectDisplay
var btn
var snaps = []
var currentEffect = ''

function setup() {
  var canvas = createCanvas(620,480)
  videoFeed = createCapture(VIDEO)
  videoFeed.hide()

  //create effect buttons
  var btnContainer = createP('').addClass('btn-container')
  var e1 = createP('Effect 1').addClass('btn').id('effect1').parent(btnContainer)
  var e2 = createP('snap!').addClass('btn').id('effect2').parent(btnContainer)

  //attch effects to buttons
  e1.mousePressed(streamBlue)
  e2.mousePressed(takeSnap)

}

function logg(){
  console.log('clickk');
}

function streamBlue(){
  currentEffect = 'streamBlue'
}

function takeSnap(){
  currentEffect = 'takeSnap'
  tint(color('#e36900'))
  snaps.push(videoFeed.get())
  image(snaps[snaps.length - 1], 0, 0)
}

//p5 draw function called everyframe
function draw() {

if(currentEffect === 'streamBlue') {
  tint('#9e2165')
  image(videoFeed, 0 ,0)
}


}
