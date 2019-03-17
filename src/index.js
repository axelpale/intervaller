//
// Intervals:
// - 5:4 Just major third
// - 4:3 Perfect fourth
// - 3:2 Perfect fifth
// - 8:5 Just minor sixth
// - 5:3 Just major sixth
// - 16:9 Pythagorean minor seventh
// - 9:5 Greater just minor seventh
// - 2:1 Octave
//
// References:
// - https://stackoverflow.com/a/34709510/638546
// - https://en.wikipedia.org/wiki/List_of_pitch_intervals

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

function compose (arr1, arr2) {
  return arr1.concat(arr2)
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
