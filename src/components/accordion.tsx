import React, { useState } from "react";

interface AccordionProps {
  items: {
    title: string;
    content: string;
  }[];
}

export default function Accordion({ items }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleAccordion = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div id="accordion-collapse" data-accordion="collapse">
      {items.map((item, index) => (
        <div key={index} className="border border-b_text rounded">
          <h2 id={`accordion-collapse-heading-${index + 1}`}>
            <button
              type="button"
              className="flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-500 border border-b-0 gap-3"
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`accordion-collapse-body-${index + 1}`}
            >
              <span>{item.title}</span>
            </button>
          </h2>
          <div
            id={`accordion-collapse-body-${index + 1}`}
            className={`${activeIndex === index ? "block" : "hidden"}`}
            aria-labelledby={`accordion-collapse-heading-${index + 1}`}
          >
            <div className="p-5 border">
              <p className="mb-2 text-b_text ">{item.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
