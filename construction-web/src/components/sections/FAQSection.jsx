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
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'text-base font-medium transition-colors duration-200',
            isOpen ? 'text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900',
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
              isOpen ? 'text-gold-500' : 'text-neutral-400',
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
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-neutral-500 leading-relaxed pr-12">
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

      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-neutral-200 px-6">
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
