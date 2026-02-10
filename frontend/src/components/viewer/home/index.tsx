// import { Header } from "./header"
import Header from "@/components/viewer/header"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { HeroSection } from "./sections/hero-section"
import { ValueProposition } from "./sections/value-proposition"
import { ComparisonSection } from "./sections/comparison-section"
import { HowItWorks } from "./sections/how-it-works"
import { WhyLevelupSection } from "./sections/why-levelup-section"
import { DeveloperFeatures } from "./sections/developer-features"
import { TemplatesSection } from "./sections/templates-section"
import { UseCasesSection } from "./sections/use-cases-section"
import { TechStackSection } from "./sections/tech-stack-section"
import { ApiSection } from "./sections/api-section"
import { RoadmapSection } from "./sections/roadmap-section"
import { FaqSection } from "./sections/faq-section"
import { CtaSection } from "./sections/cta-section"
import { Footer } from "./sections/footer"

import { ArrowUp } from "lucide-react"


export default function Home() {
    const [showTop, setShowTop] = useState(false)

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300)
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <Header context="home" />
            <main>
                <HeroSection />
                <ValueProposition />
                <TemplatesSection />
                <DeveloperFeatures />
                <HowItWorks />
                <WhyLevelupSection />
                <ComparisonSection />

                <UseCasesSection />
                <TechStackSection />
                <ApiSection />
                <RoadmapSection />
                <FaqSection />
                <CtaSection />
            </main>
            <Footer />
            {showTop && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        size="lg"
                        className="shadow-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <ArrowUp />
                    </Button>
                </div>
            )}
        </div>
    )
}
