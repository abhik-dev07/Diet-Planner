export default {
  CALOERIES_PROMPT: `Based on Weight, Height, Gender, and Goal, age 
  provide the required daily calories and proteins. 
  Return ONLY a valid JSON object following this schema:
  {
       "calories": number,
       "proteins": number      
  }`,

  GENERATE_RECIPE_OPTION_PROMPT: `Based on the user's ingredients or instruction, create 3 different detailed and mouth-watering recipe variations. 
  Return ONLY a valid JSON array of objects. 
  Each object MUST have: "recipeName" (string with emoji), "description" (a detailed and appetizing 2-3 sentence description), and "ingredients" (list of primary ingredients).
  Format: [ { "recipeName": "...", "description": "...", "ingredients": ["...", "..."] }, ... ]`,

  GENERATE_COMPLETE_RECIPE_PROMPT: ` 
  Please provide a fully detailed and professional recipe based on the provided recipeName and description. 
  The response must be extremely descriptive and clear.
  
  - For the "description", provide a rich, detailed, and mouth-watering overview of the dish that evokes appetite.
  - For the "ingredients", list ALL necessary ingredients with a matching emoji icon and precise quantity.
  - For the "steps", provide 5-8 descriptive, numbered, step-by-step cooking instructions that are easy to follow and professional.
  - Include accurate nutritional facts: calories, proteins, fat, carbs (all as numbers).
  - Categorize it exactly as one or more of: [Breakfast, Lunch, Dinner, Salad, Dessert, Fastfood, Drink, Cake].
  - Provide a highly detailed "imagePrompt" (at least 30 words) for high-quality AI image generation, describing textures, lighting, and presentation.
  
  Response must be ONLY a valid JSON following this schema precisely:
  {
    "description": "string",
    "recipeName": "string",
    "calories": number,
    "proteins": number,
    "fat": number,
    "carbs": number,
    "category": ["string"],
    "cookTime": number,
    "imagePrompt": "string",
    "ingredients": [
      {
        "icon": "emoji",
        "ingredient": "string",
        "quantity": "string"
      }
    ],
    "serveTo": number,
    "steps": ["Step 1: ...", "Step 2: ..."]
  }`,
};
