// ── Road Safety Rulebook ──
// Flat list of rules, each tagged with category + ageGroup for filtering.
import placeholderImg from '../assets/illustrations/helmet.png';
import helmet from '../assets/illustrations/helmet.png';
import sidewalk from '../assets/illustrations/sidewalk.png';
import holdhand from '../assets/illustrations/holdhand.png';
import playground from '../assets/illustrations/playground.png';
import crossing from '../assets/illustrations/crossing.png';
import zebra from '../assets/illustrations/zebra.png';
import bridge from '../assets/illustrations/bridge.png';
import between from '../assets/illustrations/between.png';
import using_phone from '../assets/illustrations/using_phone.png';
import night_bright from '../assets/illustrations/night_bright.png';
import ride_with_adult from '../assets/illustrations/using_phone.png';
import check from '../assets/illustrations/check.png';
import bike_walk from '../assets/illustrations/bike_walk.png';
import green_light from '../assets/illustrations/green_light.png';
import bike_ride from '../assets/illustrations/bike_side.png';
import signal from '../assets/illustrations/signal.png';
import phone from '../assets/illustrations/phone.png';
import night1 from '../assets/illustrations/night1.png';
import light from '../assets/illustrations/light.png';
import umbrella from '../assets/illustrations/umbrella.png';
import li from '../assets/illustrations/li.png';
import black from '../assets/illustrations/black.png';
import fastern from '../assets/illustrations/fastern.png';
import slow from '../assets/illustrations/slow-down.png';
import mhelmet from '../assets/illustrations/mhelmet.png';
import three from '../assets/illustrations/3.png';
import km from '../assets/illustrations/40km.png';
import mphone from '../assets/illustrations/mphone.png';
import stand from '../assets/illustrations/stand.png';
import alcohol from '../assets/illustrations/alcohol.png';
import mnight from '../assets/illustrations/mlight.png';
import horn from '../assets/illustrations/horn.png';
import kid from '../assets/illustrations/kid.png';
import driver from '../assets/illustrations/driver.png';
import wrong_ferry from '../assets/illustrations/wrong_ferry.png';
import running from '../assets/illustrations/running.png';
import distrupt from '../assets/illustrations/distrupt.png';
import stop from '../assets/illustrations/stop.png';
import walking from '../assets/illustrations/walking.png';
import lo from '../assets/illustrations/2.png';



export const AGE_GROUPS = [
  { id: 'all',    label: 'အားလုံး' },
  { id: 'kg-g2',  label: '၅-၈ နှစ်' },
  { id: 'g3-g5',  label: '၉-၁၁ နှစ်' },
  { id: 'g6-plus', label: '၁၂+ နှစ်' },
];

export const CATEGORIES = [
  { id: 'walking',    title: 'လမ်းလျှောက်ခြင်း စည်းကမ်းများ',       color: '#F97316' },
  { id: 'bicycle',    title: 'စက်ဘီးစီးခြင်း စည်းကမ်းများ',         color: '#CA8A04' },
  { id: 'motorcycle',  title: 'ဆိုင်ကယ်စီးခြင်း စည်းကမ်းများ',       color: '#7C3AED' },
  { id: 'schoolbus',   title: 'ကျောင်းကား/ဖယ်ရီ စည်းကမ်းများ',     color: '#0891B2' },
];

