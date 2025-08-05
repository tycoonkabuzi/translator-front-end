import React, { useState, useRef } from "react";
import { useLanguages } from "./LanguageContext";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  // Add more languages if needed
];

export default function UserPage({ user }) {
  const { userALang, setUserALang, userBLang, setUserBLang } = useLanguages();

  // Determine own and other user language with setter
  const ownLang = user === "A" ? userALang : userBLang;
  const setOwnLang = user === "A" ? setUserALang : setUserBLang;

  const otherLang = user === "A" ? userBLang : userALang;
  const setOtherLang = user === "A" ? setUserBLang : setUserALang;

  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setTranscript("");
    setTranslation("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await sendAudioAndLangs(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Could not start recording: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioAndLangs = async (audioBlob) => {
    if (!ownLang || !otherLang) {
      alert("Please select both your language and the other user's language.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");
    formData.append("sourceLang", ownLang);
    formData.append("targetLang", otherLang);

    try {
      const res = await fetch(
        "https://translator-back-end.onrender.com/interpret",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.error || "Unknown error"));
        return;
      }

      const data = await res.json();
      setTranscript(data.transcript);
      setTranslation(data.translation);
    } catch (error) {
      alert("Request failed: " + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User {user}</h2>

      <div style={{ marginBottom: 10 }}>
        <label>
          Your language:{" "}
          <select value={ownLang} onChange={(e) => setOwnLang(e.target.value)}>
            <option value="">Select</option>
            {LANG_OPTIONS.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Other user language:{" "}
          <select
            value={otherLang}
            onChange={(e) => setOtherLang(e.target.value)}
          >
            <option value="">Select</option>
            {LANG_OPTIONS.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        {!isRecording ? (
          <button onClick={startRecording} disabled={!ownLang || !otherLang}>
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Transcript (in your language):</h3>
        <p>{transcript || "---"}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Translation (in other user language):</h3>
        <p>{translation || "---"}</p>
      </div>
    </div>
  );
}
