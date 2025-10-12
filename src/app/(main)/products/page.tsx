
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Bot, BrainCircuit, Users, TrendingUp, ShieldCheck, PenTool } from 'lucide-react';

const products = [
    {
        for: "Teachers",
        icon: PenTool,
        title: "AI Teaching Assistant & Resource Generator",
        description: "Automate the most time-consuming parts of your job. Our AI, grounded in the official KICD curriculum, helps you create high-quality, compliant teaching materials in seconds.",
        features: [
            "Generate Schemes of Work from curriculum data.",
            "Create detailed, CBE-aligned Lesson Plans.",
            "Produce custom Worksheets and Rubrics for any topic.",
            "Differentiate materials for learners at different levels.",
            "Save all generated content to your personal 'My Library'."
        ]
    },
    {
        for: "Students",
        icon: BrainCircuit,
        title: "Mwalimu AI: Your Personal Socratic Tutor",
        description: "Move beyond memorization. Mwalimu AI is a thinking partner that guides you to answers through questions, fostering critical thinking and a deep understanding of concepts.",
        features: [
            "Explore any subject in the curriculum with a guided chat experience.",
            "Join teacher-created 'Learning Labs' for focused study on specific topics.",
            "Interactive choices and a visual journey map to track your progress.",
            "Receive positive reinforcement and encouragement.",
            "Safe, controlled environment using only teacher-approved materials."
        ]
    },
    {
        for: "Administrators",
        icon: TrendingUp,
        title: "AI Operational Consultant & Analytics Dashboards",
        description: "Lead with data, not just intuition. SyncSenta provides School Heads and County Officers with the real-time insights needed for strategic decision-making and resource allocation.",
        features: [
            "Ask high-level strategic questions and get data-driven answers.",
            "View real-time dashboards on class performance and resource usage.",
            "Manage staff, school finances, and school-wide communications.",
            "Identify at-risk schools or classes needing intervention.",
            "Track resource allocation and teacher engagement across the county."
        ]
    }
];

export default function ProductsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="font-headline text-3xl font-bold">Products & Services</h1>
            <p className="text-muted-foreground">An integrated ecosystem designed for every stakeholder in Kenyan education.</p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {products.map((product) => {
                const Icon = product.icon;
                return (
                     <Card key={product.title} className="flex flex-col">
                        <CardHeader>
                            <div className="mb-4">
                                <span className="text-sm font-semibold text-primary">{product.for}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{product.title}</CardTitle>
                                    <CardDescription className="mt-1">{product.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <ShieldCheck className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    </div>
  );
}
