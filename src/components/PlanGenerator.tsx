'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateTrainingPlan } from "@/services/ai-service";

interface SubjectOption {
  label: string;
  value: string;
}

const subjects: SubjectOption[] = [
  { label: "Mathematics", value: "mathematics" },
  { label: "Science", value: "science" },
  { label: "Language Arts", value: "language-arts" },
  { label: "Social Studies", value: "social-studies" },
  { label: "Physical Education", value: "physical-education" },
  { label: "Art", value: "art" },
  { label: "Music", value: "music" },
  { label: "Technology", value: "technology" },
  { label: "Foreign Languages", value: "foreign-languages" },
  { label: "Special Education", value: "special-education" },
];

interface FormData {
  title: string;
  subject: string;
  teachingLevel: string;
  duration: string;
  objectives: string;
  additionalNotes: string;
}

const PlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [openSubjects, setOpenSubjects] = useState(false);
  const [planType, setPlanType] = useState("quick");
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subject: "",
    teachingLevel: "",
    duration: "60",
    objectives: "",
    additionalNotes: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuickTemplate = (template: string) => {
    switch (template) {
      case "new-tech":
        setFormData({
          title: "Integrating New Technology in the Classroom",
          subject: "technology",
          teachingLevel: "All Levels",
          duration: "90",
          objectives: "Introduce teachers to new educational technology tools and demonstrate effective integration into lessons.",
          additionalNotes: "Ensure the session includes hands-on practice with the tools.",
        });
        break;
      case "student-engagement":
        setFormData({
          title: "Increasing Student Engagement Strategies",
          subject: "all",
          teachingLevel: "All Levels",
          duration: "60",
          objectives: "Equip teachers with practical strategies to boost student engagement and participation.",
          additionalNotes: "Focus on inclusive approaches that work for diverse learning styles.",
        });
        break;
      case "assessment":
        setFormData({
          title: "Modern Assessment Techniques",
          subject: "all",
          teachingLevel: "All Levels",
          duration: "75",
          objectives: "Train teachers on effective formative and summative assessment methods.",
          additionalNotes: "Include digital assessment tools that provide immediate feedback.",
        });
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.objectives) {
      toast.error("Please fill out the required fields");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedPlan(null);
    
    try {
      const plan = await generateTrainingPlan(formData);
      setGeneratedPlan(plan);
      toast.success("Training plan generated successfully!");
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate training plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = () => {
    if (!generatedPlan) return;
    
    // Save the generated plan (in a real app, this would connect to your database)
    // For now, we'll just show a success toast
    toast.success("Plan saved successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 staggered-fade-in">
        <h2 className="text-3xl font-bold tracking-tight">Create Your Training Plan</h2>
        <p className="text-lg text-foreground/70 mt-2">
          Generate comprehensive teacher training plans with our AI assistant
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Plan Generator</CardTitle>
            <CardDescription>
              Fill in the details or choose a template to get started
            </CardDescription>
          </CardHeader>
          
          <Tabs value={planType} onValueChange={setPlanType} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="quick">Quick Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick" className="mt-4">
              <div className="grid grid-cols-1 gap-4 p-4">
                <div
                  onClick={() => handleQuickTemplate("new-tech")}
                  className="glass-effect p-4 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-medium">Integrating New Technology</h3>
                  <p className="text-sm text-foreground/70">
                    Help teachers incorporate modern tech tools in their lessons
                  </p>
                </div>
                
                <div
                  onClick={() => handleQuickTemplate("student-engagement")}
                  className="glass-effect p-4 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-medium">Student Engagement Strategies</h3>
                  <p className="text-sm text-foreground/70">
                    Boost participation and involvement in the classroom
                  </p>
                </div>
                
                <div
                  onClick={() => handleQuickTemplate("assessment")}
                  className="glass-effect p-4 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-medium">Modern Assessment Techniques</h3>
                  <p className="text-sm text-foreground/70">
                    Train on effective evaluation methods for student learning
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Training Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="E.g., Effective Classroom Management"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Area</Label>
                      <Popover open={openSubjects} onOpenChange={setOpenSubjects}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSubjects}
                            className="w-full justify-between"
                          >
                            {formData.subject
                              ? subjects.find(subject => subject.value === formData.subject)?.label
                              : "Select subject..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <div className="max-h-[200px] overflow-y-auto p-1">
                            {subjects.map((subject) => (
                              <div
                                key={subject.value}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
                                  formData.subject === subject.value
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted"
                                )}
                                onClick={() => {
                                  handleSelectChange("subject", subject.value);
                                  setOpenSubjects(false);
                                }}
                              >
                                <span>{subject.label}</span>
                                {formData.subject === subject.value && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="teachingLevel">Teaching Level</Label>
                      <Input
                        id="teachingLevel"
                        name="teachingLevel"
                        placeholder="E.g., Elementary, Middle School"
                        value={formData.teachingLevel}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      placeholder="60"
                      min="15"
                      max="240"
                      value={formData.duration}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Learning Objectives</Label>
                    <Textarea
                      id="objectives"
                      name="objectives"
                      placeholder="What teachers should learn from this training"
                      rows={3}
                      value={formData.objectives}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      placeholder="Any specific requirements or focus areas"
                      rows={2}
                      value={formData.additionalNotes}
                      onChange={handleFormChange}
                    />
                  </div>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="button-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>Generated Training Plan</CardTitle>
            <CardDescription>
              Your AI-generated plan will appear here
            </CardDescription>
          </CardHeader>
          
          <CardContent className="h-[400px] overflow-y-auto relative">
            {isGenerating ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-foreground/70">
                    Generating your training plan...
                  </p>
                </div>
              </div>
            ) : generatedPlan ? (
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: generatedPlan }} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-foreground/50">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>Fill out the form and click Generate Plan</p>
                  <p className="text-sm">
                    The AI will create a detailed training plan based on your inputs
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={handleSavePlan} 
              disabled={!generatedPlan || isGenerating}
              className="transition-all duration-300 hover:bg-primary/10"
            >
              Save Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PlanGenerator;
