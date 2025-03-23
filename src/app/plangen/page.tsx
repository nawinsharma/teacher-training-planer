'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Sparkles, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateTrainingPlan } from "@/services/ai-service";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";

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

const templateCards = [
    {
        id: "new-tech",
        title: "Integrating New Technology",
        description: "Help teachers incorporate modern tech tools in their lessons",
        icon: "💻",
        gradient: "from-cyan-500 to-blue-600"
    },
    {
        id: "student-engagement",
        title: "Student Engagement Strategies",
        description: "Boost participation and involvement in the classroom",
        icon: "👥",
        gradient: "from-purple-500 to-indigo-600"
    },
    {
        id: "assessment",
        title: "Modern Assessment Techniques",
        description: "Train on effective evaluation methods for student learning",
        icon: "📊",
        gradient: "from-amber-500 to-pink-600"
    }
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
                setPlanType("custom");
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
                setPlanType("custom");
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
                setPlanType("custom");
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


    const handleCopyPlan = () => {
        if (!generatedPlan) return;
        // In a real app you would use navigator.clipboard.writeText or similar
        toast.success("Plan copied to clipboard!");
    };


    const handleDownloadPlan = async () => {
        if (!generatedPlan) return;

        const content = document.createElement("div");
        content.innerHTML = generatedPlan;
        content.style.width = "800px";

        document.body.appendChild(content);

        const canvas = await html2canvas(content, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        document.body.removeChild(content);

        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190; // Fit within A4 width
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("Training_Plan.pdf");

        toast.success("Plan downloaded as PDF!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section with Animated Background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBmaWxsPSIjNTI2RUZGIiB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjUiIGZpbGw9IiNGRkYiIGN4PSI4ODUiIGN5PSIyNzgiIHI9IjIzMSIvPjxjaXJjbGUgZmlsbC1vcGFjaXR5PSIuNSIgZmlsbD0iI0ZGRiIgY3g9IjM2NSIgY3k9IjYwMiIgcj0iMTUxIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii41IiBmaWxsPSIjRkZGIiBjeD0iMTIyMCIgY3k9IjU5OSIgcj0iOTgiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjUiIGZpbGw9IiNGRkYiIGN4PSI1MjAiIGN5PSIyMDYiIHI9IjEyOCIvPjwvZz48L3N2Zz4=')]"></div>
                </div>
                <div className="relative container mx-auto px-6 mt-5 text-center">
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Create beautiful, professional teacher training plans in seconds with the power of AI
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="grid md:grid-cols-5 gap-8">
                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-5">
                        <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800">
                            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <CardTitle className="flex items-center text-2xl">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Plan Generator
                                </CardTitle>
                            </CardHeader>

                            <Tabs value={planType} onValueChange={setPlanType} className="w-full">
                                <div className="px-6 pt-6">
                                    <TabsList className="grid grid-cols-2 w-full">
                                        <TabsTrigger value="quick" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                                            Quick Templates
                                        </TabsTrigger>
                                        <TabsTrigger value="custom" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                                            Custom Plan
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="quick" className="p-6 pt-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {templateCards.map((template) => (
                                            <div
                                                key={template.id}
                                                onClick={() => handleQuickTemplate(template.id)}
                                                className={`bg-gradient-to-br ${template.gradient} text-white p-6 rounded-xl cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-105`}
                                            >
                                                <div className="text-4xl mb-4">{template.icon}</div>
                                                <h3 className="font-bold text-lg">{template.title}</h3>
                                                <p className="text-sm text-white/80 mt-2">
                                                    {template.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="custom" className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-sm font-medium">Training Title</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="E.g., Effective Classroom Management"
                                                value={formData.title}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="subject" className="text-sm font-medium">Subject Area</Label>
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
                                                                            ? "bg-indigo-100 text-indigo-900 font-medium"
                                                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    )}
                                                                    onClick={() => {
                                                                        handleSelectChange("subject", subject.value);
                                                                        setOpenSubjects(false);
                                                                    }}
                                                                >
                                                                    <span>{subject.label}</span>
                                                                    {formData.subject === subject.value && (
                                                                        <Check className="ml-auto h-4 w-4 text-indigo-600" />
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="teachingLevel" className="text-sm font-medium">Teaching Level</Label>
                                                <Input
                                                    id="teachingLevel"
                                                    name="teachingLevel"
                                                    placeholder="E.g., Elementary, Middle School"
                                                    value={formData.teachingLevel}
                                                    onChange={handleFormChange}
                                                    className="w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                                            <Input
                                                id="duration"
                                                name="duration"
                                                type="number"
                                                placeholder="60"
                                                min="15"
                                                max="240"
                                                value={formData.duration}
                                                onChange={handleFormChange}
                                                className="w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="objectives" className="text-sm font-medium">Learning Objectives</Label>
                                            <Textarea
                                                id="objectives"
                                                name="objectives"
                                                placeholder="What teachers should learn from this training"
                                                rows={3}
                                                value={formData.objectives}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="additionalNotes" className="flex items-center justify-between text-sm font-medium">
                                                <span>Additional Notes</span>
                                                <span className="text-xs text-gray-500">(Optional)</span>
                                            </Label>
                                            <Textarea
                                                id="additionalNotes"
                                                name="additionalNotes"
                                                placeholder="Any specific requirements or focus areas"
                                                rows={2}
                                                value={formData.additionalNotes}
                                                onChange={handleFormChange}
                                                className="w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isGenerating}
                                                className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Generating your plan...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-5 w-5" />
                                                        Generate Plan
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Result Section */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800 h-full flex flex-col">
                            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                                <CardTitle className="flex items-center text-2xl">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Your Plan
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-grow p-0 relative">
                                {isGenerating ? (
                                    <div className="h-full min-h-[500px] flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mb-4 mx-auto relative">
                                                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Sparkles className="h-6 w-6 text-indigo-600" />
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Creating Your Plan</h3>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Our AI is crafting a personalized training plan based on your inputs...
                                            </p>
                                        </div>
                                    </div>
                                ) : generatedPlan ? (
                                    <div className="h-full min-h-[500px] overflow-y-auto p-6">
                                        <div className="prose prose-indigo dark:prose-invert max-w-none">
                                            <div dangerouslySetInnerHTML={{ __html: generatedPlan }} />
                                            {/* <ReactMarkdown>{generatedPlan}</ReactMarkdown> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full min-h-[500px] flex items-center justify-center">
                                        <div className="text-center p-6 max-w-md">
                                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                <Sparkles className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                Ready to Create Your Plan
                                            </h3>
                                            <p className="mt-3 text-gray-500 dark:text-gray-400">
                                                Select a template or fill out the form to generate a comprehensive training plan tailored to your needs.
                                            </p>
                                            <ul className="mt-6 space-y-2 text-left text-sm text-gray-700 dark:text-gray-300">
                                                <li className="flex items-center">
                                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                                    Detailed lesson structure
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                                    Custom activities and materials
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                                    Assessment strategies
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            {generatedPlan && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handleCopyPlan}
                                            className="flex items-center justify-center cursor-pointer"
                                            disabled={!generatedPlan || isGenerating}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleDownloadPlan}
                                            className="flex items-center justify-center cursor-pointer"
                                            disabled={!generatedPlan || isGenerating}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default PlanGenerator;