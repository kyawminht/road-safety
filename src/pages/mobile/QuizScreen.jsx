import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronLeft, FiRefreshCw, FiHome, FiCheckCircle, FiMenu, FiX } from 'react-icons/fi';

import quizSafeWalking from '../../assets/quiz/safe_walking.png';
import quizUnsafeWalking from '../../assets/quiz/unsafe-walking.png';
import quizUnsafeWalkingEdge from '../../assets/quiz/unsafe_walking1.png';
import quizVisible from '../../assets/quiz/visible.png';
import quizHidden from '../../assets/quiz/hidden.png';
import quizSafeCrossing from '../../assets/quiz/safe-crossing.png';
import quizUnsafeCrossing from '../../assets/quiz/unsafe-crossing.png';
import quizLook from '../../assets/quiz/look.png';
import quizUnlook from '../../assets/quiz/unlook.png';
import quizSafeBus from '../../assets/quiz/safe-bus.png';
import quizUnsafeBus from '../../assets/quiz/unsafe-bus.png';
import countdownSignal from '../../assets/quiz/count-down.jfif';
import quizWrongFerry from '../../assets/quiz/wrong_ferry.png';
import quizParkingPath from '../../assets/quiz/quiz.png';

const COLORS = {
  background: '#F5F8F6',
  cardBackground: '#FFFFFF',
  primaryGreen: '#147A4F',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  border: '#E1E8E4',
  progressTrack: '#DDE7E1',
};

const AGE_GROUPS = [
  { id: 'k1', label: 'K-1' },
  { id: 'g45', label: 'Grade 4-5' },
];

const LANGUAGE_OPTIONS = [
  { id: 'my', label: 'မြန်မာ', aria: 'Myanmar flag' },
  { id: 'en', label: 'English', aria: 'English flag' },
];

const STUDENT_PROFILE = {
  myName: 'မောင်အောင်ခန့်',
  enName: 'Aung Khant',
};

