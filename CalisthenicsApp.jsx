import { useState, useEffect, useRef } from "react";
const PROGRAMS = {
  debutant: {
    label: "Débutant",
    icon: "🌱",
    weeks: "1–8",
    days: [
      {
        name: "Push (Poussée)",
        exercises: [
          { name: "Pompes inclinées", sets: 4, reps: "12–15", rest: "60s", muscle: "Pectoraux", tips: "Mains sur un support surélevé. Descendre lentement (3s)." },
          { name: "Pompes genoux", sets: 3, reps: "8–12", rest: "60s", muscle: "Pectoraux", tips: "Corps aligné des genoux à la tête." },
          { name: "Dips sur chaise", sets: 3, reps: "8–10", rest: "90s", muscle: "Triceps", tips: "Coudes vers l'arrière, pas sur les côtés." },
          { name: "Pike Push-ups", sets: 3, reps: "6–10", rest: "90s", muscle: "Épaules", tips: "Hanches hautes, regard vers les pieds." },
          { name: "Planche bras tendus", sets: 3, reps: "30s", rest: "60s", muscle: "Core", tips: "Serrer les fessiers et les abdos." },
        ],
      },
      {
        name: "Pull (Tirage)",
        exercises: [
          { name: "Tractions australiennes", sets: 4, reps: "10–15", rest: "60s", muscle: "Dos", tips: "Corps droit, tirer la poitrine vers la barre." },
          { name: "Scapular Pulls", sets: 3, reps: "10–12", rest: "60s", muscle: "Dos", tips: "Bras tendus, tirer les omoplates vers le bas." },
          { name: "Negative Pull-ups", sets: 3, reps: "5–8", rest: "120s", muscle: "Dos/Biceps", tips: "Descente en 5 secondes minimum." },
          { name: "Dead Hang", sets: 3, reps: "30–45s", rest: "60s", muscle: "Grip", tips: "Épaules actives (pas relâchées)." },
          { name: "Superman Hold", sets: 3, reps: "20s", rest: "45s", muscle: "Lombaires", tips: "Lever bras et jambes simultanément." },
        ],
      },
      {
        name: "Legs & Core",
        exercises: [
          { name: "Squats", sets: 4, reps: "15–20", rest: "60s", muscle: "Quadriceps", tips: "Descendre sous le parallèle si possible." },
          { name: "Fentes marchées", sets: 3, reps: "12/jambe", rest: "60s", muscle: "Quadriceps/Fessiers", tips: "Genou arrière frôle le sol." },
          { name: "Glute Bridge", sets: 3, reps: "15–20", rest: "45s", muscle: "Fessiers", tips: "Serrer fort en haut pendant 2s." },
          { name: "Hollow Body Hold", sets: 3, reps: "20–30s", rest: "60s", muscle: "Core", tips: "Bas du dos collé au sol." },
          { name: "Leg Raises allongé", sets: 3, reps: "12–15", rest: "45s", muscle: "Abdos bas", tips: "Ne pas cambrer le dos." },
          { name: "Mollets debout", sets: 3, reps: "20–25", rest: "30s", muscle: "Mollets", tips: "Montée explosive, descente lente." },
        ],
      },
    ],
  },
  intermediaire: {
    label: "Intermédiaire",
    icon: "🔥",
    weeks: "9–20",
    days: [
      {
        name: "Push (Poussée)",
        exercises: [
          { name: "Pompes classiques", sets: 4, reps: "15–20", rest: "60s", muscle: "Pectoraux", tips: "Tempo 2-1-1 (descente-pause-montée)." },
          { name: "Pompes diamant", sets: 3, reps: "10–15", rest: "60s", muscle: "Triceps", tips: "Mains en losange sous la poitrine." },
          { name: "Pseudo Planche Push-ups", sets: 3, reps: "8–12", rest: "90s", muscle: "Épaules/Pecs", tips: "Doigts vers l'arrière ou sur le côté." },
          { name: "Dips parallettes", sets: 4, reps: "8–12", rest: "90s", muscle: "Triceps/Pecs", tips: "Léger penché en avant pour les pecs." },
          { name: "Handstand Wall Hold", sets: 3, reps: "30–45s", rest: "120s", muscle: "Épaules", tips: "Ventre face au mur, pousser le sol." },
          { name: "L-Sit (au sol)", sets: 3, reps: "10–20s", rest: "60s", muscle: "Core/Épaules", tips: "Comprimer le corps, épaules basses." },
        ],
      },
      {
        name: "Pull (Tirage)",
        exercises: [
          { name: "Tractions pronation", sets: 4, reps: "6–10", rest: "120s", muscle: "Dos/Biceps", tips: "Menton au-dessus de la barre. Full ROM." },
          { name: "Tractions supination", sets: 3, reps: "6–10", rest: "120s", muscle: "Biceps/Dos", tips: "Serrer les omoplates en haut." },
          { name: "Tuck Front Lever", sets: 4, reps: "10–15s", rest: "120s", muscle: "Dos/Core", tips: "Genoux pliés vers la poitrine, corps horizontal." },
          { name: "Tractions australiennes pieds surélevés", sets: 3, reps: "12–15", rest: "60s", muscle: "Dos", tips: "Pieds sur un banc pour plus d'intensité." },
          { name: "Skin the Cat", sets: 3, reps: "5–8", rest: "90s", muscle: "Épaules/Dos", tips: "Mouvement lent et contrôlé." },
        ],
      },
      {
        name: "Legs & Core",
        exercises: [
          { name: "Pistol Squat (assisté)", sets: 4, reps: "5–8/jambe", rest: "90s", muscle: "Quadriceps", tips: "Se tenir à un support si besoin." },
          { name: "Nordic Curl (négatif)", sets: 3, reps: "5–8", rest: "120s", muscle: "Ischio-jambiers", tips: "Descente la plus lente possible." },
          { name: "Step-ups lestés", sets: 3, reps: "10/jambe", rest: "60s", muscle: "Quadriceps/Fessiers", tips: "Banc à hauteur du genou minimum." },
          { name: "Dragon Flag (tuck)", sets: 3, reps: "6–10", rest: "90s", muscle: "Core", tips: "Genoux pliés, corps rigide." },
          { name: "Hanging Leg Raises", sets: 3, reps: "10–15", rest: "60s", muscle: "Abdos", tips: "Pas d'élan, mouvement contrôlé." },
          { name: "Single Leg Calf Raise", sets: 3, reps: "15/jambe", rest: "30s", muscle: "Mollets", tips: "Sur une marche pour plus d'amplitude." },
        ],
      },
    ],
  },
  avance: {
    label: "Avancé",
    icon: "⚡",
    weeks: "21+",
    days: [
      {
        name: "Push (Poussée)",
        exercises: [
          { name: "Handstand Push-ups (mur)", sets: 4, reps: "5–8", rest: "180s", muscle: "Épaules", tips: "Descente contrôlée, full ROM." },
          { name: "Planche Lean Push-ups", sets: 4, reps: "6–10", rest: "120s", muscle: "Épaules/Pecs", tips: "Penché en avant max, doigts orientés." },
          { name: "Ring Dips", sets: 4, reps: "8–12", rest: "120s", muscle: "Pecs/Triceps", tips: "Turn-out en haut (paumes vers l'avant)." },
          { name: "Pompes 90° (pike profond)", sets: 3, reps: "8–12", rest: "90s", muscle: "Épaules", tips: "Pieds surélevés, angle très fermé." },
          { name: "Straddle Planche Hold", sets: 5, reps: "5–10s", rest: "180s", muscle: "Épaules/Core", tips: "Protraction maximale des épaules." },
          { name: "V-Sit", sets: 3, reps: "10–15s", rest: "90s", muscle: "Core/Épaules", tips: "Jambes tendues à 90°+, sol repoussé." },
        ],
      },
      {
        name: "Pull (Tirage)",
        exercises: [
          { name: "Muscle-ups", sets: 4, reps: "3–6", rest: "180s", muscle: "Dos/Pecs/Triceps", tips: "Traction explosive puis transition fluide." },
          { name: "Front Lever (straddle)", sets: 5, reps: "8–12s", rest: "180s", muscle: "Dos/Core", tips: "Corps horizontal, tirer les omoplates." },
          { name: "Tractions lestées / L-sit", sets: 4, reps: "5–8", rest: "120s", muscle: "Dos/Biceps/Core", tips: "Jambes à 90° pendant la traction." },
          { name: "One-arm Pull-up (négatif)", sets: 3, reps: "3–5/bras", rest: "180s", muscle: "Dos/Biceps", tips: "Descente en 5–8 secondes." },
          { name: "Back Lever", sets: 3, reps: "10–15s", rest: "120s", muscle: "Épaules/Dos", tips: "Progresser depuis tuck vers full." },
        ],
      },
      {
        name: "Legs & Core",
        exercises: [
          { name: "Pistol Squat", sets: 4, reps: "8–10/jambe", rest: "90s", muscle: "Quadriceps", tips: "Sans assistance, descente complète." },
          { name: "Nordic Curl (complet)", sets: 4, reps: "5–8", rest: "120s", muscle: "Ischio-jambiers", tips: "Descente ET remontée contrôlées." },
          { name: "Shrimp Squat", sets: 3, reps: "6–8/jambe", rest: "90s", muscle: "Quadriceps/Fessiers", tips: "Genou arrière touche le sol." },
          { name: "Dragon Flag (full)", sets: 4, reps: "6–10", rest: "90s", muscle: "Core", tips: "Jambes tendues, corps rigide comme une planche." },
          { name: "Front Lever Raises", sets: 3, reps: "5–8", rest: "120s", muscle: "Core/Dos", tips: "De dead hang à horizontal." },
          { name: "Human Flag (practice)", sets: 3, reps: "5–10s", rest: "120s", muscle: "Obliques/Épaules", tips: "Commencer en tuck, progresser." },
        ],
      },
    ],
  },
};
const MEAL_PLANS = {
  prise: {
    label: "Prise de masse",
    icon: "📈",
    calories: "2800–3200",
    macros: { proteines: "2g/kg", glucides: "5g/kg", lipides: "1g/kg" },
    meals: [
      { time: "07:00", name: "Petit-déjeuner", items: "Flocons d'avoine (100g) + banane + 4 œufs + beurre de cacahuète (20g)", cal: "~750 kcal" },
      { time: "10:00", name: "Collation", items: "Fromage blanc (250g) + amandes (30g) + miel", cal: "~350 kcal" },
      { time: "12:30", name: "Déjeuner", items: "Riz complet (150g cru) + poulet (200g) + légumes + huile d'olive", cal: "~800 kcal" },
      { time: "16:00", name: "Pré-training", items: "Pain complet + confiture + banane + whey (30g)", cal: "~450 kcal" },
      { time: "19:30", name: "Post-training", items: "Pâtes complètes (150g cru) + saumon (200g) + brocolis", cal: "~750 kcal" },
      { time: "21:30", name: "Collation soir", items: "Fromage blanc + noix + caseine (ou lait)", cal: "~300 kcal" },
    ],
  },
  seche: {
    label: "Sèche",
    icon: "📉",
    calories: "1800–2200",
    macros: { proteines: "2.2g/kg", glucides: "2.5g/kg", lipides: "0.8g/kg" },
    meals: [
      { time: "07:00", name: "Petit-déjeuner", items: "Omelette 3 œufs + épinards + 1 tranche pain complet", cal: "~400 kcal" },
      { time: "10:00", name: "Collation", items: "Whey (30g) + pomme", cal: "~200 kcal" },
      { time: "12:30", name: "Déjeuner", items: "Poulet grillé (200g) + patate douce (150g) + salade verte", cal: "~550 kcal" },
      { time: "16:00", name: "Pré-training", items: "Fromage blanc 0% (200g) + amandes (15g)", cal: "~200 kcal" },
      { time: "19:30", name: "Post-training", items: "Poisson blanc (200g) + riz basmati (80g cru) + courgettes", cal: "~450 kcal" },
      { time: "21:00", name: "Collation soir", items: "Caseine (30g) ou fromage blanc 0%", cal: "~150 kcal" },
    ],
  },
  maintien: {
    label: "Maintien",
    icon: "⚖️",
    calories: "2300–2600",
    macros: { proteines: "1.8g/kg", glucides: "4g/kg", lipides: "1g/kg" },
    meals: [
      { time: "07:00", name: "Petit-déjeuner", items: "Porridge avoine (80g) + fruits rouges + 3 œufs", cal: "~550 kcal" },
      { time: "10:00", name: "Collation", items: "Yaourt grec + granola (30g) + miel", cal: "~280 kcal" },
      { time: "12:30", name: "Déjeuner", items: "Quinoa (120g cru) + bœuf haché 5% (180g) + légumes rôtis", cal: "~650 kcal" },
      { time: "16:00", name: "Pré-training", items: "Banane + beurre de cacahuète (15g) + pain", cal: "~350 kcal" },
      { time: "19:30", name: "Dîner", items: "Saumon (180g) + riz (100g cru) + haricots verts", cal: "~600 kcal" },
      { time: "21:00", name: "Collation soir", items: "Fromage blanc + noix (20g)", cal: "~200 kcal" },
    ],
  },
};
const WEEKLY_SCHEDULE = [
  { day: "Lundi", type: "push", label: "Push", color: "#ef4444" },
  { day: "Mardi", type: "pull", label: "Pull", color: "#3b82f6" },
  { day: "Mercredi", type: "rest", label: "Repos / Mobilité", color: "#6b7280" },
  { day: "Jeudi", type: "legs", label: "Legs & Core", color: "#22c55e" },
  { day: "Vendredi", type: "push", label: "Push", color: "#ef4444" },
  { day: "Samedi", type: "pull", label: "Pull", color: "#3b82f6" },
  { day: "Dimanche", type: "rest", label: "Repos complet", color: "#6b7280" },
];
const PROGRESSIONS = [
  { skill: "Muscle-up", steps: ["Tractions explosives", "High pulls", "Negative MU", "Band MU", "Strict MU", "Ring MU"], icon: "💪" },
  { skill: "Planche", steps: ["Lean", "Tuck", "Adv. Tuck", "Straddle", "Half lay", "Full"], icon: "🤸" },
  { skill: "Front Lever", steps: ["Tuck", "Adv. Tuck", "One leg", "Straddle", "Half lay", "Full"], icon: "🏋️" },
  { skill: "Handstand", steps: ["Wall hold", "Chest-to-wall", "Heel pulls", "Toe pulls", "Freestanding", "HSPU"], icon: "🤾" },
  { skill: "Human Flag", steps: ["Vertical hold", "Tuck", "Adv. Tuck", "Straddle", "Half", "Full"], icon: "🚩" },
  { skill: "Pistol Squat", steps: ["Assisté", "Négatif", "Box pistol", "Partiel", "Complet", "Lesté"], icon: "🦵" },
];
export default function CalisthenicsApp() {
  const [tab, setTab] = useState("programme");
  const [level, setLevel] = useState("debutant");
  const [selectedDay, setSelectedDay] = useState(0);
  const [mealPlan, setMealPlan] = useState("prise");
  const [completedExercises, setCompletedExercises] = useState({});
  const [skillProgress, setSkillProgress] = useState(() => {
    const init = {};
    PROGRESSIONS.forEach((p) => (init[p.skill] = 0));
    return init;
  });
  const [bodyWeight, setBodyWeight] = useState("");
  const [weightLog, setWeightLog] = useState([]);
  const [weekNumber, setWeekNumber] = useState(1);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const program = PROGRAMS[level];
  const meal = MEAL_PLANS[mealPlan];
  const toggleExercise = (dayIdx, exIdx) => {
    const key = `${level}-${dayIdx}-${exIdx}`;
    setCompletedExercises((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const getDayProgress = (dayIdx) => {
    const exercises = program.days[dayIdx].exercises;
    const done = exercises.filter((_, i) => completedExercises[`${level}-${dayIdx}-${i}`]).length;
    return Math.round((done / exercises.length) * 100);
  };
  const addWeight = () => {
    if (!bodyWeight) return;
    const entry = { date: new Date().toLocaleDateString("fr-FR"), weight: parseFloat(bodyWeight) };
    setWeightLog((prev) => [...prev.slice(-29), entry]);
    setBodyWeight("");
  };
  const tabs = [
    { id: "programme", label: "Programme", icon: "🏋️" },
    { id: "nutrition", label: "Nutrition", icon: "🍽️" },
    { id: "skills", label: "Skills", icon: "🎯" },
    { id: "suivi", label: "Suivi", icon: "📊" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)", borderBottom: "1px solid #222", padding: "24px 20px 16px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 3, margin: 0, background: "linear-gradient(90deg, #f97316, #ef4444, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CALISTHENICS PRO
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888", letterSpacing: 1 }}>PROGRAMME · NUTRITION · PROGRESSION</p>
          {/* Week selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
            <span style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Semaine</span>
            <button onClick={() => setWeekNumber(Math.max(1, weekNumber - 1))} style={{ ...btnSmall, borderColor: "#333" }}>−</button>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: "#f97316", minWidth: 30, textAlign: "center" }}>{weekNumber}</span>
            <button onClick={() => setWeekNumber(weekNumber + 1)} style={{ ...btnSmall, borderColor: "#333" }}>+</button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d", position: "sticky", top: 0, zIndex: 10 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "14px 8px", background: "none", border: "none", color: tab === t.id ? "#f97316" : "#555", fontSize: 12, cursor: "pointer", borderBottom: tab === t.id ? "2px solid #f97316" : "2px solid transparent", fontWeight: tab === t.id ? 700 : 400, letterSpacing: 0.5, transition: "all .2s" }}>
            <div style={{ fontSize: 18 }}>{t.icon}</div>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px 100px" }}>
        {/* ===== PROGRAMME ===== */}
        {tab === "programme" && (
          <div>
            {/* Level selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {Object.entries(PROGRAMS).map(([key, val]) => (
                <button key={key} onClick={() => { setLevel(key); setSelectedDay(0); }} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: level === key ? "2px solid #f97316" : "1px solid #222", background: level === key ? "rgba(249,115,22,0.1)" : "#111", color: level === key ? "#f97316" : "#777", cursor: "pointer", transition: "all .2s" }}>
                  <div style={{ fontSize: 20 }}>{val.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{val.label}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Sem. {val.weeks}</div>
                </button>
              ))}
            </div>
            {/* Weekly schedule toggle */}
            <button onClick={() => setShowSchedule(!showSchedule)} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1px solid #222", background: "#111", color: "#aaa", cursor: "pointer", fontSize: 13, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📅 Planning hebdomadaire</span>
              <span style={{ transform: showSchedule ? "rotate(180deg)" : "", transition: "transform .2s" }}>▼</span>
            </button>
            {showSchedule && (
              <div style={{ marginBottom: 20, borderRadius: 12, overflow: "hidden", border: "1px solid #222" }}>
                {WEEKLY_SCHEDULE.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 14px", background: i % 2 === 0 ? "#111" : "#0d0d0d", gap: 12 }}>
                    <span style={{ width: 80, fontSize: 13, fontWeight: 600, color: "#aaa" }}>{s.day}</span>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: s.color }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Day tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {program.days.map((d, i) => {
                const pct = getDayProgress(i);
                return (
                  <button key={i} onClick={() => setSelectedDay(i)} style={{ flex: 1, padding: "14px 8px", borderRadius: 12, border: selectedDay === i ? "2px solid #f97316" : "1px solid #222", background: selectedDay === i ? "#1a1008" : "#111", color: selectedDay === i ? "#f97316" : "#888", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all .2s" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: `${pct}%`, background: "#f97316", borderRadius: 2, transition: "width .3s" }} />
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{pct}%</div>
                  </button>
                );
              })}
            </div>
            {/* Exercises */}
            {program.days[selectedDay].exercises.map((ex, i) => {
              const key = `${level}-${selectedDay}-${i}`;
              const done = completedExercises[key];
              const expanded = expandedExercise === `${selectedDay}-${i}`;
              return (
                <div key={i} style={{ marginBottom: 10, borderRadius: 14, border: done ? "1px solid #2d5a1e" : "1px solid #1c1c1c", background: done ? "rgba(34,197,94,0.05)" : "#111", overflow: "hidden", transition: "all .3s" }}>
                  <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 12, cursor: "pointer" }} onClick={() => setExpandedExercise(expanded ? null : `${selectedDay}-${i}`)}>
                    <button onClick={(e) => { e.stopPropagation(); toggleExercise(selectedDay, i); }} style={{ width: 28, height: 28, borderRadius: 8, border: done ? "2px solid #22c55e" : "2px solid #333", background: done ? "#22c55e" : "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, transition: "all .2s" }}>
                      {done ? "✓" : ""}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#22c55e" : "#ddd", textDecoration: done ? "line-through" : "none" }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>
                        <span style={{ color: "#f97316" }}>{ex.sets}×{ex.reps}</span> · repos {ex.rest} · <span style={{ color: "#888" }}>{ex.muscle}</span>
                      </div>
                    </div>
                    <span style={{ color: "#444", fontSize: 12, transform: expanded ? "rotate(180deg)" : "", transition: "transform .2s" }}>▼</span>
                  </div>
                  {expanded && (
                    <div style={{ padding: "0 16px 14px 56px", fontSize: 13, color: "#999", lineHeight: 1.6 }}>
                      💡 {ex.tips}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* ===== NUTRITION ===== */}
        {tab === "nutrition" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {Object.entries(MEAL_PLANS).map(([key, val]) => (
                <button key={key} onClick={() => setMealPlan(key)} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: mealPlan === key ? "2px solid #f97316" : "1px solid #222", background: mealPlan === key ? "rgba(249,115,22,0.1)" : "#111", color: mealPlan === key ? "#f97316" : "#777", cursor: "pointer", transition: "all .2s" }}>
                  <div style={{ fontSize: 20 }}>{val.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{val.label}</div>
                </button>
              ))}
            </div>
            {/* Macros card */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "linear-gradient(135deg, #111 0%, #1a1008 100%)", padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#f97316" }}>{meal.calories} KCAL/JOUR</span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Protéines", val: meal.macros.proteines, color: "#ef4444" },
                  { label: "Glucides", val: meal.macros.glucides, color: "#f97316" },
                  { label: "Lipides", val: meal.macros.lipides, color: "#eab308" },
                ].map((m, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: `1px solid ${m.color}22` }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Meal timeline */}
            {meal.meals.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 4, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 50 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", marginBottom: 6 }}>{m.time}</div>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f97316", flexShrink: 0, zIndex: 1 }} />
                  {i < meal.meals.length - 1 && <div style={{ width: 2, flex: 1, background: "#222", marginTop: 2 }} />}
                </div>
                <div style={{ flex: 1, padding: "0 0 20px" }}>
                  <div style={{ borderRadius: 12, border: "1px solid #1c1c1c", background: "#111", padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#ddd" }}>{m.name}</span>
                      <span style={{ fontSize: 11, color: "#f97316", fontWeight: 600 }}>{m.cal}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{m.items}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 16, marginTop: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f97316", marginBottom: 10 }}>💧 Hydratation & Suppléments</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.8 }}>
                • Eau : 3–4L / jour (+ 500ml par heure d'entraînement)<br />
                • Créatine : 5g / jour (tous les jours)<br />
                • Vitamine D : 2000–4000 UI / jour<br />
                • Oméga-3 : 2–3g EPA+DHA / jour<br />
                • Magnésium : 400mg avant le coucher
              </div>
            </div>
          </div>
        )}
        {/* ===== SKILLS ===== */}
        {tab === "skills" && (
          <div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 1.6 }}>
              Clique sur chaque étape pour suivre ta progression sur les mouvements clés de la calisthénie.
            </p>
            {PROGRESSIONS.map((prog) => (
              <div key={prog.skill} style={{ marginBottom: 16, borderRadius: 14, border: "1px solid #1c1c1c", background: "#111", padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>
                    {prog.icon} {prog.skill}
                  </span>
                  <span style={{ fontSize: 11, color: "#f97316", fontWeight: 600 }}>
                    {Math.round((skillProgress[prog.skill] / (prog.steps.length - 1)) * 100)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ position: "relative", height: 6, background: "#222", borderRadius: 3, marginBottom: 14 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(skillProgress[prog.skill] / (prog.steps.length - 1)) * 100}%`, background: "linear-gradient(90deg, #f97316, #ef4444)", borderRadius: 3, transition: "width .3s" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {prog.steps.map((step, i) => {
                    const active = i <= skillProgress[prog.skill];
                    return (
                      <button key={i} onClick={() => setSkillProgress((prev) => ({ ...prev, [prog.skill]: i }))} style={{ padding: "6px 12px", borderRadius: 8, border: active ? "1px solid #f97316" : "1px solid #222", background: active ? "rgba(249,115,22,0.15)" : "#0a0a0a", color: active ? "#f97316" : "#555", fontSize: 11, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "all .2s" }}>
                        {step}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* ===== SUIVI ===== */}
        {tab === "suivi" && (
          <div>
            {/* Weight tracker */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>⚖️ Poids corporel</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <input type="number" step="0.1" placeholder="kg" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addWeight()} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#0a0a0a", color: "#eee", fontSize: 14, outline: "none" }} />
                <button onClick={addWeight} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#f97316", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+</button>
              </div>
              {weightLog.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100, marginBottom: 8 }}>
                    {weightLog.map((entry, i) => {
                      const min = Math.min(...weightLog.map((e) => e.weight));
                      const max = Math.max(...weightLog.map((e) => e.weight));
                      const range = max - min || 1;
                      const height = ((entry.weight - min) / range) * 70 + 20;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                          <div style={{ fontSize: 8, color: "#666", marginBottom: 4 }}>{i === weightLog.length - 1 ? entry.weight : ""}</div>
                          <div style={{ width: "100%", maxWidth: 16, height, background: `linear-gradient(to top, #f97316, #ef4444)`, borderRadius: 4, transition: "height .3s" }} />
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#555" }}>
                    <span>{weightLog[0]?.date}</span>
                    <span>{weightLog[weightLog.length - 1]?.date}</span>
                  </div>
                </div>
              )}
              {weightLog.length === 0 && <p style={{ fontSize: 12, color: "#444", textAlign: "center" }}>Aucune entrée pour l'instant</p>}
            </div>
            {/* Session summary */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📈 Résumé sessions</div>
              {program.days.map((d, i) => {
                const pct = getDayProgress(i);
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: "#aaa" }}>{d.name}</span>
                      <span style={{ color: pct === 100 ? "#22c55e" : "#f97316", fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#222", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #f97316, #ef4444)", borderRadius: 3, transition: "width .3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Tips */}
            <div style={{ borderRadius: 14, border: "1px solid #1c1c1c", background: "linear-gradient(135deg, #111 0%, #0d1117 100%)", padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🧠 Principes clés</div>
              {[
                { title: "Surcharge progressive", desc: "Augmenter volume ou difficulté chaque semaine (1 rep, 1 set, ou progression suivante)." },
                { title: "Tempo contrôlé", desc: "Excentrique lent (3-5s). C'est là que le muscle travaille le plus." },
                { title: "Repos & récupération", desc: "8h de sommeil minimum. Les muscles se construisent au repos." },
                { title: "Consistance > Intensité", desc: "3-5 séances/semaine régulières battent 7 séances/semaine pendant 2 semaines." },
                { title: "Mobilité", desc: "10-15 min d'étirements et mobilité par jour. Essentiel pour les skills avancés." },
              ].map((tip, i) => (
                <div key={i} style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(249,115,22,0.05)", border: "1px solid #1a1a1a" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f97316", marginBottom: 4 }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{tip.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const btnSmall = { width: 32, height: 32, borderRadius: 8, border: "1px solid", background: "none", color: "#aaa", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" };
