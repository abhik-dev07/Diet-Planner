import { FlatList, StyleSheet, Text, View } from "react-native";

export default function RecipeIngredient({ recipeDetail }) {
  const ingredients = recipeDetail?.jsonData?.ingredients;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ingredients</Text>
      </View>

      <View style={styles.gridContainer}>
        {ingredients?.map((item, index) => (
          <View key={index} style={styles.ingredientCard}>
            <Text style={styles.emoji}>{item?.icon}</Text>
            <View style={styles.textStack}>
              <Text style={styles.ingredientName} numberOfLines={1}>{item?.ingredient}</Text>
              <Text style={styles.quantity}>{item?.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: "#1c1c1e",
    letterSpacing: -0.3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    gap: 12,
  },
  emoji: {
    fontSize: 26,
  },
  textStack: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '700',
    color: "#1c1c1e",
    marginBottom: 2,
  },
  quantity: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: '500',
  },
});
