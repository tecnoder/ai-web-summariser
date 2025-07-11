import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

interface SummarizeRequest {
  url: string;
  isFunny: boolean;
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

const FUNNY_SYSTEM_PROMPT = `You are a witty and sarcastic comedian who has been forced to summarize websites. Analyze the content of the following website and provide a funny, slightly roasting summary. Ignore navigation, headers, and footers. Your response must be in Markdown.`;

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
    const { url, isFunny }: SummarizeRequest = req.body;

    // Validate input
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required.'
      });
    }

    if (!isValidUrl(url)) {
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
    const { title: websiteTitle, text: websiteText } = extractWebsiteContent(websiteHtml);

    if (!websiteText || websiteText.length < 100) {
      return res.status(400).json({
        success: false,
        error: 'Unable to extract meaningful content from the website.'
      });
    }

    // Prepare OpenAI request
    const systemPrompt = isFunny ? FUNNY_SYSTEM_PROMPT : DEFAULT_SYSTEM_PROMPT;
    const userPrompt = `You are analyzing a website with the title "${websiteTitle}". The main text content of this website is as follows. Please provide a summary based on your instructions.

${websiteText}`;

    // Call OpenAI API
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
        temperature: isFunny ? 0.8 : 0.3, // Higher temperature for funny summaries
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
        websiteTitle
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