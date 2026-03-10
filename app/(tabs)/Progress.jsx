import GanerateRecipeCard from "@/components/home/GanerateRecipeCard";
import TodayProgress from "@/components/home/TodayProgress";
import TodaysMealPlan from "@/components/home/TodaysMealPlan";
import Colors from "@/shared/Colors";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import DateSelectionCard from "../../components/shared/DateSelectionCard";

export default function Progress() {
  const [selectedDate, setSelectedDate] = useState();
  return (
    <FlatList
      data={[]}
      style={{
        backgroundColor: Colors.SECONDARY,
        height: "100%",
      }}
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            paddingTop: 40,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Progress
          </Text>
          <DateSelectionCard setSelectedDate={setSelectedDate} />
          <TodaysMealPlan selectedDate={selectedDate} />
          <TodayProgress />
          <GanerateRecipeCard />
        </View>
      }
    />
  );
}
