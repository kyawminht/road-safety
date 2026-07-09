import { FLIP_CARDS } from './flipCards.js';

export const TEACH_TOPICS = [
  {
    id: 'walking',
    title: 'လမ်းလျှောက်ခြင်း',
    emoji: '🚶',
    color: '#F97316',
    intro: 'လမ်းလျှောက်ရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['walking-1', 'walking-3', 'walking-4', 'walking-5'],
    quiz: {
      question: 'ဘယ်ဟာက လုံခြုံသလဲ?',
      options: [
        { id: 'a', text: 'ကားလမ်းပေါ်မှာ လျှောက်တာ', isCorrect: false },
        { id: 'b', text: 'လူသွားစင်္ကြံပေါ်မှာ လျှောက်တာ', isCorrect: true },
      ]
    }
  },
  {
    id: 'tricycle',
    title: 'ဆိုင်ကယ်စီးခြင်း',
    emoji: '🛺',
    color: '#7C3AED',
    intro: 'ဆိုင်ကယ်စီးရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['tricycle-2', 'bicycle-2'],
    quiz: {
      question: 'ဆိုင်ကယ်စီးရင် ဘာအရင်လုပ်ရမလဲ?',
      options: [
        { id: 'a', text: 'ဦးထုပ်ဆောင်းတာ', isCorrect: true },
        { id: 'b', text: 'ဖုန်းကြည့်တာ', isCorrect: false },
      ]
    }
  },
  {
    id: 'bicycle',
    title: 'စက်ဘီးစီးခြင်း',
    emoji: '🚲',
    color: '#CA8A04',
    intro: 'စက်ဘီးစီးရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['bicycle-1'],
    quiz: {
      question: 'စက်ဘီးစီးရင် ဘာဆောင်းရမလဲ?',
      options: [
        { id: 'a', text: 'ဦးထုပ်', isCorrect: true },
        { id: 'b', text: 'နားကြပ်', isCorrect: false },
      ]
    }
  },
  {
    id: 'rain',
    title: 'မိုးရွာချိန်သွားခြင်း',
    emoji: '🌧️',
    color: '#0891B2',
    intro: 'မိုးရွာတဲ့အခါ ဘာတွေ သတိထားရမလဲ',
    cardIds: ['rain-1'],
    quiz: {
      question: 'မိုးရွာရင် ထီးဘယ်လိုဆောင်းရမလဲ?',
      options: [
        { id: 'a', text: 'ရှေ့ကို ကြည့်ရအောင် မြှင့်ဆောင်းတာ', isCorrect: true },
        { id: 'b', text: 'ငုံ့ပြီးဆောင်းတာ', isCorrect: false },
      ]
    }
  },
  {
    id: 'ferry',
    title: 'ဖယ်ရီစီးခြင်း',
    emoji: '🚌',
    color: '#0D9488',
    intro: 'ဖယ်ရီကားစီးရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['ferry-1'],
    quiz: {
      question: 'ဖယ်ရီစီးရင် ဘာမလုပ်ရ?',
      options: [
        { id: 'a', text: 'ခေါင်းအပြင်ထုတ်တာ', isCorrect: false },
        { id: 'b', text: 'အတွင်းမှာပဲ ထိုင်တာ', isCorrect: true },
      ]
    }
  },
];

export function getCardsByTopic(topicId) {
  const topic = TEACH_TOPICS.find(t => t.id === topicId);
  if (!topic) return [];
  return topic.cardIds
    .map(id => FLIP_CARDS.find(card => card.id === id))
    .filter(Boolean);
}
