import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
   throw new Error('OPENAI_API_KEY environment variable is required');
}

export const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export interface AIContentGenerationOptions {
   prompt: string;
   type?: 'blog' | 'social' | 'email' | 'general';
   tone?: 'professional' | 'casual' | 'creative' | 'formal';
   length?: 'short' | 'medium' | 'long';
}

export interface AISummarizationOptions {
   content: string;
   length?: 'brief' | 'detailed';
}

export interface AITranslationOptions {
   content: string;
   targetLanguage: string;
   sourceLanguage?: string;
}

export interface AIIdeationOptions {
   topic: string;
   count?: number;
   type?: 'titles' | 'hashtags' | 'campaigns' | 'general';
}

/**
 * Generate content using OpenAI
 */
export async function generateContent(options: AIContentGenerationOptions): Promise<string> {
   const { prompt, type = 'general', tone = 'professional', length = 'medium' } = options;

   const systemPrompt = `You are a content generation assistant. Generate ${type} content in a ${tone} tone. The content should be ${length} in length.`;

   const userPrompt = `Generate content based on this prompt: ${prompt}`;

   try {
      const response = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
         ],
         max_tokens: length === 'short' ? 150 : length === 'medium' ? 300 : 600,
         temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || 'Failed to generate content';
   } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
   }
}

/**
 * Summarize content using OpenAI
 */
export async function summarizeContent(options: AISummarizationOptions): Promise<string> {
   const { content, length = 'brief' } = options;

   const systemPrompt = `You are a content summarization assistant. Provide a ${length} summary of the given content.`;

   try {
      const response = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please summarize this content:\n\n${content}` },
         ],
         max_tokens: length === 'brief' ? 100 : 200,
         temperature: 0.3,
      });

      return response.choices[0]?.message?.content?.trim() || 'Failed to summarize content';
   } catch (error) {
      console.error('Error summarizing content:', error);
      throw new Error('Failed to summarize content');
   }
}

/**
 * Translate content using OpenAI
 */
export async function translateContent(options: AITranslationOptions): Promise<string> {
   const { content, targetLanguage, sourceLanguage } = options;

   const systemPrompt = `You are a translation assistant. Translate the given content to ${targetLanguage}. Maintain the original tone and formatting.`;

   const userPrompt = sourceLanguage
      ? `Translate this content from ${sourceLanguage} to ${targetLanguage}:\n\n${content}`
      : `Translate this content to ${targetLanguage}:\n\n${content}`;

   try {
      const response = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
         ],
         temperature: 0.3,
      });

      return response.choices[0]?.message?.content?.trim() || 'Failed to translate content';
   } catch (error) {
      console.error('Error translating content:', error);
      throw new Error('Failed to translate content');
   }
}

/**
 * Generate ideas using OpenAI
 */
export async function generateIdeas(options: AIIdeationOptions): Promise<string[]> {
   const { topic, count = 5, type = 'general' } = options;

   const systemPrompt = `You are an ideation assistant. Generate ${count} creative ${type} ideas related to the given topic. Provide each idea as a separate item in a list.`;

   const userPrompt = `Generate ${count} ${type} ideas for: ${topic}`;

   try {
      const response = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
         ],
         max_tokens: 400,
         temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content?.trim() || '';
      // Split by newlines and filter out empty lines
      const ideas = content.split('\n').filter((line) => line.trim().length > 0);

      return ideas.length > 0 ? ideas : ['Failed to generate ideas'];
   } catch (error) {
      console.error('Error generating ideas:', error);
      throw new Error('Failed to generate ideas');
   }
}
