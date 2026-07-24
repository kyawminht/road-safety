// ── Road Safety Rulebook ──
// Flat list of rules, each tagged with category + ageGroup for filtering.
import placeholderImg from '../assets/illustrations/helmet.png';
import helmet from '../assets/illustrations/helmet.png';
import sidewalk from '../assets/illustrations/sidewalk.png';
import holdhand from '../assets/illustrations/holdhand.png';
import playground from '../assets/illustrations/playground.png';
import walking1 from '../assets/illustrations/walking1.png';
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

// ── Flip card images (wrong/right pairs) ──
import WrongWalk from '../assets/wrong_sidewalk.png';
import RightWalk from '../assets/right_sidewalk.png';
import WrongImage from '../assets/wrong_walking_with_adult.png';
import RightImage from '../assets/right_walking_with_adult.png';
import WrongAlone from '../assets/wrong_walking.png';
import RightAlone from '../assets/right_walking.png';
import WrongGroup from '../assets/wrong_group.png';
import RightGroup from '../assets/right_group.png';
import WrongRain from '../assets/wrong1_umbrella.png';
import RightRain from '../assets/right_umbrella.png';
import WrongBicycle from '../assets/wrong_bicycle.png';
import RightBicycle from '../assets/right_bicycle.png';
import WrongPassenger from '../assets/wrong_passenger.png';
import RightPassenger from '../assets/right_passenger.png';
import WrongSidecar from '../assets/wrong_sidecar.png';
import RightSidecar from '../assets/right_sidecar.png';
import WrongFerry from '../assets/wrong_ferry.png';
import RightFerry from '../assets/right_ferry.png';

export const AGE_GROUPS = [
  { id: 'all',    label: 'အားလုံး' },
  { id: 'kg-g2',  label: '၅-၈ နှစ်' },
  { id: 'g3-g5',  label: '၉-၁၁ နှစ်' },
  { id: 'g6-plus', label: '၁၂+ နှစ်' },
];

export const CATEGORIES = [
  { id: 'walking',    title: { en: 'Walking',      mm: 'လမ်းလျှောက်ခြင်း' },    color: '#F97316', image: walking1 },
  { id: 'bicycle',    title: { en: 'Bicycle',      mm: 'စက်ဘီးစီးခြင်း' },      color: '#CA8A04', image: bike_ride },
  { id: 'motorcycle',  title: { en: 'Motorcycle',   mm: 'ဆိုင်ကယ်စီးခြင်း' },    color: '#7C3AED', image: mhelmet },
  { id: 'schoolbus',   title: { en: 'School Bus',   mm: 'ကျောင်းကား/ဖယ်ရီ' },  color: '#0891B2', image: wrong_ferry },
];

