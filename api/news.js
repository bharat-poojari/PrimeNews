import { XMLParser } from "fast-xml-parser";

const PAGE_SIZE = 30;
const FEED_CACHE_TTL = 3 * 60 * 1000;
const FEED_TIMEOUT_MS = 9000;
const feedCache = new Map();
const feedRequests = new Map();

const FEEDS = {
  general: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/world/rss" },
    { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml" },
    { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    { name: "DW", url: "https://rss.dw.com/rdf/rss-en-all" },
  ],
  world: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/world/rss" },
    { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    { name: "DW", url: "https://rss.dw.com/rdf/rss-en-all" },
  ],
  nation: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/us-news/rss" },
    { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml" },
  ],
  india: [
    { name: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss" },
    { name: "The Times of India", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms" },
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml" },
  ],
  business: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/business/rss" },
    { name: "NPR", url: "https://feeds.npr.org/1006/rss.xml" },
    { name: "DW", url: "https://rss.dw.com/rdf/rss-en-all", topic: "business" },
  ],
  technology: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/technology/rss" },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", topic: "technology" },
    { name: "NPR", url: "https://feeds.npr.org/1019/rss.xml" },
  ],
  entertainment: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/culture/rss" },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", topic: "entertainment" },
    { name: "NPR", url: "https://feeds.npr.org/1008/rss.xml" },
  ],
  sports: [
    { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/sport/rss" },
    { name: "ESPN", url: "https://www.espn.com/espn/rss/news" },
    { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", topic: "sports" },
  ],
  science: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/science/rss" },
    { name: "NPR", url: "https://feeds.npr.org/1007/rss.xml" },
    { name: "DW", url: "https://rss.dw.com/rdf/rss-en-all", topic: "science" },
  ],
  health: [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/health/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/society/health/rss" },
    { name: "NPR", url: "https://feeds.npr.org/1128/rss.xml" },
  ],
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => name === "item" || name === "entry",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { endpoint, category = "general", page = "1", q = "" } = req.query;
  const normalizedCategory = String(category || "general").toLowerCase();
  const feeds = resolveFeeds(endpoint, normalizedCategory, q);

  if (!feeds.length) {
    return res.status(400).json({ error: "Unsupported news request" });
  }

  try {
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const feedResults = await Promise.allSettled(feeds.map(fetchFeed));
    feedResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.warn(`${feeds[index].name} feed unavailable: ${result.reason.message}`);
      }
    });
    const articles = deduplicateArticles(
      feedResults.flatMap((result) => result.status === "fulfilled" ? result.value : [])
    );

    if (articles.length === 0) {
      return res.status(502).json({ error: "Live news is temporarily unavailable" });
    }

    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
    return res.status(200).json({
      articles: articles.slice(startIndex, startIndex + PAGE_SIZE),
      totalResults: articles.length,
      sources: [...new Set(articles.map((article) => article.source.name))],
    });
  } catch (error) {
    console.error("Live news request failed:", error.message);
    return res.status(502).json({ error: "Live news is temporarily unavailable" });
  }
}

function resolveFeeds(endpoint, category, query) {
  if (endpoint === "top-headlines") {
    return FEEDS[category] || FEEDS.general;
  }

  if (endpoint === "search" && String(query || "").trim()) {
    const searchTerm = encodeURIComponent(String(query).trim());
    return [{ name: "Google News", url: `https://news.google.com/rss/search?q=${searchTerm}&hl=en-US&gl=US&ceid=US:en` }];
  }

  return [];
}

async function fetchFeed(feed) {
  const cacheKey = `${feed.url}::${feed.topic || ""}`;
  const cached = feedCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.articles;
  if (feedRequests.has(cacheKey)) return feedRequests.get(cacheKey);

  const request = loadFeed(feed)
    .then((articles) => {
      feedCache.set(cacheKey, { articles, expiresAt: Date.now() + FEED_CACHE_TTL });
      return articles;
    })
    .catch((error) => {
      if (cached?.articles.length) return cached.articles;
      throw error;
    })
    .finally(() => feedRequests.delete(cacheKey));

  feedRequests.set(cacheKey, request);
  return request;
}

