import { Text, View, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useGame } from "./context/GameContext";

export default function Winner() {
  const router = useRouter();
  const { mode, players, resetGame } = useGame();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const champion = sorted[0] ?? null;
  const runnerUp = sorted[1] ?? null;

  const handlePlayAgain = () => {
    resetGame();
    router.push("/gamemode");
  };

  const handleExit = () => {
    resetGame();
    router.push("/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A0A2E", padding: 24 }}>
      <Animated.View style={{ alignItems: "center", transform: [{ scale: scaleAnim }], marginBottom: 48 }}>
        <Text style={{ fontSize: 80 }}>🏆</Text>
        <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>Score Champion</Text>
        <Text style={{ color: "#F0E6FF", fontSize: 36, fontWeight: "700", textAlign: "center" }}>{champion ? champion.name : "—"}</Text>
        {champion && (
          <Text style={{ color: "#C9963A", fontSize: 16, fontStyle: "italic", marginTop: 8, textAlign: "center" }}>{champion.score} points</Text>
        )}
      </Animated.View>

      {mode === "crowd" && runnerUp && (
        <Animated.View style={{ alignItems: "center", opacity: fadeAnim, marginBottom: 48, width: "100%", borderWidth: 1, borderColor: "#C9963A", borderRadius: 4, padding: 24 }}>
          <Text style={{ fontSize: 50 }}>👑</Text>
          <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>Crowd Favorite</Text>
          <Text style={{ color: "#F0E6FF", fontSize: 28, fontWeight: "700", textAlign: "center" }}>{runnerUp.name}</Text>
          <Text style={{ color: "#C9963A", fontSize: 16, fontStyle: "italic", marginTop: 8, textAlign: "center" }}>{runnerUp.score} points</Text>
        </Animated.View>
      )}

      <TouchableOpacity onPress={handlePlayAgain} style={{ backgroundColor: "#C9963A", paddingHorizontal: 48, paddingVertical: 18, width: "100%", alignItems: "center", marginTop: mode === "crowd" ? 0 : 48 }}>
        <Text style={{ color: "#1A0A2E", fontSize: 16, fontWeight: "700", letterSpacing: 4 }}>PLAY AGAIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleExit} style={{ marginTop: 20, alignItems: "center", padding: 16 }}>
        <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase" }}>Exit to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
