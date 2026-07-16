import { Stack } from "expo-router";
import { GameProvider } from "./context/GameContext";

export default function RootLayout() {
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
      </Stack>
    </GameProvider>
  );
}
