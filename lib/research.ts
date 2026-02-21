// lib/research.ts

export interface ResearchResult {
  topic: string;
  summary: string;
  keyInsights: string[];
  detailedAnalysis: string;
  statistics?: { label: string; value: string }[];
  timeline?: { year: string; event: string }[];
  relatedConcepts?: string[];
  sources: { title: string; url: string; snippet?: string }[];
  provider?: string;
}

/**
 * Fetches search results from Wikipedia API
 */
async function fetchWikipedia(topic: string) {
  try {
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: topic,
      format: "json",
      origin: "*",
      srlimit: "5",
    });

    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
    const data = await res.json();
    return data.query?.search || [];
  } catch (error) {
    console.error("Wikipedia Fetch Error:", error);
    return [];
  }
}

/**
 * Fetches details for a specific Wikipedia page
 */
async function fetchWikipediaDetails(pageId: number) {
  try {
    const params = new URLSearchParams({
      action: "query",
      prop: "extracts",
      pageids: pageId.toString(),
      format: "json",
      origin: "*",
      exintro: "true",
      explaintext: "true",
    });

    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
    const data = await res.json();
    return data.query?.pages?.[pageId]?.extract || "";
  } catch (error) {
    return "";
  }
}

/**
 * Fetches from OpenLibrary (simulating book search)
 */
async function fetchOpenLibrary(topic: string) {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(topic)}&limit=3`,
    );
    const data = await res.json();
    return (
      data.docs?.map((doc: any) => ({
        title: doc.title,
        author: doc.author_name?.[0] || "Unknown",
        year: doc.first_publish_year,
      })) || []
    );
  } catch (error) {
    return [];
  }
}

/**
 * Aggregates raw data for the LLM to synthesize
 */
export async function performDeepResearch(
  topic: string,
): Promise<{ rawData: string; sources: any[] }> {
  // 1. Fetch Wiki Search Results
  const wikiResults = await fetchWikipedia(topic);
  const sources: any[] = [];
  let rawText = `Research Topic: ${topic}\n\n`;

  // 2. Fetch Details for top 3 Wiki pages
  for (const result of wikiResults.slice(0, 3)) {
    const details = await fetchWikipediaDetails(result.pageid);
    rawText += `Source: Wikipedia - ${result.title}\n${details}\n\n`;
    sources.push({
      title: result.title,
      url: `https://en.wikipedia.org/?curid=${result.pageid}`,
      snippet: result.snippet.replace(/<[^>]*>/g, ""),
    });
  }

  // 3. Fetch Books
  const books = await fetchOpenLibrary(topic);
  if (books.length > 0) {
    rawText += `Related Books:\n`;
    books.forEach((b: any) => {
      rawText += `- ${b.title} by ${b.author} (${b.year})\n`;
      sources.push({
        title: `Book: ${b.title}`,
        url: `https://openlibrary.org/search?q=${encodeURIComponent(b.title)}`,
        snippet: `By ${b.author}, published ${b.year}`,
      });
    });
  }

  return { rawData: rawText, sources };
}
