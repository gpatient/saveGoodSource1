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

                //0x800 = 256*8= 2^11 .......   7ff = 3.99 hz beat (8000/2048)
                var drumSpeed=0x7ff;
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
                                * ((0xa444c444 >> (t /drumSpeed & 31)) & 1) * a * 1.5
                                + (Math.floor((a * d * (t /(drumSpeed/4) & 1))) & 0xff - 0x80) * 0.1337)
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
        out = drum/3;
    return out;
}


function dsp1(t) {
  return LLT((t)*8000)/128;
} 
export function dsp(t)
{
  //return dsp1(t);

  return dsp2(t);
  
}

//change source from http://pastebin.com/TpDuf7T4

// YAY!
function dsp2(t){
  var n = sampleRate / 220;
 
  var bass_osc =
    0.324 * tri(n, t)
  + 0.052 * sin(n * 22, t)
  ;
 
  var bass_sub=0;
  var sss=1.0;
  //tu tu tu tu tu tu
  //bass_sub =sub(bass_osc, (0.5+Math.pow(sin(1.4337, t),1/2)*0.5) * (50 + (1 + Math.pow(sin(0.12, t),1/2)) * 35), t);
  //ti wa ya wa pi ya wa
  //bass_sub =sub(bass_osc, (Math.pow(sin(1.1337, t)*0.5+0.3,1/1.2)*80.5+62) *(sin(1,t)+1)+ (2230 + ( Math.pow(sin(0.22, t)*0.5+0.5,1/12)) * 2270), t);
  
  //muet muet muet put muet put
  bass_sub=sub(bass_osc, (Math.pow(sin(1.4337, t)*0.5+0.5,144/2)*0.5) * (15 + (Math.pow(sin(0.12, t)*0.5+0.5,1/2)) * 15), t);
  //good sound
  //sss=(sin(1.2,t)*0.002+0.05);
  //bass_sub=sub(bass_osc, (Math.pow(sin(1.14337*sss, t)*0.3+0.7,25/2)*1.7-0.004) * (1 + (Math.pow(sin(0.12, t)*0.5+0.5,2/12)) * 1.5), t);
  //wue wue wue ya ya ya 
  //sss=Math.pow((sin(0.634,t)*0.002+0.8),33);
  //bass_sub=sub(bass_osc, (Math.pow(sin(1.44337*sss, t)*0.3+0.7,133/2)*13.7-11.304) * (1 + (Math.pow(sin(0.22, t)*0.9+0.1,22/1)) * 11.5), t);
  
  return 0.5 * bass_sub;
 
}
 
 
var tau = 2 * Math.PI;
var abs=Math.abs; 
function sub(wave, mul, t){
  return Math.sin(wave *mul + tau * t);
}
 
function sin(x, t){
  return Math.sin(tau * t * x);
}
 
function tri(x, t){
  return Math.abs(1 - (2 * t * x) % 2) * 2 - 1;
}
