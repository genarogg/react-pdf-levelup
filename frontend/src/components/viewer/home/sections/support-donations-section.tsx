import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Heart, ExternalLink, Send, Sparkles, Crown, MessageSquareShare } from "lucide-react"

export function SupportAndDonationsSection() {
  return (
    <section id="support" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Comunidad
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Apoya el Proyecto
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tu apoyo ayuda a mantener y mejorar esta herramienta gratuita para la comunidad
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Support Card - Mejorada */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/50">
            {/* Efectos de fondo mejorados */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
              <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500" />
            </div>

            {/* Borde animado sutil */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Soporte y Contacto
                </h3>
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                ¿Tienes preguntas, sugerencias o necesitas ayuda? Contáctame a través de cualquiera de estos canales. Estoy aquí para apoyarte.
              </p>

              <div className="space-y-3">
                <a 
                  href="mailto:genarrogg@gmail.com" 
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-blue-500/20 transition-all duration-300 group/link"
                >
                  <div className="p-2 rounded-lg bg-background group-hover/link:bg-blue-50 dark:group-hover/link:bg-blue-950/30 transition-colors">
                    <Mail className="h-5 w-5 text-muted-foreground group-hover/link:text-blue-600 transition-colors flex-shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">Correo Electrónico</p>
                    <p className="text-sm text-muted-foreground truncate">genarrogg@gmail.com</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>

                <a 
                  href="https://wa.me/584127554970" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-green-500/20 transition-all duration-300 group/link"
                >
                  <div className="p-2 rounded-lg bg-background group-hover/link:bg-green-50 dark:group-hover/link:bg-green-950/30 transition-colors">
                    <MessageCircle className="h-5 w-5 text-green-600 group-hover/link:text-green-700 transition-colors flex-shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+58 412 7554970</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>

                <a 
                  href="https://MessageSquareShare.gg/jRRZJRjjCU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-indigo-500/20 transition-all duration-300 group/link"
                >
                  <div className="p-2 rounded-lg bg-background group-hover/link:bg-indigo-50 dark:group-hover/link:bg-indigo-950/30 transition-colors">
                    <MessageSquareShare className="h-5 w-5 text-indigo-600 group-hover/link:text-indigo-700 transition-colors flex-shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">Servidor MessageSquareShare</p>
                    <p className="text-sm text-muted-foreground">Únete a la comunidad</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>

          {/* Donations Card - Mejorada */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500/50">
            {/* Efectos de fondo mejorados */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-green-500/10 blur-2xl group-hover:bg-green-500/15 transition-all duration-500" />
            </div>

            {/* Borde animado sutil */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-6 w-6 text-emerald-600 group-hover:fill-emerald-600/20 transition-all" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Donaciones
                </h3>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Si encuentras útil esta herramienta y quieres apoyar su desarrollo continuo, considera hacer una donación.
              </p>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-emerald-500/10">
                  <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Tu donación ayuda a:
                  </p>
                  <ul className="space-y-3 text-sm text-foreground">
                    <li className="flex items-center gap-3 group/item">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:scale-125 transition-transform" />
                      <span className="group-hover/item:text-emerald-600 transition-colors">Mantener el proyecto gratuito</span>
                    </li>
                    <li className="flex items-center gap-3 group/item">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:scale-125 transition-transform" />
                      <span className="group-hover/item:text-emerald-600 transition-colors">Agregar nuevas características</span>
                    </li>
                    <li className="flex items-center gap-3 group/item">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:scale-125 transition-transform" />
                      <span className="group-hover/item:text-emerald-600 transition-colors">Mejorar la documentación</span>
                    </li>
                    <li className="flex items-center gap-3 group/item">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:scale-125 transition-transform" />
                      <span className="group-hover/item:text-emerald-600 transition-colors">Brindar soporte a la comunidad</span>
                    </li>
                  </ul>
                </div>

                <a 
                  href="https://patreon.com/genarogg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full block group/patreon"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group/btn"
                  >
                    <Crown className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    Apoyar en Patreon
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>

                <a 
                  href="https://www.paypal.com/paypalme/genaroggpaypal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group/btn"
                  >
                    <Heart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    Donar vía PayPal
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>

                <p className="text-xs text-center text-muted-foreground">
                  Cada contribución hace la diferencia ✨
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-sm text-foreground font-medium">
              ¡Gracias por ser parte de la comunidad! 🙏
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}