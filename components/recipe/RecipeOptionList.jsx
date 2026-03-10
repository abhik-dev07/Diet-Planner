import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { GenerateRecipe, GenerateRecipeImage } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import { useConvex, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoadingDialog from "../shared/LoadingDialog";

export default function RecipeOptionList({ RecipeOption }) {
  const [loading, setLoading] = useState();
  const CreateRecipe = useMutation(api.Recipes.CreateRecipe);
  const generateUploadUrl = useMutation(api.Recipes.generateUploadUrl);
  const convex = useConvex();
  const { user } = useContext(UserContext);
  const router = useRouter();

  const onRecipeOptionSelect = async (recipe) => {
    if (loading) return;

    setLoading(true);
    try {
      const PROMPT =
        "RecipeName:" +
        recipe?.recipeName +
        " Description:" +
        recipe?.description +
        Prompt.GENERATE_COMPLETE_RECIPE_PROMPT;

      const parsedJsonResp = await GenerateRecipe(PROMPT);
      console.log("Structured Complete Recipe:", parsedJsonResp);

      // 1. Generate Recipe Image with Google Imagen 3 (Base64)

      // 1. Generate Recipe Image with Google Imagen 3 (Base64)
      const base64Image = await GenerateRecipeImage(parsedJsonResp?.imagePrompt);
      let finalImageUrl = "";

      if (base64Image) {
        try {
          // 2. Get upload URL from Convex
          const uploadUrl = await generateUploadUrl();

          // 3. Convert base64 to Blob
          const response = await fetch(base64Image);
          const blob = await response.blob();

          // 4. Post to Convex Storage
          const uploadResult = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": "image/png" },
            body: blob,
          });

          const { storageId } = await uploadResult.json();
          console.log("Uploaded Storage ID:", storageId);

          // 5. Get Public Image URL
          finalImageUrl = await convex.query(api.Recipes.getImageUrl, {
            storageId,
          });
          console.log("Final Convex Image URL:", finalImageUrl);
        } catch (uploadError) {
          console.error("Storage Upload Error:", uploadError);
          finalImageUrl = base64Image; // Fallback to base64 if upload fails
        }
      }

      // 6. Save to Db with Convex Storage URL
      const saveRecipeResult = await CreateRecipe({
        jsonData: parsedJsonResp,
        imageUrl: finalImageUrl || "",
        recipeName: parsedJsonResp?.recipeName,
        uid: user?._id,
      });

      router.push({
        pathname: "/recipe-detail",
        params: { recipeId: saveRecipeResult },
      });
    } catch (e) {
      console.error("Error generating recipe:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: 'center', marginBottom: 10 }}>Select Recipe</Text>

      <BottomSheetFlatList
        data={RecipeOption}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onRecipeOptionSelect(item)}
            style={{
              padding: 18,
              borderWidth: 1.5,
              borderRadius: 20,
              marginTop: 15,
              backgroundColor: Colors.WHITE,
              borderColor: Colors.SECONDARY,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: Colors.PRIMARY
              }}
            >
              {item?.recipeName}
            </Text>
            <Text style={{ color: Colors.GRAY, marginTop: 5, fontSize: 14 }}>{item?.description}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
      <LoadingDialog loading={loading} title="Analyzing Recipe..." />
    </View>
  );
}
