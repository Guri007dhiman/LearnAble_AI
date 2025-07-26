import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = ({ onStartReading, onLearnMore }: { onStartReading?: () => void, onLearnMore?: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70 z-10" />
      <img 
        src={heroImage} 
        alt="Students reading with confidence" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-6">
          <Heart className="w-8 h-8 text-primary mr-3 animate-heartbeat" />
          <span className="text-primary font-semibold text-lg">LearnAble AI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 reading-text">
          Make <span className="">Reading</span>
          <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent pb-2" style={{lineHeight: '1.1'}}>
            Accessible for Everyone
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto reading-text">
          A full-stack assistive platform designed for learners with dyslexia. 
          Convert any text, create lesson plans, and access powerful reading tools 
          across all platforms and content types.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="btn-supportive text-lg px-8 py-4" onClick={onStartReading}>
            <BookOpen className="w-5 h-5 mr-2" />
            Start Reading Better
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg btn-gentle" onClick={onLearnMore}>
            Learn More
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Text-to-Speech
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            PDF Conversion
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Teaching Plans
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            AI Quiz Generation
          </div>
        </div>
      </div>
    </section>
  );
};