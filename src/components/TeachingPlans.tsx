import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Eye, 
  Headphones, 
  Hand, 
  Clock, 
  Users, 
  Download,
  Sparkles,
  CheckCircle,
  Image,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateTeachingPlan } from "@/services/geminiService";
import { searchImages } from "@/services/pexelsService";

interface LessonPlan {
  title: string;
  objectives: string[];
  structure: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
  visualAids: string[];
  engagementTips: string[];
  effectivenessScore: number;
  learningModes: string[];
}

export const TeachingPlans = () => {
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [duration, setDuration] = useState("");
  const [specificNeeds, setSpecificNeeds] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const { toast } = useToast();

  const generateLessonPlan = async () => {
    if (!topic.trim()) {
      toast({
        title: "Missing topic",
        description: "Please enter a topic for the lesson plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const gradeText = gradeLevel || "elementary";
      const durationText = duration ? `${duration} minutes` : "45 minutes";
      
      const aiPlan = await generateTeachingPlan(topic, gradeText, durationText);
      setAiGeneratedPlan(aiPlan);

      // Also generate the structured plan for UI display
      const generatedPlan: LessonPlan = {
        title: `Understanding ${topic} - Dyslexia-Friendly Approach`,
        objectives: [
          `Students will be able to identify key concepts of ${topic}`,
          "Students will demonstrate understanding through multiple modalities",
          "Students will build confidence in expressing their knowledge",
          "Students will use visual and auditory aids effectively"
        ],
        structure: [
          {
            step: 1,
            title: "Visual Introduction",
            description: `Begin with colorful, high-contrast visual aids showing ${topic}. Use large, clear fonts and minimal text per slide.`,
            duration: "5 minutes"
          },
          {
            step: 2,
            title: "Multisensory Exploration",
            description: "Engage students through tactile activities, audio descriptions, and interactive elements.",
            duration: "10 minutes"
          },
          {
            step: 3,
            title: "Structured Practice",
            description: "Break down complex concepts into smaller, manageable chunks with frequent check-ins.",
            duration: "15 minutes"
          },
          {
            step: 4,
            title: "Creative Expression",
            description: "Allow students to demonstrate understanding through drawing, storytelling, or movement.",
            duration: "10 minutes"
          },
          {
            step: 5,
            title: "Review & Reinforcement",
            description: "Summarize key points using visual memory aids and repetition techniques.",
            duration: "5 minutes"
          }
        ],
        visualAids: [
          "High-contrast color-coded charts",
          "Mind maps with clear branching",
          "Illustrated step-by-step guides",
          "Interactive digital presentations",
          "Physical manipulatives and props"
        ],
        engagementTips: [
          "Use movement breaks every 10 minutes",
          "Provide written instructions alongside verbal ones",
          "Allow extra processing time for responses",
          "Offer multiple ways to demonstrate understanding",
          "Create a calm, supportive environment",
          "Use positive reinforcement frequently"
        ],
        effectivenessScore: 95,
        learningModes: ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"]
      };

      setLessonPlan(generatedPlan);
      
      toast({
        title: "AI Lesson plan generated!",
        description: "Your dyslexia-friendly lesson plan is ready.",
      });
    } catch (error) {
      toast({
        title: "Error generating plan",
        description: "Could not generate the lesson plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchImages = async () => {
    if (!topic) {
      toast({
        title: "No topic specified",
        description: "Please enter a topic first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingImages(true);
    try {
      const foundImages = await searchImages(topic, 6);
      setImages(foundImages);
      toast({
        title: "Images found",
        description: `Found ${foundImages.length} educational images for ${topic}.`,
      });
    } catch (error) {
      toast({
        title: "Error searching images",
        description: "Could not find relevant images.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const downloadPlan = () => {
    if (!lessonPlan) return;

    const content = `
# ${lessonPlan.title}

## Learning Objectives
${lessonPlan.objectives.map(obj => `• ${obj}`).join('\n')}

## Lesson Structure
${lessonPlan.structure.map(step => `
### Step ${step.step}: ${step.title} (${step.duration})
${step.description}
`).join('\n')}

## Visual Aids Needed
${lessonPlan.visualAids.map(aid => `• ${aid}`).join('\n')}

## Engagement Tips
${lessonPlan.engagementTips.map(tip => `• ${tip}`).join('\n')}

## Learning Modes Addressed
${lessonPlan.learningModes.map(mode => `• ${mode}`).join('\n')}

## Effectiveness Score: ${lessonPlan.effectivenessScore}/100
    `;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your lesson plan has been downloaded as a markdown file.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Teaching Plans & Methods</h2>
        <p className="text-muted-foreground reading-text max-w-3xl mx-auto">
          Generate custom dyslexia-aware lesson plans with evidence-based practices, 
          multiple learning modes, and visual aids tailored to your students' needs.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Lesson Details
              </CardTitle>
              <CardDescription>
                Provide information to generate a customized lesson plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic/Subject *</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Fractions, Solar System, Reading Comprehension"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="k-2">K-2 (Ages 5-7)</SelectItem>
                    <SelectItem value="3-5">3-5 (Ages 8-10)</SelectItem>
                    <SelectItem value="6-8">6-8 (Ages 11-13)</SelectItem>
                    <SelectItem value="9-12">9-12 (Ages 14-18)</SelectItem>
                    <SelectItem value="adult">Adult Learners</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learning-style">Primary Learning Style</Label>
                <Select value={learningStyle} onValueChange={setLearningStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual Learner</SelectItem>
                    <SelectItem value="auditory">Auditory Learner</SelectItem>
                    <SelectItem value="kinesthetic">Kinesthetic Learner</SelectItem>
                    <SelectItem value="mixed">Mixed Learning Styles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Lesson Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="needs">Specific Needs (Optional)</Label>
                <Textarea
                  id="needs"
                  value={specificNeeds}
                  onChange={(e) => setSpecificNeeds(e.target.value)}
                  placeholder="e.g., attention challenges, reading level, motor skills..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={generateLessonPlan} 
                  disabled={isGenerating}
                  className="w-full btn-supportive"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating AI Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Lesson Plan
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleSearchImages} 
                  disabled={isLoadingImages}
                  variant="outline"
                  className="w-full"
                >
                  {isLoadingImages ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Finding Images...
                    </>
                  ) : (
                    <>
                      <Image className="w-4 h-4 mr-2" />
                      Find Educational Images
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Lesson Plan */}
        <div className="lg:col-span-2">
          {lessonPlan ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    {lessonPlan.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {lessonPlan.effectivenessScore}% Effective
                    </Badge>
                    <Button onClick={downloadPlan} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lessonPlan.learningModes.map((mode) => (
                    <Badge key={mode} variant="outline" className="flex items-center">
                      {mode === "Visual" && <Eye className="w-3 h-3 mr-1" />}
                      {mode === "Auditory" && <Headphones className="w-3 h-3 mr-1" />}
                      {mode === "Kinesthetic" && <Hand className="w-3 h-3 mr-1" />}
                      {mode}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ai-plan" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="ai-plan">AI Plan</TabsTrigger>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                    <TabsTrigger value="objectives">Objectives</TabsTrigger>
                    <TabsTrigger value="aids">Visual Aids</TabsTrigger>
                    <TabsTrigger value="tips">Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ai-plan" className="space-y-4">
                    <h3 className="text-lg font-semibold mb-3">AI-Generated Lesson Plan</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm reading-text">
                        {aiGeneratedPlan || "Generate a lesson plan to see AI-created content here."}
                      </pre>
                    </div>
                    
                    {/* Educational Images */}
                    {images.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold mb-3 flex items-center">
                          <Image className="w-4 h-4 mr-2" />
                          Educational Visual Aids
                        </h4>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {images.map((image) => (
                             <div key={image.id} className="relative group cursor-pointer">
                               <img 
                                 src={image.src.medium} 
                                 alt={image.alt}
                                 className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                 onClick={() => {
                                   const modal = document.createElement('div');
                                   modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                                   modal.innerHTML = `
                                     <div class="relative max-w-4xl max-h-full">
                                       <img src="${image.src.large}" alt="${image.alt}" class="max-w-full max-h-full object-contain rounded-lg" />
                                       <button class="absolute top-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
                                     </div>
                                   `;
                                   modal.onclick = (e) => {
                                     if (e.target === modal) modal.remove();
                                   };
                                   document.body.appendChild(modal);
                                 }}
                               />
                               <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg">
                                 <div className="truncate">By {image.photographer}</div>
                               </div>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="structure" className="space-y-4">
                    <h3 className="text-lg font-semibold mb-3">Lesson Structure</h3>
                    {lessonPlan.structure.map((step) => (
                      <div key={step.step} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Step {step.step}: {step.title}</h4>
                          <Badge variant="outline" className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground reading-text">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="objectives">
                    <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {lessonPlan.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <Target className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                          <span className="reading-text">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="aids">
                    <h3 className="text-lg font-semibold mb-3">Visual Aids & Materials</h3>
                    <ul className="space-y-2">
                      {lessonPlan.visualAids.map((aid, index) => (
                        <li key={index} className="flex items-start">
                          <Eye className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                          <span className="reading-text">{aid}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="tips">
                    <h3 className="text-lg font-semibold mb-3">Engagement Tips</h3>
                    <ul className="space-y-2">
                      {lessonPlan.engagementTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <Users className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                          <span className="reading-text">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                <p className="text-muted-foreground">
                  Fill in the lesson details and generate your custom dyslexia-friendly lesson plan
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};