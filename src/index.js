//
// References:
// - https://stackoverflow.com/a/34709510/638546
//

window.AudioContext = window.AudioContext || window.webkitAudioContext;

function playSound (context, arr) {
  var buf = new Float32Array(arr.length)
  for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
  var buffer = context.createBuffer(1, buf.length, context.sampleRate)
  buffer.copyToChannel(buf, 0)
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

function sineWave (sampleRate, sampleNumber, tone) {
  // Return sine wave value at sampleNumber
  var sampleFreq = sampleRate / tone
  return Math.sin(sampleNumber / (sampleFreq / (Math.PI*2)))
}

function generate (sampleRate, seconds, tone, volume, waveFn) {
  var arr = []
  for (var i = 0; i < sampleRate * seconds; i++) {
    arr[i] = waveFn(sampleRate, i, tone) * volume
  }
  return arr
}

function add (arr1, arr2) {
  return arr1.map((x, i) => {
    return x + arr2[i]
  })
}

function multiply (arr, multiplier) {
  return arr.map(x => x * multiplier)
}

function createButton (id, handler) {
  var btn = document.getElementById(id)
  btn.addEventListener('click', handler)
  return btn
}

var playButton = createButton('play', () => {
  var context = new AudioContext()

  var vol = 0.2
  var halfSec = 0.5

  var verdiA = 432
  var fifth = verdiA * 3 / 2

  var a = generate(context.sampleRate, halfSec, verdiA, vol, sineWave)
  var b = generate(context.sampleRate, halfSec, fifth, vol, sineWave)

  var c = add(a, b)

  playSound(context, c)
})