const MYANMAR_COPY = {
  'k1-walking-1': {
    topic: 'သင်ခန်းစာ ၁ - ယာဉ်ကြောအနီး လုံခြုံစွာ လမ်းလျှောက်ခြင်း',
    question: 'ယာဉ်ကြောအနီး လုံခြုံစွာ လမ်းလျှောက်နေသောပုံကို ရွေးပါ။',
  },
  'k1-walking-2': {
    topic: 'သင်ခန်းစာ ၁ - ယာဉ်ကြောအနီး လုံခြုံစွာ လမ်းလျှောက်ခြင်း',
    question: 'ကားမောင်းသူများအတွက် ဘယ်ကလေးကို ပိုမြင်လွယ်သလဲ။',
  },
  'k1-crossing-1': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'လမ်းလုံခြုံစွာ ဖြတ်ကူးနေသောပုံကို ရွေးပါ။',
  },
  'k1-crossing-2': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'လမ်းမဖြတ်မီ ဘယ်-ညာ-ဘယ် ကြည့်နေသောပုံကို ရွေးပါ။',
  },
  'k1-bus-1': {
    topic: 'သင်ခန်းစာ ၅ - ဘတ်စ်ကား လုံခြုံရေး',
    question: 'ဘတ်စ်ကားအနီး လုံခြုံသော အပြုအမူကို ပြသောပုံကို ရွေးပါ။',
  },
  'g45-q1': {
    topic: 'သင်ခန်းစာ ၁ - ယာဉ်ကြောအနီး လုံခြုံစွာ လမ်းလျှောက်ခြင်း',
    question: 'နေရာတစ်နေရာသို့ သွားရန် လမ်းလျှောက်သူကို _________ ဟု ခေါ်သည်။',
    options: { a: 'ကိုယ်ကာယကြံ့ခိုင်သူ', b: 'လမ်းသွားလမ်းလာ', c: 'လေ့ကျင့်ခန်းလုပ်သူ' },
  },
  'g45-q2': {
    topic: 'သင်ခန်းစာ ၁ - ယာဉ်ကြောအနီး လုံခြုံစွာ လမ်းလျှောက်ခြင်း',
    question: 'လမ်းပေါ်တွင် လမ်းလျှောက်ရန် အကောင်းဆုံးနေရာက ဘယ်နေရာလဲ။',
    options: { a: 'လမ်းအလယ်', b: 'လာနေသောယာဉ်ကြောကို နောက်ကျောပေး၍ လျှောက်ခြင်း', c: 'လက်ဝဲဘက်၊ လာနေသောယာဉ်ကြောကို မျက်နှာမူ၍၊ လမ်းဘေးလျှောက်လမ်းရှိပါက ထိုပေါ်တွင် လျှောက်ခြင်း' },
  },
  'g45-q3': {
    topic: 'သင်ခန်းစာ ၁ - ယာဉ်ကြောအနီး လုံခြုံစွာ လမ်းလျှောက်ခြင်း',
    question: 'သင်ကျောင်းသို့ လမ်းလျှောက်သွားနေသည်ဟု စဉ်းစားပါ။ ယာဉ်ကြောအနီး လမ်းလျှောက်သောအခါ မှတ်ထားသင့်သော စည်းကမ်းတစ်ခုက ဘာလဲ။',
    options: { prompt: 'ဆရာ/ဆရာမနှင့် ဆွေးနွေးပါ' },
  },
  'g45-q4': {
    topic: 'သင်ခန်းစာ ၁ - ယာဉ်ကြောအနီး လုံခြုံစွာ လမ်းလျှောက်ခြင်း',
    question: 'မှောင်မိုက်ချိန် လမ်းလျှောက်သောအခါ ဝတ်ရန် အကောင်းဆုံးပစ္စည်းများကို ဘယ်လိုခေါ်သလဲ။',
    options: { a: 'အလင်းပြန်သော', b: 'အရောင်ဖျော့သော', c: 'လမ်းသွားလမ်းလာ' },
  },
  'g45-q5': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'ကလေးငယ်တစ်ယောက် လမ်းဖြတ်ကူးချင်လျှင် ကျွန်ုပ်တို့ ဘာလုပ်သင့်သလဲ။',
    options: { a: 'ကလေး၏ စာအုပ်များ သို့မဟုတ် ပစ္စည်းများကို သယ်ပေးသင့်သည်။', b: 'ကလေးလုံခြုံစေရန် သူ/သူမ၏ လက်ကို ကိုင်ပေးသင့်သည်။', c: 'ကလေးမလုံခြုံသောကြောင့် ရဲကို ခေါ်သင့်သည်။' },
  },
  'g45-q6': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'အမှိုက်ပုံးကြီးတစ်ခုက ယာဉ်ကြောကို မြင်ရန် ပိတ်နေသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    options: { a: 'လွယ်ကူစွာ မြင်နိုင်သော နေရာတစ်ခုသို့ ရွှေ့သင့်သည်။', b: 'အမှိုက်ပုံးကို လမ်းတစ်ဖက်သို့ ရွှေ့သင့်သည်။', c: 'အမှိုက်သိမ်းသူကို ချက်ချင်းလာသိမ်းရန် ခေါ်သင့်သည်။' },
  },
  'g45-q7': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'ထိုအမှိုက်ပုံးကြီးကို ဘယ်လိုခေါ်သလဲ။',
    options: { a: 'မြင်ကွင်းအတားအဆီး', b: 'ပြဿနာ', c: 'မြင်ကွင်းပိတ်ပစ္စည်း' },
  },
  'g45-q8': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'Warren သည် ကားရပ်ထားသောကြောင့် ယာဉ်ကြောကို မမြင်နိုင်ပါ။ လုံခြုံစွာ လမ်းဖြတ်ကူးရန် Warren ဘာလုပ်နိုင်သလဲ။',
    options: { a: 'ကားမောင်းသူများ လာ၍ ကားများကို ရွှေ့ပေးသည်အထိ လမ်းဘေးတွင် စောင့်နိုင်သည်။', b: 'ကားအစွန်းအထိ သတိထား၍ ထွက်ပြီး ထိုနေရာကို ဒုတိယအစွန်းအဖြစ် အသုံးပြုကာ ယာဉ်ကြောကို ကြည့်နိုင်သည်။', c: 'ယာဉ်ကြောကို ပိုမြင်ရန် လမ်းဘေးတွင် ခုန်နိုင်သည်။' },
  },
  'g45-q9': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'လမ်းဖြတ်ကူးသောအခါ ဘယ်ဘက်ကို အရင်ကြည့်ပြီး၊ ညာဘက်ကို ကြည့်ကာ၊ ဘယ်ဘက်ကို ထပ်ကြည့်ရသည့် အကြောင်းကို ရှင်းပြပါ။',
    options: { prompt: 'ဆရာ/ဆရာမနှင့် ဆွေးနွေးပါ' },
  },
  'g45-q10': {
    topic: 'သင်ခန်းစာ ၂ - လမ်းလုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'လမ်းဖြတ်ကူးသောအခါ ဘယ်ဦးတည်ချက်အတိုင်း လမ်းလျှောက်သင့်သလဲ။',
    options: { a: 'တည့်တည့်', b: 'ဘေးတိုက်', c: 'ထောင့်ဖြတ်' },
  },
  'g45-q11': {
    topic: 'သင်ခန်းစာ ၃ - လမ်းဆုံများတွင် လုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'အောက်ပါအရာများအနက် ဘယ်ဟာကို လမ်းဆုံဟု သတ်မှတ်နိုင်သလဲ။',
    options: { a: 'ပုံ A', b: 'ပုံ B', c: 'ပုံ C' },
  },
  'g45-q12': {
    topic: 'သင်ခန်းစာ ၃ - လမ်းဆုံများတွင် လုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'လမ်းဆုံကို ဖြတ်မကူးမီ ဘယ်နေရာများကို ကြည့်သင့်သလဲ။',
    options: { a: 'ဘယ်-ညာ-ဘယ် သာ', b: 'ညာ-ဘယ်-ညာ နှင့် ရှေ့-နောက်-ရှေ့', c: 'ဘယ်-ညာ-ဘယ် နှင့် ရှေ့-နောက်-ရှေ့' },
  },
  'g45-q13': {
    topic: 'သင်ခန်းစာ ၃ - လမ်းဆုံများတွင် လုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'လမ်းဆုံဖြတ်ကူးနေစဉ် ဘယ်ကလေးက လုံခြုံစွာ ပြုမူနေသလဲ။',
    options: { a: 'Henry သည် လမ်းကို တည့်တည့်ဖြတ်ကူးနေပြီး ယာဉ်ကြောကို ကြည့်၍ နားထောင်နေသည်။', b: 'David သည် လမ်းကို တည့်တည့်ပြေးဖြတ်နေပြီး MP3 သီချင်းကိုလည်း နားထောင်နေသည်။', c: 'Danica သည် လမ်းကို ထောင့်ဖြတ်လျှောက်နေပြီး မိမိခြေထောက်ကို ကြည့်နေသည်။' },
  },
  'g45-q14': {
    topic: 'သင်ခန်းစာ ၃ - လမ်းဆုံများတွင် လုံခြုံစွာ ဖြတ်ကူးခြင်း',
    question: 'လူကူးမျဉ်းကြားတွင် countdown pedestrian signal ကို မြင်ပါက ၎င်းက ဘာကို ဆိုလိုသလဲ။',
    options: { a: 'လုံခြုံစွာ ဖြတ်ကူးနိုင်ရန် ကျန်နေသော စက္ကန့်များကို ပြသည်။', b: 'လမ်းဆုံကို ဖြတ်ကူးရန် သင့်တွင် ကျန်သော စက္ကန့်များကို ပြသည်။', c: 'လမ်းဆုံကို ဖြတ်ကူးရန် သင့်တွင် ကျန်သော မိနစ်များကို ပြသည်။' },
  },
  'g45-q16': {
    topic: 'သင်ခန်းစာ ၄ - ကားရပ်နားရာနေရာ လုံခြုံရေး',
    question: 'ပုံပေါ်တွင် ကားရပ်နားရာနေရာ၌ လမ်းသွားလမ်းလာအဖြစ် လုံခြုံစွာ လမ်းလျှောက်ရမည့်နေရာကို ဆွဲပါ။',
  },
  'g45-q17': {
    topic: 'သင်ခန်းစာ ၄ - ကားရပ်နားရာနေရာ လုံခြုံရေး',
    question: 'Peter သည် မိခင်နှင့်အတူ ကားဆီသို့ လမ်းလျှောက်နေစဉ် ဘတ်စကက်ဘောလုံးကို ကားရပ်နားရာနေရာတွင် ကျသွားသည်။ Peter ဘာလုပ်သင့်သလဲ။',
    options: { prompt: 'ဆရာ/ဆရာမနှင့် ဆွေးနွေးပါ' },
  },
  'g45-q18': {
    topic: 'သင်ခန်းစာ ၅ - ကျောင်းဘတ်စ်ကား လုံခြုံရေး',
    question: 'အောက်ပါတို့အနက် ကျောင်းဘတ်စ်ကား အန္တရာယ်ဇုန် မဟုတ်သောနေရာက ဘယ်နေရာလဲ။',
    options: { a: 'ဘတ်စ်ကားရှေ့တည့်တည့်', b: 'ဘတ်စ်ကားနောက်တည့်တည့်', c: 'လမ်းနှင့်ဝေးသော လမ်းဘေးလျှောက်လမ်းပေါ်' },
  },
  'g45-q19': {
    topic: 'သင်ခန်းစာ ၅ - ကျောင်းဘတ်စ်ကား လုံခြုံရေး',
    question: 'ပုံထဲရှိကလေးသည် ကျောင်းဘတ်စ်ကားပေါ်တွင် လုံခြုံသလား မလုံခြုံသလား။ သင်ထင်သည့်အကြောင်းရင်းကို ရှင်းပြပါ။',
  },
};

