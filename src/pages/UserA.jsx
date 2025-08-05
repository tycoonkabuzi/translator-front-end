import { useEffect, useState } from "react";
import VoiceInterpreter from "../components/VoiceInterpreter";
import { LANGUAGES } from "../utils/languages";

export default function UserA() {
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [targetLang, setTargetLang] = useState("fr-FR");
  const [incoming, setIncoming] = useState(null);

  // Poll incoming audio stream every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          "https://translator-back-end.onrender.com/stream/A"
        );
        if (!res.ok) throw new Error("Stream fetch failed");
        const data = await res.json();
        if (data.audioBase64) {
          setIncoming(`data:audio/mp3;base64,${data.audioBase64}`);
        }
      } catch (error) {
        console.error("Stream fetch error:", error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Service desk Agent</h1>

      <label className="block font-medium">Select Your Language:</label>
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        className="border rounded p-1"
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      <label className="block font-medium mt-4">Select Target Language:</label>
      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
        className="border rounded p-1"
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      <p>
        Translating from <strong>{LANGUAGES[selectedLang]}</strong> to{" "}
        <strong>{LANGUAGES[targetLang]}</strong>
      </p>

      <VoiceInterpreter
        sourceLang={selectedLang}
        targetLang={targetLang}
        mode="A"
      />

      {incoming && (
        <div>
          <p className="font-semibold mt-4">Incoming Translation:</p>
          <audio controls src={incoming} autoPlay />
        </div>
      )}
    </div>
  );
}
