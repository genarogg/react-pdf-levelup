// import { Header } from "./header"
import Header from "../header"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { HeroSection } from "./hero-section"
import { ValueProposition } from "./value-proposition"
import { ComparisonSection } from "./comparison-section"
import { HowItWorks } from "./how-it-works"
import { WhyLevelupSection } from "./why-levelup-section"
import { DeveloperFeatures } from "./developer-features"
import { TemplatesSection } from "./templates-section"
import { UseCasesSection } from "./use-cases-section"
import { TechStackSection } from "./tech-stack-section"
import { ApiSection } from "./api-section"
import { RoadmapSection } from "./roadmap-section"
import { FaqSection } from "./faq-section"
import { CtaSection } from "./cta-section"
import { Footer } from "./footer"

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
                <ComparisonSection />
                <HowItWorks />
                <WhyLevelupSection />

                <ApiSection />
                <UseCasesSection />
                <TechStackSection />
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
