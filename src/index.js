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
// - https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext
//   /createBuffer#Examples
// - https://stackoverflow.com/a/34709510/638546
// - https://en.wikipedia.org/wiki/List_of_pitch_intervals
//

window.AudioContext = window.AudioContext || window.webkitAudioContext;

function playSound (context, arr) {
  var buffer = context.createBuffer(1, arr.length, context.sampleRate)
  var chan = buffer.getChannelData(0)
  for (var i = 0; i < arr.length; i++) chan[i] = arr[i]
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

function linearDecay (arr) {
  var len = arr.length
  return arr.map((x, i) => {
    return x * (len - i) / len
  })
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
      decayed = linearDecay(hzs)
      chord = add(chord, decayed)
    }
    song = compose(song, chord)
  }
  return song
}

function createButton (id, handler) {
  var btn = document.getElementById(id)
  btn.addEventListener('click', handler)
  return btn
}

function createSongButton (id, scoreFn) {
  return createButton(id, () => {
    var score = scoreFn()
    var bpm = 160
    var beat = 60 / bpm // seconds
    var context = new AudioContext()
    var song = generateFromScore(context.sampleRate, beat, sineWave, score)
    playSound(context, song)
  })
}

function drawScore () {
  const VF = Vex.Flow;

  var div = document.getElementById('score');
  var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

  renderer.resize(900, 150);
  var context = renderer.getContext();

  var stave = new VF.Stave(10, 10, 400);
  stave.addClef('treble').addTimeSignature('4/4');

  stave.setContext(context).draw();

  // '(C4 G4)/8, (C4 F4)/q, (C4 F4)/q, (C4 F4)/q.'

  var notes = [
    new VF.StaveNote({clef: "treble", keys: ["c/4", "g/4"], duration: "8" }),
    new VF.StaveNote({clef: "treble", keys: ["c/4", "f/4"], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: ["c/4", "f/4"], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: ["c/4", "f/4"], duration: "qd" }).
      addDotToAll()
  ];

  var voice = new VF.Voice({num_beats:4, beat_value: 4});
  voice.addTickables(notes);

  var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);

  var stave2 = new VF.Stave(410, 10, 400);
  stave2.setContext(context).draw();

  var notes2 = [
    new VF.StaveNote({clef: "treble", keys: ["d#/4", "a#/4"], duration: "8" })
      .addAccidental(0, new VF.Accidental('#'))
      .addAccidental(1, new VF.Accidental('#')),
    new VF.StaveNote({clef: "treble", keys: ["d#/4", "g#/4"], duration: "q" })
      .addAccidental(0, new VF.Accidental('#'))
      .addAccidental(1, new VF.Accidental('#')),
    new VF.StaveNote({clef: "treble", keys: ["d#/4", "g#/4"], duration: "q" })
      .addAccidental(0, new VF.Accidental('#'))
      .addAccidental(1, new VF.Accidental('#')),
    new VF.StaveNote({clef: "treble", keys: ["d#/4", "g#/4"], duration: "qd" })
      .addAccidental(0, new VF.Accidental('#'))
      .addAccidental(1, new VF.Accidental('#'))
      .addDotToAll()
  ];

  var voice2 = new VF.Voice({num_beats: 4, beat_value: 4});
  voice2.addTickables(notes2);
  var formatter2 = new VF.Formatter().joinVoices([voice2]).format([voice2], 400);
  voice2.draw(context, stave2);
}
drawScore()

var playButton = createSongButton('play', () => {
  var m3 = 6 / 5 // Just minor third
  var M3 = 5 / 4
  var P4 = 4 / 3 // Perfect fourth
  var P5 = 3 / 2 // Perfect fifth

  var hz00 = 441 // 432 // Verdi A
  var hz03 = hz00 * m3
  var hz05 = hz00 * P4
  var hz07 = hz00 * P5
  var hz08 = hz03 * P4
  var hz10 = hz03 * P5

  return [
    [hz00, hz07],
    [hz00, hz05],
    [],
    [hz00, hz05],
    [],
    [hz00, hz05],
    [],
    [],
    [hz03, hz10],
    [hz03, hz08],
    [],
    [hz03, hz08],
    [],
    [hz03, hz08],
    [],
    []
  ]
})

var equalButton = createSongButton('equal', () => {
  // Equal temperament, 12-TET
  var hz00 = 441 // 432 // Verdi A
  var hz03 = hz00 * 1.189207
  var hz05 = hz00 * 1.334840
  var hz07 = hz00 * 1.498307
  var hz08 = hz00 * 1.587401
  var hz10 = hz00 * 1.781797

  return [
    [hz00, hz07],
    [hz00, hz05],
    [],
    [hz00, hz05],
    [],
    [hz00, hz05],
    [],
    [],
    [hz03, hz10],
    [hz03, hz08],
    [],
    [hz03, hz08],
    [],
    [hz03, hz08],
    [],
    []
  ]
})
