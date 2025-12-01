import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Figma,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  ArrowRight,
  Check,
  Github,
  MessageSquare,
  Eye,
  Download,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CodeMe</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Powered by GPT-4, Claude & Gemini</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Apps with <span className="gradient-text">AI Magic</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your ideas into fully functional web and mobile apps. Just describe what you want, and let AI write the code for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 gap-2">
                Start Building Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="gap-2">
                <Eye className="w-4 h-4" /> Watch Demo
              </Button>
            </Link>
          </div>
          
          {/* Hero Image/Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-blue-500/20 blur-3xl" />
            <div className="relative glass rounded-2xl p-4 shadow-2xl">
              <div className="bg-background/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground ml-4">CodeMe Editor</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 h-64">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">File Explorer</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm"><Code2 className="w-4 h-4 text-blue-400" /> App.tsx</div>
                      <div className="flex items-center gap-2 text-sm"><Code2 className="w-4 h-4 text-green-400" /> index.css</div>
                      <div className="flex items-center gap-2 text-sm"><Code2 className="w-4 h-4 text-yellow-400" /> utils.ts</div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">AI Chat</p>
                    <div className="space-y-2 text-sm">
                      <div className="bg-violet-500/20 rounded p-2">Create a landing page</div>
                      <div className="bg-blue-500/20 rounded p-2">✨ Generating code...</div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Live Preview</p>
                    <div className="bg-white/10 rounded h-full flex items-center justify-center">
                      <Globe className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Build</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From AI code generation to live preview, CodeMe has all the tools to bring your ideas to life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass border-white/10 hover:border-violet-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI Chat Interface</CardTitle>
                <CardDescription>
                  Describe your app in plain English. Our AI understands context and generates production-ready code.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass border-white/10 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Multiple AI Models</CardTitle>
                <CardDescription>
                  Choose from GPT-4, Claude, or Gemini. Each model brings unique strengths to your project.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass border-white/10 hover:border-pink-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
                  <Figma className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Figma to Code</CardTitle>
                <CardDescription>
                  Import your Figma designs and convert them to React or React Native components instantly.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass border-white/10 hover:border-green-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Monaco Editor</CardTitle>
                <CardDescription>
                  Full-featured code editor with syntax highlighting, IntelliSense, and file management.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass border-white/10 hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See your changes in real-time with responsive viewport options for desktop, tablet, and mobile.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass border-white/10 hover:border-cyan-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Export & Deploy</CardTitle>
                <CardDescription>
                  Download your project as a ZIP file or deploy directly to Vercel, Netlify, or other platforms.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Types Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Build Any Type of App</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether it&apos;s a web app or mobile app, CodeMe supports multiple frameworks and platforms.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="glass border-white/10 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Web Apps</h3>
                  <p className="text-muted-foreground">React & Next.js</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> React 18 with Hooks</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Next.js 14 App Router</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> TypeScript support</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Tailwind CSS styling</li>
              </ul>
            </Card>
            <Card className="glass border-white/10 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Android Apps</h3>
                  <p className="text-muted-foreground">React Native & Flutter</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> React Native CLI</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Expo managed workflow</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Flutter widgets</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Native device APIs</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For hobbyists and learners</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> 3 projects</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> 50 AI generations/day</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> GPT-3.5 model</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Community support</li>
                </ul>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="glass border-violet-500/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For professional developers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Unlimited projects</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Unlimited generations</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> GPT-4, Claude, Gemini</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Figma to Code</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Priority support</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>For teams and organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> 5 team members</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Shared projects</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Custom integrations</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Dedicated support</li>
                </ul>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of developers who are building faster with AI. Start your free account today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 gap-2">
                    <Zap className="w-4 h-4" /> Start Building Free
                  </Button>
                </Link>
                <Link href="https://github.com" target="_blank">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Github className="w-4 h-4" /> View on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">CodeMe</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CodeMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
