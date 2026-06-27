import WrongImage from '../assets/wrong_walking_with_adult.png';
import RightImage from '../assets/right_walking_with_adult.png';
import RightAlone from '../assets/right_walking.png';
import WrongAlone from '../assets/wrong_walking.png';
import WrongHelmet from '../assets/wrong_helmet.png';
import RightHelmet from '../assets/right_helmet.png';
import RightSidecar from '../assets/right_sidecar.png';
import WrongSidecar from '../assets/wrong_sidecar.png';
import WrongBicycle from '../assets/wrong_bicycle.png';
import RightBicycle from '../assets/right_bicycle.png';
import RightPassenger from '../assets/right_passenger.png';
import WrongPassenger from '../assets/wrong_passenger.png';
import WrongWalk from '../assets/wrong_sidewalk.png';
import RightWalk from '../assets/right_sidewalk.png';
import RightFerry from '../assets/right_ferry.png';
import WrongFerry from '../assets/wrong_ferry.png';
import WrongGroup from '../assets/wrong_group.png';
import RightGroup from '../assets/right_group.png';
import RightRain from '../assets/right_umbrella.png';
import WrongRain from '../assets/wrong1_umbrella.png';




export const TOPICS = [
  { id: "walking", title: "လူသွားစင်္ကြံ", emoji: "🚶‍♂️" },
  { id: "helmet", title: "ဦးထုပ်ဆောင်းခြင်း", emoji: "⛑️" },
  { id: "sidecar", title: "ဘေးတွဲစီးနည်း", emoji: "🛵" },
  { id: "bicycle", title: "စက်ဘီးစီးနည်း", emoji: "🚲" },
  { id: "tricycle", title: "ဆိုင်ကယ်စီးနည်း", emoji: "🛺" },
];

// All cards use the same two real PNG images:
// - Wrong: child walking on the road side (unsafe)
// - Right: child walking on the safe side with adult

export const FLIP_CARDS = [
  // ── Walking ──

    {
    id: "tricycle-2",
    topicId: "tricycle",
    frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "ဘေးတွဲပေါ်တွင် လူများလွန်းနေသည်",
    backVisual: "ဘေးတွဲပေါ်တွင် လုံခြုံစွာ စီးနေသည်",
    shortRule: "သင့်တင့် ရုံသာ စီးပါ",
    wrongImage: WrongSidecar,
    rightImage: RightSidecar,
  },

  {
    id: "walking-1",
    topicId: "walking",
   frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "ကားလမ်းပေါ်မှာ လမ်းလျှောက်နေသည်",
    backVisual: "လူသွားစင်္ကြံပေါ်မှာ လုံခြုံစွာ လျှောက်နေသည်",
    shortRule: "လူသွားစင်္ကြံပေါ်မှာ လမ်းလျှောက်ပါ",
    wrongImage: WrongWalk,
    rightImage: RightWalk,
  },

  {
    id: "walking-3",
    topicId: "walking",
   frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "ကလေးက ကားလမ်းဘက်မှာ လျှောက်နေသည်",
    backVisual: "ကလေးက လမ်းဘေးဘက်မှာ လုံခြုံစွာ လျှောက်နေသည်",
    shortRule: "ကလေးကို လမ်းဘေးဘက်မှာ ထားပါ",
    wrongImage: WrongImage,
    rightImage: RightImage,
  },
  {
    id: "walking-4",
    topicId: "walking",
    frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "ကားကို ကျောပေးပြီး လျှောက်နေသည်",
    backVisual: "ကားလာသောဘက်ကို မျက်နှာမူ၍ လျှောက်နေသည်",
    shortRule: "ကားလာသောဘက်ကို မျက်နှာမူ၍ လျှောက်ပါ",
    wrongImage: WrongAlone,
    rightImage: RightAlone,
  },

 

  // ── Bicycle ──
  {
    id: "bicycle-1",
    topicId: "bicycle",
     frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "စက်ဘီးကို ဘေးချင်းယှဉ်ပြီး စီးနေသည်",
    backVisual: "စက်ဘီးကို တန်းစီပြီး စီးနေသည်",
    shortRule: "တန်းစီစီးပါ",
    wrongImage: WrongBicycle,
    rightImage: RightBicycle,
  },
  {
    id: "bicycle-2",
    topicId: "tricycle",
    frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "ဦးထုပ်မဆောင်းဘဲ ဆိုင်ကယ်စီးနေသည်",
    backVisual: "ဦးထုပ်ဆောင်းပြီး  ဆိုင်ကယ်စီးနေသည်",
    shortRule: "ဆိုင်ကယ်စီးလျှင် ဦးထုပ်ဆောင်းပါ",
    wrongImage: WrongPassenger,
    rightImage: RightPassenger,
  },

   {
    id: "ferry-1",
    topicId: "ferry",
    frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "ဖယ်ရီကားနောက်ခန်းမှ ခေါင်းနှင့် လက်များကို အပြင်ထုတ်ထားသည်",
    backVisual: "ကားစီးနေစဉ် ခေါင်းနှင့် လက်များကို ကားအတွင်း၌သာ ထားရှိသည်",
    shortRule: "ဖယ်ရီစီးလျှင် ခေါင်း သို့မဟုတ် လက်များကို အပြင်မထုတ်ရ",
    wrongImage: WrongFerry,
    rightImage: RightFerry,
  },

  {
    id: "walking-5",
    topicId: "walking",
    frontLabel: "အမှား",
    backLabel: "အမှန်",
    frontVisual: "သူငယ်ချင်းများနှင့် လမ်းဘေးတွင် စနောက်ပြေးလွှားနေသည်",
    backVisual: "လမ်းဘေးတွင် ဆော့ကစားခြင်းမပြုဘဲ တန်းစီလျှောက်သည်",
    shortRule: "လမ်းပေါ်တွင် စနောက်ဆော့ကစားခြင်း မပြုရ",
    wrongImage: WrongGroup,
    rightImage: RightGroup,
  },
   {
    id: "rain-1",
    topicId: "walking",
    frontLabel: "အမှား",
    frontVisual: "မိုးရွာစဉ် ထီးကို ငုံ့ဆောင်းထား၍ ရှေ့လမ်းကို မမြင်ရပါ",
    backVisual: "ရှေ့လမ်းကို မြင်ရအောင် ထီးကို အပေါ်သို့ မြှင့်ဆောင်းထားသည်",
    shortRule: "မိုးရွာစဉ် လမ်းလျှောက်ပါက ထီးဆောင်းထားသော်လည်း ရှေ့ကို ကောင်းစွာကြည့်ပါ",
    wrongImage: WrongRain,
    rightImage: RightRain,
  }
];
