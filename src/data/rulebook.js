// ── Road Safety Rulebook ──
// Flat list of rules, each tagged with category + ageGroup for filtering.

export const AGE_GROUPS = [
  { id: 'all',    label: 'အားလုံး' },
  { id: 'kg-g2',  label: 'KG - Grade 2',  age: '၅-၈ နှစ်' },
  { id: 'g3-g5',  label: 'Grade 3 - 5',   age: '၉-၁၁ နှစ်' },
  { id: 'g6-plus', label: 'Grade 6+',      age: '၁၂+ နှစ်' },
];

export const CATEGORIES = [
  { id: 'walking',   icon: '🚶‍♂️', title: 'လမ်းလျှောက်ခြင်း စည်းကမ်းများ',       color: '#F97316' },
  { id: 'bicycle',   icon: '🚲',   title: 'စက်ဘီးစီးခြင်း စည်းကမ်းများ',         color: '#CA8A04' },
  { id: 'motorcycle', icon: '🏍️',   title: 'ဆိုင်ကယ်စီးခြင်း စည်းကမ်းများ',       color: '#7C3AED' },
  { id: 'schoolbus',  icon: '🚌',   title: 'ကျောင်းကား/ဖယ်ရီ စည်းကမ်းများ',     color: '#0891B2' },
];