export const RULES = [
  // ── Walking / KG-G2 ──
  { category: 'walking', ageGroup: 'kg-g2', image: sidewalk, wrongImage: WrongWalk, rightImage: RightWalk, text: 'လူသွားစင်္ကြံပေါ်မှာပဲ လျှောက်ပါ' },
  { category: 'walking', ageGroup: 'kg-g2', image: holdhand, wrongImage: WrongImage, rightImage: RightImage, text: 'လူကြီးလက်ကို ကိုင်ထားပါ' },
  { category: 'walking', ageGroup: 'kg-g2', image: playground, wrongImage: WrongGroup, rightImage: RightGroup, text: 'ကားလမ်းပေါ် မပြေးရ' },
  { category: 'walking', ageGroup: 'kg-g2', image: zebra, text: 'လူကူးမျဉ်းကျားကနေပဲ ကူးပါ' },
  // ── Walking / G3-G5 ──
  { category: 'walking', ageGroup: 'g3-g5', image: walking, wrongImage: WrongAlone, rightImage: RightAlone, text: 'လမ်းဘေးကပ် ကားဘက်မျက်နှာမူပြီးလျှောက်ပါ' },
  { category: 'walking', ageGroup: 'g3-g5', image: bridge, text: 'တံတားကနေပဲ ကူးပါ' },
  { category: 'walking', ageGroup: 'g3-g5', image: green_light, text: 'မီးစိမ်းမှသာ ကူးပါ' },
  { category: 'walking', ageGroup: 'g3-g5', image: between, text: 'ကားကြားထဲက မထွက်ရ' },
  { category: 'walking', ageGroup: 'g3-g5', image: using_phone, text: 'ဖုန်းမကြည့်ရ' },
  // ── Walking / G6+ ──
  { category: 'walking', ageGroup: 'g6-plus', image: night_bright, text: 'ညဘက် အရောင်တောက်အင်္ကျီ ဝတ်ပါ' },
  { category: 'walking', ageGroup: 'g6-plus', image: umbrella, wrongImage: WrongRain, rightImage: RightRain, text: 'ထီးမြှင့်ဆောင်းပါ' },

  // ── Bicycle / KG-G2 ──
  { category: 'bicycle', ageGroup: 'kg-g2', image: helmet, text: 'ဦးထုပ်ဆောင်းပါ' },
  { category: 'bicycle', ageGroup: 'kg-g2', image: helmet, text: 'လူကြီးနဲ့ပဲစီးပါ' },
  { category: 'bicycle', ageGroup: 'kg-g2', image: check, text: 'ဘရိတ်စစ်ပါ' },
  { category: 'bicycle', ageGroup: 'kg-g2', image: bike_walk, text: 'လမ်းကူးရင် ဆင်းတွန်းပါ' },
  // ── Bicycle / G3-G5 ──
  { category: 'bicycle', ageGroup: 'g3-g5', image: bike_ride, wrongImage: WrongBicycle, rightImage: RightBicycle, text: 'လမ်းဘေးကပ်စီးပါ' },
  { category: 'bicycle', ageGroup: 'g3-g5', image: signal, text: 'လက်ပြအချက်သင်ပါ' },
  // ── Bicycle / G6+ ──
  { category: 'bicycle', ageGroup: 'g6-plus', image: li, text: 'ညဘက် မီးတပ်စီးပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: black, text: 'အရောင်ဖျော့အင်္ကျီ ဝတ်ပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: phone, text: 'ဖုန်းနားမထောင်ရ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: slow, text: 'လမ်းဆုံမှာ နှေးပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', image: fastern, text: 'မေးကြိုးချိတ်ပါ' },

  // ── Motorcycle / G6-G9 (rider) ──
  { category: 'motorcycle', ageGroup: 'g6-plus', image: mhelmet, wrongImage: WrongPassenger, rightImage: RightPassenger, text: 'ဦးထုပ်မဖြစ်မနေဆောင်းပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: three, wrongImage: WrongSidecar, rightImage: RightSidecar, text: 'လူ ၂ ယောက်ထက် မစီးရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: mphone, text: 'ဖုန်းမကိုင်ရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: km, text: 'အမြန်နှုန်းကျော်မစီးရ' },

  // ── Motorcycle / G10+ ──
  { category: 'motorcycle', ageGroup: 'g6-plus', image: mnight, text: 'ညဘက် ရှေ့မီးဖွင့်ပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: alcohol, text: 'အရက်မူးရင် မမောင်းရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: kid, text: 'ကလေးကိုရှေ့မတင်ရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', image: horn, text: 'လမ်းဆုံမှာ နှေးပါ' },

  // ── School Bus / KG-G2 ──
  { category: 'schoolbus', ageGroup: 'kg-g2', image: wrong_ferry, wrongImage: WrongFerry, rightImage: RightFerry, text: 'ခေါင်းလက် မထုတ်ရ' },
  { category: 'schoolbus', ageGroup: 'kg-g2', image: distrupt, text: 'မောင်းသူကို မနှောက်ရ' },
  // ── School Bus / G3-G5 ──
  { category: 'schoolbus', ageGroup: 'g3-g5', image: lo, text: 'တန်းစီပြီးတက်ပါ' },
  { category: 'schoolbus', ageGroup: 'g3-g5', image: stop, text: 'ကားသွားမှ ကူးပါ' },
  // ── School Bus / G6+ ──
  { category: 'schoolbus', ageGroup: 'g6-plus', image: stand, text: 'တံခါးဝမှာ မရပ်ရ' },
  { category: 'schoolbus', ageGroup: 'g6-plus', image: driver, text: 'မောင်းသူကို ကြည့်ပါ' },
];
