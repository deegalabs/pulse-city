export const SAMPLES_URL =
  "https://raw.githubusercontent.com/felixroos/dough-samples/main";

export const INITIAL_CODE = `// pulse.city — hit Ctrl+Enter to play
// or type a direction in the prompt below

$: s("bd*4").bank('RolandTR909').gain(.9)

$: s("~ cp ~ cp").bank('RolandTR909').room(.3).gain(.6)

$: s("hh*8").bank('RolandTR909').gain(perlin.range(.25,.5))

$: note("<c2 c2 eb2 g1>").struct("x(5,8)")
  .s('sawtooth').decay(.15).sustain(0)
  .lpf(800).lpq(10).gain(.55)

$: note("<[c4,eb4,g4] [ab3,c4,eb4]>/2")
  .s('square').decay(.3).sustain(.1).release(.4)
  .lpf(1400).gain(.25).delay(.4).delaytime(.375).delayfeedback(.5)
`;
