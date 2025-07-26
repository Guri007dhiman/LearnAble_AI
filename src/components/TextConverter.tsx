import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Type, 
  Volume2, 
  FileText, 
  Image, 
  Sparkles, 
  HelpCircle,
  Square,
  AudioWaveform,
  Eye,
  Mic,
  Headphones
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { simplifyText, generateQuiz } from "@/services/geminiService";
import { searchImages } from "@/services/pexelsService";
import { extractTextFromPDF } from "@/services/pdfService";

interface TTSSettings {
  voice: string;
  speed: number;
  pitch: number;
  emphasis: number;
  tone: string;
  highlightWords: boolean;
  pauseLength: number;
}

export const TextConverter = () => {
  const [inputText, setInputText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [letterSpacing, setLetterSpacing] = useState([1.2]);
  const [lineHeight, setLineHeight] = useState([1.8]);
  const [fontSize, setFontSize] = useState([21]);
  const [useDyslexicFont, setUseDyslexicFont] = useState(true);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [quiz, setQuiz] = useState("");
  const [highlightColor, setHighlightColor] = useState("#3b82f6");
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{[key: number]: string}>({});
  const [quizResults, setQuizResults] = useState<{[key: number]: boolean | null}>({});
  const [parsedQuiz, setParsedQuiz] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState("sk_ff733aa44fc141e4ec3ad3303c1c5d4cbd3e18fbddfc4819");
  const [showApiKey, setShowApiKey] = useState(false);
  const [ttsSettings, setTtsSettings] = useState<TTSSettings>({
    voice: "aria",
    speed: 1.0,
    pitch: 1.0,
    emphasis: 1.0,
    tone: "calm",
    highlightWords: true,
    pauseLength: 0.5
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordsRef = useRef<string[]>([]);
  const { toast } = useToast();

  // Voice options with ElevenLabs voice IDs
  // const voices = [
  //   { id: "aria", name: "Aria (Female, Clear)", elevenLabsId: "9BWtsMINqrJLrRacOk9x" },
  //   { id: "sarah", name: "Sarah (Female, Warm)", elevenLabsId: "EXAVITQu4vr4xnSDxMaL" },
  //   { id: "charlie", name: "Charlie (Male, Friendly)", elevenLabsId: "IKne3meq5aSn9XLyUdCD" },
  //   { id: "liam", name: "Liam (Male, Professional)", elevenLabsId: "TX3LPaxmHKxFdv7VOQHJ" },
  //   { id: "charlotte", name: "Charlotte (Female, Gentle)", elevenLabsId: "XB0fDUnXU5powFXDhCwa" }
  // ];
  const voices = [
    { id: "aria", name: "Aria (Female, Clear)", elevenLabsId: "9BWtsMINqrJLrRacOk9x" },
    { id: "sarah", name: "Sarah (Female, Warm)", elevenLabsId: "EXAVITQu4vr4xnSDxMaL" },
    { id: "charlie", name: "Charlie (Male, Friendly)", elevenLabsId: "IKne3meq5aSn9XLyUdCD" },
    { id: "liam", name: "Liam (Male, Professional)", elevenLabsId: "TX3LPaxmHKxFdv7VOQHJ" },
    { id: "charlotte", name: "Charlotte (Female, Gentle)", elevenLabsId: "XB0fDUnXU5powFXDhCwa" }
  ];


  const tones = [
    { id: "calm", name: "Calm & Soothing" },
    { id: "enthusiastic", name: "Enthusiastic" },
    { id: "teacher", name: "Teacher-like" },
    { id: "playful", name: "Playful" },
    { id: "storyteller", name: "Storyteller" }
  ];

  useEffect(() => {
    if (inputText) {
      wordsRef.current = inputText.split(/\s+/).filter(word => word.length > 0);
    }
  }, [inputText]);

  const generateSpeech = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to convert",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey && !showApiKey) {
      setShowApiKey(true);
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key to use advanced TTS features.",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedVoice = voices.find(v => v.id === ttsSettings.voice);
      
      if (apiKey) {
        
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + selectedVoice?.elevenLabsId, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: inputText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.75,
              style: 0.5,
              use_speaker_boost: true
            }
          })
        });

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.playbackRate = ttsSettings.speed;
        }
      } else {
        
        const utterance = new SpeechSynthesisUtterance(inputText);
        utterance.rate = ttsSettings.speed;
        utterance.pitch = ttsSettings.pitch;
        utterance.volume = 1;
        
        speechSynthesis.speak(utterance);
      }

      toast({
        title: "Speech generated",
        description: "Audio is ready to play with dyslexia-friendly settings.",
      });
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate speech. Please check your API key and try again.",
        variant: "destructive"
      });
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        generateSpeech();
        setIsPlaying(true);
      }
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  };

  const downloadAudio = async () => {
    if (!audioRef.current?.src) {
      toast({
        title: "No audio to download",
        description: "Please generate speech first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(audioRef.current.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dyslexia-friendly-audio.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your audio file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the audio file.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPDF(file);
        setInputText(text);
        toast({
          title: "PDF processed",
          description: "Text extracted successfully from PDF.",
        });
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setInputText(text);
        toast({
          title: "File loaded",
          description: "Text file loaded successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Could not extract text from the file.",
        variant: "destructive"
      });
    }
  };

  const handleSimplifyText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to simplify",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    setIsSimplifying(true);
    try {
      const simplified = await simplifyText(inputText);
      setInputText(simplified);
      toast({
        title: "Text simplified",
        description: "Your text has been made more dyslexia-friendly.",
      });
    } catch (error) {
      toast({
        title: "Error simplifying text",
        description: "Could not simplify the text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No content for quiz",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      const generatedQuiz = await generateQuiz(inputText, "easy");
      setQuiz(generatedQuiz);
      
      
      try {
        const quizData = JSON.parse(generatedQuiz);
        if (Array.isArray(quizData)) {
          setParsedQuiz(quizData);
        }
      } catch {
        // If JSON parsing fails, keep as text
        setParsedQuiz([]);
      }
      
      toast({
        title: "Quiz generated",
        description: "A dyslexia-friendly quiz has been created.",
      });
    } catch (error) {
      toast({
        title: "Error generating quiz",
        description: "Could not generate quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSearchImages = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text for image search",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingImages(true);
    try {
      const searchQuery = inputText.slice(0, 100); 
      const foundImages = await searchImages(searchQuery, 4);
      setImages(foundImages);
      toast({
        title: "Images found",
        description: `Found ${foundImages.length} relevant images.`,
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

  const downloadAsText = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to download",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([inputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dyslexia-friendly-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your dyslexia-friendly text has been downloaded.",
    });
  };

  
  useEffect(() => {
    if (!isPlaying || !audioRef.current || !ttsSettings.highlightWords) return;

    const audio = audioRef.current;
    const wordCount = wordsRef.current.length;
    const duration = audio.duration;

    if (!duration || wordCount === 0) return;

    
    const timePerWord = duration / wordCount;

    const updateHighlight = () => {
      const currentTime = audio.currentTime;
      const wordIndex = Math.floor(currentTime / timePerWord);
      setCurrentWordIndex(Math.min(wordIndex, wordCount - 1));
    };

    const interval = setInterval(updateHighlight, 100); 

    return () => clearInterval(interval);
  }, [isPlaying, ttsSettings.highlightWords]);

  const renderTextWithHighlights = () => {
    if (!ttsSettings.highlightWords || !inputText) return inputText;

    return wordsRef.current.map((word, index) => (
      <span
        key={index}
        className={`inline-block mr-2 mb-1 px-2 py-1 rounded transition-all duration-300`}
        style={{
          backgroundColor: index === currentWordIndex ? highlightColor : 'transparent',
          color: index === currentWordIndex ? 'white' : 'inherit',
          transform: index === currentWordIndex ? 'scale(1.05)' : 'scale(1)',
          boxShadow: index === currentWordIndex ? `0 2px 8px ${highlightColor}40` : 'none'
        }}
      >
        {word}
      </span>
    ));
  };

  const handleQuizAnswer = (questionIndex: number, answer: string, correctAnswer: string) => {
    setSelectedQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
    
    setQuizResults(prev => ({
      ...prev,
      [questionIndex]: answer === correctAnswer
    }));
  };

  const textStyle = {
    fontSize: `${fontSize[0]}px`,
    lineHeight: lineHeight[0],
    letterSpacing: `${letterSpacing[0] * 0.1}em`,
    fontFamily: useDyslexicFont ? "'OpenDyslexic', 'Comic Sans MS', cursive" : "inherit",
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Text & PDF to Dyslexia-Friendly Format with Advanced TTS</h2>
        <p className="text-muted-foreground reading-text">
          Upload a PDF or type your text below, customize it for better readability, and use natural voice reading
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Text Input & Advanced TTS
              </CardTitle>
              <CardDescription>
                Enter text and use natural voice reading with dyslexia-friendly settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-4">
                <Label htmlFor="file-upload" className="block mb-2">Upload PDF or Text File</Label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here or upload a PDF/text file..."
                className="min-h-[200px] resize-none text-lg leading-relaxed"
              />
              
              {/* Dyslexia-Friendly Preview with Auto Word Highlighting */}
              {inputText && (
                <div className="p-6 bg-muted/30 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Label className="text-sm font-medium flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Dyslexia-Friendly Preview
                      </Label>
                      {ttsSettings.highlightWords && (
                        <Badge variant="secondary" className="ml-2">Auto Highlighting</Badge>
                      )}
                    </div>
                  </div>

                  {/* Text Customization Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-background/50 rounded-lg border">
                    <div className="space-y-2">
                      <Label className="text-xs">Font Size: {fontSize[0]}px</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        min={12}
                        max={32}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Letter Spacing: {letterSpacing[0].toFixed(1)}</Label>
                      <Slider
                        value={letterSpacing}
                        onValueChange={setLetterSpacing}
                        min={1}
                        max={3}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Line Height: {lineHeight[0].toFixed(1)}</Label>
                      <Slider
                        value={lineHeight}
                        onValueChange={setLineHeight}
                        min={1.2}
                        max={2.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="dyslexic-font" className="text-xs">Dyslexic Font</Label>
                        <Switch
                          id="dyslexic-font"
                          checked={useDyslexicFont}
                          onCheckedChange={setUseDyslexicFont}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Preview */}
                  <div 
                    className="text-lg leading-relaxed p-4 bg-background rounded-lg border-2 border-dashed border-border"
                    style={textStyle}
                  >
                    {ttsSettings.highlightWords ? renderTextWithHighlights() : 
                      inputText.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* TTS Controls */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={generateSpeech} variant="outline">
                  <AudioWaveform className="w-4 h-4 mr-2" />
                  Generate Speech
                </Button>
                <Button onClick={togglePlayback} className="btn-supportive">
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button onClick={stopPlayback} variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
                <Button onClick={downloadAudio} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Audio
                </Button>
              </div>

              {/* Other Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button onClick={handleSimplifyText} disabled={isSimplifying} variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isSimplifying ? "Simplifying..." : "Simplify Text"}
                </Button>
                <Button onClick={downloadAsText} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Text
                </Button>
              </div>

              <audio
                ref={audioRef}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  setCurrentWordIndex(-1);
                }}
                className="w-full"
                controls
              />
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                Voice Settings
              </CardTitle>
              <CardDescription>
                Customize voice settings for dyslexia-friendly reading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Voice Selection</Label>
                <Select 
                  value={ttsSettings.voice} 
                  onValueChange={(value) => setTtsSettings({...ttsSettings, voice: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Voice Tone</Label>
                <Select 
                  value={ttsSettings.tone} 
                  onValueChange={(value) => setTtsSettings({...ttsSettings, tone: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.id} value={tone.id}>
                        {tone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speed: {ttsSettings.speed.toFixed(1)}x</Label>
                <Slider
                  value={[ttsSettings.speed]}
                  onValueChange={([value]) => setTtsSettings({...ttsSettings, speed: value})}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Pitch: {ttsSettings.pitch.toFixed(1)}</Label>
                <Slider
                  value={[ttsSettings.pitch]}
                  onValueChange={([value]) => setTtsSettings({...ttsSettings, pitch: value})}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

               <div className="flex items-center justify-between">
                 <Label>Word Highlighting</Label>
                 <Button
                   variant={ttsSettings.highlightWords ? "default" : "outline"}
                   size="sm"
                   onClick={() => setTtsSettings({...ttsSettings, highlightWords: !ttsSettings.highlightWords})}
                 >
                   {ttsSettings.highlightWords ? "On" : "Off"}
                 </Button>
               </div>

               {ttsSettings.highlightWords && (
                 <div className="space-y-2">
                   <Label>Highlight Color</Label>
                   <div className="flex items-center space-x-2">
                     <Input
                       type="color"
                       value={highlightColor}
                       onChange={(e) => setHighlightColor(e.target.value)}
                       className="w-12 h-10 p-1 border rounded"
                     />
                     <Input
                       type="text"
                       value={highlightColor}
                       onChange={(e) => setHighlightColor(e.target.value)}
                       placeholder="#3b82f6"
                       className="flex-1"
                     />
                   </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Tools Section */}
      {inputText && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Visual Aids
              </CardTitle>
              <CardDescription>
                Find relevant images to help understand the content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSearchImages} disabled={isLoadingImages} className="w-full mb-4">
                <Image className="w-4 h-4 mr-2" />
                {isLoadingImages ? "Finding Images..." : "Find Related Images"}
              </Button>
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image) => (
                    <div key={image.id} className="relative group cursor-pointer">
                      <img 
                        src={image.src.small} 
                        alt={image.alt}
                        className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
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
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        By {image.photographer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <HelpCircle className="w-6 h-6 mr-2" />
                Quiz Generator
              </CardTitle>
              <CardDescription className="text-base">
                Generate a comprehensive, dyslexia-friendly quiz from your content with multiple question types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGenerateQuiz} 
                disabled={isGeneratingQuiz} 
                className="w-full mb-6 btn-supportive text-lg py-3"
                size="lg"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                {isGeneratingQuiz ? "Generating Quiz..." : "Generate Interactive Quiz"}
              </Button>
              {quiz && (
                <div className="bg-gradient-to-br from-muted/20 to-accent/10 p-6 rounded-xl border-2 border-accent/20 min-h-[300px]">
                  {/* Text Customization Controls */}
                  <div className="mb-4 flex items-center gap-4 pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Font Size:</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        min={14}
                        max={28}
                        step={2}
                        className="w-20"
                      />
                      <span className="text-sm">{fontSize[0]}px</span>
                    </div>
                  </div>

                  {parsedQuiz.length > 0 ? (
                    <div className="space-y-6" style={{ fontSize: `${fontSize[0]}px`, lineHeight: lineHeight[0] }}>
                      {parsedQuiz.map((question, index) => (
                        <div key={index} className="p-4 bg-background rounded-lg border">
                          <h3 className="font-semibold mb-3">{question.question}</h3>
                          <div className="space-y-2">
                            {question.options?.map((option: string, optIndex: number) => {
                              const isSelected = selectedQuizAnswers[index] === option;
                              const isCorrect = quizResults[index];
                              const showResult = selectedQuizAnswers[index] !== undefined;
                              
                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => handleQuizAnswer(index, option, question.correct)}
                                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                    !showResult 
                                      ? 'border-border hover:border-primary/50 hover:bg-muted/50'
                                      : isSelected
                                        ? isCorrect
                                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                                          : 'border-red-500 bg-red-50 dark:bg-red-950'
                                        : option === question.correct
                                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                                          : 'border-border'
                                  }`}
                                  disabled={showResult}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                          {quizResults[index] !== undefined && (
                            <div className={`mt-3 p-2 rounded text-sm ${
                              quizResults[index] 
                                ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950' 
                                : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950'
                            }`}>
                              {quizResults[index] ? '✓ Correct!' : '✗ Incorrect. The correct answer is highlighted above.'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="prose prose-lg max-w-none" style={{ fontSize: `${fontSize[0]}px`, lineHeight: lineHeight[0] }}>
                      <pre className="whitespace-pre-wrap leading-relaxed dyslexic-text">{quiz}</pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};