export const RULES = [
  // ── Walking / KG-G2 ──
  { category: 'walking', ageGroup: 'kg-g2', image: sidewalk, text: 'လူသွားစင်္ကြံပေါ်မှာ အမြဲလမ်းလျှောက်ပါ' },
  { category: 'walking', ageGroup: 'kg-g2', image: holdhand, text: 'လမ်းမကူးခင် လူကြီးလက်ကို အမြဲကိုင်ထားပါ' },
  { category: 'walking', ageGroup: 'kg-g2', image: playground, text: 'ကားလမ်းပေါ် ဘယ်တော့မှ မပြေးရ၊ မဆော့ရ' },
  { category: 'walking', ageGroup: 'kg-g2', image: crossing, text: 'လမ်းကူးတဲ့အခါ "ရပ်-ကြည့်-နားထောင်-ကူး" လုပ်ပါ' },
  { category: 'walking', ageGroup: 'kg-g2', image: zebra, text: 'ကားလမ်းကူးရင် လူကူးမျဉ်းကျားကနေပဲ ကူးပါ' },
  // ── Walking / G3-G5 ──
  { category: 'walking', ageGroup: 'g3-g5', image: walking, text: 'လူသွားစင်္ကြံမရှိရင် လမ်းဘေးစွန်းကနေ ကားလာတဲ့ဘက်ကို မျက်နှာမူပြီး လျှောက်ပါ' },
  { category: 'walking', ageGroup: 'g3-g5', image: bridge, text: 'လမ်းကူးတံတားရှိရင် တံတားကနေပဲ ကူးပါ' },
  { category: 'walking', ageGroup: 'g3-g5', image: green_light, text: 'မီးပွိုင့်ရှိရင် လူကူးမီးစိမ်းမှသာ ကူးပါ' },
  { category: 'walking', ageGroup: 'g3-g5', image: between, text: 'ကားရပ်ထားတဲ့ကြားထဲက ဘယ်တော့မှ မထွက်ရ' },
  { category: 'walking', ageGroup: 'g3-g5', image: using_phone, text: 'လမ်းလျှောက်ရင်း ဖုန်းမကြည့်ရ၊ နားကြပ်မတပ်ရ' },
  // ── Walking / G6+ ──
  { category: 'walking', ageGroup: 'g6-plus', image: night_bright, text: 'ညအချိန်လမ်းလျှောက်ရင် အရောင်ဖျော့တဲ့အင်္ကျီ ဝတ်ပါ' },
  { category: 'walking', ageGroup: 'g6-plus', image: umbrella, text: 'မိုးရွာစဉ် ထီးကို အပေါ်မြှင့်ဆောင်းပါ၊ ရှေ့ကို ရှင်းရှင်းမြင်ရပါစေ' },

  // ── Bicycle / KG-G2 ──
  { category: 'bicycle', ageGroup: 'kg-g2', image: helmet, text: 'စက်ဘီးစီးရင် ဦးထုပ်ဆောင်းပါ' },
  { category: 'bicycle', ageGroup: 'kg-g2', image: helmet, text: 'လူကြီးနဲ့အတူပဲ စီးပါ၊ တစ်ယောက်တည်းမစီးရ' },
  { category: 'bicycle', ageGroup: 'kg-g2', image: check, text: 'စက်ဘီးမစီးခင် ဘရိတ်နဲ့ဘီးကို စစ်ဆေးပါ' },
  { category: 'bicycle', ageGroup: 'kg-g2', image: bike_walk, text: 'လမ်းကူးတဲ့အခါ စက်ဘီးပေါ်ကဆင်းပြီး တွန်းကူးပါ' },
  // ── Bicycle / G3-G5 ──
  { category: 'bicycle', ageGroup: 'g3-g5', image: bike_ride, text: 'စက်ဘီးကို လမ်းဘေးကပ်စီးပါ၊ လမ်းအလယ်မှာ မစီးရ' },
  { category: 'bicycle', ageGroup: 'g3-g5', image: signal, text: 'လက်ပြအချက်ပြတတ်အောင်သင်ယူပါ — ဘယ်ကွေ့ ဘယ်လက်ထောင်၊ ညာကွေ့ ညာလက်ထောင်' },
  // ── Bicycle / G6+ ──
  { category: 'bicycle', ageGroup: 'g6-plus', image: li, text: 'ညအချိန်စီးရင် ရှေ့မီးဖြူ၊ နောက်မီးနီ တပ်ဆင်ပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: black, text: 'အနက်ရောင်အင်္ကျီနဲ့ ညအချိန်မစီးရ၊ အရောင်ဖျော့တဲ့အင်္ကျီ ဝတ်ပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: phone, text: 'စက်ဘီးစီးရင်း ဖုန်းနားထောင်တာ၊ ဖုန်းကြည့်တာ မလုပ်ရ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: slow, text: 'လမ်းဆုံနဲ့ လမ်းကွေ့တွေမှာ အရှိန်လျှော့ပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: fastern, text: 'ဦးထုပ်ကို မေးသိုင်းကြိုး သေချာချိတ်ပါ' },

  // ── Motorcycle / G6-G9 (rider) ──
  { category: 'motorcycle', ageGroup: 'g6-plus', image: mhelmet, text: 'ဆိုင်ကယ်စီးတိုင်း ဦးထုပ်ဆောင်းပါ — မေးသိုင်းကြိုးကို သေချာချိတ်ပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: three, text: 'ဆိုင်ကယ်ပေါ်မှာ လူ ၂ ယောက်ထက်ပိုမစီးရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: mphone, text: 'ဆိုင်ကယ်မောင်းရင်း ဖုန်းမကိုင်ရ၊ ဖုန်းမကြည့်ရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: km, text: 'သတ်မှတ်အမြန်နှုန်းထက် မကျော်ရ' },

  // ── Motorcycle / G10+ ──
  { category: 'motorcycle', ageGroup: 'g6-plus', image: mnight, text: 'ညအချိန်ဆိုင်ကယ်စီးရင် ရှေ့မီးဖွင့်ပါ၊ နောက်မီးပါအောင်စစ်ပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: alcohol, text: 'အရက်သောက်ပြီး ဆိုင်ကယ်မမောင်းရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: kid, text: 'ကလေးငယ်ကို ဆိုင်ကယ်ရှေ့မှာ မတင်ရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: horn, text: 'လမ်းဆုံတိုင်းမှာ အရှိန်လျှော့ပါ၊ ဟွန်းတီးပါ' },

  // ── School Bus / KG-G2 ──
  { category: 'schoolbus', ageGroup: 'kg-g2', image: wrong_ferry, text: 'လက်နဲ့ခေါင်းကို ပြတင်းပေါက်အပြင်ကို မထုတ်ရ' },
  { category: 'schoolbus', ageGroup: 'kg-g2', image: distrupt, text: 'ကားမောင်းသူကို အနှောက်အယှက်မပေးရ' },
  // ── School Bus / G3-G5 ──
  { category: 'schoolbus', ageGroup: 'g3-g5', image: lo, text: 'ကားပေါ်တက်တဲ့အခါ တန်းစီပြီးတက်ပါ၊ မတွန်းမဆောင့်ရ' },
  { category: 'schoolbus', ageGroup: 'g3-g5', image: stop, text: 'ကားထွက်သွားတဲ့အထိ စောင့်ပြီးမှ လမ်းကူးပါ' },
  // ── School Bus / G6+ ──
  { category: 'schoolbus', ageGroup: 'g6-plus', image: stand, text: 'ကားတံခါးဝမှာ ရပ်စီးတာ၊ ချိတ်ဆွဲစီးတာ လုံးဝမလုပ်ရ' },
  { category: 'schoolbus', ageGroup: 'g6-plus', image: driver, text: 'ကားမစီးခင် ယာဉ်မောင်းက ယာဉ်စည်းကမ်းလိုက်နာမှုရှိမရှိ သတိထားကြည့်ပါ' },
];
