import { Stack } from "expo-router";
import { useEffect } from "react";
import { GameProvider } from "./context/GameContext";
import { requestMicPermissionOnce } from "./context/micPermission";

export default function RootLayout() {
  useEffect(() => {
    requestMicPermissionOnce();
  }, []);

  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="gamemode" />
        <Stack.Screen name="players" />
        <Stack.Screen name="round" />
        <Stack.Screen name="recording" />
        <Stack.Screen name="reveal" />
        <Stack.Screen name="leaderboard" />
        <Stack.Screen name="winner" />
        <Stack.Screen name="pose-test" />
      </Stack>
    </GameProvider>
  );
}