export const RULES = [
  // ── Walking / KG-G2 ──
  { category: 'walking', ageGroup: 'kg-g2', text: 'လူသွားစင်္ကြံပေါ်မှာ အမြဲလမ်းလျှောက်ပါ' },
  { category: 'walking', ageGroup: 'kg-g2', text: 'လမ်းမကူးခင် လူကြီးလက်ကို အမြဲကိုင်ထားပါ' },
  { category: 'walking', ageGroup: 'kg-g2', text: 'ကားလမ်းပေါ် ဘယ်တော့မှ မပြေးရ၊ မဆော့ရ' },
  { category: 'walking', ageGroup: 'kg-g2', text: 'လမ်းကူးတဲ့အခါ "ရပ်-ကြည့်-နားထောင်-ကူး" လုပ်ပါ' },
  { category: 'walking', ageGroup: 'kg-g2', text: 'ကားလမ်းကူးရင် လူကူးမျဉ်းကျားကနေပဲ ကူးပါ' },
  // ── Walking / G3-G5 ──
  { category: 'walking', ageGroup: 'g3-g5', text: 'လူသွားစင်္ကြံမရှိရင် လမ်းဘေးစွန်းကနေ ကားလာတဲ့ဘက်ကို မျက်နှာမူပြီး လျှောက်ပါ' },
  { category: 'walking', ageGroup: 'g3-g5', text: 'လမ်းကူးတံတားရှိရင် တံတားကနေပဲ ကူးပါ' },
  { category: 'walking', ageGroup: 'g3-g5', text: 'မီးပွိုင့်ရှိရင် လူကူးမီးစိမ်းမှသာ ကူးပါ' },
  { category: 'walking', ageGroup: 'g3-g5', text: 'ကားရပ်ထားတဲ့ကြားထဲက ဘယ်တော့မှ မထွက်ရ' },
  { category: 'walking', ageGroup: 'g3-g5', text: 'လမ်းလျှောက်ရင်း ဖုန်းမကြည့်ရ၊ နားကြပ်မတပ်ရ' },
  // ── Walking / G6+ ──
  { category: 'walking', ageGroup: 'g6-plus', text: 'ညအချိန်လမ်းလျှောက်ရင် အရောင်ဖျော့တဲ့အင်္ကျီ ဝတ်ပါ' },
  { category: 'walking', ageGroup: 'g6-plus', text: 'မိုးရွာစဉ် ထီးကို အပေါ်မြှင့်ဆောင်းပါ၊ ရှေ့ကို ရှင်းရှင်းမြင်ရပါစေ' },
  { category: 'walking', ageGroup: 'g6-plus', text: 'လမ်းဘေးပါကင်ထွက်တဲ့ကားတွေကို သတိထားပါ' },
  { category: 'walking', ageGroup: 'g6-plus', text: 'သူငယ်ချင်းတွေနဲ့ လမ်းလျှောက်ရင် တစ်တန်းတည်းလျှောက်ပါ' },
  { category: 'walking', ageGroup: 'g6-plus', text: 'လမ်းဖြတ်ကူးရင် ဘယ်-ညာ-ဘယ် ၂ ကြိမ်ကြည့်ပါ' },

  // ── Bicycle / KG-G2 ──
  { category: 'bicycle', ageGroup: 'kg-g2', text: 'စက်ဘီးစီးရင် ဦးထုပ်ဆောင်းပါ' },
  { category: 'bicycle', ageGroup: 'kg-g2', text: 'လူကြီးနဲ့အတူပဲ စီးပါ၊ တစ်ယောက်တည်းမစီးရ' },
  { category: 'bicycle', ageGroup: 'kg-g2', text: 'ကားလမ်းပေါ်မှာ စက်ဘီးမစီးရ' },
  { category: 'bicycle', ageGroup: 'kg-g2', text: 'စက်ဘီးမစီးခင် ဘရိတ်နဲ့ဘီးကို စစ်ဆေးပါ' },
  { category: 'bicycle', ageGroup: 'kg-g2', text: 'လမ်းကူးတဲ့အခါ စက်ဘီးပေါ်ကဆင်းပြီး တွန်းကူးပါ' },
  // ── Bicycle / G3-G5 ──
  { category: 'bicycle', ageGroup: 'g3-g5', text: 'စက်ဘီးကို လမ်းဘေးကပ်စီးပါ၊ လမ်းအလယ်မှာ မစီးရ' },
  { category: 'bicycle', ageGroup: 'g3-g5', text: 'လက်ပြအချက်ပြတတ်အောင်သင်ယူပါ — ဘယ်ကွေ့ ဘယ်လက်ထောင်၊ ညာကွေ့ ညာလက်ထောင်' },
  { category: 'bicycle', ageGroup: 'g3-g5', text: 'တစ်လိုင်းတည်းစီးပါ၊ ဘေးချင်းယှဉ်မစီးရ' },
  { category: 'bicycle', ageGroup: 'g3-g5', text: 'စက်ဘီးပေါ်မှာ လူနှစ်ယောက်မစီးရ' },
  { category: 'bicycle', ageGroup: 'g3-g5', text: 'မိုးရွာရင် စက်ဘီးမစီးပါနဲ့၊ လမ်းချော်ပြီး လဲတတ်တယ်' },
  // ── Bicycle / G6+ ──
  { category: 'bicycle', ageGroup: 'g6-plus', text: 'ညအချိန်စီးရင် ရှေ့မီးဖြူ၊ နောက်မီးနီ တပ်ဆင်ပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', text: 'အနက်ရောင်အင်္ကျီနဲ့ ညအချိန်မစီးရ၊ အရောင်ဖျော့တဲ့အင်္ကျီ ဝတ်ပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', text: 'စက်ဘီးစီးရင်း ဖုန်းနားထောင်တာ၊ ဖုန်းကြည့်တာ မလုပ်ရ' },
  { category: 'bicycle', ageGroup: 'g6-plus', text: 'လမ်းဆုံနဲ့ လမ်းကွေ့တွေမှာ အရှိန်လျှော့ပါ' },
  { category: 'bicycle', ageGroup: 'g6-plus', text: 'ဦးထုပ်ကို မေးသိုင်းကြိုး သေချာချိတ်ပါ' },

  // ── Motorcycle / G6-G9 (rider) ──
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ဆိုင်ကယ်စီးတိုင်း ဦးထုပ်ဆောင်းပါ — မေးသိုင်းကြိုးကို သေချာချိတ်ပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ဆိုင်ကယ်ပေါ်မှာ လူ ၂ ယောက်ထက်ပိုမစီးရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ဆိုင်ကယ်မောင်းရင်း ဖုန်းမကိုင်ရ၊ ဖုန်းမကြည့်ရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'သတ်မှတ်အမြန်နှုန်းထက် မကျော်ရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ဆိုင်ကယ်ဘေးတွဲပေါ်မှာ လူများများမတင်ရ' },
  // ── Motorcycle / passenger ──
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'နောက်ခန်းစီးရင်လည်း ဦးထုပ်ဆောင်းပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ဆိုင်ကယ်မောင်းသူကို ကိုင်ထားပါ၊ လက်လွှတ်မထားရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ဆိုင်ကယ်နောက်ခန်းမှာ စနောက်ဆော့ကစားခြင်းမပြုရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'မိုးရွာစဉ် ဆိုင်ကယ်မစီးပါနဲ့' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ဆိုင်ကယ်ပေါ်မှာ ထီးမဆောင်းရ' },
  // ── Motorcycle / G10+ ──
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ညအချိန်ဆိုင်ကယ်စီးရင် ရှေ့မီးဖွင့်ပါ၊ နောက်မီးပါအောင်စစ်ပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'အရက်သောက်ပြီး ဆိုင်ကယ်မမောင်းရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'စံမမီတဲ့ဦးထုပ်တွေ မသုံးပါနဲ့၊ အရည်အသွေးစစ်မှန်တဲ့ ဦးထုပ်ကိုသာသုံးပါ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'ကလေးငယ်ကို ဆိုင်ကယ်ရှေ့မှာ မတင်ရ' },
  { category: 'motorcycle', ageGroup: 'g6-plus', text: 'လမ်းဆုံတိုင်းမှာ အရှိန်လျှော့ပါ၊ ဟွန်းတီးပါ' },

  // ── School Bus / KG-G2 ──
  { category: 'schoolbus', ageGroup: 'kg-g2', text: 'ကားစောင့်ရင် လမ်းဘေးမှာ ရပ်စောင့်ပါ' },
  { category: 'schoolbus', ageGroup: 'kg-g2', text: 'ကားလုံးဝရပ်ပြီးမှ အနားကပ်ပါ' },
  { category: 'schoolbus', ageGroup: 'kg-g2', text: 'ကားပေါ်ရောက်ရင် ထိုင်ခုံမှာ ငြိမ်ငြိမ်ထိုင်ပါ' },
  { category: 'schoolbus', ageGroup: 'kg-g2', text: 'လက်နဲ့ခေါင်းကို ပြတင်းပေါက်အပြင်ကို မထုတ်ရ' },
  { category: 'schoolbus', ageGroup: 'kg-g2', text: 'ကားမောင်းသူကို အနှောက်အယှက်မပေးရ' },
  // ── School Bus / G3-G5 ──
  { category: 'schoolbus', ageGroup: 'g3-g5', text: 'ကားပေါ်တက်တဲ့အခါ တန်းစီပြီးတက်ပါ၊ မတွန်းမဆောင့်ရ' },
  { category: 'schoolbus', ageGroup: 'g3-g5', text: 'ကားပေါ်ကဆင်းရင် ကားရှေ့ကဖြစ်စေ၊ နောက်ကဖြစ်စေ လမ်းမကူးရ' },
  { category: 'schoolbus', ageGroup: 'g3-g5', text: 'ကားထွက်သွားတဲ့အထိ စောင့်ပြီးမှ လမ်းကူးပါ' },
  { category: 'schoolbus', ageGroup: 'g3-g5', text: 'ကားပေါ်မှာ ပြေးလွှားဆော့ကစားခြင်းမပြုရ' },
  { category: 'schoolbus', ageGroup: 'g3-g5', text: 'ကားပေါ်ကနေ အမှိုက်တွေ၊ ပစ္စည်းတွေ အပြင်ကိုမပစ်ရ' },
  // ── School Bus / G6+ ──
  { category: 'schoolbus', ageGroup: 'g6-plus', text: 'ကားတံခါးဝမှာ ရပ်စီးတာ၊ ချိတ်ဆွဲစီးတာ လုံးဝမလုပ်ရ' },
  { category: 'schoolbus', ageGroup: 'g6-plus', text: 'ကားပေါ်ပါလာတဲ့ ခါးပတ်ရှိရင် အမြဲပတ်ထားပါ' },
  { category: 'schoolbus', ageGroup: 'g6-plus', text: 'ကားပေါ်မှာ အော်ဟစ်ဆူညံခြင်းမပြုရ' },
  { category: 'schoolbus', ageGroup: 'g6-plus', text: 'အရေးပေါ်ထွက်ပေါက်တည်နေရာကို သိထားပါ' },
  { category: 'schoolbus', ageGroup: 'g6-plus', text: 'ကားမစီးခင် ယာဉ်မောင်းက ယာဉ်စည်းကမ်းလိုက်နာမှုရှိမရှိ သတိထားကြည့်ပါ' },
];
