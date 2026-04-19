// src/data/sampleNews.js
export const sampleNews = {
  general: [
    {
      source: { id: null, name: "TechDaily" },
      author: "Sarah Johnson",
      title: "Global Tech Summit 2024: AI Takes Center Stage",
      description: "World leaders and tech executives gather to discuss the future of artificial intelligence and its impact on global economy.",
      url: "https://example.com/tech-summit-2024",
      urlToImage: "https://picsum.photos/id/0/800/500",
      publishedAt: new Date().toISOString(),
      content: "The annual Global Tech Summit kicked off today with a focus on responsible AI development..."
    },
    {
      source: { id: null, name: "Business Insider" },
      author: "Michael Chen",
      title: "Stock Markets Rally on Positive Economic Data",
      description: "Major indices close higher as inflation shows signs of cooling, boosting investor confidence.",
      url: "https://example.com/markets-rally",
      urlToImage: "https://picsum.photos/id/26/800/500",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      content: "Wall Street ended the week on a high note as fresh data suggests the Federal Reserve may ease interest rates..."
    },
    {
      source: { id: null, name: "Health Weekly" },
      author: "Dr. Emily Watson",
      title: "Breakthrough in Cancer Research: New Treatment Shows Promise",
      description: "Scientists announce major breakthrough in personalized cancer treatment with 80% success rate in trials.",
      url: "https://example.com/cancer-breakthrough",
      urlToImage: "https://picsum.photos/id/116/800/500",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      content: "Researchers have developed a new immunotherapy approach that targets specific cancer cells..."
    },
    {
      source: { id: null, name: "Sports Network" },
      author: "James Rodriguez",
      title: "Champions League Final: Underdogs Advance to Semi-Finals",
      description: "Shocking upsets mark this year's tournament as smaller clubs defeat European giants.",
      url: "https://example.com/champions-league",
      urlToImage: "https://picsum.photos/id/145/800/500",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      content: "In a stunning turn of events, underdogs have secured their spots in the Champions League semi-finals..."
    },
    {
      source: { id: null, name: "Entertainment Today" },
      author: "Lisa Wong",
      title: "Streaming Wars: New Platforms Challenge Industry Leaders",
      description: "Emerging streaming services gain market share with exclusive content and competitive pricing.",
      url: "https://example.com/streaming-wars",
      urlToImage: "https://picsum.photos/id/106/800/500",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      content: "The entertainment landscape is shifting as new players enter the streaming market..."
    },
    {
      source: { id: null, name: "Science Daily" },
      author: "Dr. Robert Martinez",
      title: "Mars Mission Update: Rover Discovers Signs of Ancient Water",
      description: "New data from the Perseverance rover suggests Mars once had vast oceans and potentially harbored life.",
      url: "https://example.com/mars-mission",
      urlToImage: "https://picsum.photos/id/96/800/500",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      content: "NASA's Perseverance rover has uncovered compelling evidence of ancient water flows on Mars..."
    }
  ],
  technology: [
    {
      source: { id: null, name: "TechCrunch" },
      author: "Alex Rivera",
      title: "Apple Announces Revolutionary New Product Line",
      description: "Latest innovations include AR glasses and AI-powered personal assistant.",
      url: "https://example.com/apple-launch",
      urlToImage: "https://picsum.photos/id/0/800/500",
      publishedAt: new Date().toISOString(),
      content: "Apple's annual event showcased groundbreaking technology that promises to reshape how we interact with devices..."
    }
  ],
  business: [
    {
      source: { id: null, name: "Financial Times" },
      author: "Emma Thompson",
      title: "Global Economy Shows Resilience Despite Challenges",
      description: "Economic indicators point to steady growth as markets adapt to changing conditions.",
      url: "https://example.com/global-economy",
      urlToImage: "https://picsum.photos/id/20/800/500",
      publishedAt: new Date().toISOString(),
      content: "The global economy continues to show remarkable resilience in the face of various challenges..."
    }
  ],
  sports: [
    {
      source: { id: null, name: "ESPN" },
      author: "Mike Johnson",
      title: "Historic Comeback: Team Makes Unprecedented Recovery",
      description: "Down 3-0, the underdogs complete the greatest comeback in sports history.",
      url: "https://example.com/sports-comeback",
      urlToImage: "https://picsum.photos/id/145/800/500",
      publishedAt: new Date().toISOString(),
      content: "In what experts are calling the greatest comeback ever witnessed, the team defied all odds..."
    }
  ],
  entertainment: [
    {
      source: { id: null, name: "Hollywood Reporter" },
      author: "Chris Evans",
      title: "Summer Blockbusters Break Box Office Records",
      description: "Record-breaking weekend as multiple films surpass $100 million openings.",
      url: "https://example.com/box-office",
      urlToImage: "https://picsum.photos/id/106/800/500",
      publishedAt: new Date().toISOString(),
      content: "The summer movie season is off to an explosive start with multiple films shattering box office expectations..."
    }
  ],
  science: [
    {
      source: { id: null, name: "Nature" },
      author: "Dr. Sarah Chen",
      title: "Quantum Computing Breakthrough Achieved",
      description: "Scientists achieve quantum supremacy with new 1000-qubit processor.",
      url: "https://example.com/quantum",
      urlToImage: "https://picsum.photos/id/96/800/500",
      publishedAt: new Date().toISOString(),
      content: "A major milestone in quantum computing has been reached, opening new possibilities for computation..."
    }
  ],
  health: [
    {
      source: { id: null, name: "Medical News Today" },
      author: "Dr. James Wilson",
      title: "New Vaccine Shows 95% Effectiveness",
      description: "Revolutionary vaccine technology proves highly effective in large-scale trials.",
      url: "https://example.com/vaccine",
      urlToImage: "https://picsum.photos/id/116/800/500",
      publishedAt: new Date().toISOString(),
      content: "A new approach to vaccine development has shown remarkable results in clinical trials..."
    }
  ]
};

// Generate more articles for each category
const categories = ['technology', 'business', 'sports', 'entertainment', 'science', 'health'];
const titles = [
  "Revolutionary New Technology Changes Everything",
  "Market Analysis: Trends to Watch This Quarter",
  "Championship Preview: Experts Make Their Picks",
  "Exclusive Interview: Rising Star Opens Up",
  "Scientific Discovery Rewrites History Books",
  "Health Breakthrough: New Treatment Available"
];

const sources = ["News Network", "Global Times", "Daily Chronicle", "Metro News", "World Report"];

categories.forEach(cat => {
  if (!sampleNews[cat]) sampleNews[cat] = [];
  for (let i = 0; i < 8; i++) {
    sampleNews[cat].push({
      source: { id: null, name: sources[i % sources.length] },
      author: ["John Smith", "Jane Doe", "Bob Wilson", "Alice Brown"][i % 4],
      title: titles[i % titles.length] + ` - ${new Date().toLocaleDateString()}`,
      description: `This is a sample news article about ${cat}. Stay tuned for real news when API keys are available.`,
      url: `https://example.com/${cat}/article-${i}`,
      urlToImage: `https://picsum.photos/id/${[0, 20, 26, 96, 106, 116, 145][i % 7]}/800/500`,
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      content: `Full article content would appear here. This is sample data while API keys are being configured.`
    });
  }
});