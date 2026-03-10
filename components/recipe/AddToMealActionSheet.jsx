import { RefreshDataContext } from "@/context/RefreshDataContex";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import {
  Coffee02Icon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMutation } from "convex/react";
import { useContext, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import Button from "../shared/Button";
import DateSelectionCard from "../shared/DateSelectionCard";

export default function AddToMealActionSheet({
  recipeDetail,
  hideActionSheet,
}) {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedMeal, setSelectedMeal] = useState();
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  const createMealPlan = useMutation(api.MealPlan.CreateMealPlan);
  const { user } = useContext(UserContext);
  const mealOption = [
    {
      title: "Breakfast",
      icon: Coffee02Icon,
    },
    {
      title: "Lunch",
      icon: Sun03Icon,
    },
    {
      title: "Dinner",
      icon: Moon02Icon,
    },
  ];

  const AddToMealPlan = async () => {
    if (!selectedDate && !selectedMeal) {
      Alert.alert("Error!", "Please Select All Details");
      return;
    }

    const result = await createMealPlan({
      date: selectedDate,
      mealType: selectedMeal,
      recipeId: recipeDetail?._id,
      uid: user?._id,
    });

    console.log(result);

    if (Platform.OS === "ios") {
      Alert.alert("Added!", "Added to meal plan");
    } else {
      ToastAndroid.show("Added to meal plan 🥳", ToastAndroid.SHORT);
    }
    setRefreshData(Date.now());
    hideActionSheet();
  };

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>
        Add To Meal
      </Text>

      <DateSelectionCard setSelectedDate={setSelectedDate} />

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        Select Meal
      </Text>
      <BottomSheetFlatList
        data={mealOption}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setSelectedMeal(item?.title)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: 7,
              borderWidth: 1,
              borderRadius: 10,
              margin: 5,
              borderColor:
                selectedMeal == item.title ? Colors.PRIMARY : Colors.GRAY,
              backgroundColor:
                selectedMeal == item.title ? Colors.SECONDARY : Colors.WHITE,
            }}
          >
            <HugeiconsIcon icon={item.icon} />

            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View
        style={{
          marginTop: 15,
        }}
      >
        <Button title={"+ Add to Meal Plan"} onPress={AddToMealPlan} />
        <TouchableOpacity
          onPress={() => hideActionSheet()}
          style={{
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