const QUESTION_SETS = {
  k1: [
  {
    id: 'k1-walking-1',
    topic: 'Lesson 1: Walking Safely Near Traffic',
    question: 'Which picture shows safe walking near traffic?',
    options: [
      { id: 'a', label: 'A', image: quizUnsafeWalking, correct: false, accessibility: 'Child walking in the road near cars unsafely' },
      { id: 'b', label: 'B', image: quizUnsafeWalkingEdge, correct: false, accessibility: 'Child walking too close to the road edge unsafely' },
      { id: 'c', label: 'C', image: quizSafeWalking, correct: true, accessibility: 'Child walking safely on the sidewalk' },
    ],
  },
  {
    id: 'k1-walking-2',
    topic: 'Lesson 1: Walking Safely Near Traffic',
    question: 'Which child is easier for drivers to see?',
    options: [
      { id: 'a', label: 'A', image: quizHidden, correct: false, accessibility: 'Child hidden in the shadows near the road' },
      { id: 'b', label: 'B', image: quizVisible, correct: true, accessibility: 'Child standing clearly visible beside the road' },
    ],
  },
  {
    id: 'k1-crossing-1',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'Which picture shows safe street crossing?',
    options: [
      { id: 'a', label: 'A', image: quizUnsafeCrossing, correct: false, accessibility: 'Child running into the street while traffic is moving' },
      { id: 'b', label: 'B', image: quizSafeCrossing, correct: true, accessibility: 'Child crossing safely with an adult at a crossing' },
    ],
  },
  {
    id: 'k1-crossing-2',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'Which picture shows left-right-left before crossing?',
    options: [
      { id: 'a', label: 'A', image: quizUnlook, correct: false, accessibility: 'Child crossing while looking at a phone instead of traffic' },
      { id: 'b', label: 'B', image: quizLook, correct: true, accessibility: 'Child waiting and looking for traffic before crossing' },
    ],
  },
  {
    id: 'k1-bus-1',
    topic: 'Lesson 5: Bus Safety',
    question: 'Which picture shows safe bus behavior?',
    options: [
      { id: 'a', label: 'A', image: quizUnsafeBus, correct: false, accessibility: 'Child standing in the school bus danger zone' },
      { id: 'b', label: 'B', image: quizSafeBus, correct: true, accessibility: 'Child waiting safely on the sidewalk away from the bus' },
    ],
  },
  ],
  g45: [
  {
    id: 'g45-q1',
    topic: 'Lesson 1: Walking Safely Near Traffic',
    question: 'A person who walks to get places is called _________.',
    options: [
      { id: 'a', label: 'A', text: 'physically fit', correct: false },
      { id: 'b', label: 'B', text: 'a pedestrian', correct: true },
      { id: 'c', label: 'C', text: 'an exerciser', correct: false },
    ],
  },
  {
    id: 'g45-q2',
    topic: 'Lesson 1: Walking Safely Near Traffic',
    question: 'Where is the best place on a street to walk?',
    options: [
      { id: 'a', label: 'A', text: 'The middle', correct: false },
      { id: 'b', label: 'B', text: 'Facing away from oncoming traffic', correct: false },
      { id: 'c', label: 'C', text: 'The left side, facing oncoming traffic, on a sidewalk if it is available', correct: true },
    ],
  },
  {
    id: 'g45-q3',
    topic: 'Lesson 1: Walking Safely Near Traffic',
    question: 'Imagine that you are walking to school. What is one rule you should remember when you are walking near traffic?',
    graded: false,
    options: [
      { id: 'prompt', label: 'Think', text: 'Discuss with teacher', correct: true },
    ],
  },
  {
    id: 'g45-q4',
    topic: 'Lesson 1: Walking Safely Near Traffic',
    question: 'What do we call materials that are best to wear when walking in the dark?',
    options: [
      { id: 'a', label: 'A', text: 'reflective', correct: true },
      { id: 'b', label: 'B', text: 'light', correct: false },
      { id: 'c', label: 'C', text: 'pedestrian', correct: false },
    ],
  },
  {
    id: 'g45-q5',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'If a young child wants to cross the street, what should we do?',
    options: [
      { id: 'a', label: 'A', text: "We should carry the child's books or other belongings.", correct: false },
      { id: 'b', label: 'B', text: "We should hold the child's hand to help him or her be safe.", correct: true },
      { id: 'c', label: 'C', text: 'We should call the police because the child is not being safe.', correct: false },
    ],
  },
  {
    id: 'g45-q6',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'A large trash can blocks your view of traffic. What should you do?',
    options: [
      { id: 'a', label: 'A', text: 'You should move to a different place where you can see easily.', correct: true },
      { id: 'b', label: 'B', text: 'You should move the trash can to the other side of the street.', correct: false },
      { id: 'c', label: 'C', text: 'You should call the garbage collector to come and pick it up immediately.', correct: false },
    ],
  },
  {
    id: 'g45-q7',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'What is the large trash can called?',
    options: [
      { id: 'a', label: 'A', text: 'a visual barrier', correct: true },
      { id: 'b', label: 'B', text: 'a problem', correct: false },
      { id: 'c', label: 'C', text: 'a view blocker', correct: false },
    ],
  },
  {
    id: 'g45-q8',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'Warren cannot see traffic because parked cars block every crossing place. What can Warren do to cross safely?',
    options: [
      { id: 'a', label: 'A', text: 'Warren can wait on the side of the road until several drivers come and move their cars.', correct: false },
      { id: 'b', label: 'B', text: 'Warren can carefully move out to the edge of the car and use that as the second edge to look for traffic.', correct: true },
      { id: 'c', label: 'C', text: 'Warren can jump up and down on the side of the street to try to see traffic the best that he can.', correct: false },
    ],
  },
  {
    id: 'g45-q9',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'Explain why you should look left first, then right, and left again before crossing.',
    graded: false,
    options: [
      { id: 'prompt', label: 'Think', text: 'Discuss with teacher', correct: true },
    ],
  },
  {
    id: 'g45-q10',
    topic: 'Lesson 2: Crossing Streets Safely',
    question: 'When you are crossing the street, in which direction should you walk?',
    options: [
      { id: 'a', label: 'A', text: 'straight', correct: true },
      { id: 'b', label: 'B', text: 'sideways', correct: false },
      { id: 'c', label: 'C', text: 'diagonal', correct: false },
    ],
  },
  {
    id: 'g45-q11',
    topic: 'Lesson 3: Crossing Intersections Safely',
    question: 'Which of the following would be considered an intersection?',
    options: [
      { id: 'a', label: 'A', text: 'Picture A', correct: false },
      { id: 'b', label: 'B', text: 'Picture B', correct: false },
      { id: 'c', label: 'C', text: 'Picture C', correct: true },
    ],
  },
  {
    id: 'g45-q12',
    topic: 'Lesson 3: Crossing Intersections Safely',
    question: 'Where should you look before you cross an intersection?',
    options: [
      { id: 'a', label: 'A', text: 'only left-right-left', correct: false },
      { id: 'b', label: 'B', text: 'right-left-right and in front-behind-in front', correct: false },
      { id: 'c', label: 'C', text: 'left-right-left and in front-behind-in front', correct: true },
    ],
  },
  {
    id: 'g45-q13',
    topic: 'Lesson 3: Crossing Intersections Safely',
    question: 'Which child is being safe while crossing an intersection?',
    options: [
      { id: 'a', label: 'A', text: 'Henry is walking straight across the street. He is looking and listening for traffic.', correct: true },
      { id: 'b', label: 'B', text: 'David is running straight across the street. He is also listening to music on his MP3 player.', correct: false },
      { id: 'c', label: 'C', text: 'Danica is walking across the street at a diagonal. She is looking at her feet.', correct: false },
    ],
  },
  {
    id: 'g45-q14',
    topic: 'Lesson 3: Crossing Intersections Safely',
    question: 'A countdown pedestrian signal is showing in the crosswalk. What does it mean?',
    image: countdownSignal,
    imageAlt: 'Countdown pedestrian crossing signal showing numbers for people crossing the street',
    options: [
      { id: 'a', label: 'A', text: 'The pedestrian signal is telling you how many seconds are left before you can safely cross the intersection.', correct: false },
      { id: 'b', label: 'B', text: 'The pedestrian signal is telling you how many seconds you have to get across the intersection.', correct: true },
      { id: 'c', label: 'C', text: 'The pedestrian signal is telling you how many minutes you have to get across the intersection.', correct: false },
    ],
  },
  {
    id: 'g45-q16',
    topic: 'Lesson 4: Parking Lot Safety',
    question: 'On the picture, draw the safest place to walk if you are a pedestrian in a parking lot.',
    graded: false,
    answerOverlay: 'parkingFootpath',
    options: [
      { id: 'prompt', label: 'Draw', image: quizParkingPath, correct: true, accessibility: 'Parking lot picture for drawing the safest walking place' },
    ],
  },
  {
    id: 'g45-q17',
    topic: 'Lesson 4: Parking Lot Safety',
    question: 'Peter has just walked out of the toy store with a brand new basketball. As he is walking to his car with his mother, he drops the basketball in the parking lot. What should Peter do?',
    graded: false,
    options: [
      { id: 'prompt', label: 'Think', text: 'Discuss with teacher', correct: true },
    ],
  },
  {
    id: 'g45-q18',
    topic: 'Lesson 5: School Bus Safety',
    question: 'Which of the following is not a school bus danger zone?',
    options: [
      { id: 'a', label: 'A', text: 'directly in front of the bus', correct: false },
      { id: 'b', label: 'B', text: 'directly in back of the bus', correct: false },
      { id: 'c', label: 'C', text: 'on the sidewalk away from the road', correct: true },
    ],
  },
  {
    id: 'g45-q19',
    topic: 'Lesson 5: School Bus Safety',
    question: 'Is the child in the picture being safe or unsafe on the school bus? Explain why you think so.',
    graded: false,
    options: [
      { id: 'prompt', label: 'Explain', image: quizWrongFerry, correct: true, accessibility: 'Picture for explaining whether the child is safe or unsafe on the school bus' },
    ],
  },
],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -60 }),
};

