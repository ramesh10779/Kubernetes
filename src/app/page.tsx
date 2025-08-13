import Link from "next/link";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { scenarios } from "@/lib/scenarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const groupedScenarios = scenarios.reduce((acc, scenario) => {
    const category = scenario.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(scenario);
    return acc;
  }, {} as Record<string, typeof scenarios>);

  return (
    <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center sm:text-left mb-8">Kubernetes Scenarios & Blueprints</h1>

        {Object.entries(groupedScenarios).map(([category, scenariosInCategory]) => (
          <div key={category} className="w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenariosInCategory.map((scenario) => (
                <Link key={scenario.slug} href={`/topics/${scenario.slug}`}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {scenario.content.split('\n')[0].replace(/• \*\*Symptoms\*\* – /, '')}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
      <MadeWithDyad />
    </div>
  );
}