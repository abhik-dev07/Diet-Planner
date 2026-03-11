import Colors from "@/shared/Colors";
import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

export default function Input({
  placeholder,
  password = false,
  onChangeText,
  lable = "",
  rightIcon = null,
  keyboardType = "default",
}) {
  return (
    <View style={styles.wrapper}>
      {lable ? <Text style={styles.label}>{lable}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={password}
          placeholder={placeholder}
          placeholderTextColor="#C7C7CC"
          onChangeText={(value) => onChangeText(value)}
          style={styles.input}
          keyboardType={keyboardType}
        />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    width: "100%",
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 6,
    color: Colors.DARK,
    letterSpacing: -0.1,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    borderRadius: 16,
    fontSize: 16,
    paddingRight: 45,
    width: "100%",
    color: Colors.DARK,
    backgroundColor: Colors.WHITE,
    fontWeight: '500',
  },
  icon: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
