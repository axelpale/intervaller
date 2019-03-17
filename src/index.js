//
// Intervals:
// - 6:5 Just minor third
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
// - VexFlow for musical notation https://github.com/0xfe/vexflow
// - Tone.js for synths https://tonejs.github.io/
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
  var source = context.createBufferSource()
  source.buffer = buffer
  source.connect(context.destination)
  source.start(0)
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

function compose () {
  return Array.prototype.concat.apply([], arguments)
}

function createButton (id, handler) {
  var btn = document.getElementById(id)
  btn.addEventListener('click', handler)
  return btn
}

function generateFromScore (sampleRate, beatDuration, waveFn, score) {
  var i, j, beat, hz
  var song = []
  for (i = 0; i < score.length; i += 1) {
    beat = score[i]
    chord = generate(sampleRate, beatDuration, 0, 0, waveFn)
    for (j = 0; j < beat.length; j += 1) {
      hz = beat[j]
      hzs = generate(sampleRate, beatDuration, hz, 0.4, waveFn)
      chord = add(chord, hzs)
    }
    song = compose(song, chord)
  }
  return song
}

var playButton = createButton('play', () => {
  var m3 = 6 / 5 // Just minor third
  var M3 = 5 / 4
  var P4 = 4 / 3 // Perfect fourth
  var P5 = 3 / 2 // Perfect fifth

  var hz00 = 432 // Verdi A
  var hz03 = hz00 * m3
  var hz05 = hz00 * P4
  var hz07 = hz00 * P5
  var hz08 = hz03 * P4
  var hz10 = hz03 * P5

  var score = [
    [hz00, hz07],
    [hz00, hz05],
    [],
    [hz00, hz05],
    [hz00, hz05],
    [hz00, hz05],
    [],
    [],
    [hz03, hz10],
    [hz03, hz08],
    [],
    [hz03, hz08],
    [hz03, hz08],
    [hz03, hz08],
    [],
    []
  ]

  var bpm = 160
  var beatDuration = 60 / bpm // seconds
  var context = new AudioContext()
  song = generateFromScore(context.sampleRate, beatDuration, sineWave, score)
  playSound(context, song)
})
