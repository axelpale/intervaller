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

function sineWaveAt (sampleRate, sampleNumber, tone) {
    var sampleFreq = sampleRate / tone
    return Math.sin(sampleNumber / (sampleFreq / (Math.PI*2)))
}

function createButton (id, handler) {
  var btn = document.getElementById(id)
  btn.addEventListener('click', handler)
  return btn
}

var playButton = createButton('play', () => {
  var context = new AudioContext()

  var arr = [], volume = 0.2, seconds = 0.5, tone = 441

  for (var i = 0; i < context.sampleRate * seconds; i++) {
      arr[i] = sineWaveAt(context.sampleRate, i, tone) * volume
  }

  playSound(context, arr)
})
