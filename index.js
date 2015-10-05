//stand alone wavepot   http://zylannprods.fr/audiotoy/  from https://groups.google.com/forum/#!topic/wavepot/6-HwHaOaJEk
// save nice source from  https://groups.google.com/forum/#!topic/wavepot/6-HwHaOaJEk

/*!
 *  @name saveGoodSource1
 * Welcome to Long Line Theory
 * ------------------
 *
 * A start of a human readable port of a well done bytebeat findable here : http://www.pouet.net/topic.php?which=8357&page=13
 * Made readable by @Eiyeron
 * Enjoy!
 *

 */

function LLT(t) {

        var sb, y, h, a, d, g;

        var backgroundWaveNotes= [ 15, 15, 23, 8 ];
        var mainInstrumentNotes= [
                [ 15, 18, 17, 17, 17, 17, 999, 999, 22, 22, 999, 18, 999, 15,
                        20, 22 ],
                [ 20, 18, 17, 17, 10, 10, 999, 999, 20, 22, 20, 18, 17, 18, 17,
                        10 ]];

                sb = (t > 0xffff ? 1 : 0);

                y = Math.pow(2, backgroundWaveNotes[t >> 14 & 3] / 12);

                a = 1 - ((t & 0x7ff) /  0x7ff);
                d = (( 14 * t * t ^ t) & 0x7ff);

                g =  (t & 0x7ff) /  0x7ff;
                g = 1 - (g * g);

                h = Math.pow(2, mainInstrumentNotes[((t >> 14 & 3) > 2 ? 1 : 0) & 1][t >> 10 & 15] / 12);

                var wave = (Math.floor(y * t * 0.241) & 127 - 64)
                        + (Math.floor(y * t * 0.25) & 127 - 64) * 1.2;
                var drum = (

                                (Math.floor((Math.floor(5 * t) & 0x7ff) * a) & 255 - 127)
                                * ((0x53232323 >> (t >> 11 & 31)) & 1) * a * 1.0

                                + (Math.floor(d * a) & 255 - 128)
                                * ((0xa444c444 >> (t >> 11 & 31)) & 1) * a * 1.5 + (Math.floor((a
                                                        * a * d * (t >> 9 & 1))) & 0xff - 0x80) * 0.1337)
                        * sb;

                var instrument =

                        ((Math.floor(h * t) & 31) + (Math.floor(h * t * 1.992) & 31)
                         + (Math.floor(h * t * .497) & 31) + (Math.floor(h * t * 0.977) & 31))
                        * g * sb;

        
    return Math.max(Math.min((wave + drum + instrument) / 3, 127), -128);
}


export function dsp(t) {
  return LLT(t*8000)/128;
} 

