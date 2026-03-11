import RecipeCard from "@/components/meals/RecipeCard";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Meals() {
  const { user } = useContext(UserContext);
  const recipeList = useQuery(api.Recipes.GetAllRecipesByUser, {
    uid: user?._id,
  });
  const router = useRouter();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Page Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Delicious Recipes</Text>
        <TouchableOpacity style={styles.focusButton}>
          <MaterialIcons name="center-focus-strong" size={24} color="#1c1c1e" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentPadding}>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => router.push("/generate-ai-recipe")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="auto-awesome" size={24} color="#ffffff" />
          <Text style={styles.aiButtonText}>AI Recipe Generator</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Text style={{ fontSize: 40 }}>🥗</Text>
      </View>
      <Text style={styles.emptyTitle}>No Recipes Yet</Text>
      <Text style={styles.emptySubtitle}>
        You haven't generated any recipes yet.{"\n"}Use the AI tool above to get started!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.LIGHT_BG} />
      <FlatList
        data={recipeList || []}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!recipeList ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ff6a00" />
          </View>
        ) : renderEmptyState}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  headerContainer: {
    backgroundColor: '#f8f7f5',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  focusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPadding: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  aiButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#ff6a00',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 8,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  aiButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff6a00',
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
  columnWrapper: {
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  loaderContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 106, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