async function loadFeed(feed) {
  const response = await fetch(feed.url, {
    headers: {
      "User-Agent": "PrimeNews/1.0 (news reader)",
      Accept: "application/rss+xml, application/atom+xml, application/rdf+xml, application/xml, text/xml",
    },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`${feed.name} feed returned ${response.status}`);

  const parsed = parser.parse(await response.text());
  const rssChannel = parsed.rss?.channel;
  const atomFeed = parsed.feed;
  const rdfFeed = parsed["rdf:RDF"];
  const items = rssChannel?.item || atomFeed?.entry || rdfFeed?.item || [];

  return items
    .filter((item) => !feed.topic || matchesTopic(item, feed.topic))
    .map((item) => normalizeArticle(item, feed))
    .filter((article) => article.title && /^https?:\/\//i.test(article.url));
}

function matchesTopic(item, topic) {
  const categories = Array.isArray(item.category) ? item.category : [item.category];
  const labels = [item["dc:subject"], ...categories]
    .map((value) => {
      if (value && typeof value === "object") return value["@_term"] || value["#text"] || "";
      return value || "";
    })
    .map((value) => plainText(value).toLowerCase());
  const terms = {
    business: ["business", "economy", "economics", "finance", "financial", "markets"],
    sports: ["sport", "sports"],
    science: ["science", "environment", "climate"],
    technology: ["technology", "tech", "gadgets", "ai", "software", "computing", "mobile"],
    entertainment: ["entertainment", "culture", "film", "music", "streaming", "television", "movies"],
  }[topic] || [topic];

  return labels.some((label) => terms.some((term) => label.includes(term)));
}

function normalizeArticle(item, feed) {
  const content = textValue(item["content:encoded"] || item.content);
  const description = plainText(item.description || item.summary || content);
  const atomLink = Array.isArray(item.link)
    ? item.link.find((link) => link["@_rel"] === "alternate") || item.link[0]
    : item.link;
  const url = textValue(atomLink?.["@_href"] || atomLink || item.guid || item.id);
  const sourceName = plainText(item.source || feed.name);
  const image = findImage(item, content || textValue(item.description) || textValue(item.summary));

  return {
    source: { id: null, name: sourceName || feed.name, url: feed.url },
    author: plainText(item["dc:creator"] || item.creator || item.author?.name || item.author) || null,
    title: plainText(item.title),
    description,
    url,
    urlToImage: image,
    publishedAt: textValue(item.pubDate || item.published || item.updated || item["dc:date"]) || new Date().toISOString(),
    content: plainText(content) || description,
  };
}

function textValue(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return textValue(value[0]);
  if (typeof value === "object") return textValue(value["#text"] ?? value["__cdata"] ?? "");
  return String(value);
}

function plainText(value = "") {
  return textValue(value)
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\u0027/gi, "'")
    .replace(/\\u0022/gi, '"')
    .replace(/\\u00a0/gi, " ")
    .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&rsquo;|&#8217;|&lsquo;|&#8216;/gi, "'")
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/gi, '"')
    .replace(/&ndash;|&mdash;|&#8211;|&#8212;/gi, "-")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&hellip;/gi, "\u2026")
    .replace(/&#(x[\da-f]+|\d+);/gi, (entity, code) => {
      const isHex = code[0].toLowerCase() === "x";
      const codePoint = Number.parseInt(isHex ? code.slice(1) : code, isHex ? 16 : 10);
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function findImage(item, html = "") {
  const mediaCandidates = [item["media:thumbnail"], item["media:content"], item.enclosure, item["itunes:image"]];
  for (const candidate of mediaCandidates) {
    const imageUrl = imageUrlFrom(candidate);
    if (imageUrl) return upgradeImageUrl(imageUrl);
  }

  const imageMatch = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  return imageMatch?.[1] ? upgradeImageUrl(imageMatch[1].replace(/&amp;/g, "&")) : null;
}

function imageUrlFrom(value) {
  if (Array.isArray(value)) {
    for (const candidate of value) {
      const url = imageUrlFrom(candidate);
      if (url) return url;
    }
    return null;
  }
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return null;

  return value["@_url"] || value["@_href"] || value.url || value.link || null;
}

function upgradeImageUrl(url) {
  return String(url)
    .replace("/standard/240/", "/standard/1024/")
    .replace(/([?&]width=)\d+/i, (_, parameter) => `${parameter}1000`);
}

function deduplicateArticles(articles) {
  const seenUrls = new Set();
  const seenTitles = new Set();

  return articles
    .filter((article) => {
      const normalizedUrl = article.url.split("?")[0].replace(/\/$/, "").toLowerCase();
      const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seenUrls.has(normalizedUrl) || seenTitles.has(normalizedTitle)) return false;
      seenUrls.add(normalizedUrl);
      seenTitles.add(normalizedTitle);
      return true;
    })
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
}