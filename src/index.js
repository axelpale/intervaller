window.AudioContext = window.AudioContext || window.webkitAudioContext;

function playSound(context, arr) {
    var buf = new Float32Array(arr.length)
    for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
    var buffer = context.createBuffer(1, buf.length, context.sampleRate)
    buffer.copyToChannel(buf, 0)
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}

var playButton = document.getElementById('play')

playButton.addEventListener('click', (ev) => {

  var context = new AudioContext();

  function sineWaveAt(sampleNumber, tone) {
      var sampleFreq = context.sampleRate / tone
      return Math.sin(sampleNumber / (sampleFreq / (Math.PI*2)))
  }

  var arr = [], volume = 0.2, seconds = 0.5, tone = 441

  for (var i = 0; i < context.sampleRate * seconds; i++) {
      arr[i] = sineWaveAt(i, tone) * volume
  }

  playSound(context, arr)
})
