import { Text, View, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useGame } from "./context/GameContext";

export default function Reveal() {
  const router = useRouter();
  const {
    players,
    currentPlayer,
    currentPlayerIndex,
    currentRoundIndex,
    roundCount,
    addScore,
    nextPlayerTurn,
    nextRound,
    setCurrentPlayerIndex,
  } = useGame();
  const [phase, setPhase] = useState("suspense");
  const rhythmAnim = useRef(new Animated.Value(0)).current;
  const physAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  const [rhythmScore] = useState(() => Math.floor(Math.random() * 40) + 20);
  const [physScore] = useState(() => Math.floor(Math.random() * 60) + 20);
  const scoredRef = useRef(false);

  useEffect(() => {
    setTimeout(() => setPhase("splitscreen"), 2000);
  }, []);

  useEffect(() => {
    if (phase === "scores") {
      Animated.parallel([
        Animated.timing(rhythmAnim, { toValue: rhythmScore / 40, duration: 1400, useNativeDriver: false }),
        Animated.timing(physAnim, { toValue: physScore / 60, duration: 1400, useNativeDriver: false }),
        Animated.timing(textAnim, { toValue: 1, duration: 1400, useNativeDriver: false }),
      ]).start();

      if (!scoredRef.current) {
        scoredRef.current = true;
        addScore(currentPlayerIndex, rhythmScore + physScore);
      }
    }
  }, [phase]);

  const rhythmHeight = rhythmAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const physHeight = physAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const textTranslateY = textAnim.interpolate({ inputRange: [0, 1], outputRange: [120, 0] });
  const textSize = textAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 22] });
  const textLetterSpacing = textAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 8] });

  const handleNext = () => {
    const isLastPlayerOfRound = currentPlayerIndex === players.length - 1;

    if (!isLastPlayerOfRound) {
      nextPlayerTurn();
      router.push("/round");
      return;
    }

    const isFinalRound = currentRoundIndex + 1 >= roundCount;
    if (isFinalRound) {
      router.push("/winner");
      return;
    }

    nextRound();
    setCurrentPlayerIndex(0);
    router.push("/leaderboard");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A0A2E", padding: 24 }}>

      {phase === "suspense" && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#C9963A", fontSize: 16, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>Calculating...</Text>
          <Text style={{ fontSize: 80 }}>⚡</Text>
        </View>
      )}

      {phase === "splitscreen" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={{ color: "#F0E6FF", fontSize: 20, fontWeight: "700", marginBottom: 8, textAlign: "center" }}>{currentPlayer ? currentPlayer.name : ""}</Text>
          <Text style={{ color: "#C9963A", fontSize: 14, letterSpacing: 4, textTransform: "uppercase", marginBottom: 28, textAlign: "center" }}>How did you do?</Text>
          <View style={{ flexDirection: "row", width: "100%", marginBottom: 36 }}>
            <View style={{ flex: 1, backgroundColor: "#2D1B4E", height: 220, justifyContent: "center", alignItems: "center", marginRight: 6, borderRadius: 4, borderWidth: 1, borderColor: "#C9963A" }}>
              <Text style={{ fontSize: 60 }}>🕺</Text>
              <Text style={{ color: "#F0E6FF", fontSize: 15, marginTop: 12, fontWeight: "700", letterSpacing: 2 }}>YOUR MOVES</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#2D1B4E", height: 220, justifyContent: "center", alignItems: "center", marginLeft: 6, borderRadius: 4, borderWidth: 1, borderColor: "#C9963A" }}>
              <Text style={{ fontSize: 60 }}>💃</Text>
              <Text style={{ color: "#C9963A", fontSize: 15, marginTop: 12, fontWeight: "700", letterSpacing: 2 }}>PRO MOVES</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setPhase("scores")} style={{ borderWidth: 1, borderColor: "#C9963A", paddingHorizontal: 32, paddingVertical: 14, alignItems: "center" }}>
            <Text style={{ color: "#C9963A", fontSize: 14, fontWeight: "700", letterSpacing: 4 }}>SEE MY SCORE</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === "scores" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={{ color: "#F0E6FF", fontSize: 20, fontWeight: "700", marginBottom: 20, textAlign: "center" }}>{currentPlayer ? currentPlayer.name : ""}</Text>
          <View style={{ flexDirection: "row", width: "100%", height: 300, marginBottom: 32 }}>
            <View style={{ flexDirection: "row", flex: 1, alignItems: "flex-end", height: 300 }}>
              <View style={{ flex: 1, alignItems: "center", marginRight: 12 }}>
                <View style={{ width: 44, height: 220, backgroundColor: "#2D1B4E", borderRadius: 4, justifyContent: "flex-end" }}>
                  <Animated.View style={{ width: 44, height: rhythmHeight, backgroundColor: "#C9963A", borderRadius: 4 }} />
                </View>
                <Text style={{ color: "#F0E6FF", fontSize: 12, letterSpacing: 2, marginTop: 8, textTransform: "uppercase" }}>Rhythm</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <View style={{ width: 44, height: 220, backgroundColor: "#2D1B4E", borderRadius: 4, justifyContent: "flex-end" }}>
                  <Animated.View style={{ width: 44, height: physHeight, backgroundColor: "#C9963A", borderRadius: 4 }} />
                </View>
                <Text style={{ color: "#F0E6FF", fontSize: 12, letterSpacing: 2, marginTop: 8, textTransform: "uppercase" }}>Moves</Text>
              </View>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 28 }}>
              <Animated.Text style={{ color: "#C9963A", fontWeight: "700", textTransform: "uppercase", transform: [{ translateY: textTranslateY }], fontSize: textSize, letterSpacing: textLetterSpacing }}>
                YOUR{"\n"}SCORE
              </Animated.Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleNext} style={{ backgroundColor: "#C9963A", paddingHorizontal: 48, paddingVertical: 18, width: "100%", alignItems: "center" }}>
            <Text style={{ color: "#1A0A2E", fontSize: 16, fontWeight: "700", letterSpacing: 4 }}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}
