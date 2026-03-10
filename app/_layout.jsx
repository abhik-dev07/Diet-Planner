import { UserContext } from "@/context/UserContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RefreshDataContext } from "../context/RefreshDataContex";

import { useKeepAwake } from "expo-keep-awake";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  useKeepAwake();
  const [user, setUser] = useState();
  const [refreshData, setRefreshData] = useState();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ConvexProvider client={convex}>
          <UserContext.Provider value={{ user, setUser }}>
            <RefreshDataContext.Provider
              value={{ refreshData, setRefreshData }}
            >
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
              </Stack>
            </RefreshDataContext.Provider>
          </UserContext.Provider>
        </ConvexProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
