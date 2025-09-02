// create readTime function to generate readTime from content length in post
export function generateReadTime(content: string): number {
  // get the length of content (excluding markdown or html tags)
  const cleanContent = content.replace(/<[^>]*>?/g, "").trim();
  const wordCount = cleanContent.split(/\s+/).length;
  const averageWordsPerMinute = 200;
  return Math.ceil(wordCount / averageWordsPerMinute);
}
