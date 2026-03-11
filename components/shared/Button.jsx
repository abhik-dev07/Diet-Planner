import Colors from "@/shared/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function Button({ title, onPress, loading = false, icon = "" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={styles.button}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={Colors.WHITE} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.text}>{title}</Text>
          {icon ? <Ionicons name={icon} size={18} color={Colors.WHITE} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.PRIMARY,
    width: "100%",
    borderRadius: 16,
    elevation: 4,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.WHITE,
    textAlign: "center",
  },
});
