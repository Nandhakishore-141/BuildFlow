import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import { FAQ_ITEMS } from '@/constants';
import { cn } from '@/utils/cn';

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}) {
  return (
    <div className="border-b border-zinc-800/80 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'text-base font-semibold transition-colors duration-200',
            isOpen ? 'text-zinc-100' : 'text-zinc-300 group-hover:text-zinc-100',
          )}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 ml-4"
        >
          <HiOutlineChevronDown
            className={cn(
              'w-5 h-5 transition-colors',
              isOpen ? 'text-gold-400' : 'text-zinc-500',
            )}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-zinc-400 leading-relaxed pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionWrapper variant="alt">
      <SectionHeading
        label="FAQ"
        title="Frequently Asked Questions"
        description="Everything you need to know about BuildFlow."
      />

      <div className="max-w-2xl mx-auto bg-zinc-900/70 rounded-xl border border-zinc-800 px-6 backdrop-blur-sm shadow-xl shadow-black/20">
        {FAQ_ITEMS.map((item, i) => (
          <FAQAccordionItem
            key={i}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
