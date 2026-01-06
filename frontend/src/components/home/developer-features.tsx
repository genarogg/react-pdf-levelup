import { Check } from "lucide-react"

const features = [
  {
    title: "Fully Typed with TypeScript",
    description: "IntelliSense, autocomplete, and compile-time safety for all components and props.",
  },
  {
    title: "Works with Modern Frameworks",
    description: "Seamless integration with Vite, Next.js, Remix, and Create React App.",
  },
  {
    title: "Composable Components",
    description: "Build complex layouts by combining simple, reusable building blocks.",
  },
  {
    title: "Easy Theming & Customization",
    description: "Override colors, fonts, and spacing with a simple theme object or CSS-like syntax.",
  },
  {
    title: "Designed for Scale",
    description: "Generate thousands of PDFs efficiently with optimized rendering and caching.",
  },
]

const codeExample = `interface InvoiceProps {
  logo?: string;
  client: ClientInfo;
  items: LineItem[];
  currency?: 'USD' | 'EUR' | 'GBP';
  dueDate?: string;
  notes?: string;
  theme?: ThemeConfig;
  onRender?: (blob: Blob) => void;
}`

export function DeveloperFeatures() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Features */}
          <div>
            <h2 className="text-4xl font-bold mb-4 text-balance">Built for Developers</h2>
            <p className="text-muted-foreground mb-12 text-pretty leading-relaxed">
              We obsess over the little things so you can focus on shipping. Every API decision is made with developer
              experience in mind.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-cyan-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Code example */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-card border rounded-lg shadow-lg overflow-hidden">
              {/* Window controls */}
              <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-2 text-sm text-muted-foreground font-mono">types.d.ts</span>
              </div>

              {/* Code content */}
              <div className="p-6 bg-card">
                <pre className="text-sm leading-relaxed">
                  <code className="font-mono">
                    <span className="text-purple-600">interface</span>{" "}
                    <span className="text-yellow-600">InvoiceProps</span> <span className="text-foreground">{"{"}</span>
                    {"\n  "}
                    <span className="text-blue-600">logo?</span>
                    <span className="text-foreground">:</span> <span className="text-cyan-600">string</span>
                    <span className="text-foreground">;</span>
                    {"\n  "}
                    <span className="text-blue-600">client</span>
                    <span className="text-foreground">:</span> <span className="text-yellow-600">ClientInfo</span>
                    <span className="text-foreground">;</span>
                    {"\n  "}
                    <span className="text-blue-600">items</span>
                    <span className="text-foreground">:</span> <span className="text-yellow-600">LineItem</span>
                    <span className="text-foreground">[];</span>
                    {"\n  "}
                    <span className="text-blue-600">currency?</span>
                    <span className="text-foreground">:</span> <span className="text-green-600">'USD'</span>
                    <span className="text-foreground"> | </span>
                    <span className="text-green-600">'EUR'</span>
                    <span className="text-foreground"> | </span>
                    <span className="text-green-600">'GBP'</span>
                    <span className="text-foreground">;</span>
                    {"\n  "}
                    <span className="text-blue-600">dueDate?</span>
                    <span className="text-foreground">:</span> <span className="text-cyan-600">string</span>
                    <span className="text-foreground">;</span>
                    {"\n  "}
                    <span className="text-blue-600">notes?</span>
                    <span className="text-foreground">:</span> <span className="text-cyan-600">string</span>
                    <span className="text-foreground">;</span>
                    {"\n  "}
                    <span className="text-blue-600">theme?</span>
                    <span className="text-foreground">:</span> <span className="text-yellow-600">ThemeConfig</span>
                    <span className="text-foreground">;</span>
                    {"\n  "}
                    <span className="text-blue-600">onRender?</span>
                    <span className="text-foreground">:</span> <span className="text-foreground">(</span>
                    <span className="text-blue-600">blob</span>
                    <span className="text-foreground">:</span> <span className="text-yellow-600">Blob</span>
                    <span className="text-foreground">) {"=>"} </span>
                    <span className="text-cyan-600">void</span>
                    <span className="text-foreground">;</span>
                    {"\n"}
                    <span className="text-foreground">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
