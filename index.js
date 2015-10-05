//stand alone wavepot   http://zylannprods.fr/audiotoy/  from https://groups.google.com/forum/#!topic/wavepot/6-HwHaOaJEk
// save nice this source from  https://groups.google.com/forum/#!topic/wavepot/6-HwHaOaJEk

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
import dbg from 'debug';
dbg('aaa')((32.44>>1)>>1);

function LLT(t) {

        var sb, y, h, a, d, g;

        var backgroundWaveNotes= [415, 15, 23, 8 ];
        var mainInstrumentNotes= [
                [ 15, 18, 17, 17, 17, 17, 1999, 1999, 22, 22, 1999, 18, 1999, 15,
                        20, 22 ],
                [ 20, 18, 17, 17, 10, 10, 1999, 1999, 20, 22, 20, 18, 17, 18, 17,
                        10 ]];

                //0x10000=65536=8192*8  8second silence
                sb = (t > 0xffff ? 1 : 0);
                 //t*8000/(2^14)%4 t*8000 2^10=1024 2^13=8192
                 //=t/2 %4 2 second for background one array.........  (8192/8000 bpm )
                y = Math.pow(2, backgroundWaveNotes[t >> 14 & 3] / 12);

                //0x800 = 256*8= 2^11 .......
                var drumSpeed=0x12ff;
                //for drum
                // a= 1/4 beat saw evelope
                //a = 1 - ((t & 0x7ff) /  0x7ff);
                a = 1 -(t%drumSpeed)/drumSpeed;
                // d= high freq noise...value  0~2047 for hihat
                d = (( 14 * t * t ^ t) & 0x7ff);
                //0x800=256*8=2048=2^11 t*8000%2048/2047 = t%0.25   1/4 beat decay envlove... 
                g =  (t & 0x7ff) /  0x7ff;
                g = 1 - (g * g);

                //mainInstrumentNotes[t/4%2][t*8%16] / 12  8 beat.....
                h = Math.pow(2, mainInstrumentNotes[((t >> 14 & 3) > 2 ? 1 : 0) & 1][t >> 10 & 15] / 12);

                // background note........
                //t *8000/4=t*2000 2000 /2pi=300hz...... (300,301)hz saw wave  vol 64*2
                var wave = (Math.floor(y * t * 0.241) & 127 - 64)
                        + (Math.floor(y * t * 0.25) & 127 - 64) * 1.2;
                var drum = (
                               // base drum 8000*5*t %2048  (1.25,4) beat...  saw wave drum 
                                (Math.floor((Math.floor(5 * t) % drumSpeed) *a) & 255 - 127)
                                //32bit drum score 1001 0011 0010 0011 0010 0011 0010 0011   4 hz speed
                                //  bit reverse    1100 0100 1100 0100 1100 0100 1100 1001
                                * ((0x53232323 >> ( ((t /drumSpeed)) & 31)) & 1) * a * 1.0
                                //hihat 
                                + (Math.floor(d * a) & 255 - 128)
                               //   0xa444c444 is  1010 1000 1000 1000 1100 1000 1000 1000
                               //     bit reverse  0001 0001 0001 0011 0001 0001 0001 0101
                                * ((0xa444c444 >> (t /drumSpeed & 31)) & 1) * a * 1.5 + (Math.floor((a
                                                        * a * d * (t /(drumSpeed/4) & 1))) & 0xff - 0x80) * 0.1337)
                        ;//* sb;

                // 8000/2pi= 1300 hz ..... 2600hz  650 hz  (1300,2600,652,1301) hz saw wave vol 31*4  g is evelope
                var instrument =

                        ((Math.floor(h * t) & 31) + (Math.floor(h * t * 1.992) & 31)
                         + (Math.floor(h * t * .497) & 31) + (Math.floor(h * t * 0.977) & 31))
                        *sb;//* g * sb;

        
       
        var out;
        //cut value (clip) ~128 ~ 127......
        out=Math.max(Math.min((wave + drum + instrument) / 3, 127), -128);
        //out=Math.max(Math.min((drum) / 3, 127), -128);
        //out =d/2048*128;
    return out;
}


export function dsp(t) {
  return LLT((t)*8000)/128;
} 

