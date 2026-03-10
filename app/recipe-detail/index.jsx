import AddToMealActionSheet from "@/components/recipe/AddToMealActionSheet";
import RecipeIngredient from "@/components/recipe/RecipeIngredient";
import RecipeSteps from "@/components/recipe/RecipeSteps";
import Button from "@/components/shared/Button";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { FlatList, View } from "react-native";
import RecipeIntro from "../../components/recipe/RecipeIntro";

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams();
  const id = Array.isArray(recipeId) ? recipeId[0] : recipeId;
  console.log("recipeId:", recipeId);
  const recipeDetail = useQuery(
    api.Recipes.GetRecipeById,
    id ? { id } : "skip"
  );
  console.log("recipeDetail", recipeDetail);
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View
            style={{
              padding: 20,
              paddingTop: 55,
              backgroundColor: Colors.WHITE,
            }}
          >
            {/* Recipe Intro */}
            <RecipeIntro
              recipeDetail={recipeDetail}
              showActionSheet={handlePresentModalPress}
            />
            {/* Recipe Ingrdient */}
            <RecipeIngredient recipeDetail={recipeDetail} />
            {/* Cooking Steps */}
            <RecipeSteps recipeDetail={recipeDetail} />

            <View
              style={{
                marginTop: 15,
                marginBottom: 30,
              }}
            >
              <Button
                title={"Add to Meal Plan"}
                onPress={handlePresentModalPress}
              />
            </View>
          </View>
        }
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["60%", "80%"]}
        enablePanDownToClose={true}
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
