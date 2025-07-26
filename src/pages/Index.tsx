import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ModuleCard } from "@/components/ModuleCard";
import { TextConverter } from "@/components/TextConverter";
import { TeachingPlans } from "@/components/TeachingPlans";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  ArrowLeft,
  GraduationCap,
  Accessibility,
  Users
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRef } from "react";

type ActiveModule = 'home' | 'text-converter' | 'lesson-plans';

const Index = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const impactRef = useRef<HTMLDivElement>(null);

  const modules = [
    {
      id: 'lesson-plans' as ActiveModule,
      title: 'Teaching Plans & Methods',
      description: 'Generate custom dyslexia-aware lesson plans with multiple learning modes and visual aids',
      icon: GraduationCap,
      comingSoon: false
    },
    {
      id: 'text-converter' as ActiveModule,
      title: 'Text & PDF to Dyslexia-Friendly Format with Advanced TTS',
      description: 'Convert any text or PDF to dyslexia-friendly format with customizable fonts, spacing, and natural voice reading',
      icon: FileText,
      comingSoon: false
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'text-converter':
        return <TextConverter />;
      case 'lesson-plans':
        return <TeachingPlans />;
      default:
        return null;
    }
  };

  if (activeModule !== 'home') {
    return (
      <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setActiveModule('home')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Modules
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>
        <main>
          {renderActiveModule()}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Hero 
        onStartReading={() => setActiveModule('text-converter')}
        onLearnMore={() => impactRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Powerful Tools for Every Learning Style</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto reading-text">
              Our comprehensive platform provides everything educators, students, and families need 
              to make reading accessible and enjoyable for learners with dyslexia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                comingSoon={module.comingSoon}
                onClick={() => !module.comingSoon && setActiveModule(module.id)}
              />
            ))}
          </div>

          {/* Impact Stats */}
          <div ref={impactRef} className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Real-World Impact</h3>
              <p className="text-muted-foreground">Empowering learners and educators worldwide</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <Users className="w-8 h-8 text-primary mx-auto" />
                <div className="text-2xl font-bold">10%</div>
                <p className="text-sm text-muted-foreground">of the population has dyslexia</p>
              </div>
              <div className="space-y-2">
                <BookOpen className="w-8 h-8 text-primary mx-auto" />
                <div className="text-2xl font-bold">85%</div>
                <p className="text-sm text-muted-foreground">improvement in reading confidence</p>
              </div>
              <div className="space-y-2">
                <Accessibility className="w-8 h-8 text-primary mx-auto" />
                <div className="text-2xl font-bold">24/7</div>
                <p className="text-sm text-muted-foreground">accessible learning support</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Learning?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of educators and learners who are already using our platform 
              to make reading more accessible and enjoyable.
            </p>
            <Button 
              size="lg" 
              className="btn-supportive text-lg px-8 py-4 mb-4"
              onClick={() => setActiveModule('text-converter')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Try Text Converter Now
            </Button>
            <div className="text-sm text-muted-foreground mt-8 p-4 bg-muted/20 rounded-lg inline-block">
              Created by <span className="font-semibold text-primary">Team Thunderbolts</span> 
              <span className="mx-2">⚡</span>
              <span className="text-xs">Hackathon Project</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
