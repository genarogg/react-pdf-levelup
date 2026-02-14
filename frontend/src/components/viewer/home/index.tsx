// import { Header } from "./header"
import Header from "@/components/viewer/header"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { HeroSection } from "./sections/hero-section"
import { ValueProposition } from "./sections/value-proposition"
import { HowItWorks } from "./sections/how-it-works"
import { DeveloperFeatures } from "./sections/developer-features"
import { TemplatesSection } from "./sections/templates-section"
import { UseCasesSection } from "./sections/use-cases-section"
import { ApiSection } from "./sections/api-section"
import { RoadmapSection } from "./sections/roadmap-section"
import { FaqSection } from "./sections/faq-section"
import { SupportAndDonationsSection } from "./sections/support-donations-section"
import { Footer } from "./sections/footer"

// import { ComparisonSection } from "./sections/comparison-section"
// import { CtaSection } from "./sections/cta-section"
// import { TechStackSection } from "./sections/tech-stack-section"
// import { WhyLevelupSection } from "./sections/why-levelup-section"

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
                <DeveloperFeatures />
                <TemplatesSection />
                <HowItWorks />
                <ApiSection />
                <RoadmapSection />
                <UseCasesSection />
                <SupportAndDonationsSection />
                <FaqSection />

                {/* secciones irrelevantes */}
                {/* <CtaSection /> */}
                {/* <TechStackSection /> */}
                {/* <WhyLevelupSection /> */}
                {/* <ComparisonSection />  */}
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
