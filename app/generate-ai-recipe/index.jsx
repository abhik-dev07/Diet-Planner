import Button from "@/components/shared/Button";
import { GenerateRecipe } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import EmptyRecipeState from "../../components/recipe/EmptyRecipeState";
import RecipeOptionList from "../../components/recipe/RecipeOptionList";

export default function GenerateAiRecipe() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeOption, setRecipeOption] = useState(null);
  const paddingAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const GenerateRecipeOptions = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const PROMPT = input + Prompt.GENERATE_RECIPE_OPTION_PROMPT;
      const result = await GenerateRecipe(PROMPT);
      console.log("Direct AI Response:", result);

      let parsedOptions = null;
      try {
        if (typeof result === "string") {
          // Clean up markdown wrapping if present
          let cleanStr = result.replace(/```json/gi, '').replace(/```/gi, '').trim();
          parsedOptions = JSON.parse(cleanStr);
        } else if (result?.data?.candidates) {
          // Fallback if backend returned raw gemini response
          const extractJson = result.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
          const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/);
          const jsonString = jsonMatch ? jsonMatch[1] : extractJson;
          parsedOptions = JSON.parse(jsonString || "[]");
        } else {
          parsedOptions = result;
        }

        // Handle if object wrapped in { recipes: [...] }
        if (parsedOptions && !Array.isArray(parsedOptions) && parsedOptions.recipes) {
          parsedOptions = parsedOptions.recipes;
        }
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        Alert.alert("Parsing Error", "AI gave an invalid response format. Please try again.");
        return;
      }

      if (parsedOptions && Array.isArray(parsedOptions) && parsedOptions.length > 0) {
        setRecipeOption(parsedOptions);
        handlePresentModalPress();
      } else {
        Alert.alert("No recipes found", "AI could not generate specific options for this prompt. Try being more descriptive!");
      }
    } catch (error) {
      console.log("Recipe Generation Error:", error);
      const status = error.response?.status;
      const errorMsg = error.response?.data?.error || error.message;

      if (status === 429) {
        Alert.alert(
          "Too Many Requests",
          "The AI is a bit busy right now. Please wait a moment (about 1 minute) and try again."
        );
      } else {
        Alert.alert(
          "Error",
          `Something went wrong: ${errorMsg}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(paddingAnim, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      Animated.timing(paddingAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [paddingAnim]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f7f5" />
      <Animated.View style={{ flex: 1, paddingBottom: paddingAnim }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Back Button */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="arrow-back-ios-new" size={20} color="#1c1c1e" />
              </TouchableOpacity>
            </View>

            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerIconBadge}>
                 <MaterialIcons name="auto-awesome" size={28} color="#ff6a00" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>AI Recipe Generator</Text>
                <Text style={styles.subtitle}>Create custom meals in seconds</Text>
              </View>
            </View>

            {/* Input Area */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>What would you like to cook?</Text>
              <TextInput
                style={styles.textArea}
                placeholder="e.g. A high-protein Mediterranean salad with chickpeas and a lemon-tahini dressing..."
                placeholderTextColor="#94a3b8"
                onChangeText={(value) => setInput(value)}
                multiline
                textAlignVertical="top"
                returnKeyType="done"
              />
              <TouchableOpacity 
                style={[styles.generateBtn, loading && { opacity: 0.7 }]}
                activeOpacity={0.8}
                onPress={GenerateRecipeOptions}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.generateBtnText}>Generating...</Text>
                ) : (
                  <>
                    <MaterialIcons name="bolt" size={20} color="#ffffff" />
                    <Text style={styles.generateBtnText}>Generate Recipe</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Empty State / Results Notice */}
            {recipeOption && recipeOption.length > 0 ? (
              <View style={styles.foundBadge}>
                <Text style={styles.foundText}>
                  🎉 Found {recipeOption.length} options — swipe up to choose!
                </Text>
              </View>
            ) : (
              <EmptyRecipeState />
            )}
          </View>
        </ScrollView>
      </Animated.View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["60%", "85%"]}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBg}
        handleIndicatorStyle={styles.bottomSheetHandle}
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          <RecipeOptionList RecipeOption={recipeOption} />
        </BottomSheetView>
      </BottomSheetModal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  topBar: {
    marginBottom: 32,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 32,
  },
  headerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1c1c1e",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: "#1c1c1e",
    marginBottom: 16,
  },
  textArea: {
    fontSize: 16,
    minHeight: 140,
    color: "#1e293b",
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
    lineHeight: 24,
    marginBottom: 24,
  },
  generateBtn: {
    width: '100%',
    backgroundColor: '#ff6a00',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  generateBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  foundBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  foundText: {
    color: '#065F46',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSheetBg: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  bottomSheetHandle: {
    backgroundColor: '#cbd5e1',
    width: 40,
  },
});
