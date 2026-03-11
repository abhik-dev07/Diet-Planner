import AddToMealActionSheet from "@/components/recipe/AddToMealActionSheet";
import RecipeIngredient from "@/components/recipe/RecipeIngredient";
import RecipeSteps from "@/components/recipe/RecipeSteps";
import { api } from "@/convex/_generated/api";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity, StatusBar, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import RecipeIntro from "../../components/recipe/RecipeIntro";

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams();
  const id = Array.isArray(recipeId) ? recipeId[0] : recipeId;
  const router = useRouter();
  const recipeDetail = useQuery(
    api.Recipes.GetRecipeById,
    id ? { id } : "skip"
  );
  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f7f5" />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconCircle}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Recipe Details</Text>
        <TouchableOpacity
          onPress={() => {}}
          style={styles.iconCircle}
          activeOpacity={0.8}
        >
          <MaterialIcons name="favorite" size={24} color="#ff6a00" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.content}>
            <RecipeIntro
              recipeDetail={recipeDetail}
              showActionSheet={handlePresentModalPress}
            />
            <RecipeIngredient recipeDetail={recipeDetail} />
            <RecipeSteps recipeDetail={recipeDetail} />

            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                onPress={handlePresentModalPress}
                style={styles.addButton}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>Add to Meal Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["60%", "80%"]}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBg}
        handleIndicatorStyle={styles.bottomSheetHandle}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <AddToMealActionSheet
            recipeDetail={recipeDetail}
            hideActionSheet={() => bottomSheetModalRef.current?.dismiss()}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: '#f8f7f5',
    zIndex: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.3,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  addButtonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  addButton: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6a00',
    borderRadius: 16,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
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
