"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is react-pdf-levelup free to use?",
    answer:
      "Yes! react-pdf-levelup is completely free and open source under the MIT license. You can use it in personal and commercial projects without any restrictions.",
  },
  {
    question: "Does it work with Next.js App Router?",
    answer:
      "Absolutely. react-pdf-levelup is fully compatible with Next.js App Router, including server components and server actions. You can generate PDFs on the server or client.",
  },
  {
    question: "Can I use custom fonts?",
    answer:
      "Yes, you can register and use any TTF or OTF font file. We support font families with multiple weights and styles for complete typographic control.",
  },
  {
    question: "What about performance with large documents?",
    answer:
      "react-pdf-levelup uses lazy rendering and efficient memory management. Documents with hundreds of pages render smoothly without blocking the main thread.",
  },
  {
    question: "Is it compatible with React Native?",
    answer:
      "Currently, react-pdf-levelup is designed for web environments (browsers and Node.js). React Native support is on our roadmap for future releases.",
  },
  {
    question: "How do I handle dynamic data?",
    answer:
      "Just like any React component! Pass props to your PDF components and they'll re-render with the new data. You can use hooks, context, and all React patterns you're familiar with.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about react-pdf-levelup.</p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
