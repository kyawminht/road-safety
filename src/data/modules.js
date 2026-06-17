export const MODULES = [
  {
    id: 'walking',
    emoji: '🚶‍♂️',
    title: 'လူသွားစင်္ကြံ စည်းကမ်း',
    lessonText: 'လူသွားစင်္ကြံပေါ်မှာသွားပါ',
    canvas: {
      studentOnRoad: true,
      vehicleType: 'car',
      hasSidewalk: true,
    },
  },
  {
    id: 'helmet',
    emoji: '⛑️',
    title: 'ဦးထုပ်ဆောင်းခြင်း',
    lessonText: 'ဦးထုပ်အမြဲဆောင်းပါ',
    canvas: {
      studentOnRoad: false,
      vehicleType: 'motorcycle',
      hasSidewalk: false,
      extraStudents: 1,
    },
  },
  {
    id: 'sidecar',
    emoji: '🛵',
    title: 'ဘေးတွဲစီးနည်း',
    lessonText: 'ဘေးတွဲမှာ ၂ ယောက်ထက်ပိုမစီးရ',
    canvas: {
      studentOnRoad: false,
      vehicleType: 'sidecar',
      hasSidewalk: false,
      extraStudents: 2,
    },
  },
  {
    id: 'bicycle',
    emoji: '🚲',
    title: 'စက်ဘီးစီးနည်း',
    lessonText: 'တစ်ယောက်ချင်းစီစီးပါ',
    canvas: {
      studentOnRoad: true,
      vehicleType: 'bicycle',
      hasSidewalk: false,
      extraStudents: 1,
    },
  },
  {
    id: 'tricycle',
    emoji: '🛺',
    title: 'သုံးဘီးဆိုင်ကယ်စီးနည်း',
    lessonText: 'ထိုင်ပြီးစီးပါ',
    canvas: {
      studentOnRoad: false,
      vehicleType: 'tricycle',
      hasSidewalk: false,
      extraStudents: 0,
    },
  },
];

export const COMPLETION_MESSAGE = 'သင်ခန်းစာအားလုံးပြီးပါပြီ';

export const TIMING = {
  wrongRun: 5000,
  lesson: 3000,
  rightRun: 5000,
  confetti: 2000,
  transition: 1000,
};
