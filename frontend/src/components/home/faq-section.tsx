"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿react-pdf-levelup es gratuito?",
    answer:
      "¡Sí! react-pdf-levelup es completamente gratuito y de código abierto bajo la licencia MIT. Puedes usarlo en proyectos personales y comerciales sin ninguna restricción.",
  },
  {
    question: "¿Funciona con Next.js App Router?",
    answer:
      "Absolutamente. react-pdf-levelup es totalmente compatible con Next.js App Router, incluidos los server components y las server actions. Puedes generar PDFs tanto en el servidor como en el cliente.",
  },
  {
    question: "¿Puedo usar fuentes personalizadas?",
    answer:
      "Sí, puedes registrar y usar cualquier archivo de fuente TTF u OTF. Soportamos familias tipográficas con múltiples pesos y estilos para un control tipográfico completo.",
  },
  {
    question: "¿Qué tal el rendimiento con documentos grandes?",
    answer:
      "react-pdf-levelup utiliza renderizado perezoso (lazy rendering) y una gestión eficiente de memoria. Los documentos con cientos de páginas se renderizan de forma fluida sin bloquear el hilo principal.",
  },
  {
    question: "¿Es compatible con React Native?",
    answer:
      "Actualmente, react-pdf-levelup está diseñado para entornos web (navegadores y Node.js). El soporte para React Native está en nuestra hoja de ruta para futuras versiones.",
  },
  {
    question: "¿Cómo manejo datos dinámicos?",
    answer:
      "¡Igual que cualquier componente de React! Pasa props a tus componentes de PDF y se volverán a renderizar con los nuevos datos. Puedes usar hooks, context y todos los patrones de React que ya conoces.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Todo lo que necesitas saber sobre react-pdf-levelup.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