function TopBar({ currentQ, totalQ, score, onBack, summaryLabel, showScore = true }) {
  return (
    <div
      className="px-[16px]"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px) + 6px, 10px)',
        backgroundColor: COLORS.background,
      }}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: 11,
            backgroundColor: COLORS.cardBackground,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.primaryText,
          }}
        >
          <FiChevronLeft size={18} aria-hidden="true" />
        </button>
        <div className="text-center">
          <p className="font-bold text-road-gray-500" style={{ fontSize: 11 }}>
            Student Response
          </p>
          <p className="font-black text-road-gray-900" style={{ fontSize: 13, lineHeight: 1.1 }}>
            {summaryLabel || `${currentQ + 1} / ${totalQ}`}
          </p>
        </div>
        <div
          className="flex items-center justify-center font-black"
          style={{
            minWidth: 32,
            height: 32,
            borderRadius: 11,
            backgroundColor: showScore ? '#E8F6F1' : 'transparent',
            color: showScore ? COLORS.primaryGreen : 'transparent',
            fontSize: 12,
          }}
        >
          {showScore ? score : null}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;
  return (
    <div style={{ padding: '12px 16px 0' }}>
      <div
        style={{
          width: '100%',
          height: 7,
          backgroundColor: COLORS.progressTrack,
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{ height: '100%', backgroundColor: COLORS.primaryGreen, borderRadius: 999 }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function AgeGroupTabs({ activeGroup, onChange, compact = false }) {
  return (
    <div className={`flex gap-2 ${compact ? '' : 'px-4 pt-2'}`}>
      {AGE_GROUPS.map((group) => {
        const isActive = activeGroup === group.id;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onChange(group.id)}
            className="flex-1 font-black"
            style={{
              height: compact ? 30 : 34,
              borderRadius: 11,
              backgroundColor: isActive ? COLORS.primaryGreen : COLORS.cardBackground,
              color: isActive ? '#FFFFFF' : COLORS.primaryText,
              border: `1px solid ${isActive ? COLORS.primaryGreen : COLORS.border}`,
              fontSize: 11,
            }}
          >
            {group.label}
          </button>
        );
      })}
    </div>
  );
}

function FlagIcon({ id }) {
  if (id === 'my') {
    return (
      <span
        role="img"
        aria-label="Myanmar flag"
        style={{
          width: 28,
          height: 20,
          borderRadius: 5,
          overflow: 'hidden',
          border: '1px solid rgba(31, 41, 55, 0.14)',
          position: 'relative',
          boxShadow: '0 1px 4px rgba(31,41,55,0.12)',
        }}
      >
        <span style={{ display: 'block', height: '33.34%', backgroundColor: '#FECB00' }} />
        <span style={{ display: 'block', height: '33.33%', backgroundColor: '#34B233' }} />
        <span style={{ display: 'block', height: '33.33%', backgroundColor: '#EA2839' }} />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: 11,
            lineHeight: 1,
            textShadow: '0 1px 2px rgba(31,41,55,0.25)',
          }}
        >
          ★
        </span>
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="English flag"
      style={{
        width: 28,
        height: 20,
        borderRadius: 5,
        overflow: 'hidden',
        border: '1px solid rgba(31, 41, 55, 0.14)',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(31,41,55,0.12)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: 5,
          backgroundColor: '#CE1126',
          transform: 'translateY(-50%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 5,
          backgroundColor: '#CE1126',
          transform: 'translateX(-50%)',
        }}
      />
    </span>
  );
}

