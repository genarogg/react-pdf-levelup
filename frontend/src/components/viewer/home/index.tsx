// import { Header } from "./header"
import Layout from "../layout"

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


// import { ComparisonSection } from "./sections/comparison-section"
// import { CtaSection } from "./sections/cta-section"
// import { TechStackSection } from "./sections/tech-stack-section"
// import { WhyLevelupSection } from "./sections/why-levelup-section"

// import { ArrowUp } from "lucide-react"


export default function Home() {


    return (
        <div className="min-h-screen bg-background">
            <Layout context="home">
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
            </Layout>
        </div>
    )
}
