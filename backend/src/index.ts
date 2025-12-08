import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'TryOn API is running' });
});

// Virtual Try-On endpoint
app.post('/api/virtual-tryon', async (c) => {
  try {
    const { userPhotoBase64, productImage, productName, productCategory } = await c.req.json();

    console.log('Starting virtual try-on process...');
    console.log('Product:', productName, 'Category:', productCategory);

    const GEMINI_API_KEY = c.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return c.json({ success: false, error: 'GEMINI_API_KEY is not configured' }, 500);
    }

    // Extract base64 data without prefix
    const userImageData = userPhotoBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const productImageData = productImage.replace(/^data:image\/[a-z]+;base64,/, '');

    // Create the prompt for virtual try-on - more natural approach
    const editPrompt = `Virtual try-on: Show this person wearing the ${productName} (${productCategory}) from the second image.

GOAL: Create a realistic photo of the person trying on this garment, like they're in a fitting room mirror.

PRESERVE:
- Person's face, skin tone, and features
- Body proportions and pose
- Background and lighting atmosphere

CLOTHING STYLING:
- Use the exact garment design, color, pattern and style from the reference product image
- Make it drape and fit naturally on their body shape
- Show realistic fabric texture and how it falls
- Adjust the garment size to fit their body proportionally

OUTPUT: A natural-looking photo as if this person is actually wearing this ${productCategory}. The clothing should look real and wearable, not digitally pasted.`;

    let response;
    let usingGemini3 = false;

    // Try Gemini 3 Pro Image first
    try {
      console.log('Attempting with Gemini 3 Pro Image...');
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [
                { text: editPrompt },
                { inlineData: { mimeType: 'image/jpeg', data: userImageData } },
                { inlineData: { mimeType: 'image/jpeg', data: productImageData } },
              ],
            }],
            generationConfig: { responseModalities: ['IMAGE'] },
          }),
        }
      );

      if (response.ok) {
        usingGemini3 = true;
        console.log('Gemini 3 Pro Image request successful');
      } else {
        console.log('Gemini 3 Pro Image failed, status:', response.status);
      }
    } catch (err) {
      console.log('Gemini 3 Pro Image not available:', err);
    }

    // Fallback to Gemini 2.0 Flash
    if (!usingGemini3 || !response?.ok) {
      console.log('Falling back to Gemini 2.0 Flash...');
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: `Virtual fitting room: Generate a photo of this person wearing the "${productName}" garment.

IMAGE 1: The customer who wants to try on clothes
IMAGE 2: The ${productCategory} product they want to wear

Create a realistic try-on result showing:
- The same person from Image 1
- Wearing the ${productCategory} from Image 2
- Natural fabric draping that fits their body
- Same pose, background, and lighting
- The clothing should look like they're actually wearing it, not photoshopped

Think of this like a smart fitting room mirror - show them how this ${productCategory} would look on them in real life.`
                },
                { inlineData: { mimeType: 'image/jpeg', data: userImageData } },
                { inlineData: { mimeType: 'image/jpeg', data: productImageData } },
              ],
            }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
          }),
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      return c.json({ success: false, error: `API error: ${response.status}` }, 500);
    }

    const data = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            inlineData?: { data: string; mimeType?: string };
            text?: string;
          }>;
        };
      }>;
    };
    console.log('API response received, usingGemini3:', usingGemini3);

    // Extract generated image
    let generatedImage: string | null = null;
    let textResponse = '';

    if (data.candidates && data.candidates[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          generatedImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
        if (part.text) {
          textResponse = part.text;
        }
      }
    }

    if (!generatedImage) {
      return c.json({
        success: false,
        message: textResponse || 'Could not generate try-on image. Please try again with a clearer photo.',
        originalPhoto: userPhotoBase64,
      });
    }

    console.log('Virtual try-on completed successfully');
    return c.json({ success: true, generatedImage, message: textResponse });

  } catch (error) {
    console.error('Error in virtual-tryon:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: errorMessage, message: 'Failed to process virtual try-on.' }, 500);
  }
});

export default app;
