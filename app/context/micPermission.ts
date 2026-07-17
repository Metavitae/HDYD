import { requestRecordingPermissionsAsync, setAudioModeAsync } from "expo-audio";

export const micPermission = { granted: false, requested: false };

export async function requestMicPermissionOnce() {
  if (micPermission.requested) return;
  micPermission.requested = true;
  const { granted } = await requestRecordingPermissionsAsync();
  micPermission.granted = granted;
  if (granted) {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }
}
