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
// Tools:
// - VexFlow https://github.com/0xfe/vexflow
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

  var verdiAHz = 432
  var fifthHz = verdiAHz * 3 / 2
  var fourthHz = verdiAHz * 4 / 3

  var base = generate(context.sampleRate, halfSec, verdiAHz, vol, sineWave)
  var s1 = generate(context.sampleRate, halfSec, fifthHz, vol, sineWave)
  var fifth = add(base, s1)

  var s2 = generate(context.sampleRate, halfSec, fourthHz, vol, sineWave)
  var fourth = add(base, s2)

  var c = compose(fifth, fourth)
  playSound(context, c)
})
