import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';

/* ── Design tokens ── */
const COLORS = {
  background: '#F5F8F6',
  cardBackground: '#FFFFFF',
  primaryGreen: '#147A4F',
  studentGreen: '#147A4F',
  teacherBlue: '#2F78B7',
  parentOrange: '#F6A01A',
  primaryText: '#2B2B2B',
  secondaryText: '#7A817D',
  border: '#E6EAE8',
  validationRed: '#DC2626',
};

/* ── Role definitions ── */
const ROLES = [
  {
    id: 'student',
    title: { en: "I'm a Student", mm: 'ကျောင်းသား' },
    description: {
      en: 'Learn rules, take quizzes, play games',
      mm: 'စည်းကမ်းများ လေ့လာရန်၊ ပဟေဠိဖြေရန်၊ ဂိမ်းကစားရန်',
    },
    color: COLORS.studentGreen,
    ariaLabel: { en: 'Select student role', mm: 'ကျောင်းသားအခန်းကဏ္ဍကို ရွေးချယ်ရန်' },
  },
  {
    id: 'teacher',
    title: { en: "I'm a Teacher", mm: 'ဆရာ/ဆရာမ' },
    description: {
      en: 'Teach a class and track student progress',
      mm: 'အတန်းသင်ရန် နှင့် ကျောင်းသားတိုးတက်မှု စစ်ဆေးရန်',
    },
    color: COLORS.teacherBlue,
    ariaLabel: { en: 'Select teacher role', mm: 'ဆရာအခန်းကဏ္ဍကို ရွေးချယ်ရန်' },
  },
  {
    id: 'parent',
    title: { en: "I'm a Parent", mm: 'မိဘ' },
    description: {
      en: "Check your child's results and progress",
      mm: 'ကလေး၏ ရလဒ်များနှင့် တိုးတက်မှု စစ်ဆေးရန်',
    },
    color: COLORS.parentOrange,
    ariaLabel: { en: 'Select parent role', mm: 'မိဘအခန်းကဏ္ဍကို ရွေးချယ်ရန်' },
  },
];

