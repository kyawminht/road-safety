// ── Profanity / Harassment Filter ──
// Checks text against blocked keywords in English and Burmese.
// Returns { clean: boolean, matched: string | null }

// English blocked words (lowercase, partial match)
const EN_BLOCKED = [
  // Harassment / insults
  'fuck', 'fck', 'fuk', 'fuq', 'fux', 'f_u_c_k',
  'shit', 'sh1t', 'sht',
  'bitch', 'b1tch', 'btch',
  'asshole', 'ass hole', 'a$$hole',
  'dick', 'd1ck',
  'bastard',
  'damn', 'dammit',
  'crap',
  'wtf', 'stfu', 'gtfo',
  'slut', 'sl0t',
  'retard', 'retarded',
  'idiot', 'stupid',
  'moron',
  'dumbass',
  'piss', 'p1ss',
  'cock', 'c0ck',
  'pussy', 'pus5y',
  'whore', 'wh0re',
  'nigger', 'n1gger', 'nigga',
  'fag', 'faggot', 'f@ggot',
  'dyke',
  ' tranny',
  'kike',
  'chink',
  'spic',
  'beaner',
  'wetback',
  'towelhead',
  'homo',
  'loser',
  'scum',
  'trash',
  'ugly',
  'fatass',
  'motherfucker', 'motherfckr', 'mtherfcker',
  'blowjob',
  'handjob',
  'cum', 'cummies',
  'porn', 'p0rn',
  'nude',
  'rape', 'rapist',
  'kill yourself', 'kys',
  'go die',
  'commit suicide',
];

// Burmese blocked words (Myanmar Unicode)
const MY_BLOCKED = [
  // Insults / harassment
  'အကောင်',         // animal (insult)
  'အရူး',             // crazy / fool
  'အရူးကြီး',        // big fool
  'မိုက်ရိုင်း',      // rude / wild
  'ညစ်ညမ်း',         // dirty / vulgar
  'ညစ်ပတ်',          // dirty
  'လူဆိုး',           // bad person
  'လူမိုက်',          // stupid person
  'အသက်မသွားနဲ့',   // go die
  'သေကြောင်းကြံ',   // commit suicide
  'သေပါ',             // die
  'အသတ်ခံပါ',        // get killed
  'ငါ့ကိုပစ်',        // throw me (aggressive)
  'နင်',               // you (rude)
  'မင်းကိုယ်တိုင်',  // you yourself (aggressive)
  'ကျောက်စား',       // stone-eater (insult)
  'ဝက်',               // pig (insult)
  'ခွေး',              // dog (insult when directed)
  'အံပေါက်',         // vulgar
  'ဖား',               // frog (insult)
  'ကြွက်',             // rat (insult)
  'မိစ္ဆာ',            // demon / evil
  'နတ်ဆိုး',          // evil spirit
  'အပြစ်ပြော',        // blame / criticize harshly
  'ရိုက်မယ်',         // will hit you
  'ဓားထောက်',        // knife threat
  'အိမ်ဖျက်',         // destroy house
  'မီးရှို့',           // burn
  'ရိုင်းစိုင်း',      // rude
  'ပါးရိုက်',          // slap
  'ခေါင်းရိုက်',      // hit head
  'နားဆွဲ',            // pull ear
];

/**
 * Check text for profanity/harassment keywords.
 * @param {string} text - The comment text to check
 * @returns {{ clean: boolean, matched: string | null }}
 */
export function checkProfanity(text) {
  if (!text) return { clean: true, matched: null };

  const lower = text.toLowerCase().replace(/\s+/g, ' ').trim();

  // Check English
  for (const word of EN_BLOCKED) {
    if (lower.includes(word)) {
      return { clean: false, matched: word };
    }
  }

  // Check Burmese (Myanmar text has no spaces between words, so check substring)
  for (const word of MY_BLOCKED) {
    if (text.includes(word)) {
      return { clean: false, matched: word };
    }
  }

  return { clean: true, matched: null };
}
