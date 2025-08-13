export type Scenario = {
  slug: string;
  title: string;
  category?: string;
  content: string;
};

// Define a generic PageProps type for Next.js App Router pages
export type PageProps<
  Params extends Record<string, string | string[]> = Record<string, string | string[]>,
  SearchParams extends Record<string, string | string[]> = Record<string, string | string[]>,
> = {
  params: Params;
  searchParams?: SearchParams; // searchParams is optional for pages that don't use it
};