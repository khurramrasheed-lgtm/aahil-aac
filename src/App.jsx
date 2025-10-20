import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Hand,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  HelpCircle,
  Brain,
  Timer,
  Volume2,
  VolumeX,
  RotateCcw,
  Star,
  StarOff,
  Settings,
  Download,
  Upload,
  Plus,
  Trash2,
  Pencil,
  Utensils,
  Sandwich,
  CupSoda,
  Bike,
  Music,
  Calendar as CalendarIcon,
  BedDouble,
  School,
  Activity,
  Heart,
  Users,
  DoorOpen,
  MapPin,
  BookOpen,
  Tv,
  Lightbulb,
  EyeOff,
  CloudSun,
  ThermometerSun,
  ThermometerSnowflake,
} from "lucide-react";

/**
 * FIX: Some lucide-react icons (Sun, Moon, Horse) intermittently fail to load from the CDN.
 * Solution: Replace with confirmed-available alternatives and add runtime self-tests.
 * - Replaced Sun  -> CloudSun
 * - Replaced Moon -> BedDouble
 * - Removed Horse import (kept "horse riding" as text)
 */

// ---------- Small UI helpers (shadcn-like) ----------
const cx = (...cls) => cls.filter(Boolean).join(" ");
const Card = ({ className = "", children, onClick }) => (
  <div
    onClick={onClick}
    className={cx(
      "rounded-2xl shadow-md border border-gray-200 bg-white p-4 cursor-pointer hover:shadow-lg transition",
      className
    )}
  >
    {children}
  </div>
);
const Button = ({ className = "", children, onClick, disabled, variant = "default" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cx(
      "px-4 py-2 rounded-2xl font-medium transition shadow-sm",
      variant === "ghost" && "bg-transparent hover:bg-gray-100",
      variant === "secondary" && "bg-gray-100 hover:bg-gray-200",
      variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
      variant === "success" && "bg-green-500 text-white hover:bg-green-600",
      variant === "default" && "bg-black text-white hover:bg-gray-800",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);
const Badge = ({ children }) => (
  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
    {children}
  </span>
);

// ---------- Data Model ----------
const INITIAL_MODEL = {
  starters: [
    { key: "i_want", label: "I want", icon: "Hand" },
    { key: "i_need", label: "I need", icon: "HelpCircle" },
    { key: "can_i", label: "Can I", icon: "MessageSquare" },
    { key: "i_feel", label: "I feel", icon: "Heart" },
    { key: "i_dont_want", label: "I don’t want", icon: "ThumbsDown" },
    { key: "i_like", label: "I like", icon: "ThumbsUp" },
    { key: "all_done", label: "All done", icon: "DoorOpen" },
    { key: "lets", label: "Let’s", icon: "Users" },
    { key: "its_too", label: "It’s too…", icon: "Activity" },
    { key: "im", label: "I’m", icon: "Home" },
    { key: "please", label: "Please", icon: "Hand" },
  ],
  // Tier 2 contexts per starter
  contexts: {
    i_want: [
      { key: "to_go", label: "to go", icon: "MapPin" },
      { key: "to_eat", label: "to eat", icon: "Utensils" },
      { key: "to_drink", label: "to drink", icon: "CupSoda" },
      { key: "to_play", label: "to play", icon: "Bike" },
      { key: "to_watch", label: "to watch", icon: "Tv" },
      { key: "to_do", label: "to do", icon: "Lightbulb" },
      { key: "to_rest", label: "to rest", icon: "BedDouble" },
      { key: "aahils_choice", label: "Aahil’s choice", icon: "Star" },
    ],
    i_need: [
      { key: "help", label: "help", icon: "HelpCircle" },
      { key: "a_break", label: "a break", icon: "Timer" },
      { key: "to_use", label: "to use", icon: "Settings" },
    ],
    can_i: [
      { key: "have", label: "have", icon: "Sandwich" },
      { key: "go", label: "go", icon: "MapPin" },
    ],
    i_feel: [
      { key: "feel_list", label: "—", icon: "Heart" },
    ],
    i_dont_want: [
      { key: "to", label: "to", icon: "DoorOpen" },
      { key: "this_that", label: "this/that", icon: "EyeOff" },
    ],
    i_like: [
      { key: "to", label: "to", icon: "ThumbsUp" },
      { key: "things", label: "—", icon: "Star" },
    ],
    all_done: [
      { key: "with", label: "with", icon: "RotateCcw" },
    ],
    lets: [
      { key: "play", label: "play", icon: "Users" },
      { key: "go", label: "go", icon: "MapPin" },
    ],
    its_too: [
      { key: "levels", label: "—", icon: "Activity" },
    ],
    im: [
      { key: "states", label: "—", icon: "Home" },
    ],
    please: [
      { key: "actions", label: "—", icon: "Hand" },
    ],
  },
  // Tier 3 specifics per context
  specifics: {
    // I want
    to_go: [
      "outside",
      "for a walk",
      "for a hike",
      "to the park",
      "to school",
      "to Usman Mamoo’s house",
      "to Aira’s house",
      "to Taha’s house",
      "to Amilia’s house",
      "to therapy",
      "to speech therapy",
      "to OT",
      "horse riding",
    ],
    to_eat: [
      "biryani",
      "rice and chicken",
      "nuggets",
      "wings",
      "burger",
      "pancakes",
      "peanut butter and jam",
      "fruits",
      "fries",
    ],
    to_drink: ["juice", "water", "milk", "smoothie", "hot chocolate"],
    to_play: [
      "on iPad",
      "outside",
      "with Lego",
      "with cars",
      "with toys",
      "with Sharjil",
      "with Qasim",
      "ride my electric bike",
      "listen to music",
    ],
    to_watch: ["YouTube", "a movie", "cartoons", "music videos", "funny clips"],
    to_do: [
      "daily calendar",
      "painting",
      "drawing",
      "music",
      "homework",
      "read a book",
      "nothing",
    ],
    to_rest: ["lie down", "relax", "be alone", "nap", "cuddle with blanket"],
    aahils_choice: [
      "hiking",
      "walking",
      "new song",
      "new game",
      "new place",
    ],

    // I need
    help: [
      "with dressing",
      "with shoes",
      "with homework",
      "with food",
      "with tablet",
      "with game",
      "with calendar",
      "with getting ready",
      "with brushing teeth",
    ],
    a_break: ["from talking", "from noise", "from people", "from screens"],
    to_use: ["the bathroom", "my tablet", "my headphones", "my blanket", "my pillow"],

    // Can I
    have: ["a snack", "iPad", "headphones", "more food", "a turn", "music", "quiet time"],
    go: [
      "outside",
      "to the bathroom",
      "to the kitchen",
      "to see mom",
      "to see dad",
      "to play",
      "to horse riding",
      "to OT",
      "to speech therapy",
    ],

    // I feel
    feel_list: [
      "happy",
      "sad",
      "angry",
      "tired",
      "scared",
      "excited",
      "bored",
      "hungry",
      "sleepy",
      "sick",
      "calm",
      "proud",
      "frustrated",
      "silly",
    ],

    // I don’t want
    to: [
      "go",
      "eat",
      "play",
      "share",
      "listen",
      "take a bath",
      "ride bike",
      "talk",
      "do work",
    ],
    this_that: ["this", "that", "loud sound", "bright light", "music", "smell", "wait"],

    // I like
    things: [
      "biryani",
      "rice",
      "nuggets",
      "burgers",
      "music",
      "horse riding",
      "walks",
      "hiking",
      "calendar time",
      "electric bike",
    ],

    // All done
    with: ["eating", "playing", "iPad", "calendar", "therapy", "homework", "talking"],

    // Let’s
    play: ["together", "ball", "blocks", "bike", "music", "drawing"],
    go2: ["outside", "walk", "ride", "eat", "sleep", "calendar time", "therapy"],

    // It’s too…
    levels: ["loud", "bright", "hot", "cold", "noisy", "smelly"],

    // I’m …
    states: ["ready", "not ready", "okay", "not okay", "hungry", "tired", "excited"],

    // Please …
    actions: ["stop", "wait", "help", "come here", "listen", "open", "close"],
  },
  routines: [
    {
      key: "morning",
      label: "Morning",
      icon: "CloudSun", // replaced Sun
      phrases: [
        ["I want", "to eat", "pancakes"],
        ["I want", "to take", "a bath"],
        ["I need", "help", "with clothes"],
        ["I’m", "—", "ready"],
      ],
    },
    {
      key: "school",
      label: "School",
      icon: "School",
      phrases: [
        ["I want", "to go", "to school"],
        ["I need", "to use", "the bathroom"],
        ["I feel", "—", "happy"],
        ["I don’t want", "to", "talk"],
      ],
    },
    {
      key: "therapy",
      label: "Therapy",
      icon: "Brain",
      phrases: [
        ["I want", "to go", "to speech therapy"],
        ["I want", "to go", "to OT"],
        ["I want", "to do", "horse riding"],
        ["I need", "help", "with calendar"],
      ],
    },
    {
      key: "lunch",
      label: "Lunch",
      icon: "Utensils",
      phrases: [
        ["I want", "to eat", "biryani"],
        ["I’m", "—", "hungry"],
        ["Can I", "have", "a snack"],
        ["All done", "with", "eating"],
      ],
    },
    {
      key: "play",
      label: "Play",
      icon: "Bike",
      phrases: [
        ["I want", "to play", "ride my electric bike"],
        ["I want", "to play", "with Lego"],
        ["I want", "to do", "daily calendar"],
        ["I want", "to play", "listen to music"],
      ],
    },
    {
      key: "evening",
      label: "Evening",
      icon: "CloudSun",
      phrases: [
        ["I want", "to watch", "YouTube"],
        ["I need", "a break", "from noise"],
        ["Let’s", "go", "sleep"],
        ["I’m", "—", "tired"],
      ],
    },
    {
      key: "bedtime",
      label: "Bedtime",
      icon: "BedDouble", // replaced Moon
      phrases: [
        ["I’m", "—", "sleepy"],
        ["I need", "to use", "my blanket"],
        ["Please", "—", "turn off lights"],
        ["Good night"],
      ],
    },
  ],
};

// ---------- Icon Mapping (with fallback) ----------
const iconMap = {
  Home, Hand, ThumbsUp, ThumbsDown, MessageSquare, HelpCircle, Brain, Timer, Volume2, VolumeX, RotateCcw, Star, StarOff, Settings, Download, Upload, Plus, Trash2, Pencil, Utensils, Sandwich, CupSoda, Bike, Music, CalendarIcon, BedDouble, School, Activity, Heart, Users, DoorOpen, MapPin, BookOpen, Tv, Lightbulb, EyeOff, CloudSun, ThermometerSun, ThermometerSnowflake,
};

const Icon = ({ name, className = "w-5 h-5" }) => {
  const Cmp = iconMap[name];
  if (!Cmp) {
    // Graceful fallback if an icon isn't available at runtime
    return <span className={cx(className, "inline-flex items-center justify-center")}>🔷</span>;
  }
  return <Cmp className={className} />;
};

// ---------- Speech ----------
const speak = (text) => {
  try {
    if (!text) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (e) {
    // noop
  }
};

// ---------- Self Tests (runtime) ----------
function SelfTests({ iconMap }) {
  const tests = [
    {
      name: "Icon availability (core)",
      pass: ["Hand", "HelpCircle", "MessageSquare", "Heart", "ThumbsDown", "ThumbsUp", "DoorOpen", "Users", "Activity", "Home"].every((k) => !!iconMap[k]),
    },
    {
      name: "Icon availability (routines)",
      pass: ["CloudSun", "BedDouble", "School", "Bike", "Utensils"].every((k) => !!iconMap[k]),
    },
    {
      name: "Model starters defined",
      pass: Array.isArray(INITIAL_MODEL.starters) && INITIAL_MODEL.starters.length > 5,
    },
    {
      name: "Model contexts defined",
      pass: INITIAL_MODEL.contexts && Object.keys(INITIAL_MODEL.contexts).length >= 5,
    },
    {
      name: "Model specifics contain mapping for Let’s->go (go2)",
      pass: Array.isArray(INITIAL_MODEL.specifics.go2) && INITIAL_MODEL.specifics.go2.length > 0,
    },
    {
      name: "Aahil’s choice options exist",
      pass: Array.isArray(INITIAL_MODEL.specifics.aahils_choice) && INITIAL_MODEL.specifics.aahils_choice.length > 0,
    },
    {
      name: "Routines have phrases",
      pass: Array.isArray(INITIAL_MODEL.routines) && INITIAL_MODEL.routines.every(r => Array.isArray(r.phrases) && r.phrases.length > 0),
    },
  ];
  return (
    <div className="mt-6 p-3 rounded-xl border bg-white shadow-sm">
      <div className="text-sm font-semibold mb-2">Self-tests</div>
      <ul className="text-xs space-y-1">
        {tests.map((t) => (
          <li key={t.name} className={t.pass ? "text-green-700" : "text-red-700"}>
            {t.pass ? "✅" : "❌"} {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Main App ----------
export default function AahilAACApp() {
  const [model, setModel] = useState(INITIAL_MODEL);
  const [tier1, setTier1] = useState(null); // starter key
  const [tier2, setTier2] = useState(null); // context key
  const [sentence, setSentence] = useState([]); // array of strings
  const [favorites, setFavorites] = useState([]); // saved phrases
  const [editMode, setEditMode] = useState(false);
  const [importError, setImportError] = useState("");

  // NEW: routine picker & Aahil's choice picker
  const [routineOpen, setRoutineOpen] = useState(null); // routine object
  const [choiceOpen, setChoiceOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aahil_aac_model");
    const fav = localStorage.getItem("aahil_aac_favs");
    if (saved) setModel(JSON.parse(saved));
    if (fav) setFavorites(JSON.parse(fav));
  }, []);
  useEffect(() => {
    localStorage.setItem("aahil_aac_model", JSON.stringify(model));
  }, [model]);
  useEffect(() => {
    localStorage.setItem("aahil_aac_favs", JSON.stringify(favorites));
  }, [favorites]);

  const resetFlow = () => {
    setTier1(null);
    setTier2(null);
    setSentence([]);
  };

  const starters = model.starters;
  const contexts = tier1 ? model.contexts[tier1] || [] : [];
  const specificKey = tier2?.key === "go" ? "go2" : tier2?.key; // special mapping for Let’s->go
  const specifics = tier2 ? model.specifics[specificKey] || [] : [];

  const readableSentence = useMemo(() => sentence.join(" ").replace(/\s+/g, " ").trim(), [sentence]);

  const addWord = (part) => setSentence((s) => [...s, part]);

  const onStarter = (s) => {
    setTier1(s.key);
    setTier2(null);
    setSentence([s.label]);
    speak(s.label);
  };
  const onContext = (c) => {
    if (c.key === "aahils_choice") {
      setTier2(c);
      setChoiceOpen(true);
      return;
    }
    setTier2(c);
    if (c.label !== "—") addWord(c.label);
    speak(c.label !== "—" ? c.label : "");
  };
  const onSpecific = (x) => {
    addWord(x);
    speak(x);
  };

  const saveFavorite = () => {
    if (!readableSentence) return;
    setFavorites((f) => Array.from(new Set([...f, readableSentence])));
  };
  const removeFavorite = (p) => setFavorites((f) => f.filter((x) => x !== p));

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(model, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aahil_aac_model.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const onImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(String(evt.target?.result || ""));
        setModel(parsed);
        setImportError("");
      } catch (err) {
        setImportError("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Edit helpers: add or remove Tier 3 items quickly
  const addSpecific = () => {
    if (!tier2) return;
    const val = prompt("Add a new option for: " + tier2.label);
    if (!val) return;
    setModel((m) => ({
      ...m,
      specifics: {
        ...m.specifics,
        [specificKey]: [...(m.specifics[specificKey] || []), val],
      },
    }));
  };
  const removeSpecific = (val) => {
    if (!tier2) return;
    setModel((m) => ({
      ...m,
      specifics: {
        ...m.specifics,
        [specificKey]: (m.specifics[specificKey] || []).filter((x) => x !== val),
      },
    }));
  };

  // Routine selection handling
  const openRoutine = (r) => setRoutineOpen(r);
  const chooseRoutinePhrase = (phrase) => {
    setSentence(phrase);
    speak(phrase.join(" "));
    setRoutineOpen(null);
  };

  // Aahil's choice handling
  const chooseAahilChoice = (item) => {
    const starter = sentence[0] || "I want";
    setSentence([starter, item]);
    speak([starter, item].join(" "));
    setChoiceOpen(false);
  };

  return (
    <div className="min-h-[100vh] bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-2xl shadow-md"><Icon name="Star" className="w-6 h-6" /></div>
            <div>
              <h1 className="text-2xl font-bold">Aahil’s AAC</h1>
              <p className="text-sm text-gray-600">Tiered communication with icons, TTS, favorites, routines, JSON import/export, and runtime self-tests.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setEditMode((e) => !e)}>
              <Pencil className="inline w-4 h-4 mr-2" /> {editMode ? "Done" : "Edit"}
            </Button>
            <Button variant="secondary" onClick={exportJSON}>
              <Download className="inline w-4 h-4 mr-2" /> Export
            </Button>
            <label className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-2xl cursor-pointer">
              <Upload className="w-4 h-4" /> Import
              <input type="file" accept="application/json" className="hidden" onChange={onImport} />
            </label>
          </div>
        </div>
        {importError && (
          <div className="mb-4 text-sm text-red-600">{importError}</div>
        )}

        {/* Sentence bar */}
        <div className="mb-5 p-4 rounded-2xl border bg-white shadow-sm flex items-center gap-2">
          <div className="flex-1 text-lg font-medium min-h-[28px]">{readableSentence || <span className="text-gray-400">Tap tiles to build a sentence…</span>}</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => speak(readableSentence)} disabled={!readableSentence}>
              <Volume2 className="w-4 h-4 mr-2" /> Speak
            </Button>
            <Button variant="secondary" onClick={saveFavorite} disabled={!readableSentence}>
              <Star className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button variant="destructive" onClick={resetFlow}>
              <RotateCcw className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </div>

        {/* Routines */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-5 h-5" />
            <h2 className="font-semibold">Daily Routines</h2>
            <Badge>{model.routines.length}</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {model.routines.map((r) => (
              <Card key={r.key} onClick={() => openRoutine(r)}>
                <div className="flex flex-col items-center gap-2">
                  <Icon name={r.icon} className="w-6 h-6" />
                  <div className="text-sm font-semibold text-center">{r.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Grid: Tier 1, Tier 2, Tier 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5" />
              <h2 className="font-semibold">Tier 1 – Starters</h2>
              <Badge>{starters.length}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {starters.map((s) => (
                <Card key={s.key} onClick={() => onStarter(s)} className={cx(tier1 === s.key && "ring-2 ring-black")}>
                  <div className="flex flex-col items-center gap-2">
                    <Icon name={s.icon} className="w-6 h-6" />
                    <div className="text-sm font-semibold text-center">{s.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Tier 2 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5" />
              <h2 className="font-semibold">Tier 2 – Context</h2>
              <Badge>{contexts.length}</Badge>
            </div>
            {!tier1 ? (
              <div className="text-sm text-gray-500">Choose a starter to see contexts.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {contexts.map((c) => (
                  <Card key={c.key} onClick={() => onContext(c)} className={cx(tier2?.key === c.key && "ring-2 ring-black")}>
                    <div className="flex flex-col items-center gap-2">
                      <Icon name={c.icon} className="w-6 h-6" />
                      <div className="text-sm font-semibold text-center">{c.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Tier 3 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <h2 className="font-semibold">Tier 3 – Options</h2>
                <Badge>{specifics.length}</Badge>
              </div>
              {editMode && tier2 && (
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={addSpecific}><Plus className="w-4 h-4 mr-1" /> Add</Button>
                </div>
              )}
            </div>
            {!tier2 ? (
              <div className="text-sm text-gray-500">Choose a context to see options.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specifics.map((sp) => (
                  <Card key={sp} onClick={() => onSpecific(sp)}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold">{sp}</div>
                      {editMode && (
                        <Button variant="ghost" onClick={(e) => { e.stopPropagation(); removeSpecific(sp); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Favorites */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5" />
            <h2 className="font-semibold">Favorites</h2>
            <Badge>{favorites.length}</Badge>
          </div>
          {favorites.length === 0 ? (
            <div className="text-sm text-gray-500">Saved sentences will appear here.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favorites.map((f) => (
                <div key={f} className="flex items-center justify-between gap-2 p-3 rounded-2xl border bg-white shadow-sm">
                  <div className="text-sm font-medium">{f}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => speak(f)}><Volume2 className="w-4 h-4 mr-1" /> Speak</Button>
                    <Button variant="ghost" onClick={() => removeFavorite(f)}><StarOff className="w-4 h-4" /> </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Self-tests */}
        <SelfTests iconMap={iconMap} />

        {/* Routine modal */}
        {routineOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50" onClick={() => setRoutineOpen(null)}>
            <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Icon name={routineOpen.icon} /> <span className="font-semibold">{routineOpen.label}</span></div>
                <Button variant="ghost" onClick={() => setRoutineOpen(null)}>Close</Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {routineOpen.phrases.map((p, idx) => (
                  <Button key={idx} variant="secondary" onClick={() => chooseRoutinePhrase(p)}>
                    {p.join(" ")}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aahil's choice picker */}
        {choiceOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50" onClick={() => setChoiceOpen(false)}>
            <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Star className="w-5 h-5" /> <span className="font-semibold">Aahil’s choice</span></div>
                <Button variant="ghost" onClick={() => setChoiceOpen(false)}>Close</Button>
              </div>

              {/* Suggested choices from model */}
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1">Suggestions</div>
                <div className="grid grid-cols-2 gap-2">
                  {(model.specifics.aahils_choice || []).map((opt) => (
                    <Button key={opt} variant="secondary" onClick={() => chooseAahilChoice(opt)}>{opt}</Button>
                  ))}
                </div>
              </div>

              {/* Favorites as quick picks */}
              <div>
                <div className="text-xs font-semibold mb-1">From Favorites</div>
                {favorites.length === 0 ? (
                  <div className="text-xs text-gray-500">No favorites saved yet.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {favorites.map((f) => (
                      <Button key={f} variant="secondary" onClick={() => chooseAahilChoice(f.replace(/^I want\s*/i, ""))}>{f}</Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Tips */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            Tip: Use <b>Edit</b> to add/remove Tier 3 options quickly. Export the JSON to share or back up the configuration. Import to sync across devices.
          </p>
        </div>
      </div>
    </div>
  );
}
