import Colors from "@/shared/Colors";
import {
  Dumbbell01Icon,
  Fire03Icon,
  PlusSignSquareIcon,
  TimeQuarter02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecipeIntro({ recipeDetail, showActionSheet }) {
  const RecipeJson = recipeDetail?.jsonData;
  return (
    <View>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        {recipeDetail?.imageUrl ? (
          <Image
            source={{ uri: recipeDetail.imageUrl }}
            style={styles.heroImage}
          />
        ) : (
          <View style={[styles.heroImage, { justifyContent: 'center', alignItems: 'center' }]}>
            <MaterialIcons name="image-not-supported" size={48} color="#cbd5e1" />
          </View>
        )}
      </View>

      {/* Title Row */}
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.recipeName}>
            {recipeDetail?.recipeName}
          </Text>
          {RecipeJson?.description && (
            <Text style={styles.description} numberOfLines={2}>
              {RecipeJson?.description}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => showActionSheet && showActionSheet()}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="add" size={24} color="#ff6a00" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>CALORIES</Text>
          <Text style={[styles.statValue, { color: '#ff6a00' }]}>{RecipeJson?.calories}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>PROTEIN</Text>
          <Text style={[styles.statValue, { color: '#ec4899' }]}>{RecipeJson?.proteins}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={[styles.statValue, { color: '#3b82f6' }]}>{RecipeJson?.cookTime}</Text>
        </View>
      </View>

      {/* AI Health Insights */}
      {RecipeJson?.insights && (
        <View style={styles.insightsContainer}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightTitle}>AI Health Insights</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{RecipeJson?.insights?.healthScore}/100</Text>
            </View>
          </View>

          <View style={styles.macroBar}>
            <View
              style={{
                flex: RecipeJson?.insights?.distribution?.proteinPct || 0,
                backgroundColor: '#ec4899',
              }}
            />
            <View
              style={{
                flex: RecipeJson?.insights?.distribution?.fatPct || 0,
                backgroundColor: '#ff6a00',
              }}
            />
            <View
              style={{
                flex: RecipeJson?.insights?.distribution?.carbsPct || 0,
                backgroundColor: '#3b82f6',
              }}
            />
          </View>

          <View style={styles.macroLabelContainer}>
            <View style={styles.macroLabelItem}>
              <View style={[styles.macroLabelDot, { backgroundColor: '#ec4899' }]} />
              <Text style={styles.macroLabelText}>
                Protein ({RecipeJson?.insights?.distribution?.proteinPct || 0}%)
              </Text>
            </View>
            <View style={styles.macroLabelItem}>
              <View style={[styles.macroLabelDot, { backgroundColor: '#ff6a00' }]} />
              <Text style={styles.macroLabelText}>
                Fat ({RecipeJson?.insights?.distribution?.fatPct || 0}%)
              </Text>
            </View>
            <View style={styles.macroLabelItem}>
              <View style={[styles.macroLabelDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.macroLabelText}>
                Carbs ({RecipeJson?.insights?.distribution?.carbsPct || 0}%)
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  heroImage: {
    width: "100%",
    aspectRatio: 4/3,
    backgroundColor: '#f1f5f9',
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
    gap: 16,
  },
  recipeName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1c1c1e",
    flex: 1,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 106, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    color: "#ff6a00",
  },
  statsRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  insightsContainer: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  scoreBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  macroBar: {
    height: 12,
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    marginBottom: 16,
  },
  macroLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  macroLabelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
});
