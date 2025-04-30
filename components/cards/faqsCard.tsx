"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Apa itu Website ini?",
    answer: "Website ini adalah platform untuk analisis pertandingan.",
  },
  {
    question: "Bagaimana cara menggunakan fitur?",
    answer: "Anda bisa mengunggah video dan melihat analisis otomatis.",
  },
  {
    question: "Apakah layanan ini gratis?",
    answer: "Saat ini layanan tersedia secara gratis selama periode beta.",
  },
];

export default function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="flex flex-col bg-white border border-[#DBDADE] shadow w-full rounded-2xl overflow-hidden"
        >
          <div
            className="flex flex-row justify-between items-center w-full py-2 max-sm:py-1 px-8 max-sm:px-6 cursor-pointer"
            onClick={() => toggleAnswer(index)}
          >
            <p className="text-black font-semibold text-2xl max-sm:text-lg">
              {faq.question}
            </p>
            {openIndex === index ? (
              <ChevronUp
                size={40}
                className="max-sm:size-6 transition-transform duration-300 text-black"
              />
            ) : (
              <ChevronDown
                size={40}
                className="max-sm:size-6 transition-transform duration-300 text-black"
              />
            )}
          </div>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: "auto", opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                transition={{
                  height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.3 },
                }}
                className="overflow-hidden origin-top"
              >
                <div className="flex flex-row w-full items-start px-8 max-sm:px-6 pb-4">
                  {/* Divider Tailwind */}
                  <div className="w-px bg-[#38347A] my-2 mr-4" />
                  <p className="text-[#667085] font-semibold text-sm max-sm:text-xs border-l-2 pl-[10px]">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
