import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;

app.post('/generate-content', async (req, res) => {
  const { prompt, platform } = req.body;

  if (!prompt || !platform) {
    return res.status(400).json({ error: 'Missing required fields: prompt and platform' });
  }

  // Create a prompt based on the platform and user input
  const systemPrompt = `<s>[INST] You are an expert social media marketer. Generate high-converting, platform-specific content that maximizes engagement and conversions.  

**Platform:** ${platform}  
**Product/Service:** ${prompt}  

### **Content Guidelines:**  
${platform === 'twitter' ?  
    "- Keep it under 280 characters.\n- Be concise, impactful, and engaging.\n- Use hashtags only in the last sentence." :  
    platform === 'instagram' ?  
    "- Use up to 15 relevant hashtags (only in the last sentence).\n- Include emojis for engagement.\n- Make it visually compelling.\n- Use short, readable paragraphs." :  
    platform === 'linkedin' ?  
    "- Maintain a professional, industry-relevant tone.\n- Incorporate insights, data, or trends.\n- Use industry-specific hashtags (only in the last sentence).\n- Format for readability (short paragraphs, bullet points where needed)." :  
    "- Craft engaging, shareable content.\n- Use emojis appropriately.\n- Include a strong call-to-action.\n- Focus on community-building."}  

### **Objective:**  
Create a compelling post optimized for ${platform}, ensuring it aligns with platform-specific best practices, audience preferences, and engagement strategies. [/INST]</s>`;


  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: systemPrompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.9,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
            stop: ["</s>", "[/INST]"],
            repetition_penalty: 1.15
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to generate content',
        details: error
      });
    }

    const result = await response.json();
    let generatedContent = Array.isArray(result) ? result[0] : result;
    
    // If the response is just the generated text
    if (typeof generatedContent === 'string') {
      generatedContent = generatedContent.trim();
    } else {
      // If the response has a generated_text property
      generatedContent = generatedContent?.generated_text?.trim() || '';
    }

    // Remove the prompt from the generated content if it's included
    generatedContent = generatedContent.replace(systemPrompt, '').trim();

    // Format the content based on the platform
    switch (platform) {
      case 'twitter':
        // Ensure content fits Twitter's character limit
        if (generatedContent.length > 280) {
          generatedContent = generatedContent.slice(0, 277) + '...';
        }
        // Add hashtags if none present
        if (!generatedContent.includes('#')) {
          const relevantHashtags = ['#marketing', '#digital', '#growth'];
          generatedContent += '\n\n' + relevantHashtags.join(' ');
        }
        break;

      case 'instagram':
        // Add line breaks for readability
        generatedContent = generatedContent.replace(/\. /g, '.\n\n');
        // Add emojis if none present
        if (!generatedContent.match(/[\u{1F300}-\u{1F9FF}]/u)) {
          generatedContent = '✨ ' + generatedContent;
        }
        // Add hashtags if none present
        if (!generatedContent.includes('#')) {
          const relevantHashtags = ['#marketing', '#digital', '#growth', '#success', '#business'];
          generatedContent += '\n\n' + relevantHashtags.join(' ');
        }
        break;

      case 'linkedin':
        // Add professional formatting
        generatedContent = generatedContent.replace(/\. /g, '.\n\n');
        // Add professional hashtags if none present
        if (!generatedContent.includes('#')) {
          const relevantHashtags = ['#business', '#professional', '#growth', '#innovation'];
          generatedContent += '\n\n' + relevantHashtags.join(' ');
        }
        break;

      case 'facebook':
        // Add engaging formatting
        generatedContent = generatedContent.replace(/\. /g, '.\n\n');
        // Add emojis if none present
        if (!generatedContent.match(/[\u{1F300}-\u{1F9FF}]/u)) {
          generatedContent = '👋 ' + generatedContent;
        }
        break;
    }

    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});