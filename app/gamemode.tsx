import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useGame } from "./context/GameContext";
import type { GameMode } from "./context/GameContext";

const roundOptions = [3, 5, 7];

export default function GameMode() {
  const router = useRouter();
  const { setRoundCount } = useGame();
  const [step, setStep] = useState<"mode" | "rounds">("mode");
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const chooseMode = (mode: GameMode) => {
    setSelectedMode(mode);
    setStep("rounds");
  };

  const chooseRounds = (count: number) => {
    setRoundCount(count);
    router.push({ pathname: "/players", params: { mode: selectedMode ?? "pure" } });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A0A2E", padding: 24 }}>
      {step === "mode" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Game Mode</Text>
          <Text style={{ color: "#F0E6FF", fontSize: 36, fontStyle: "italic", marginBottom: 60, textAlign: "center" }}>How shall we play?</Text>
          <TouchableOpacity onPress={() => chooseMode("pure")} style={{ width: "100%", backgroundColor: "#C9963A", padding: 24, marginBottom: 16, alignItems: "center" }}>
            <Text style={{ color: "#1A0A2E", fontSize: 18, letterSpacing: 3, fontWeight: "700", textTransform: "uppercase" }}>Pure Scoring</Text>
            <Text style={{ color: "#1A0A2E", fontSize: 12, marginTop: 6, opacity: 0.7 }}>AI judges everything</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => chooseMode("crowd")} style={{ width: "100%", borderWidth: 1, borderColor: "#C9963A", padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#C9963A", fontSize: 18, letterSpacing: 3, fontWeight: "700", textTransform: "uppercase" }}>Crowd Favorite</Text>
            <Text style={{ color: "#F0E6FF", fontSize: 12, marginTop: 6, opacity: 0.7 }}>AI scores + audience votes</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "rounds" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Rounds</Text>
          <Text style={{ color: "#F0E6FF", fontSize: 36, fontStyle: "italic", marginBottom: 60, textAlign: "center" }}>How many rounds?</Text>
          {roundOptions.map(count => (
            <TouchableOpacity key={count} onPress={() => chooseRounds(count)} style={{ width: "100%", borderWidth: 1, borderColor: "#C9963A", padding: 24, marginBottom: 16, alignItems: "center" }}>
              <Text style={{ color: "#C9963A", fontSize: 18, letterSpacing: 3, fontWeight: "700" }}>{count} ROUNDS</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
