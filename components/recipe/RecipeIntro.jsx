import Colors from "@/shared/Colors";
import {
  Dumbbell01Icon,
  Fire03Icon,
  PlusSignSquareIcon,
  TimeQuarter02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecipeIntro({ recipeDetail, showActionSheet }) {
  const RecipeJson = recipeDetail?.jsonData;
  return (
    <View>
      <Image
        source={{ uri: recipeDetail?.imageUrl }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 15,
        }}
      />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            flex: 1,
            flexShrink: 1,
          }}
        >
          {recipeDetail?.recipeName}
        </Text>
        <TouchableOpacity onPress={() => showActionSheet && showActionSheet()}>
          <HugeiconsIcon
            icon={PlusSignSquareIcon}
            size={40}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 16,
          marginTop: 6,
          color: Colors.GRAY,
          lineHeight: 25,
        }}
      >
        {RecipeJson?.description}
      </Text>

      <View
        style={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={Fire03Icon}
            color={Colors.PRIMARY}
            style={styles.iconBg}
            size={27}
          />
          <Text style={styles.subText}>Calories</Text>
          <Text style={styles.counts}>{RecipeJson?.calories} Kcal</Text>
        </View>
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={Dumbbell01Icon}
            style={styles.iconBg}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Proteins</Text>
          <Text style={styles.counts}>{RecipeJson?.proteins} g</Text>
        </View>
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={TimeQuarter02Icon}
            style={styles.iconBg}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Time</Text>
          <Text style={styles.counts}>{RecipeJson?.cookTime} Min</Text>
        </View>
      </View>

      {/* Nutritional Insights */}
      {RecipeJson?.insights && (
        <View style={styles.insightsContainer}>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>AI Health Score</Text>
            <Text style={styles.healthValue}>
              {RecipeJson?.insights?.healthScore}/100
            </Text>
          </View>

          <View style={styles.macroBar}>
            <View
              style={{
                flex: RecipeJson?.insights?.distribution?.proteinPct || 0,
                backgroundColor: Colors.BLUE,
              }}
            />
            <View
              style={{
                flex: RecipeJson?.insights?.distribution?.fatPct || 0,
                backgroundColor: "#EAB308",
              }}
            />
            <View
              style={{
                flex: RecipeJson?.insights?.distribution?.carbsPct || 0,
                backgroundColor: "#22C55E",
              }}
            />
          </View>

          <View style={styles.macroLabelContainer}>
            <Text style={[styles.macroLabel, { color: Colors.BLUE }]}>
              {RecipeJson?.insights?.distribution?.proteinPct}% Prot
            </Text>
            <Text style={[styles.macroLabel, { color: "#854D0E" }]}>
              {RecipeJson?.insights?.distribution?.fatPct}% Fat
            </Text>
            <Text style={[styles.macroLabel, { color: "#166534" }]}>
              {RecipeJson?.insights?.distribution?.carbsPct}% Carb
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconBg: {
    padding: 6,
  },
  subText: {
    fontSize: 18,
  },
  propertyContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fbf5ff",
    padding: 6,
    borderRadius: 20,
    flex: 1,
  },
  counts: {
    fontSize: 22,
    color: Colors.PRIMARY,
    fontWeight: "bold",
    textAlign: "center",
  },
  insightsContainer: {
    marginTop: 20,
    backgroundColor: "#fff9f9",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffe4e6",
  },
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  healthLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e11d48",
  },
  healthValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e11d48",
  },
  macroBar: {
    height: 10,
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  macroLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
