import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function RecipeCard({ recipe }) {
  const recipeJson = recipe?.jsonData;

  return (
    <Link
      href={"/recipe-detail?recipeId=" + recipe?._id}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {recipe?.imageUrl ? (
            <Image
              source={{ uri: recipe.imageUrl }}
              style={styles.image}
            />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <MaterialIcons name="restaurant" size={32} color="#cbd5e1" />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.recipeName} numberOfLines={1}>
            {recipe?.recipeName}
          </Text>

          <View style={styles.footer}>
            <MaterialIcons name="bolt" color="#94a3b8" size={14} />
            <Text style={styles.metaText}>
              {recipeJson?.calories} kcal • {recipeJson?.cookTime || 15} min
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 10,
  },
  card: {
    gap: 8,
  },
  imageContainer: {
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  content: {
    paddingHorizontal: 2,
  },
  recipeName: {
    fontSize: 15,
    fontWeight: "800",
    color: '#1c1c1e',
    letterSpacing: -0.3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: "500",
  },
});
