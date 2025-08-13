import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { scenarios } from "@/lib/scenarios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Scenario } from "@/lib/types"; // Import the Scenario type

// Define the expected props type explicitly, including searchParams for full compatibility
type ScenarioDetailPageProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// @ts-ignore: This is a workaround for a persistent Next.js type generation bug.
export default function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const scenario = scenarios.find((s: Scenario) => s.slug === params.slug);

  if (!scenario) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start w-full max-w-4xl mx-auto">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Topics
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-center sm:text-left mb-4">{scenario.title}</h1>
        {scenario.category && (
          <p className="text-lg text-muted-foreground mb-6">{scenario.category}</p>
        )}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{scenario.content}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return scenarios.map((scenario: Scenario) => ({
    slug: scenario.slug,
  }));
}