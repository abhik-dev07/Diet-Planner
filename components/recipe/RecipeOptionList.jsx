import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { GenerateRecipe, GenerateRecipeImage } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useConvex, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import LoadingDialog from "../shared/LoadingDialog";
import * as FileSystem from 'expo-file-system';

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

      const resultJson = await GenerateRecipe(PROMPT);
      let parsedJsonResp = null;
      console.log("Full Recipe AI Raw Response (Type:", typeof resultJson, "):", resultJson);

      try {
        if (resultJson === undefined || resultJson === null) {
           throw new Error("AI returned nothing (null/undefined)");
        }

        if (typeof resultJson === "string") {
          let cleanStr = resultJson.replace(/```json/gi, '').replace(/```/gi, '').trim();
          if (!cleanStr) throw new Error("AI response string resulted in empty content after cleaning");
          parsedJsonResp = JSON.parse(cleanStr);
        } else if (resultJson?.data?.candidates) {
          const extractJson = resultJson.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (!extractJson) throw new Error("AI response contains empty text in candidates");
          
          const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/) || extractJson.match(/{[\s\S]*}/);
          const jsonString = (jsonMatch ? jsonMatch[1] || jsonMatch[0] : extractJson).trim();
          
          if (!jsonString) throw new Error("JSON extraction failed (no braces or markdown blocks found)");
          parsedJsonResp = JSON.parse(jsonString);
        } else {
          parsedJsonResp = resultJson;
        }

        if (parsedJsonResp && !parsedJsonResp.recipeName) {
           if (parsedJsonResp.recipe) {
             parsedJsonResp = parsedJsonResp.recipe;
             if (Array.isArray(parsedJsonResp)) parsedJsonResp = parsedJsonResp[0];
           } else if (parsedJsonResp.recipes && Array.isArray(parsedJsonResp.recipes)) {
             parsedJsonResp = parsedJsonResp.recipes[0];
           }
        }

        if (!parsedJsonResp || typeof parsedJsonResp !== 'object') {
           throw new Error("Final parsed response is not a valid object: " + JSON.stringify(parsedJsonResp));
        }
      } catch (parseError) {
        console.error("Critical JSON Parsing Error:", parseError);
        Alert.alert(
          "Generation Failed", 
          "The AI was unable to generate a structured recipe at this time. This usually happens if the response is interrupted. Please try again."
        );
        return;
      }
      console.log("Structured Complete Recipe:", parsedJsonResp);

      const base64Image = await GenerateRecipeImage(parsedJsonResp?.imagePrompt);
      let finalImageUrl = "";

      if (base64Image) {
        try {
          const uploadUrl = await generateUploadUrl();
          
          // React Native fetch() often fails on literal data URIs, so write to a temp file first
          const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
          const tempUri = FileSystem.cacheDirectory + 'tempImage.png';
          
          await FileSystem.writeAsStringAsync(tempUri, base64Data, { 
            encoding: 'base64' 
          });

          const response = await fetch(tempUri);
          const blob = await response.blob();

          const uploadResult = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": "image/png" },
            body: blob,
          });

          const { storageId } = await uploadResult.json();
          console.log("Uploaded Storage ID:", storageId);

          finalImageUrl = await convex.query(api.Recipes.getImageUrl, {
            storageId,
          });
          console.log("Final Convex Image URL:", finalImageUrl);
        } catch (uploadError) {
          console.error("Storage Upload Error:", uploadError);
          // Don't fallback to base64 string because it's too large for Convex DB (1MiB limit)
          finalImageUrl = ""; 
        }
      }

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
      Alert.alert("Process Failed", "There was an error saving your generated recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Recipe</Text>
      <Text style={styles.subtitle}>Choose one to generate the full recipe</Text>

      <BottomSheetFlatList
        data={RecipeOption}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onRecipeOptionSelect(item)}
            style={styles.optionCard}
            activeOpacity={0.7}
          >
            <View style={styles.optionNumberBadge}>
              <Text style={styles.optionNumber}>{index + 1}</Text>
            </View>
            <View style={styles.optionContent}>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionName}>{item?.recipeName}</Text>
                <Text style={styles.optionDescription} numberOfLines={2}>{item?.description}</Text>
              </View>
            </View>
            <View style={styles.arrowCircle}>
              <MaterialIcons name="arrow-forward-ios" size={14} color="#ff6a00" />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
      <LoadingDialog loading={loading} title="Creating Recipe..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: "#1c1c1e",
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    gap: 16,
  },
  optionNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6a00',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionTextBlock: {
    flex: 1,
  },
  optionName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1c1c1e",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  optionDescription: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 106, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
