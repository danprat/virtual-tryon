import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhotoBase64, productImage, productName, productCategory } = await req.json();
    
    console.log('Starting virtual try-on process...');
    console.log('Product:', productName, 'Category:', productCategory);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Extract base64 data without prefix
    const userImageData = userPhotoBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const productImageData = productImage.replace(/^data:image\/[a-z]+;base64,/, '');

    // Create the prompt for virtual try-on - focusing on IMAGE EDITING not generation
    const editPrompt = `Edit this photo: change ONLY the clothing to show the person wearing a ${productCategory} (${productName}). 

CRITICAL - KEEP UNCHANGED:
- The person's face must remain EXACTLY the same - same eyes, nose, mouth, skin tone, expression
- Same hair style and color
- Same body pose and position
- Same background
- Same lighting on the face

ONLY CHANGE: Replace the current clothing with the ${productCategory} from the reference image. Make the clothing fit naturally on the person's body.

This is a photo editing task - the output should look like the same person took a new photo wearing different clothes.`;

    let response;
    let usingGemini3 = false;
    
    // Try Gemini 3 Pro Image (Nano Banana Pro) first - better for editing tasks
    try {
      console.log('Attempting with Gemini 3 Pro Image (Nano Banana Pro)...');
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: editPrompt },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: userImageData,
                    },
                  },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg', 
                      data: productImageData,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["IMAGE"],
            },
          }),
        }
      );
      
      if (response.ok) {
        usingGemini3 = true;
        console.log('Gemini 3 Pro Image request successful');
      } else {
        console.log('Gemini 3 Pro Image failed, status:', response.status);
      }
    } catch (gemini3Error) {
      console.log('Gemini 3 Pro Image not available:', gemini3Error);
    }

    // Fallback to Gemini 2.0 Flash
    if (!usingGemini3 || !response?.ok) {
      console.log('Falling back to Gemini 2.0 Flash...');
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { 
                    text: `Edit this photo to show the SAME PERSON wearing different clothing.

IMAGE 1 (PERSON TO EDIT): This is the person. Their face, hair, body, and background must stay EXACTLY the same.

IMAGE 2 (CLOTHING REFERENCE): This is a ${productCategory} called "${productName}".

YOUR TASK: 
1. Take the person from Image 1
2. Replace ONLY their clothing with the ${productCategory} from Image 2
3. Keep the EXACT same face - do not change or regenerate any facial features
4. The output must look like the same person wearing new clothes

IMPORTANT: This is photo editing, not photo generation. The person's identity must be preserved 100%.`
                  },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: userImageData,
                    },
                  },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg', 
                      data: productImageData,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"],
            },
          }),
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API response received, usingGemini3:', usingGemini3);

    // Extract the generated image from response
    let generatedImage = null;
    let textResponse = '';
    
    // Handle Gemini response format (works for both Gemini 3 Pro Image and Gemini 2.0 Flash)
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
      console.log('No image generated, returning original with overlay simulation');
      // If no image generated, return original photo with a message
      return new Response(
        JSON.stringify({
          success: false,
          message: textResponse || 'Could not generate try-on image. Please try again with a clearer photo.',
          originalPhoto: userPhotoBase64,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Virtual try-on completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        generatedImage,
        message: textResponse,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in virtual-tryon function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        message: 'Failed to process virtual try-on. Please try again.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
