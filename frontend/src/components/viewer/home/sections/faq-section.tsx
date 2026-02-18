"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslation } from "react-i18next"

export function FaqSection() {
  const { t } = useTranslation()
  const faqs = t("faq.items", { returnObjects: true }) as { q: string; a: string }[]

  return (
    <section id="faq" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl text-balance">
            {t("faq.heading")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("faq.subheading")}
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left  hover:text-accent hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
