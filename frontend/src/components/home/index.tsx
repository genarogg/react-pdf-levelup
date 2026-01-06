import { Header } from "./header"
import { HeroSection } from "./hero-section"
import { ValueProposition } from "./value-proposition"
import { ComparisonSection } from "./comparison-section"
import { HowItWorks } from "./how-it-works"
import { WhyLevelupSection } from "./why-levelup-section"
import { DeveloperFeatures } from "./developer-features"
import { TemplatesSection } from "./templates-section"
import { UseCasesSection } from "./use-cases-section"
import { TechStackSection } from "./tech-stack-section"
import { RoadmapSection } from "./roadmap-section"
import { FaqSection } from "./faq-section"
import { CtaSection } from "./cta-section"
import { Footer } from "./footer"

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <HeroSection />
                <ValueProposition />
                <ComparisonSection />
                <HowItWorks />
                <WhyLevelupSection />
                <DeveloperFeatures />
                <TemplatesSection />
                <UseCasesSection />
                <TechStackSection />
                <RoadmapSection />
                <FaqSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    )
}