/* ── Framer Motion variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + 0.07 * i, duration: 0.3, ease: 'easeOut' },
  }),
};

export default function OnboardingPage({ onComplete }) {
  const { setOnboardingRole } = useAuth();
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState('EN');
  const [showValidation, setShowValidation] = useState(false);

  const langKey = language === 'EN' ? 'en' : 'mm';

  const handleSelect = useCallback(
    (roleId) => {
      setSelected(roleId);
      setOnboardingRole(roleId);
      setShowValidation(false);
    },
    [setOnboardingRole],
  );

  const handleContinue = useCallback(() => {
    if (selected) {
      onComplete(selected);
    } else {
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 2200);
    }
  }, [selected, onComplete]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'EN' ? 'MM' : 'EN'));
  }, []);

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* ── Status bar ── */}
      <div
        className="flex items-center justify-between px-3"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
          height: 'max(env(safe-area-inset-top, 0px) + 36px, 44px)',
        }}
      >
        {/* Time */}
        <span
          className="font-semibold tracking-tight"
          style={{
            fontSize: 13,
            color: COLORS.primaryText,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
            letterSpacing: 0.3,
          }}
        >
          9:41
        </span>

        {/* Language pill */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={language === 'EN' ? 'Switch to Burmese' : 'Switch to English'}
          className="flex items-center justify-center rounded-full bg-white border transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
          style={{
            height: 18,
            width: 44,
            borderColor: COLORS.border,
            borderWidth: 0.5,
          }}
        >
          <span
            className="font-semibold tracking-wide"
            style={{
              fontSize: 9.5,
              color: COLORS.secondaryText,
              letterSpacing: 0.2,
            }}
          >
            {language === 'EN' ? 'MM' : 'EN'}
            <span style={{ color: '#B0B5B2', margin: '0 0.5px' }}> / </span>
            {language === 'EN' ? 'EN' : 'MM'}
          </span>
        </button>
      </div>

      {/* ── Main content ── */}
      <motion.div
        className="flex-1 flex flex-col px-[26px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Header: Logo + Title + Subtitle ── */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          {/* Green circle logo */}
          <div
            className="rounded-full shrink-0"
            style={{
              width: 40,
              height: 40,
              backgroundColor: COLORS.primaryGreen,
              marginTop: 36,
            }}
            aria-hidden="true"
          />

          {/* App title */}
          <h1
            className="font-bold text-center mt-[11px]"
            style={{
              fontSize: 16,
              color: COLORS.primaryText,
              lineHeight: 1.3,
            }}
          >
            Road Safety Myanmar
          </h1>

          {/* Subtitle */}
          <p
            className="text-center mt-[6px]"
            style={{
              fontSize: 10.5,
              color: COLORS.secondaryText,
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            {language === 'EN' ? 'Choose your role to continue' : 'ဆက်လက်ရန် သင်၏အခန်းကဏ္ဍကို ရွေးချယ်ပါ'}
          </p>
        </motion.div>

        {/* ── Role cards ── */}
        <motion.div
          className="flex flex-col"
          style={{ gap: 16, marginTop: 32 }}
          variants={containerVariants}
        >
          {ROLES.map((role, index) => {
            const isSelected = selected === role.id;
            return (
              <motion.button
                key={role.id}
                custom={index}
                variants={cardVariants}
                type="button"
                onClick={() => handleSelect(role.id)}
                aria-label={
                  language === 'EN'
                    ? `${role.ariaLabel.en} — ${role.title.en}`
                    : `${role.ariaLabel.mm} — ${role.title.mm}`
                }
                aria-pressed={isSelected}
                className="flex items-center text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147A4F]"
                style={{
                  width: 342,
                  height: 92,
                  backgroundColor: COLORS.cardBackground,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderStyle: 'solid',
                  borderColor: isSelected ? COLORS.primaryGreen : COLORS.border,
                  padding: '0 12px',
                  boxShadow: isSelected
                    ? '0 2px 8px rgba(20, 122, 79, 0.2)'
                    : '0 2px 6px rgba(0,0,0,0.08)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                whileTap={{ scale: 0.985 }}
              >
                {/* Colored square icon (plain) */}
                <div
                  className="shrink-0 rounded-[9px]"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: role.color,
                  }}
                  aria-hidden="true"
                />

                {/* Title + Description */}
                <div
                  className="flex flex-col justify-center"
                  style={{ marginLeft: 12, minWidth: 0 }}
                >
                  <span
                    className="font-bold leading-tight truncate"
                    style={{
                      fontSize: 12,
                      color: COLORS.primaryText,
                    }}
                  >
                    {role.title[langKey]}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: COLORS.secondaryText,
                      lineHeight: 1.45,
                      marginTop: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {role.description[langKey]}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Validation message ── */}
        <AnimatePresence>
          {showValidation && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-center mt-2"
              style={{
                fontSize: 9.5,
                color: COLORS.validationRed,
                fontWeight: 500,
              }}
              role="alert"
            >
              {language === 'EN'
                ? 'Please select a role to continue'
                : 'ဆက်လက်ရန် အခန်းကဏ္ဍတစ်ခုကို ရွေးချယ်ပါ'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Flexible spacer ── */}
        <div className="flex-1 min-h-[40px]" />

        {/* ── Continue button ── */}
        <motion.div
          variants={itemVariants}
          className="pb-4"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 8px, 16px)',
          }}
        >
          <button
            type="button"
            onClick={handleContinue}
            disabled={false}
            aria-label={
              selected
                ? language === 'EN'
                  ? `Continue as ${selected}`
                  : `ဆက်လက်ရန်`
                : language === 'EN'
                  ? 'Select a role first'
                  : 'အခန်းကဏ္ဍတစ်ခုကို ရွေးချယ်ပါ'
            }
            className="w-full flex items-center justify-center font-bold rounded-[8px] transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{
              height: 34,
              backgroundColor: COLORS.primaryGreen,
              color: '#FFFFFF',
              fontSize: 11.5,
              boxShadow: '0 1px 4px rgba(20, 122, 79, 0.25)',
              opacity: selected ? 1 : 0.5,
              cursor: selected ? 'pointer' : 'default',
            }}
            onPointerEnter={(e) => {
              if (selected) e.currentTarget.style.backgroundColor = '#0F6640';
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primaryGreen;
            }}
          >
            {language === 'EN' ? 'Continue' : 'ဆက်လက်ရန်'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
