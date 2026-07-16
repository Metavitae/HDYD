import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useGame } from "./context/GameContext";

const countries = [
  { name: "Brazil", flag: "🇧🇷", dance: "Samba" },
  { name: "Spain", flag: "🇪🇸", dance: "Flamenco" },
  { name: "Argentina", flag: "🇦🇷", dance: "Tango" },
  { name: "India", flag: "🇮🇳", dance: "Bharatanatyam" },
  { name: "Ireland", flag: "🇮🇪", dance: "Riverdance" },
  { name: "Japan", flag: "🇯🇵", dance: "Bon Odori" },
  { name: "Cuba", flag: "🇨🇺", dance: "Salsa" },
  { name: "Colombia", flag: "🇨🇴", dance: "Cumbia" },
];

export default function Round() {
  const router = useRouter();
  const { currentPlayer, currentRoundIndex, roundCount, currentCountry, setCurrentCountry } = useGame();
  const [phase, setPhase] = useState("spinning");
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();

    setTimeout(() => {
      anim.stop();
      const picked = countries[Math.floor(Math.random() * countries.length)];
      setCurrentCountry(picked);
      setPhase("reveal");
    }, 3000);
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A0A2E", padding: 24 }}>
      {phase === "spinning" && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#C9963A", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
            Round {currentRoundIndex + 1} of {roundCount}
          </Text>
          <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 40 }}>Get Ready...</Text>
          <Animated.Text style={{ fontSize: 100, transform: [{ rotate: spin }] }}>🌍</Animated.Text>
        </View>
      )}
      {phase === "reveal" && currentCountry && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 80, marginBottom: 24 }}>{currentCountry.flag}</Text>
          <Text style={{ color: "#F0E6FF", fontSize: 42, fontWeight: "700", marginBottom: 12 }}>{currentCountry.name}</Text>
          <Text style={{ color: "#C9963A", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 60 }}>
            {currentPlayer ? `${currentPlayer.name}, get dancing!` : "Get dancing!"}
          </Text>
          <TouchableOpacity onPress={() => router.push("/recording")} style={{ backgroundColor: "#C9963A", paddingHorizontal: 48, paddingVertical: 18 }}>
            <Text style={{ color: "#1A0A2E", fontSize: 16, fontWeight: "700", letterSpacing: 4 }}>I'M READY</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
