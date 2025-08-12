import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

interface SummarizeRequest {
  url: string;
  mode: 'normal' | 'roast' | 'angry';
  stream?: boolean;
  brochure?: boolean;
  existingContent?: string;
}

interface SummarizeResponse {
  success: boolean;
  summary?: string;
  websiteTitle?: string;
  error?: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompts
const DEFAULT_SYSTEM_PROMPT = `You are a highly intelligent assistant that analyzes the content of a website and provides a concise and easy-to-read summary. Ignore any text that appears to be part of navigation, headers, or footers. Your response must be in Markdown.`;

const ROAST_SYSTEM_PROMPT = `You are a witty and sarcastic comedian who has been forced to summarize websites. Analyze the content of the following website and provide a funny, slightly roasting summary. Ignore navigation, headers, and footers. Your response must be in Markdown.`;

const ANGRY_SYSTEM_PROMPT = `You are a highly critical and frustrated analyst who has been forced to review websites. Analyze the content of the following website and provide a harsh, impatient, and angry critique that points out flaws, inconsistencies, and problems in a very critical tone. Be highly critical, frustrated, and point out everything wrong with the content, design, or approach. Your response must be in Markdown.`;

const BROCHURE_SYSTEM_PROMPT = `You are a professional marketing copywriter. Transform the provided content into a concise, well-formatted, and visually appealing marketing brochure. Create compelling headlines, organize information clearly, and use persuasive language that highlights key benefits and features. Format the response as a professional brochure with clear sections, bullet points, and engaging copy. Your response must be in Markdown.`;

// Helper function to clean and extract text from HTML
function extractWebsiteContent(html: string) {
  const $ = cheerio.load(html);
  
  // Extract title
  const title = $('title').first().text().trim() || 'Untitled Website';
  
  // Remove unwanted elements
  $('script, style, nav, header, footer, aside, .nav, .navigation, .menu, .sidebar, .ads, .advertisement').remove();
  
  // Extract main content areas
  const contentSelectors = [
    'main',
    'article', 
    '.content',
    '.main-content',
    '.post-content',
    '.entry-content',
    '#content',
    '#main',
    'body'
  ];
  
  let mainContent = '';
  
  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length) {
      mainContent = element.text();
      break;
    }
  }
  
  // If no main content found, fall back to body
  if (!mainContent) {
    mainContent = $('body').text();
  }
  
  // Clean up the text
  const cleanText = mainContent
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
    .trim();
  
  return {
    title,
    text: cleanText.substring(0, 8000) // Limit to 8000 characters to avoid token limits
  };
}

// Helper function to validate URL
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SummarizeResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { url, mode = 'normal', stream = false, brochure = false, existingContent }: SummarizeRequest = req.body;

    // Validate input
    if (!url && !brochure) {
      return res.status(400).json({
        success: false,
        error: 'URL is required for website summarization.'
      });
    }

    if (brochure && !existingContent) {
      return res.status(400).json({
        success: false,
        error: 'Existing content is required for brochure generation.'
      });
    }

    if (url && !isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL. Please provide a valid HTTPS URL.'
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is not configured.'
      });
    }

    let websiteTitle = '';
    let websiteText = '';

    if (!brochure) {
      // Fetch website content
      let websiteHtml: string;
      try {
        const response = await axios.get(url, {
          timeout: 10000, // 10 second timeout
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          }
        });
        websiteHtml = response.data;
      } catch (error) {
        console.error('Error fetching website:', error);
        return res.status(400).json({
          success: false,
          error: 'Failed to fetch website content. Please check the URL and try again.'
        });
      }

      // Extract and clean content
      const extracted = extractWebsiteContent(websiteHtml);
      websiteTitle = extracted.title;
      websiteText = extracted.text;

      if (!websiteText || websiteText.length < 100) {
        return res.status(400).json({
          success: false,
          error: 'Unable to extract meaningful content from the website.'
        });
      }
    }

    // Prepare OpenAI request
    let systemPrompt: string;
    let userPrompt: string;

    if (brochure) {
      systemPrompt = BROCHURE_SYSTEM_PROMPT;
      userPrompt = `Transform the following content into a professional marketing brochure:

${existingContent}`;
    } else {
      switch (mode) {
        case 'roast':
          systemPrompt = ROAST_SYSTEM_PROMPT;
          break;
        case 'angry':
          systemPrompt = ANGRY_SYSTEM_PROMPT;
          break;
        default:
          systemPrompt = DEFAULT_SYSTEM_PROMPT;
      }

      userPrompt = `You are analyzing a website with the title "${websiteTitle}". The main text content of this website is as follows. Please provide a summary based on your instructions.

${websiteText}`;
    }

    // Handle streaming
    if (stream) {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const stream = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_tokens: 1000,
          temperature: mode === 'normal' ? 0.3 : 0.8,
          stream: true
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            res.write(content);
          }
        }
        res.end();
        return;
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        res.write('Error: Failed to generate content. Please try again later.');
        res.end();
        return;
      }
    }

    // Non-streaming request
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 1000,
        temperature: mode === 'normal' ? 0.3 : 0.8,
        stream: false
      });

      const summary = completion.choices[0]?.message?.content;

      if (!summary) {
        throw new Error('No summary generated');
      }

      // Return successful response
      return res.status(200).json({
        success: true,
        summary,
        websiteTitle: brochure ? 'Brochure' : websiteTitle
      });

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate summary. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Unexpected error in summarize API:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    });
  }
} 