function LanguageToggle({ language, onChange, compact = false }) {
  return (
    <div className={`flex justify-end ${compact ? '' : 'px-4 pt-2'}`}>
      <div
        className="grid grid-cols-2"
        style={{
          width: compact ? 186 : 210,
          maxWidth: '100%',
          padding: 3,
          borderRadius: 999,
          backgroundColor: '#FFFFFF',
          border: `1px solid ${COLORS.border}`,
          boxShadow: 'none',
        }}
      >
        {LANGUAGE_OPTIONS.map((option) => {
          const isActive = language === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className="flex items-center justify-center gap-1.5 font-black"
              style={{
                height: compact ? 28 : 30,
                borderRadius: 999,
                backgroundColor: isActive ? COLORS.primaryGreen : 'transparent',
                color: isActive ? '#FFFFFF' : COLORS.secondaryText,
                fontSize: 11,
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
            >
              <FlagIcon id={option.id} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileQuizControls({
  ageGroup,
  onAgeGroupChange,
  language,
  onLanguageChange,
  isOpen,
  onToggle,
}) {
  const activeAgeGroup = AGE_GROUPS.find((group) => group.id === ageGroup);
  const activeLanguage = LANGUAGE_OPTIONS.find((option) => option.id === language);

  return (
    <div className="px-4 pt-2">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between"
        style={{
          minHeight: 38,
          borderRadius: 14,
          backgroundColor: COLORS.cardBackground,
          border: `1px solid ${COLORS.border}`,
          padding: '7px 10px',
          color: COLORS.primaryText,
        }}
      >
        <span className="flex items-center gap-2 font-black" style={{ fontSize: 12 }}>
          <span
            className="flex items-center justify-center"
            style={{
              width: 24,
              height: 24,
              borderRadius: 9,
              backgroundColor: '#E8F6F1',
              color: COLORS.primaryGreen,
            }}
          >
            {isOpen ? <FiX size={15} aria-hidden="true" /> : <FiMenu size={15} aria-hidden="true" />}
          </span>
          {activeAgeGroup?.label}
        </span>
        <span className="flex items-center gap-2 font-bold" style={{ fontSize: 11, color: COLORS.secondaryText }}>
          <FlagIcon id={language} />
          {activeLanguage?.label}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: 8,
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                border: `1px solid ${COLORS.border}`,
                padding: 10,
              }}
            >
              <AgeGroupTabs
                activeGroup={ageGroup}
                onChange={(nextAgeGroup) => {
                  onAgeGroupChange(nextAgeGroup);
                  onToggle();
                }}
                compact
              />
              <div style={{ height: 8 }} />
              <LanguageToggle
                language={language}
                onChange={(nextLanguage) => {
                  onLanguageChange(nextLanguage);
                  onToggle();
                }}
                compact
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getQuestionTopic(question, language) {
  return language === 'my' ? MYANMAR_COPY[question.id]?.topic || question.topic : question.topic;
}

function getQuestionText(question, language) {
  return language === 'my' ? MYANMAR_COPY[question.id]?.question || question.question : question.question;
}

function getOptionText(question, option, language) {
  return language === 'my' ? MYANMAR_COPY[question.id]?.options?.[option.id] || option.text : option.text;
}

function getLessonLabel(question, language) {
  const topic = getQuestionTopic(question, language);
  const lessonNumber = topic.match(/[0-9၁၂၃၄၅]+/)?.[0];
  return lessonNumber
    ? language === 'my' ? `သင်ခန်းစာ ${lessonNumber}` : `Lesson ${lessonNumber}`
    : topic;
}

function getStudentName(language) {
  return language === 'my' ? STUDENT_PROFILE.myName : STUDENT_PROFILE.enName;
}

function useIsDesktopQuizView() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
}

function ImageAnswerOption({
  option,
  isSelected,
  isCorrect,
  showFeedback,
  onSelect,
  disabled = false,
  compactText = false,
  desktopImage = false,
  halfImage = false,
  showAnswerOverlay = false,
}) {
  const hasImage = Boolean(option.image);
  const isPromptOption = option.id === 'prompt';
  let borderColor = COLORS.border;
  let bgColor = COLORS.cardBackground;
  let status = null;

  if (showFeedback && isSelected) {
    borderColor = isCorrect ? '#22C55E' : '#EF4444';
    bgColor = isCorrect ? '#EFFDF4' : '#FEF2F2';
    status = hasImage ? (isCorrect ? 'Correct' : 'Try again') : null;
  } else if (isSelected) {
    borderColor = COLORS.primaryGreen;
    bgColor = '#E8F6F1';
  }

  return (
    <motion.button
      variants={cardVariants}
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      className="flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147A4F]"
      style={{
        flex: '1 1 0',
        minWidth: 0,
        width: '100%',
        cursor: disabled ? 'default' : 'pointer',
      }}
      whileTap={{ scale: 0.96 }}
    >
      <div
        style={{
          width: '100%',
          minHeight: hasImage ? undefined : compactText ? 88 : 82,
          height: hasImage && halfImage && desktopImage
            ? 'clamp(520px, 76vh, 720px)'
            : hasImage && halfImage
              ? 180
              : hasImage && desktopImage
                ? 'clamp(260px, 48vh, 420px)'
                : undefined,
          aspectRatio: hasImage && !desktopImage && !halfImage ? '1 / 1.18' : undefined,
          borderRadius: 12,
          borderWidth: isSelected ? 2 : 1,
          borderStyle: 'solid',
          borderColor,
          backgroundColor: bgColor,
          overflow: 'hidden',
          boxShadow: isPromptOption ? 'none' : isSelected ? '0 8px 18px rgba(31, 41, 55, 0.10)' : '0 3px 10px rgba(31, 41, 55, 0.04)',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          position: 'relative',
          display: 'flex',
          alignItems: compactText ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: hasImage ? 0 : compactText ? '34px 10px 10px' : '18px 16px 18px 54px',
        }}
      >
        {hasImage ? (
          <>
            <img
              src={option.image}
              alt={option.accessibility}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#F8FBF9',
              }}
            />
            {showAnswerOverlay && (
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0"
                style={{ filter: 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.75))', zIndex: 2 }}
              >
                <path
                  d="M 20 56 L 45 74 L 66 82 L 80 71"
                  fill="none"
                  stroke="#0EA5E9"
                  strokeLinecap="butt"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  strokeDasharray="14 8"
                />
              </svg>
            )}
          </>
        ) : (
          <span
            className="block w-full font-bold"
            style={{
              color: COLORS.primaryText,
              fontSize: compactText ? 11 : 14,
              lineHeight: 1.35,
              textAlign: compactText ? 'center' : 'left',
            }}
          >
            {option.displayText || option.text}
          </span>
        )}
        {!isPromptOption && (
          <div
            className="absolute left-2 top-2 flex items-center justify-center font-black"
            style={{
              width: 28,
              height: 28,
              borderRadius: compactText ? 8 : 10,
              backgroundColor: isSelected ? '#FFFFFF' : '#F9FAFB',
              color: isSelected ? COLORS.primaryGreen : COLORS.primaryText,
              fontSize: 12,
              boxShadow: compactText ? 'none' : '0 4px 10px rgba(31,41,55,0.14)',
              border: compactText ? `1px solid ${COLORS.border}` : 'none',
            }}
          >
            {option.label}
          </div>
        )}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-2 right-2 bottom-2 text-center font-black"
            style={{
              borderRadius: 12,
              padding: '7px 6px',
              backgroundColor: isCorrect ? '#22C55E' : '#EF4444',
              color: '#FFFFFF',
              fontSize: 11,
            }}
          >
            {status}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

function ResponseSheetQuestion({ question, index, selectedAnswer, onSelect, language, isDesktopView }) {
  const [showAnswerOverlay, setShowAnswerOverlay] = useState(false);
  const visibleOptions = question.options.filter((option) => option.id !== 'prompt' || option.image);
  const hasImageOptions = visibleOptions.some((option) => option.image);
  const hasAnswerOverlay = question.answerOverlay === 'parkingFootpath';
  const showFeedback = question.graded !== false && Boolean(selectedAnswer);
  const isAnswered = Boolean(selectedAnswer);
  const shouldShowAnswerRow = hasImageOptions || visibleOptions.length > 1;

  return (
    <motion.section
      variants={cardVariants}
      style={{
        backgroundColor: 'transparent',
        borderBottom: '6px solid #12815A',
        padding: '16px 0 18px',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 flex items-center justify-center font-black"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: '#E8F6F1',
            color: COLORS.primaryGreen,
            fontSize: 13,
          }}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="font-black"
              style={{
                borderRadius: 999,
                backgroundColor: '#ECFDF5',
                color: COLORS.primaryGreen,
                padding: '4px 8px',
                fontSize: 10,
                lineHeight: 1,
              }}
            >
              {getLessonLabel(question, language)}
            </span>
          </div>
          <h2 className="font-bold text-road-gray-900" style={{ fontSize: 14, lineHeight: 1.35 }}>
            {getQuestionText(question, language)}
          </h2>
        </div>
      </div>
      {question.image && (
        <div
          style={{
            marginTop: 22,
            width: 170,
            maxWidth: '100%',
            borderRadius: 14,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(31, 41, 55, 0.06)',
          }}
        >
          <img
            src={question.image}
            alt={question.imageAlt || ''}
            style={{
              width: '100%',
              height: 120,
              objectFit: 'contain',
              backgroundColor: '#F8FBF9',
            }}
          />
        </div>
      )}
      {visibleOptions.length > 0 && (
        <div
          className="flex mt-8"
          style={{
            flexDirection: shouldShowAnswerRow ? 'row' : 'column',
            gap: 10,
            paddingTop: 8,
            width: hasImageOptions && visibleOptions.length === 1 ? '50%' : undefined,
            minWidth: hasImageOptions && visibleOptions.length === 1 ? 180 : undefined,
          }}
        >
          {visibleOptions.map((option) => (
            <ImageAnswerOption
              key={option.id}
              option={{ ...option, displayText: getOptionText(question, option, language) }}
              isSelected={selectedAnswer === option.id}
              isCorrect={option.correct}
              showFeedback={showFeedback}
              onSelect={(optionId) => onSelect(index, optionId)}
              disabled={isAnswered || question.graded === false}
              compactText={shouldShowAnswerRow && !hasImageOptions}
              halfImage={hasImageOptions && visibleOptions.length === 1}
              desktopImage={isDesktopView}
              showAnswerOverlay={hasAnswerOverlay && showAnswerOverlay}
            />
          ))}
        </div>
      )}
      {hasAnswerOverlay && (
        <button
          type="button"
          onClick={() => setShowAnswerOverlay((isVisible) => !isVisible)}
          className="mt-4 inline-flex items-center justify-center font-black"
          style={{
            minHeight: 42,
            borderRadius: 12,
            border: '1px solid #16A34A',
            backgroundColor: showAnswerOverlay ? '#DCFCE7' : '#FFFFFF',
            color: COLORS.primaryGreen,
            padding: '0 18px',
            fontSize: 13,
          }}
        >
          {showAnswerOverlay ? 'Hide answer' : 'See answer'}
        </button>
      )}
    </motion.section>
  );
}

function QuizResults({ score, total, responses, onRetake, onHome }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const needsReview = responses.filter((response) => response.graded && !response.correct);

  return (
    <div
      className="min-h-dvh overflow-y-auto"
      style={{
        backgroundColor: COLORS.background,
        padding: 'max(env(safe-area-inset-top, 0px) + 24px, 34px) 20px max(env(safe-area-inset-bottom, 0px) + 24px, 34px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="text-center"
        style={{
          borderRadius: 24,
          backgroundColor: COLORS.cardBackground,
          padding: 22,
          boxShadow: '0 16px 34px rgba(31, 41, 55, 0.10)',
        }}
      >
        <FiCheckCircle className="mx-auto mb-3" size={48} color={COLORS.primaryGreen} aria-hidden="true" />
        <p className="font-bold text-road-gray-500" style={{ fontSize: 12 }}>
          Response Saved
        </p>
        <h1 className="font-black text-road-gray-900" style={{ fontSize: 34, lineHeight: 1 }}>
          {score}/{total}
        </h1>
        <p className="text-road-gray-500 mt-2" style={{ fontSize: 13 }}>
          Teacher data collected: {percent}% correct on scored questions
        </p>

        {needsReview.length > 0 && (
          <div className="mt-5 text-left">
            <p className="font-black text-road-gray-800 mb-2" style={{ fontSize: 13 }}>
              Review these topics
            </p>
            <div className="flex flex-wrap gap-2">
              {needsReview.map((response) => (
                <span
                  key={response.questionId}
                  className="font-bold"
                  style={{
                    borderRadius: 999,
                    backgroundColor: '#FEF2F2',
                    color: '#B91C1C',
                    padding: '7px 10px',
                    fontSize: 11,
                  }}
                >
                  {response.topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center justify-center gap-2 font-bold"
            style={{
              height: 48,
              borderRadius: 15,
              backgroundColor: '#E8F6F1',
              color: COLORS.primaryGreen,
              fontSize: 13,
            }}
          >
            <FiRefreshCw size={16} aria-hidden="true" />
            Retake
          </button>
          <button
            type="button"
            onClick={onHome}
            className="flex items-center justify-center gap-2 font-bold"
            style={{
              height: 48,
              borderRadius: 15,
              backgroundColor: COLORS.primaryGreen,
              color: '#FFFFFF',
              fontSize: 13,
            }}
          >
            <FiHome size={16} aria-hidden="true" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function QuizScreen({ onComplete }) {
  const isDesktopQuizView = useIsDesktopQuizView();
  const advanceTimerRef = useRef(null);
  const [ageGroup, setAgeGroup] = useState('k1');
  const [language, setLanguage] = useState('my');
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = QUESTION_SETS[ageGroup];
  const activeAgeGroup = AGE_GROUPS.find((group) => group.id === ageGroup);
  const question = questions[currentQ];
  const totalQ = questions.length;
  const isLast = currentQ === totalQ - 1;
  const hasImageOptions = question.options.some((option) => option.image);
  const selectedCount = Object.keys(answers).length;
  const savedAnswer = answers[currentQ]?.selected ?? null;
  const visibleAnswer = selectedAnswer ?? savedAnswer;
  const visibleFeedback = showFeedback || Boolean(savedAnswer);
  const canContinueAnsweredQuestion = Boolean(savedAnswer);

  const responses = useMemo(() => {
    return questions.map((item, index) => {
      const selected = answers[index]?.selected ?? null;
      const selectedOption = item.options.find((option) => option.id === selected);
      const correctOption = item.options.find((option) => option.correct);

      return {
        questionId: item.id,
        topic: item.topic,
        question: item.question,
        graded: item.graded !== false,
        selectedOptionId: selected,
        correctOptionId: correctOption?.id,
        correct: item.graded === false ? null : Boolean(selectedOption?.correct),
      };
    }).filter((response) => response.selectedOptionId);
  }, [answers, questions]);

  const score = useMemo(() => {
    return responses.filter((response) => response.graded && response.correct).length;
  }, [responses]);

  const scoredTotal = useMemo(() => {
    return questions.filter((item) => item.graded !== false).length;
  }, [questions]);

  useEffect(() => {
    if (!finished) return;

    const saved = JSON.parse(localStorage.getItem('studentQuizResponses') || '[]');
    localStorage.setItem(
      'studentQuizResponses',
      JSON.stringify([
        ...saved,
        {
          id: `response-${Date.now()}`,
          submittedAt: new Date().toISOString(),
          ageGroup,
          ageGroupLabel: activeAgeGroup?.label,
          studentName: getStudentName(language),
          score,
          total: scoredTotal,
          questionCount: totalQ,
          responses,
        },
      ]),
    );
  }, [activeAgeGroup, ageGroup, finished, language, responses, score, scoredTotal, totalQ]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const handleAgeGroupChange = useCallback((nextAgeGroup) => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setAgeGroup(nextAgeGroup);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers({});
    setDirection(1);
    setFinished(false);
    setShowFeedback(false);
  }, []);

  const handleLanguageChange = useCallback((nextLanguage) => {
    setLanguage(nextLanguage);
  }, []);

  const toggleMobileControls = useCallback(() => {
    setShowMobileControls((prev) => !prev);
  }, []);

  const advanceQuestion = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    if (isLast) {
      setFinished(true);
      return;
    }

    setDirection(1);
    setCurrentQ((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [isLast]);

  const handleSelect = useCallback((optionId) => {
    if (showFeedback || answers[currentQ] !== undefined) return;

    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    const selectedOption = question.options.find((option) => option.id === optionId);

    setSelectedAnswer(optionId);
    setShowFeedback(true);
    setAnswers((prev) => ({
      ...prev,
      [currentQ]: {
        questionId: question.id,
        selected: optionId,
        correct: Boolean(selectedOption?.correct),
      },
    }));

    advanceTimerRef.current = window.setTimeout(advanceQuestion, 950);
  }, [advanceQuestion, answers, currentQ, question, showFeedback]);

  const handleSheetSelect = useCallback((questionIndex, optionId) => {
    if (answers[questionIndex] !== undefined) return;

    const sheetQuestion = questions[questionIndex];
    const selectedOption = sheetQuestion.options.find((option) => option.id === optionId);

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        questionId: sheetQuestion.id,
        selected: optionId,
        correct: Boolean(selectedOption?.correct),
      },
    }));
  }, [answers, questions]);

  const handleBack = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    if (currentQ === 0) {
      onComplete();
      return;
    }

    const prevQuestionIndex = currentQ - 1;
    setDirection(-1);
    setCurrentQ(prevQuestionIndex);
    setSelectedAnswer(answers[prevQuestionIndex]?.selected ?? null);
    setShowFeedback(Boolean(answers[prevQuestionIndex]));
  }, [answers, currentQ, onComplete]);

  const handleRetake = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers({});
    setDirection(1);
    setFinished(false);
    setShowFeedback(false);
  }, []);

  if (finished) {
    return (
      <QuizResults
        score={score}
        total={scoredTotal}
        responses={responses}
        onRetake={handleRetake}
        onHome={onComplete}
      />
    );
  }

  if (ageGroup === 'g45') {
    return (
      <div className="min-h-dvh flex flex-col" style={{ backgroundColor: COLORS.background }}>
        <TopBar
          currentQ={currentQ}
          totalQ={totalQ}
          score={score}
          onBack={onComplete}
          summaryLabel={`${selectedCount} / ${totalQ}`}
          showScore={false}
        />
        {isDesktopQuizView ? (
          <div className="px-4 pt-2 grid gap-2" style={{ gridTemplateColumns: '1fr auto' }}>
            <AgeGroupTabs activeGroup={ageGroup} onChange={handleAgeGroupChange} compact />
            <LanguageToggle language={language} onChange={handleLanguageChange} compact />
          </div>
        ) : (
          <MobileQuizControls
            ageGroup={ageGroup}
            onAgeGroupChange={handleAgeGroupChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            isOpen={showMobileControls}
            onToggle={toggleMobileControls}
          />
        )}

        <div
          className="flex-1 overflow-y-auto"
          style={{
            padding: '18px 14px max(env(safe-area-inset-bottom, 0px) + 18px, 28px)',
          }}
        >
          <div className="mb-4">
            <h1 className="font-black text-road-gray-900" style={{ fontSize: 21, lineHeight: 1.15 }}>
              {language === 'my' ? 'Grade 4-5 ဖြေဆိုမှုစာမျက်နှာ' : 'Grade 4-5 Response Sheet'}
            </h1>
            <p className="text-road-gray-500 mt-1" style={{ fontSize: 12 }}>
              {language === 'my'
                ? 'အဖြေတစ်ခုကို ရွေးပါ။ ရွေးပြီးပါက ပြန်မပြောင်းနိုင်ပါ။'
                : 'Choose one answer. Green means correct and red means review.'}
            </p>
          </div>

          <motion.div
            className="flex flex-col"
            style={{
              gap: 0,
              borderTop: '6px solid #12815A',
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {questions.map((item, index) => (
              <ResponseSheetQuestion
                key={item.id}
                question={item}
                index={index}
                selectedAnswer={answers[index]?.selected}
                onSelect={handleSheetSelect}
                language={language}
                isDesktopView={isDesktopQuizView}
              />
            ))}
          </motion.div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: COLORS.background }}>
      <TopBar currentQ={currentQ} totalQ={totalQ} score={score} onBack={handleBack} />
      {isDesktopQuizView ? (
        <div className="px-4 pt-2 grid gap-2" style={{ gridTemplateColumns: '1fr auto' }}>
          <AgeGroupTabs activeGroup={ageGroup} onChange={handleAgeGroupChange} compact />
          <LanguageToggle language={language} onChange={handleLanguageChange} compact />
        </div>
      ) : (
        <MobileQuizControls
          ageGroup={ageGroup}
          onAgeGroupChange={handleAgeGroupChange}
          language={language}
          onLanguageChange={handleLanguageChange}
          isOpen={showMobileControls}
          onToggle={toggleMobileControls}
        />
      )}
      <ProgressBar current={currentQ} total={totalQ} />

      <div className="px-4 pt-5">
        <p className="font-black text-road-green-dark mb-2" style={{ fontSize: 12 }}>
          {getQuestionTopic(question, language)}
        </p>
        <h1 className="font-black text-road-gray-900" style={{ fontSize: 24, lineHeight: 1.18 }}>
          {getQuestionText(question, language)}
        </h1>
        <p className="text-road-gray-500 mt-2" style={{ fontSize: 13 }}>
          {language === 'my'
            ? 'ပုံတစ်ပုံကို ရွေးပါ။ သင့်အဖြေကို ဆရာ/ဆရာမအတွက် သိမ်းဆည်းမည်။'
            : hasImageOptions
              ? 'Tap one picture. Your answer will be saved for your teacher.'
              : 'Choose one answer. Your response will be saved for your teacher.'}
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            <motion.div
              className="flex"
              style={{
                flexDirection: hasImageOptions ? 'row' : 'column',
                padding: '20px 14px 0',
                gap: hasImageOptions ? 10 : 12,
                maxWidth: hasImageOptions && isDesktopQuizView ? 920 : undefined,
                width: hasImageOptions && isDesktopQuizView ? '100%' : undefined,
                margin: hasImageOptions && isDesktopQuizView ? '0 auto' : undefined,
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {question.options.map((option) => (
                <ImageAnswerOption
                  key={option.id}
                  option={{ ...option, displayText: getOptionText(question, option, language) }}
                  isSelected={visibleAnswer === option.id}
                  isCorrect={option.correct}
                  showFeedback={question.graded !== false && visibleFeedback}
                  onSelect={handleSelect}
                  disabled={visibleFeedback || answers[currentQ] !== undefined}
                  desktopImage={isDesktopQuizView}
                />
              ))}
            </motion.div>
            {canContinueAnsweredQuestion && (
              <div
                className="px-4"
                style={{
                  paddingTop: 18,
                  maxWidth: hasImageOptions && isDesktopQuizView ? 920 : undefined,
                  width: hasImageOptions && isDesktopQuizView ? '100%' : undefined,
                  margin: hasImageOptions && isDesktopQuizView ? '0 auto' : undefined,
                }}
              >
                <button
                  type="button"
                  onClick={advanceQuestion}
                  className="w-full font-black"
                  style={{
                    height: 50,
                    borderRadius: 16,
                    backgroundColor: COLORS.primaryGreen,
                    color: '#FFFFFF',
                    fontSize: 14,
                    boxShadow: '0 10px 22px rgba(20, 122, 79, 0.22)',
                  }}
                >
                  {isLast
                    ? language === 'my' ? 'ပြီးဆုံးမည်' : 'Finish'
                    : language === 'my' ? 'ဆက်သွားမည်' : 'Continue'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
