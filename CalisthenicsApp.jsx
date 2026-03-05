import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";

// ============================================================
// CALISTHENICS PRO — Complete Training App
// ============================================================

// ---- STORAGE HELPERS ----
const storage = {
  async get(key, fallback) {
    try {
      const val = await window.storage.get(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  async set(key, val) {
    try { await window.storage.set(key, JSON.stringify(val)); } catch {}
  },
};

// ---- MOTIVATIONAL QUOTES ----
const QUOTES = [
  "La discipline bat la motivation chaque jour.",
  "Ton corps peut le supporter. C'est ton esprit que tu dois convaincre.",
  "Chaque rep te rapproche de la meilleure version de toi-même.",
  "Le confort est l'ennemi du progrès.",
  "Pas d'excuses, pas de limites.",
  "La douleur que tu ressens aujourd'hui sera ta force demain.",
  "Les champions s'entraînent, les perdants se plaignent.",
  "Tu ne regrettes jamais une séance d'entraînement.",
  "Le secret c'est la consistance, pas la perfection.",
  "Deviens la personne que tu veux être, une rep à la fois.",
  "Le meilleur moment pour commencer c'est maintenant.",
  "La sueur est la graisse qui pleure.",
  "Ton seul adversaire c'est toi-même hier.",
  "L'impossible n'est qu'une opinion.",
  "Chaque jour est une chance de devenir plus fort.",
  "Force ne vient pas de la capacité physique. Elle vient d'une volonté indomptable.",
  "Le corps atteint ce que l'esprit croit.",
  "Sois plus fort que tes excuses.",
  "Les résultats viennent avec le temps, pas du jour au lendemain.",
  "Push yourself because no one else is going to do it for you.",
  "La calisthénie c'est l'art de maîtriser son propre corps.",
  "Un jour ou jour un. C'est toi qui décides.",
  "Le progrès est un progrès, même le plus petit.",
  "Entraîne-toi comme une bête, parais comme une beauté.",
  "L'entraînement ne ment jamais.",
  "Chaque pull-up est une victoire sur la gravité.",
  "La barre ne juge pas, elle te teste.",
  "Construis des habitudes, pas des excuses.",
  "Le muscle-up n'est pas un rêve, c'est un plan.",
  "Respecte le processus, les résultats suivront.",
  "La douleur est temporaire, la fierté est éternelle.",
  "Ton potentiel est infini.",
  "La force n'est pas physique, c'est mentale.",
  "Chaque jour est une compétition contre toi-même.",
  "Ne compte pas les jours, fais que les jours comptent.",
  "Les limites n'existent que dans ton esprit.",
  "L'échec est le meilleur professeur.",
  "Sois patient avec toi-même, la transformation prend du temps.",
  "Le plus dur c'est de commencer. Le reste c'est de l'élan.",
  "La calisthénie t'apprend que ton corps est le meilleur outil.",
  "Contrôle ton corps, contrôle ta vie.",
  "Handstand today, human flag tomorrow.",
  "Le front lever est une question de patience, pas de force brute.",
  "La planche n'est pas impossible, elle est inévitable.",
  "Chaque seconde en isométrique forge un mental d'acier.",
  "Le ring muscle-up : quand l'impossible devient ta routine.",
  "La gravité est ton adversaire préféré.",
  "Street workout : la rue est ton gymnase.",
  "Skills unlock with consistency, not talent.",
  "Tu es plus fort que tu ne le penses.",
];

// ---- XP & LEVEL SYSTEM ----
const LEVEL_THRESHOLDS = [
  { min: 0, max: 100, title: "Recrue" },
  { min: 101, max: 200, title: "Recrue" },
  { min: 201, max: 300, title: "Recrue" },
  { min: 301, max: 400, title: "Recrue" },
  { min: 401, max: 500, title: "Recrue" },
  { min: 501, max: 700, title: "Athlète" },
  { min: 701, max: 900, title: "Athlète" },
  { min: 901, max: 1200, title: "Athlète" },
  { min: 1201, max: 1500, title: "Athlète" },
  { min: 1501, max: 2000, title: "Athlète" },
  { min: 2001, max: 2500, title: "Warrior" },
  { min: 2501, max: 3000, title: "Warrior" },
  { min: 3001, max: 3700, title: "Warrior" },
  { min: 3701, max: 4500, title: "Warrior" },
  { min: 4501, max: 5000, title: "Warrior" },
  { min: 5001, max: 6000, title: "Beast" },
  { min: 6001, max: 7200, title: "Beast" },
  { min: 7201, max: 8500, title: "Beast" },
  { min: 8501, max: 10000, title: "Beast" },
  { min: 10001, max: 12000, title: "Beast" },
  { min: 12001, max: 14000, title: "Legend" },
  { min: 14001, max: 17000, title: "Legend" },
  { min: 17001, max: 20000, title: "Legend" },
  { min: 20001, max: 25000, title: "Legend" },
  { min: 25001, max: 30000, title: "Titan" },
  { min: 30001, max: 37000, title: "Titan" },
  { min: 37001, max: 45000, title: "Titan" },
  { min: 45001, max: 50000, title: "Titan" },
];

function getLevel(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].min) return { level: i + 1, ...LEVEL_THRESHOLDS[i] };
  }
  return { level: 1, ...LEVEL_THRESHOLDS[0] };
}

function getLevelProgress(xp) {
  const info = getLevel(xp);
  const range = info.max - info.min;
  const prog = xp - info.min;
  return Math.min(100, Math.round((prog / range) * 100));
}

// ---- BADGES ----
const BADGES = [
  { id: "first_workout", name: "Premier Pas", icon: "👣", desc: "Première séance complétée" },
  { id: "streak_3", name: "Régulier", icon: "🔥", desc: "3 jours de streak" },
  { id: "streak_7", name: "Machine", icon: "⚡", desc: "7 jours de streak" },
  { id: "streak_14", name: "Déterminé", icon: "💎", desc: "14 jours de streak" },
  { id: "streak_30", name: "Inarrêtable", icon: "🏆", desc: "30 jours de streak" },
  { id: "streak_100", name: "Centurion", icon: "👑", desc: "100 jours de streak" },
  { id: "streak_365", name: "Iron Mind", icon: "🧠", desc: "365 jours de streak" },
  { id: "sessions_10", name: "Habitué", icon: "🎯", desc: "10 séances complétées" },
  { id: "sessions_50", name: "Vétéran", icon: "🎖️", desc: "50 séances complétées" },
  { id: "sessions_100", name: "Centurion", icon: "💯", desc: "100 séances complétées" },
  { id: "sessions_500", name: "Spartiate", icon: "⚔️", desc: "500 séances complétées" },
  { id: "pr_first", name: "Record!", icon: "📈", desc: "Premier record personnel" },
  { id: "pr_10", name: "Record Hunter", icon: "🏹", desc: "10 PRs battus" },
  { id: "volume_1000", name: "Volume 1K", icon: "💪", desc: "1 000 reps totales" },
  { id: "volume_5000", name: "Volume 5K", icon: "🦾", desc: "5 000 reps totales" },
  { id: "volume_10000", name: "Volume Beast", icon: "🐉", desc: "10 000 reps totales" },
  { id: "skill_first", name: "Skill Unlock", icon: "🔓", desc: "Premier skill débloqué" },
  { id: "skill_5", name: "Skill Collector", icon: "🗝️", desc: "5 skills maîtrisés" },
  { id: "muscleup", name: "Muscle-up Club", icon: "🦅", desc: "Muscle-up débloqué" },
  { id: "planche", name: "Planche Master", icon: "🤸", desc: "Full planche débloquée" },
  { id: "frontlever", name: "Front Lever", icon: "🏋️", desc: "Front lever débloqué" },
  { id: "handstand", name: "Handstand Pro", icon: "🤾", desc: "Handstand freestanding" },
  { id: "humanflag", name: "Human Flag", icon: "🚩", desc: "Human flag débloqué" },
  { id: "pistol", name: "Pistol Master", icon: "🦵", desc: "Pistol squat maîtrisé" },
  { id: "nutrition_7", name: "Nutrition Rookie", icon: "🥗", desc: "7 jours de suivi repas" },
  { id: "nutrition_30", name: "Nutrition Pro", icon: "🍽️", desc: "30 jours de suivi repas" },
  { id: "water_7", name: "Hydraté", icon: "💧", desc: "7 jours objectif eau atteint" },
  { id: "weight_30", name: "Suivi Régulier", icon: "⚖️", desc: "30 entrées de poids" },
  { id: "early_bird", name: "Early Bird", icon: "🌅", desc: "Séance avant 7h" },
  { id: "night_owl", name: "Night Owl", icon: "🦉", desc: "Séance après 21h" },
  { id: "allrounder", name: "All-Rounder", icon: "🌟", desc: "Tous les groupes musculaires cette semaine" },
];

// ---- EXERCISE DATABASE ----
const EXERCISES = {
  // PUSH
  pompes_inclinees: { name: "Pompes inclinées", muscle: "Pectoraux", emoji: "🫸", tips: "Mains sur un support surélevé. Descendre lentement (3s).", category: "push", difficulty: 1 },
  pompes_genoux: { name: "Pompes genoux", muscle: "Pectoraux", emoji: "🫸", tips: "Corps aligné des genoux à la tête.", category: "push", difficulty: 1 },
  pompes_classiques: { name: "Pompes classiques", muscle: "Pectoraux", emoji: "🫸", tips: "Tempo 2-1-1. Corps gainé.", category: "push", difficulty: 2 },
  pompes_diamant: { name: "Pompes diamant", muscle: "Triceps", emoji: "💎", tips: "Mains en losange sous la poitrine.", category: "push", difficulty: 3 },
  pompes_archer: { name: "Pompes archer", muscle: "Pectoraux", emoji: "🏹", tips: "Un bras tendu sur le côté, alterner.", category: "push", difficulty: 4 },
  pompes_claquees: { name: "Pompes claquées", muscle: "Pectoraux", emoji: "👏", tips: "Phase explosive, amortir la réception.", category: "push", difficulty: 4 },
  pseudo_planche_pu: { name: "Pseudo Planche Push-ups", muscle: "Épaules/Pecs", emoji: "🤸", tips: "Doigts vers l'arrière, penché en avant.", category: "push", difficulty: 4 },
  pike_pushups: { name: "Pike Push-ups", muscle: "Épaules", emoji: "⛰️", tips: "Hanches hautes, regard vers les pieds.", category: "push", difficulty: 2 },
  pike_pushups_elevated: { name: "Pike Push-ups pieds surélevés", muscle: "Épaules", emoji: "⛰️", tips: "Pieds sur un banc, angle plus fermé.", category: "push", difficulty: 3 },
  hspu_wall: { name: "HSPU (mur)", muscle: "Épaules", emoji: "🤾", tips: "Descente contrôlée, full ROM.", category: "push", difficulty: 5 },
  hspu_free: { name: "HSPU freestanding", muscle: "Épaules", emoji: "🤾", tips: "Équilibre + force. Le Graal.", category: "push", difficulty: 6 },
  dips_chaise: { name: "Dips sur chaise", muscle: "Triceps", emoji: "🪑", tips: "Coudes vers l'arrière.", category: "push", difficulty: 1 },
  dips_parallettes: { name: "Dips parallettes", muscle: "Triceps/Pecs", emoji: "🏗️", tips: "Léger penché en avant pour les pecs.", category: "push", difficulty: 3 },
  dips_anneaux: { name: "Ring Dips", muscle: "Pecs/Triceps", emoji: "⭕", tips: "Turn-out en haut.", category: "push", difficulty: 5 },
  planche_bras_tendus: { name: "Planche bras tendus", muscle: "Core", emoji: "🧱", tips: "Serrer fessiers et abdos.", category: "push", difficulty: 1 },
  lsit: { name: "L-Sit", muscle: "Core/Épaules", emoji: "🪑", tips: "Comprimer le corps, épaules basses.", category: "push", difficulty: 3 },
  vsit: { name: "V-Sit", muscle: "Core/Épaules", emoji: "✌️", tips: "Jambes tendues à 90°+.", category: "push", difficulty: 5 },
  planche_lean: { name: "Planche Lean Push-ups", muscle: "Épaules/Pecs", emoji: "🤸", tips: "Penché en avant max.", category: "push", difficulty: 5 },
  straddle_planche: { name: "Straddle Planche Hold", muscle: "Épaules/Core", emoji: "🤸", tips: "Protraction maximale des épaules.", category: "push", difficulty: 6 },
  handstand_wall: { name: "Handstand Wall Hold", muscle: "Épaules", emoji: "🤾", tips: "Ventre face au mur, pousser le sol.", category: "push", difficulty: 3 },
  // PULL
  tractions_australiennes: { name: "Tractions australiennes", muscle: "Dos", emoji: "🔄", tips: "Corps droit, tirer la poitrine vers la barre.", category: "pull", difficulty: 1 },
  tractions_australiennes_elev: { name: "Tractions australiennes pieds surélevés", muscle: "Dos", emoji: "🔄", tips: "Pieds sur un banc.", category: "pull", difficulty: 2 },
  scapular_pulls: { name: "Scapular Pulls", muscle: "Dos", emoji: "🦴", tips: "Bras tendus, tirer les omoplates vers le bas.", category: "pull", difficulty: 1 },
  negative_pullups: { name: "Negative Pull-ups", muscle: "Dos/Biceps", emoji: "⬇️", tips: "Descente en 5 secondes minimum.", category: "pull", difficulty: 2 },
  tractions_pronation: { name: "Tractions pronation", muscle: "Dos/Biceps", emoji: "💪", tips: "Menton au-dessus de la barre. Full ROM.", category: "pull", difficulty: 3 },
  tractions_supination: { name: "Tractions supination", muscle: "Biceps/Dos", emoji: "💪", tips: "Serrer les omoplates en haut.", category: "pull", difficulty: 3 },
  tractions_lestees: { name: "Tractions lestées", muscle: "Dos/Biceps", emoji: "🏋️", tips: "Ajouter progressivement du lest.", category: "pull", difficulty: 5 },
  tractions_lsit: { name: "Tractions L-sit", muscle: "Dos/Biceps/Core", emoji: "🪑", tips: "Jambes à 90° pendant la traction.", category: "pull", difficulty: 5 },
  muscleup: { name: "Muscle-ups", muscle: "Dos/Pecs/Triceps", emoji: "🦅", tips: "Traction explosive puis transition fluide.", category: "pull", difficulty: 6 },
  tuck_front_lever: { name: "Tuck Front Lever", muscle: "Dos/Core", emoji: "🏋️", tips: "Genoux pliés, corps horizontal.", category: "pull", difficulty: 3 },
  front_lever_straddle: { name: "Front Lever (straddle)", muscle: "Dos/Core", emoji: "🏋️", tips: "Corps horizontal, tirer les omoplates.", category: "pull", difficulty: 5 },
  front_lever_full: { name: "Front Lever (full)", muscle: "Dos/Core", emoji: "🏋️", tips: "Corps complètement horizontal et droit.", category: "pull", difficulty: 6 },
  one_arm_pullup_neg: { name: "One-arm Pull-up (négatif)", muscle: "Dos/Biceps", emoji: "☝️", tips: "Descente en 5–8 secondes.", category: "pull", difficulty: 6 },
  skin_the_cat: { name: "Skin the Cat", muscle: "Épaules/Dos", emoji: "🔄", tips: "Mouvement lent et contrôlé.", category: "pull", difficulty: 3 },
  back_lever: { name: "Back Lever", muscle: "Épaules/Dos", emoji: "🔙", tips: "Progresser depuis tuck vers full.", category: "pull", difficulty: 5 },
  dead_hang: { name: "Dead Hang", muscle: "Grip", emoji: "🤲", tips: "Épaules actives.", category: "pull", difficulty: 1 },
  superman_hold: { name: "Superman Hold", muscle: "Lombaires", emoji: "🦸", tips: "Lever bras et jambes simultanément.", category: "pull", difficulty: 1 },
  // LEGS
  squats: { name: "Squats", muscle: "Quadriceps", emoji: "🦵", tips: "Descendre sous le parallèle.", category: "legs", difficulty: 1 },
  squats_jump: { name: "Jump Squats", muscle: "Quadriceps", emoji: "🦘", tips: "Explosive, amortir la réception.", category: "legs", difficulty: 2 },
  fentes: { name: "Fentes marchées", muscle: "Quadriceps/Fessiers", emoji: "🚶", tips: "Genou arrière frôle le sol.", category: "legs", difficulty: 1 },
  fentes_bulgares: { name: "Fentes bulgares", muscle: "Quadriceps/Fessiers", emoji: "🇧🇬", tips: "Pied arrière surélevé sur un banc.", category: "legs", difficulty: 3 },
  glute_bridge: { name: "Glute Bridge", muscle: "Fessiers", emoji: "🌉", tips: "Serrer fort en haut pendant 2s.", category: "legs", difficulty: 1 },
  single_leg_bridge: { name: "Single Leg Glute Bridge", muscle: "Fessiers", emoji: "🌉", tips: "Une jambe à la fois, stabiliser.", category: "legs", difficulty: 2 },
  pistol_assiste: { name: "Pistol Squat (assisté)", muscle: "Quadriceps", emoji: "🔫", tips: "Se tenir à un support.", category: "legs", difficulty: 3 },
  pistol_squat: { name: "Pistol Squat", muscle: "Quadriceps", emoji: "🔫", tips: "Sans assistance, descente complète.", category: "legs", difficulty: 5 },
  nordic_curl_neg: { name: "Nordic Curl (négatif)", muscle: "Ischio-jambiers", emoji: "🧎", tips: "Descente la plus lente possible.", category: "legs", difficulty: 3 },
  nordic_curl: { name: "Nordic Curl (complet)", muscle: "Ischio-jambiers", emoji: "🧎", tips: "Descente ET remontée contrôlées.", category: "legs", difficulty: 5 },
  step_ups: { name: "Step-ups lestés", muscle: "Quadriceps/Fessiers", emoji: "📦", tips: "Banc à hauteur du genou.", category: "legs", difficulty: 2 },
  shrimp_squat: { name: "Shrimp Squat", muscle: "Quadriceps/Fessiers", emoji: "🦐", tips: "Genou arrière touche le sol.", category: "legs", difficulty: 5 },
  mollets: { name: "Mollets debout", muscle: "Mollets", emoji: "🦶", tips: "Montée explosive, descente lente.", category: "legs", difficulty: 1 },
  single_calf: { name: "Single Leg Calf Raise", muscle: "Mollets", emoji: "🦶", tips: "Sur une marche pour amplitude.", category: "legs", difficulty: 2 },
  // CORE
  hollow_body: { name: "Hollow Body Hold", muscle: "Core", emoji: "🥜", tips: "Bas du dos collé au sol.", category: "core", difficulty: 2 },
  leg_raises: { name: "Leg Raises allongé", muscle: "Abdos bas", emoji: "🦵", tips: "Ne pas cambrer le dos.", category: "core", difficulty: 1 },
  hanging_leg_raises: { name: "Hanging Leg Raises", muscle: "Abdos", emoji: "🦵", tips: "Pas d'élan, contrôlé.", category: "core", difficulty: 3 },
  dragon_flag_tuck: { name: "Dragon Flag (tuck)", muscle: "Core", emoji: "🐉", tips: "Genoux pliés, corps rigide.", category: "core", difficulty: 3 },
  dragon_flag: { name: "Dragon Flag (full)", muscle: "Core", emoji: "🐉", tips: "Jambes tendues, corps rigide.", category: "core", difficulty: 5 },
  front_lever_raises: { name: "Front Lever Raises", muscle: "Core/Dos", emoji: "📐", tips: "De dead hang à horizontal.", category: "core", difficulty: 6 },
  human_flag: { name: "Human Flag (practice)", muscle: "Obliques/Épaules", emoji: "🚩", tips: "Commencer en tuck.", category: "core", difficulty: 6 },
  windshield_wipers: { name: "Windshield Wipers", muscle: "Obliques", emoji: "🔄", tips: "Jambes tendues, mouvement contrôlé.", category: "core", difficulty: 4 },
  ab_wheel: { name: "Ab Wheel / Slide-outs", muscle: "Core", emoji: "🛞", tips: "Aller le plus loin possible.", category: "core", difficulty: 3 },
};

// ---- PROGRAMS (5 LEVELS) ----
const PROGRAMS = {
  fondation: {
    label: "Fondation", icon: "🌱", weeks: "1–6",
    criteria: "Réussir 3×10 pompes + 1 traction complète",
    days: [
      { name: "Push (Poussée)", type: "push", exercises: [
        { id: "pompes_inclinees", sets: 4, reps: "12–15", rest: 60, tempo: "3-1-1-0", rpe: 6 },
        { id: "pompes_genoux", sets: 3, reps: "8–12", rest: 60, tempo: "2-1-1-0", rpe: 7 },
        { id: "dips_chaise", sets: 3, reps: "8–10", rest: 90, tempo: "2-0-1-0", rpe: 7 },
        { id: "pike_pushups", sets: 3, reps: "6–10", rest: 90, tempo: "2-1-1-0", rpe: 7 },
        { id: "planche_bras_tendus", sets: 3, reps: "30s", rest: 60, tempo: "hold", rpe: 6 },
      ]},
      { name: "Pull (Tirage)", type: "pull", exercises: [
        { id: "tractions_australiennes", sets: 4, reps: "10–15", rest: 60, tempo: "2-1-1-0", rpe: 6 },
        { id: "scapular_pulls", sets: 3, reps: "10–12", rest: 60, tempo: "2-1-1-0", rpe: 6 },
        { id: "negative_pullups", sets: 3, reps: "5–8", rest: 120, tempo: "5-0-0-0", rpe: 8 },
        { id: "dead_hang", sets: 3, reps: "30–45s", rest: 60, tempo: "hold", rpe: 6 },
        { id: "superman_hold", sets: 3, reps: "20s", rest: 45, tempo: "hold", rpe: 5 },
      ]},
      { name: "Legs & Core", type: "legs", exercises: [
        { id: "squats", sets: 4, reps: "15–20", rest: 60, tempo: "2-1-1-0", rpe: 6 },
        { id: "fentes", sets: 3, reps: "12/jambe", rest: 60, tempo: "2-0-1-0", rpe: 7 },
        { id: "glute_bridge", sets: 3, reps: "15–20", rest: 45, tempo: "2-2-1-0", rpe: 6 },
        { id: "hollow_body", sets: 3, reps: "20–30s", rest: 60, tempo: "hold", rpe: 7 },
        { id: "leg_raises", sets: 3, reps: "12–15", rest: 45, tempo: "2-0-2-0", rpe: 6 },
        { id: "mollets", sets: 3, reps: "20–25", rest: 30, tempo: "1-1-3-0", rpe: 5 },
      ]},
    ],
  },
  debutant: {
    label: "Débutant", icon: "🔰", weeks: "7–14",
    criteria: "3×10 tractions + 3×20 dips + 60s planche",
    days: [
      { name: "Push (Poussée)", type: "push", exercises: [
        { id: "pompes_classiques", sets: 4, reps: "15–20", rest: 60, tempo: "2-1-1-0", rpe: 7 },
        { id: "pompes_diamant", sets: 3, reps: "10–15", rest: 60, tempo: "2-1-1-0", rpe: 7 },
        { id: "dips_parallettes", sets: 4, reps: "8–12", rest: 90, tempo: "2-0-1-0", rpe: 8 },
        { id: "pike_pushups_elevated", sets: 3, reps: "8–12", rest: 90, tempo: "2-1-1-0", rpe: 7 },
        { id: "handstand_wall", sets: 3, reps: "30–45s", rest: 120, tempo: "hold", rpe: 7 },
        { id: "lsit", sets: 3, reps: "10–20s", rest: 60, tempo: "hold", rpe: 8 },
      ]},
      { name: "Pull (Tirage)", type: "pull", exercises: [
        { id: "tractions_pronation", sets: 4, reps: "6–10", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "tractions_supination", sets: 3, reps: "6–10", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "tuck_front_lever", sets: 4, reps: "10–15s", rest: 120, tempo: "hold", rpe: 8 },
        { id: "tractions_australiennes_elev", sets: 3, reps: "12–15", rest: 60, tempo: "2-1-1-0", rpe: 7 },
        { id: "skin_the_cat", sets: 3, reps: "5–8", rest: 90, tempo: "3-0-3-0", rpe: 7 },
      ]},
      { name: "Legs & Core", type: "legs", exercises: [
        { id: "pistol_assiste", sets: 4, reps: "5–8/jambe", rest: 90, tempo: "3-1-1-0", rpe: 8 },
        { id: "nordic_curl_neg", sets: 3, reps: "5–8", rest: 120, tempo: "5-0-0-0", rpe: 8 },
        { id: "step_ups", sets: 3, reps: "10/jambe", rest: 60, tempo: "2-0-1-0", rpe: 7 },
        { id: "dragon_flag_tuck", sets: 3, reps: "6–10", rest: 90, tempo: "3-1-1-0", rpe: 8 },
        { id: "hanging_leg_raises", sets: 3, reps: "10–15", rest: 60, tempo: "2-1-2-0", rpe: 7 },
        { id: "single_calf", sets: 3, reps: "15/jambe", rest: 30, tempo: "1-1-3-0", rpe: 6 },
      ]},
    ],
  },
  intermediaire: {
    label: "Intermédiaire", icon: "🔥", weeks: "15–30",
    criteria: "10 dips anneaux + tuck FL 15s + HSPU négatives",
    days: [
      { name: "Push (Poussée)", type: "push", exercises: [
        { id: "pompes_archer", sets: 4, reps: "8–12/côté", rest: 90, tempo: "2-1-1-0", rpe: 8 },
        { id: "dips_anneaux", sets: 4, reps: "8–12", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "pseudo_planche_pu", sets: 3, reps: "8–12", rest: 90, tempo: "2-1-1-0", rpe: 8 },
        { id: "hspu_wall", sets: 4, reps: "5–8", rest: 180, tempo: "2-1-1-0", rpe: 9 },
        { id: "lsit", sets: 3, reps: "20–30s", rest: 60, tempo: "hold", rpe: 7 },
        { id: "handstand_wall", sets: 3, reps: "45–60s", rest: 120, tempo: "hold", rpe: 7 },
      ]},
      { name: "Pull (Tirage)", type: "pull", exercises: [
        { id: "tractions_lestees", sets: 4, reps: "5–8", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "front_lever_straddle", sets: 5, reps: "8–12s", rest: 180, tempo: "hold", rpe: 9 },
        { id: "tractions_lsit", sets: 4, reps: "5–8", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "skin_the_cat", sets: 3, reps: "6–10", rest: 90, tempo: "3-0-3-0", rpe: 7 },
        { id: "back_lever", sets: 3, reps: "10–15s", rest: 120, tempo: "hold", rpe: 8 },
      ]},
      { name: "Legs & Core", type: "legs", exercises: [
        { id: "pistol_squat", sets: 4, reps: "6–8/jambe", rest: 90, tempo: "3-1-1-0", rpe: 8 },
        { id: "nordic_curl", sets: 4, reps: "5–8", rest: 120, tempo: "3-0-2-0", rpe: 9 },
        { id: "fentes_bulgares", sets: 3, reps: "10/jambe", rest: 60, tempo: "2-1-1-0", rpe: 7 },
        { id: "dragon_flag", sets: 4, reps: "6–10", rest: 90, tempo: "3-1-1-0", rpe: 8 },
        { id: "windshield_wipers", sets: 3, reps: "8–12", rest: 60, tempo: "2-1-2-0", rpe: 8 },
        { id: "single_calf", sets: 3, reps: "20/jambe", rest: 30, tempo: "1-1-3-0", rpe: 6 },
      ]},
    ],
  },
  avance: {
    label: "Avancé", icon: "⚡", weeks: "31–52",
    criteria: "Muscle-up + straddle planche 5s + pistol squat",
    days: [
      { name: "Push (Poussée)", type: "push", exercises: [
        { id: "hspu_wall", sets: 4, reps: "5–8", rest: 180, tempo: "2-1-1-0", rpe: 9 },
        { id: "planche_lean", sets: 4, reps: "6–10", rest: 120, tempo: "2-1-1-0", rpe: 9 },
        { id: "dips_anneaux", sets: 4, reps: "10–15", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "pompes_claquees", sets: 3, reps: "8–12", rest: 90, tempo: "explosive", rpe: 8 },
        { id: "straddle_planche", sets: 5, reps: "5–10s", rest: 180, tempo: "hold", rpe: 9 },
        { id: "vsit", sets: 3, reps: "10–15s", rest: 90, tempo: "hold", rpe: 8 },
      ]},
      { name: "Pull (Tirage)", type: "pull", exercises: [
        { id: "muscleup", sets: 4, reps: "3–6", rest: 180, tempo: "explosive", rpe: 9 },
        { id: "front_lever_straddle", sets: 5, reps: "10–15s", rest: 180, tempo: "hold", rpe: 9 },
        { id: "tractions_lsit", sets: 4, reps: "5–8", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "one_arm_pullup_neg", sets: 3, reps: "3–5/bras", rest: 180, tempo: "5-0-0-0", rpe: 9 },
        { id: "back_lever", sets: 3, reps: "15–20s", rest: 120, tempo: "hold", rpe: 8 },
      ]},
      { name: "Legs & Core", type: "legs", exercises: [
        { id: "pistol_squat", sets: 4, reps: "8–10/jambe", rest: 90, tempo: "2-1-1-0", rpe: 7 },
        { id: "nordic_curl", sets: 4, reps: "5–8", rest: 120, tempo: "3-0-2-0", rpe: 9 },
        { id: "shrimp_squat", sets: 3, reps: "6–8/jambe", rest: 90, tempo: "3-1-1-0", rpe: 8 },
        { id: "dragon_flag", sets: 4, reps: "8–12", rest: 90, tempo: "3-1-1-0", rpe: 8 },
        { id: "front_lever_raises", sets: 3, reps: "5–8", rest: 120, tempo: "2-1-2-0", rpe: 9 },
        { id: "human_flag", sets: 3, reps: "5–10s", rest: 120, tempo: "hold", rpe: 9 },
      ]},
    ],
  },
  elite: {
    label: "Élite", icon: "👑", weeks: "52+",
    criteria: "Full planche + front lever + HSPU freestanding",
    days: [
      { name: "Push (Poussée)", type: "push", exercises: [
        { id: "hspu_free", sets: 4, reps: "3–5", rest: 180, tempo: "2-1-1-0", rpe: 10 },
        { id: "straddle_planche", sets: 5, reps: "10–15s", rest: 180, tempo: "hold", rpe: 10 },
        { id: "dips_anneaux", sets: 4, reps: "15–20", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "planche_lean", sets: 4, reps: "8–12", rest: 120, tempo: "2-1-1-0", rpe: 8 },
        { id: "pompes_claquees", sets: 4, reps: "12–15", rest: 90, tempo: "explosive", rpe: 7 },
        { id: "vsit", sets: 3, reps: "15–20s", rest: 90, tempo: "hold", rpe: 8 },
      ]},
      { name: "Pull (Tirage)", type: "pull", exercises: [
        { id: "muscleup", sets: 4, reps: "6–10", rest: 180, tempo: "2-1-1-0", rpe: 8 },
        { id: "front_lever_full", sets: 5, reps: "10–15s", rest: 180, tempo: "hold", rpe: 10 },
        { id: "one_arm_pullup_neg", sets: 4, reps: "3–5/bras", rest: 180, tempo: "8-0-0-0", rpe: 10 },
        { id: "front_lever_raises", sets: 3, reps: "5–8", rest: 120, tempo: "2-1-2-0", rpe: 9 },
        { id: "back_lever", sets: 3, reps: "20–30s", rest: 120, tempo: "hold", rpe: 8 },
      ]},
      { name: "Legs & Core", type: "legs", exercises: [
        { id: "pistol_squat", sets: 4, reps: "10–12/jambe", rest: 90, tempo: "2-1-1-0", rpe: 7 },
        { id: "nordic_curl", sets: 4, reps: "8–12", rest: 120, tempo: "2-0-2-0", rpe: 8 },
        { id: "shrimp_squat", sets: 4, reps: "8–10/jambe", rest: 90, tempo: "2-1-1-0", rpe: 8 },
        { id: "dragon_flag", sets: 4, reps: "12–15", rest: 90, tempo: "2-1-1-0", rpe: 7 },
        { id: "human_flag", sets: 4, reps: "10–15s", rest: 120, tempo: "hold", rpe: 9 },
        { id: "windshield_wipers", sets: 3, reps: "12–15", rest: 60, tempo: "2-1-2-0", rpe: 8 },
      ]},
    ],
  },
};

// ---- SKILL PROGRESSIONS ----
const SKILL_TREES = [
  { skill: "Muscle-up", icon: "🦅", steps: [
    { name: "Tractions explosives", desc: "Tirer la barre au sternum", weeks: "2–4", prereq: [] },
    { name: "High pulls", desc: "Barre en dessous des pecs", weeks: "3–6", prereq: [0] },
    { name: "Negative MU", desc: "Descente lente depuis le haut", weeks: "2–4", prereq: [1] },
    { name: "Band MU", desc: "Muscle-up avec bande élastique", weeks: "3–6", prereq: [2] },
    { name: "Kipping MU", desc: "Avec élan contrôlé", weeks: "2–4", prereq: [3] },
    { name: "Strict MU (barre)", desc: "Sans élan, barre fixe", weeks: "4–8", prereq: [4] },
    { name: "Ring MU", desc: "Muscle-up aux anneaux", weeks: "4–8", prereq: [5] },
    { name: "Weighted MU", desc: "Muscle-up lesté", weeks: "8+", prereq: [6] },
  ]},
  { skill: "Planche", icon: "🤸", steps: [
    { name: "Lean", desc: "Penché en avant, pieds au sol", weeks: "2–4", prereq: [] },
    { name: "Tuck Planche", desc: "Genoux pliés vers poitrine", weeks: "4–8", prereq: [0] },
    { name: "Adv. Tuck", desc: "Dos horizontal, genoux pliés", weeks: "6–12", prereq: [1] },
    { name: "Straddle", desc: "Jambes écartées tendues", weeks: "8–16", prereq: [2] },
    { name: "Half Lay", desc: "Jambes semi-tendues", weeks: "8–16", prereq: [3] },
    { name: "Full Planche", desc: "Corps complètement horizontal", weeks: "12–24", prereq: [4] },
    { name: "Planche Push-ups", desc: "Pompes en position planche", weeks: "12+", prereq: [5] },
  ]},
  { skill: "Front Lever", icon: "🏋️", steps: [
    { name: "Tuck FL", desc: "Genoux pliés, horizontal", weeks: "2–4", prereq: [] },
    { name: "Adv. Tuck", desc: "Genoux moins pliés", weeks: "4–8", prereq: [0] },
    { name: "One Leg", desc: "Une jambe tendue", weeks: "4–8", prereq: [1] },
    { name: "Straddle", desc: "Jambes écartées tendues", weeks: "6–12", prereq: [2] },
    { name: "Half Lay", desc: "Jambes semi-tendues rapprochées", weeks: "8–12", prereq: [3] },
    { name: "Full FL", desc: "Corps droit horizontal", weeks: "8–16", prereq: [4] },
    { name: "FL Rows", desc: "Tractions en front lever", weeks: "12+", prereq: [5] },
  ]},
  { skill: "Back Lever", icon: "🔙", steps: [
    { name: "German Hang", desc: "Suspension inversée passive", weeks: "2–4", prereq: [] },
    { name: "Tuck BL", desc: "Genoux pliés, inversé", weeks: "3–6", prereq: [0] },
    { name: "Adv. Tuck", desc: "Genoux moins pliés", weeks: "4–8", prereq: [1] },
    { name: "Straddle", desc: "Jambes écartées tendues", weeks: "6–12", prereq: [2] },
    { name: "Full BL", desc: "Corps droit, inversé horizontal", weeks: "8–16", prereq: [3] },
  ]},
  { skill: "Handstand", icon: "🤾", steps: [
    { name: "Wall Hold", desc: "Dos au mur, bras tendus", weeks: "1–3", prereq: [] },
    { name: "Chest-to-wall", desc: "Ventre face au mur", weeks: "2–4", prereq: [0] },
    { name: "Heel Pulls", desc: "Décoller les talons du mur", weeks: "3–6", prereq: [1] },
    { name: "Toe Pulls", desc: "Équilibre avec un orteil au mur", weeks: "4–8", prereq: [2] },
    { name: "Freestanding 30s", desc: "30s sans appui", weeks: "6–12", prereq: [3] },
    { name: "HSPU (mur)", desc: "Pompes en handstand au mur", weeks: "8–16", prereq: [4] },
    { name: "90° Push-up", desc: "Handstand push-up 90° libre", weeks: "16+", prereq: [5] },
  ]},
  { skill: "Human Flag", icon: "🚩", steps: [
    { name: "Vertical Hold", desc: "Corps vertical sur le poteau", weeks: "2–4", prereq: [] },
    { name: "Tuck", desc: "Genoux pliés vers poitrine", weeks: "4–8", prereq: [0] },
    { name: "Adv. Tuck", desc: "Genoux moins pliés", weeks: "6–12", prereq: [1] },
    { name: "Straddle", desc: "Jambes écartées", weeks: "8–16", prereq: [2] },
    { name: "Full Flag", desc: "Corps droit horizontal", weeks: "12–24", prereq: [3] },
    { name: "Flag Press", desc: "Monter depuis le bas", weeks: "16+", prereq: [4] },
  ]},
  { skill: "L-Sit", icon: "🪑", steps: [
    { name: "Tuck L-Sit", desc: "Genoux pliés", weeks: "1–3", prereq: [] },
    { name: "One Leg", desc: "Une jambe tendue", weeks: "2–4", prereq: [0] },
    { name: "Full L-Sit", desc: "Deux jambes tendues 90°", weeks: "4–8", prereq: [1] },
    { name: "V-Sit", desc: "Jambes au-dessus de 90°", weeks: "8–12", prereq: [2] },
    { name: "Manna", desc: "Jambes parallèles au sol derrière", weeks: "24+", prereq: [3] },
  ]},
  { skill: "Pistol Squat", icon: "🦵", steps: [
    { name: "Assisté", desc: "Avec support (main sur poteau)", weeks: "2–4", prereq: [] },
    { name: "Box Pistol", desc: "S'asseoir sur une box", weeks: "2–4", prereq: [0] },
    { name: "Négatif", desc: "Descente lente uniquement", weeks: "2–4", prereq: [1] },
    { name: "Complet", desc: "Full ROM sans aide", weeks: "4–8", prereq: [2] },
    { name: "Lesté", desc: "Avec gilet ou poids", weeks: "4–8", prereq: [3] },
    { name: "Dragon Squat", desc: "Pistol avec jambe croisée", weeks: "8+", prereq: [4] },
  ]},
  { skill: "Iron Cross", icon: "✝️", steps: [
    { name: "Ring Support", desc: "Maintien bras tendus anneaux", weeks: "2–4", prereq: [] },
    { name: "Negative", desc: "Descente lente bras écartés", weeks: "8–16", prereq: [0] },
    { name: "Assisted", desc: "Avec bande élastique", weeks: "12–24", prereq: [1] },
    { name: "Full IC", desc: "Iron cross complète", weeks: "24+", prereq: [2] },
  ]},
  { skill: "360 Pull", icon: "🔄", steps: [
    { name: "High Pull explosif", desc: "Traction lâchée au sommet", weeks: "4–8", prereq: [] },
    { name: "180 Turn", desc: "Demi-tour en l'air", weeks: "6–12", prereq: [0] },
    { name: "360 Pull", desc: "Tour complet en l'air", weeks: "12+", prereq: [1] },
  ]},
];

// ---- MEAL PLANS ----
const MEAL_PLANS = {
  prise: {
    label: "Prise de masse", icon: "📈", calories: "2800–3200",
    macros: { proteines: "2g/kg", glucides: "5g/kg", lipides: "1g/kg" },
    meals: [
      { time: "07:00", name: "Petit-déjeuner", items: "Flocons d'avoine (100g) + banane + 4 œufs + beurre de cacahuète (20g)", cal: "~750 kcal", veg: "Tofu brouillé (200g) + avoine + banane + PB" },
      { time: "10:00", name: "Collation", items: "Fromage blanc (250g) + amandes (30g) + miel", cal: "~350 kcal", veg: "Yaourt soja (250g) + amandes + miel" },
      { time: "12:30", name: "Déjeuner", items: "Riz complet (150g) + poulet (200g) + légumes + huile d'olive", cal: "~800 kcal", veg: "Riz complet + lentilles (200g) + légumes rôtis" },
      { time: "16:00", name: "Pré-training", items: "Pain complet + confiture + banane + whey (30g)", cal: "~450 kcal", veg: "Pain complet + confiture + banane + protéine pois" },
      { time: "19:30", name: "Post-training", items: "Pâtes complètes (150g) + saumon (200g) + brocolis", cal: "~750 kcal", veg: "Pâtes + tempeh (200g) + brocolis + sauce soja" },
      { time: "21:30", name: "Collation soir", items: "Fromage blanc + noix + caséine", cal: "~300 kcal", veg: "Yaourt soja + noix + protéine de pois" },
    ],
  },
  seche: {
    label: "Sèche", icon: "📉", calories: "1800–2200",
    macros: { proteines: "2.2g/kg", glucides: "2.5g/kg", lipides: "0.8g/kg" },
    meals: [
      { time: "07:00", name: "Petit-déjeuner", items: "Omelette 3 œufs + épinards + 1 tranche pain complet", cal: "~400 kcal", veg: "Tofu scramble + épinards + pain complet" },
      { time: "10:00", name: "Collation", items: "Whey (30g) + pomme", cal: "~200 kcal", veg: "Protéine pois (30g) + pomme" },
      { time: "12:30", name: "Déjeuner", items: "Poulet grillé (200g) + patate douce (150g) + salade", cal: "~550 kcal", veg: "Seitan (200g) + patate douce + salade" },
      { time: "16:00", name: "Pré-training", items: "Fromage blanc 0% (200g) + amandes (15g)", cal: "~200 kcal", veg: "Yaourt soja 0% + amandes" },
      { time: "19:30", name: "Post-training", items: "Poisson blanc (200g) + riz basmati (80g) + courgettes", cal: "~450 kcal", veg: "Tofu ferme (200g) + riz + courgettes" },
      { time: "21:00", name: "Collation soir", items: "Caséine (30g) ou fromage blanc 0%", cal: "~150 kcal", veg: "Protéine pois (30g)" },
    ],
  },
  maintien: {
    label: "Maintien", icon: "⚖️", calories: "2300–2600",
    macros: { proteines: "1.8g/kg", glucides: "4g/kg", lipides: "1g/kg" },
    meals: [
      { time: "07:00", name: "Petit-déjeuner", items: "Porridge (80g) + fruits rouges + 3 œufs", cal: "~550 kcal", veg: "Porridge + fruits rouges + tofu brouillé" },
      { time: "10:00", name: "Collation", items: "Yaourt grec + granola (30g) + miel", cal: "~280 kcal", veg: "Yaourt soja + granola + miel" },
      { time: "12:30", name: "Déjeuner", items: "Quinoa (120g) + bœuf haché 5% (180g) + légumes rôtis", cal: "~650 kcal", veg: "Quinoa + haricots noirs + légumes rôtis" },
      { time: "16:00", name: "Pré-training", items: "Banane + beurre de cacahuète (15g) + pain", cal: "~350 kcal", veg: "Identique" },
      { time: "19:30", name: "Dîner", items: "Saumon (180g) + riz (100g) + haricots verts", cal: "~600 kcal", veg: "Tempeh (180g) + riz + haricots verts" },
      { time: "21:00", name: "Collation soir", items: "Fromage blanc + noix (20g)", cal: "~200 kcal", veg: "Yaourt soja + noix" },
    ],
  },
};

// ---- FOOD DATABASE (100+ items) ----
const FOOD_DB = [
  { name: "Poulet (100g)", cal: 165, p: 31, g: 0, l: 3.6 },
  { name: "Saumon (100g)", cal: 208, p: 20, g: 0, l: 13 },
  { name: "Œuf entier", cal: 78, p: 6, g: 0.6, l: 5 },
  { name: "Blanc d'œuf", cal: 17, p: 3.6, g: 0.2, l: 0.1 },
  { name: "Bœuf haché 5% (100g)", cal: 137, p: 21, g: 0, l: 5 },
  { name: "Thon (100g)", cal: 132, p: 28, g: 0, l: 1 },
  { name: "Crevettes (100g)", cal: 85, p: 20, g: 0, l: 0.5 },
  { name: "Dinde (100g)", cal: 135, p: 30, g: 0, l: 1 },
  { name: "Poisson blanc (100g)", cal: 96, p: 21, g: 0, l: 0.8 },
  { name: "Tofu (100g)", cal: 76, p: 8, g: 1.9, l: 4.8 },
  { name: "Tempeh (100g)", cal: 192, p: 20, g: 7.6, l: 11 },
  { name: "Seitan (100g)", cal: 148, p: 25, g: 4, l: 1.5 },
  { name: "Lentilles cuites (100g)", cal: 116, p: 9, g: 20, l: 0.4 },
  { name: "Pois chiches cuits (100g)", cal: 164, p: 9, g: 27, l: 2.6 },
  { name: "Haricots rouges (100g)", cal: 127, p: 8.7, g: 22.8, l: 0.5 },
  { name: "Riz complet cuit (100g)", cal: 123, p: 2.7, g: 26, l: 1 },
  { name: "Riz blanc cuit (100g)", cal: 130, p: 2.7, g: 28, l: 0.3 },
  { name: "Pâtes cuites (100g)", cal: 131, p: 5, g: 25, l: 1 },
  { name: "Quinoa cuit (100g)", cal: 120, p: 4.4, g: 21, l: 1.9 },
  { name: "Patate douce (100g)", cal: 86, p: 1.6, g: 20, l: 0.1 },
  { name: "Pomme de terre (100g)", cal: 77, p: 2, g: 17, l: 0.1 },
  { name: "Pain complet (1 tranche)", cal: 69, p: 3.6, g: 12, l: 1.1 },
  { name: "Pain blanc (1 tranche)", cal: 79, p: 2.7, g: 15, l: 1 },
  { name: "Flocons d'avoine (100g)", cal: 379, p: 13, g: 67, l: 6.5 },
  { name: "Muesli (100g)", cal: 340, p: 8, g: 66, l: 5 },
  { name: "Banane", cal: 105, p: 1.3, g: 27, l: 0.4 },
  { name: "Pomme", cal: 52, p: 0.3, g: 14, l: 0.2 },
  { name: "Orange", cal: 62, p: 1.2, g: 15, l: 0.2 },
  { name: "Fraises (100g)", cal: 32, p: 0.7, g: 7.7, l: 0.3 },
  { name: "Myrtilles (100g)", cal: 57, p: 0.7, g: 14, l: 0.3 },
  { name: "Avocat (100g)", cal: 160, p: 2, g: 8.5, l: 14.7 },
  { name: "Brocolis (100g)", cal: 34, p: 2.8, g: 7, l: 0.4 },
  { name: "Épinards (100g)", cal: 23, p: 2.9, g: 3.6, l: 0.4 },
  { name: "Courgette (100g)", cal: 17, p: 1.2, g: 3.1, l: 0.3 },
  { name: "Haricots verts (100g)", cal: 31, p: 1.8, g: 7, l: 0.1 },
  { name: "Carottes (100g)", cal: 41, p: 0.9, g: 10, l: 0.2 },
  { name: "Tomate (100g)", cal: 18, p: 0.9, g: 3.9, l: 0.2 },
  { name: "Lait entier (250ml)", cal: 152, p: 8, g: 12, l: 8 },
  { name: "Lait demi-écrémé (250ml)", cal: 115, p: 8, g: 12, l: 4 },
  { name: "Lait d'amande (250ml)", cal: 30, p: 1, g: 1, l: 2.5 },
  { name: "Yaourt grec (100g)", cal: 97, p: 9, g: 3.6, l: 5 },
  { name: "Fromage blanc 0% (100g)", cal: 46, p: 7, g: 3.5, l: 0.1 },
  { name: "Fromage blanc (100g)", cal: 73, p: 7, g: 3.5, l: 3.4 },
  { name: "Whey protein (30g)", cal: 120, p: 24, g: 3, l: 1.5 },
  { name: "Caséine (30g)", cal: 120, p: 24, g: 4, l: 1 },
  { name: "Protéine pois (30g)", cal: 110, p: 21, g: 4, l: 1.5 },
  { name: "Beurre cacahuète (15g)", cal: 94, p: 3.5, g: 3, l: 8 },
  { name: "Amandes (30g)", cal: 173, p: 6, g: 6, l: 15 },
  { name: "Noix (30g)", cal: 185, p: 4.3, g: 4, l: 18 },
  { name: "Noix de cajou (30g)", cal: 163, p: 5, g: 9, l: 13 },
  { name: "Graines de chia (15g)", cal: 73, p: 2.5, g: 6, l: 4.5 },
  { name: "Graines de lin (15g)", cal: 80, p: 2.7, g: 4.3, l: 6.3 },
  { name: "Huile d'olive (15ml)", cal: 119, p: 0, g: 0, l: 13.5 },
  { name: "Beurre (10g)", cal: 72, p: 0, g: 0, l: 8 },
  { name: "Miel (15g)", cal: 46, p: 0, g: 12, l: 0 },
  { name: "Confiture (20g)", cal: 52, p: 0, g: 13, l: 0 },
  { name: "Chocolat noir 85% (20g)", cal: 120, p: 2.5, g: 6, l: 10 },
  { name: "Granola (30g)", cal: 132, p: 2.8, g: 20, l: 5 },
  { name: "Fromage emmental (30g)", cal: 113, p: 8.5, g: 0.1, l: 8.8 },
  { name: "Jambon blanc (2 tranches)", cal: 60, p: 10, g: 1, l: 2 },
  { name: "Cottage cheese (100g)", cal: 98, p: 11, g: 3.4, l: 4.3 },
  { name: "Edamame (100g)", cal: 121, p: 12, g: 9, l: 5 },
  { name: "Houmous (30g)", cal: 47, p: 1.5, g: 3.5, l: 3 },
  { name: "Tartine complète + beurre", cal: 120, p: 3, g: 14, l: 6 },
  { name: "Crêpe protéinée", cal: 180, p: 18, g: 15, l: 5 },
  { name: "Smoothie banane-whey", cal: 280, p: 28, g: 35, l: 4 },
  { name: "Wrap poulet-crudités", cal: 350, p: 25, g: 30, l: 12 },
  { name: "Salade César", cal: 300, p: 20, g: 12, l: 20 },
  { name: "Bowl poké saumon", cal: 550, p: 30, g: 60, l: 18 },
];

// ---- WEEKLY SCHEDULE ----
const WEEKLY_SCHEDULE = [
  { day: "Lundi", type: "push", label: "Push", color: "#ef4444" },
  { day: "Mardi", type: "pull", label: "Pull", color: "#3b82f6" },
  { day: "Mercredi", type: "rest", label: "Repos / Mobilité", color: "#6b7280" },
  { day: "Jeudi", type: "legs", label: "Legs & Core", color: "#22c55e" },
  { day: "Vendredi", type: "push", label: "Push", color: "#ef4444" },
  { day: "Samedi", type: "pull", label: "Pull", color: "#3b82f6" },
  { day: "Dimanche", type: "rest", label: "Repos complet", color: "#6b7280" },
];

// ---- WARMUP TEMPLATES ----
const WARMUPS = {
  push: [
    "Cercles de bras (30s chaque sens)", "Rotations épaules (10 chaque)", "Band pull-aparts (15)", "Pompes inclinées faciles (10)",
    "Scapular push-ups (10)", "Wrist circles (20 chaque)", "Cat-cow stretch (10)", "Shoulder dislocates (10)",
  ],
  pull: [
    "Dead hang (30s)", "Scapular pulls (10)", "Band pull-aparts (15)", "Cercles de bras (30s)",
    "Cat-cow stretch (10)", "Tractions australiennes faciles (8)", "Rotations thoraciques (10/côté)", "Shoulder dislocates (10)",
  ],
  legs: [
    "Marche sur place (60s)", "Squats légers (15)", "Fentes latérales (10/côté)", "Cercles de hanches (10/sens)",
    "Hip flexor stretch (30s/côté)", "Glute bridges légers (15)", "Mollets (20)", "Genoux hauts (30s)",
  ],
};

// ---- WEEKLY CHALLENGES ----
const WEEKLY_CHALLENGES = [
  { title: "100 Pompes", desc: "Atteindre 100 pompes cumulées cette semaine", target: 100, unit: "reps", exercise: "pompes" },
  { title: "50 Tractions", desc: "50 tractions cumulées cette semaine", target: 50, unit: "reps", exercise: "tractions" },
  { title: "5 Séances", desc: "Compléter 5 séances cette semaine", target: 5, unit: "séances" },
  { title: "200 Squats", desc: "200 squats cumulés cette semaine", target: 200, unit: "reps", exercise: "squats" },
  { title: "10 min Handstand", desc: "Accumuler 10 min de handstand", target: 600, unit: "sec" },
  { title: "150 Dips", desc: "150 dips cumulés cette semaine", target: 150, unit: "reps", exercise: "dips" },
  { title: "Eau 3L/jour × 7", desc: "Boire 3L d'eau chaque jour pendant 7 jours", target: 7, unit: "jours" },
  { title: "Streak 7 jours", desc: "S'entraîner 7 jours consécutifs", target: 7, unit: "jours" },
  { title: "Core Challenge", desc: "Accumuler 30 min d'exercices de core", target: 1800, unit: "sec" },
  { title: "1000 Reps", desc: "1000 reps totales cette semaine", target: 1000, unit: "reps" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CalisthenicsApp() {
  // ---- STATE ----
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [subTab, setSubTab] = useState(null);

  // Profile / Onboarding
  const [profile, setProfile] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({ name: "", age: "", sex: "homme", height: "", weight: "", goal: "force", level: "fondation", daysPerWeek: 3, equipment: [], injuries: "" });

  // Program
  const [currentLevel, setCurrentLevel] = useState("fondation");
  const [selectedDay, setSelectedDay] = useState(0);
  const [weekNumber, setWeekNumber] = useState(1);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});

  // Live workout
  const [liveWorkout, setLiveWorkout] = useState(null);
  const [liveExIdx, setLiveExIdx] = useState(0);
  const [liveSetIdx, setLiveSetIdx] = useState(0);
  const [liveReps, setLiveReps] = useState("");
  const [liveWeight, setLiveWeight] = useState("");
  const [restTimer, setRestTimer] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  const [currentWorkoutData, setCurrentWorkoutData] = useState([]);
  const restRef = useRef(null);
  const workoutRef = useRef(null);

  // Nutrition
  const [mealPlan, setMealPlan] = useState("prise");
  const [showVeg, setShowVeg] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [nutritionLog, setNutritionLog] = useState([]);
  const [todayMeals, setTodayMeals] = useState([]);
  const [foodSearch, setFoodSearch] = useState("");
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [customFoodQty, setCustomFoodQty] = useState(1);

  // Skills
  const [skillProgress, setSkillProgress] = useState(() => {
    const init = {};
    SKILL_TREES.forEach(s => { init[s.skill] = []; });
    return init;
  });
  const [expandedSkill, setExpandedSkill] = useState(null);

  // Analytics / Suivi
  const [weightLog, setWeightLog] = useState([]);
  const [bodyWeight, setBodyWeight] = useState("");
  const [prs, setPrs] = useState({});

  // Gamification
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [showBadgePopup, setShowBadgePopup] = useState(null);

  // Tools
  const [toolTab, setToolTab] = useState("timer");
  const [timerType, setTimerType] = useState("rest");
  const [timerDuration, setTimerDuration] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const [tabataWork, setTabataWork] = useState(20);
  const [tabataRest, setTabataRest] = useState(10);
  const [tabataRounds, setTabataRounds] = useState(8);
  const [tabataPhase, setTabataPhase] = useState("idle");
  const [tabataCurrentRound, setTabataCurrentRound] = useState(0);
  const [emomDuration, setEmomDuration] = useState(60);
  const [emomRounds, setEmomRounds] = useState(10);
  const [amrapDuration, setAmrapDuration] = useState(600);
  const timerRef = useRef(null);
  const tabataRef = useRef(null);

  // Calculators
  const [calcWeight, setCalcWeight] = useState("");
  const [calcReps, setCalcReps] = useState("");
  const [calcHeight, setCalcHeight] = useState("");
  const [calcAge, setCalcAge] = useState("");
  const [calcSex, setCalcSex] = useState("homme");
  const [calcActivity, setCalcActivity] = useState(1.55);
  const [calcNeck, setCalcNeck] = useState("");
  const [calcWaist, setCalcWaist] = useState("");
  const [calcHip, setCalcHip] = useState("");

  // Settings
  const [units, setUnits] = useState("metric");
  const [theme, setTheme] = useState("dark");

  // Challenge
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState(0);

  // ---- LOAD DATA ----
  useEffect(() => {
    (async () => {
      try {
        const p = await storage.get("user-profile", null);
        if (p) {
          setProfile(p);
          setCurrentLevel(p.level || "fondation");
          setOnboardingData(p);
        }
        setWorkoutLog(await storage.get("workout-log", []));
        setNutritionLog(await storage.get("nutrition-log", []));
        setWeightLog(await storage.get("weight-log", []));
        setSkillProgress(await storage.get("skill-progress", (() => { const i = {}; SKILL_TREES.forEach(s => { i[s.skill] = []; }); return i; })()));
        setAchievements(await storage.get("achievements", []));
        setPrs(await storage.get("prs", {}));
        const gam = await storage.get("gamification", { xp: 0, streak: 0, bestStreak: 0, totalSessions: 0, totalReps: 0 });
        setXp(gam.xp || 0);
        setStreak(gam.streak || 0);
        setBestStreak(gam.bestStreak || 0);
        setTotalSessions(gam.totalSessions || 0);
        setTotalReps(gam.totalReps || 0);
        const s = await storage.get("settings", { units: "metric", theme: "dark" });
        setUnits(s.units || "metric");
        setTheme(s.theme || "dark");
        setWaterIntake(await storage.get("water-today", 0));
        setTodayMeals(await storage.get("meals-today", []));
        setCompletedExercises(await storage.get("completed-exercises", {}));
        const wc = await storage.get("weekly-challenge", null);
        if (wc) { setWeeklyChallenge(wc.challenge); setChallengeProgress(wc.progress || 0); }
        else {
          const ch = WEEKLY_CHALLENGES[Math.floor(Math.random() * WEEKLY_CHALLENGES.length)];
          setWeeklyChallenge(ch);
          await storage.set("weekly-challenge", { challenge: ch, progress: 0 });
        }
        const wn = await storage.get("week-number", 1);
        setWeekNumber(wn);
      } catch {}
      setLoading(false);
    })();
  }, []);

  // ---- SAVE HELPERS ----
  const saveGamification = useCallback(async (newXp, newStreak, newBest, newSessions, newReps) => {
    await storage.set("gamification", { xp: newXp, streak: newStreak, bestStreak: newBest, totalSessions: newSessions, totalReps: newReps });
  }, []);

  const addXp = useCallback((amount) => {
    setXp(prev => { const n = prev + amount; saveGamification(n, streak, bestStreak, totalSessions, totalReps); return n; });
  }, [streak, bestStreak, totalSessions, totalReps, saveGamification]);

  const unlockBadge = useCallback((badgeId) => {
    if (achievements.includes(badgeId)) return;
    const newAch = [...achievements, badgeId];
    setAchievements(newAch);
    storage.set("achievements", newAch);
    setShowBadgePopup(BADGES.find(b => b.id === badgeId));
    setTimeout(() => setShowBadgePopup(null), 3000);
    addXp(150);
  }, [achievements, addXp]);

  // ---- REST TIMER ----
  useEffect(() => {
    if (restActive && restTimer > 0) {
      restRef.current = setTimeout(() => setRestTimer(t => t - 1), 1000);
    } else if (restActive && restTimer <= 0) {
      setRestActive(false);
      try { navigator.vibrate?.(500); } catch {}
    }
    return () => clearTimeout(restRef.current);
  }, [restActive, restTimer]);

  // ---- WORKOUT TIMER ----
  useEffect(() => {
    if (workoutStartTime) {
      workoutRef.current = setInterval(() => {
        setWorkoutTimer(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(workoutRef.current);
  }, [workoutStartTime]);

  // ---- TOOL TIMER ----
  useEffect(() => {
    if (timerRunning && timerValue > 0) {
      timerRef.current = setTimeout(() => setTimerValue(v => v - 1), 1000);
    } else if (timerRunning && timerValue <= 0) {
      setTimerRunning(false);
      try { navigator.vibrate?.(1000); } catch {}
    }
    return () => clearTimeout(timerRef.current);
  }, [timerRunning, timerValue]);

  // ---- HELPERS ----
  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const today = new Date().toISOString().slice(0, 10);
  const dayOfWeek = new Date().getDay();
  const todaySchedule = WEEKLY_SCHEDULE[(dayOfWeek + 6) % 7];
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
  const levelInfo = useMemo(() => getLevel(xp), [xp]);
  const levelProgress = useMemo(() => getLevelProgress(xp), [xp]);
  const program = PROGRAMS[currentLevel];

  const getDayProgress = useCallback((dayIdx) => {
    const exs = program.days[dayIdx].exercises;
    const done = exs.filter((_, i) => completedExercises[`${currentLevel}-${dayIdx}-${i}`]).length;
    return Math.round((done / exs.length) * 100);
  }, [program, completedExercises, currentLevel]);

  // ---- ONBOARDING ----
  const finishOnboarding = async () => {
    const p = { ...onboardingData };
    setProfile(p);
    setCurrentLevel(p.level);
    await storage.set("user-profile", p);
    setTab("dashboard");
  };

  // ---- LIVE WORKOUT ----
  const startWorkout = (dayIdx) => {
    const day = program.days[dayIdx];
    setLiveWorkout(day);
    setLiveExIdx(0);
    setLiveSetIdx(0);
    setLiveReps("");
    setLiveWeight("");
    setCurrentWorkoutData([]);
    setWorkoutStartTime(Date.now());
    setWorkoutTimer(0);
    setShowWorkoutSummary(false);
    setTab("programme");
    setSubTab("live");
  };

  const finishSet = () => {
    const ex = liveWorkout.exercises[liveExIdx];
    const exInfo = EXERCISES[ex.id];
    const reps = parseInt(liveReps) || 0;
    const weight = parseFloat(liveWeight) || 0;
    const entry = { exerciseId: ex.id, name: exInfo.name, set: liveSetIdx + 1, reps, weight, time: Date.now() };
    setCurrentWorkoutData(prev => [...prev, entry]);
    setTotalReps(prev => { const n = prev + reps; saveGamification(xp, streak, bestStreak, totalSessions, n); return n; });
    const numSets = ex.sets;
    if (liveSetIdx + 1 < numSets) {
      setLiveSetIdx(liveSetIdx + 1);
      setRestTimer(ex.rest);
      setRestActive(true);
    } else {
      if (liveExIdx + 1 < liveWorkout.exercises.length) {
        setLiveExIdx(liveExIdx + 1);
        setLiveSetIdx(0);
        setRestTimer(ex.rest);
        setRestActive(true);
      } else {
        finishWorkout();
      }
    }
    setLiveReps("");
    setLiveWeight("");
  };

  const finishWorkout = async () => {
    clearInterval(workoutRef.current);
    const duration = workoutTimer;
    const totalR = currentWorkoutData.reduce((s, e) => s + e.reps, 0);
    const entry = { date: today, timestamp: Date.now(), duration, level: currentLevel, day: liveWorkout.name, exercises: currentWorkoutData, totalReps: totalR };
    const newLog = [...workoutLog, entry];
    setWorkoutLog(newLog);
    await storage.set("workout-log", newLog);
    const newSessions = totalSessions + 1;
    setTotalSessions(newSessions);
    addXp(50);
    // Streak
    const newStreak = streak + 1;
    const newBest = Math.max(bestStreak, newStreak);
    setStreak(newStreak);
    setBestStreak(newBest);
    await saveGamification(xp + 50, newStreak, newBest, newSessions, totalReps + totalR);
    // Badges
    if (newSessions === 1) unlockBadge("first_workout");
    if (newSessions >= 10) unlockBadge("sessions_10");
    if (newSessions >= 50) unlockBadge("sessions_50");
    if (newSessions >= 100) unlockBadge("sessions_100");
    if (newStreak >= 3) unlockBadge("streak_3");
    if (newStreak >= 7) { unlockBadge("streak_7"); addXp(200); }
    if (newStreak >= 14) unlockBadge("streak_14");
    if (newStreak >= 30) { unlockBadge("streak_30"); addXp(1000); }
    if (newStreak >= 100) unlockBadge("streak_100");
    setShowWorkoutSummary(true);
    setWorkoutStartTime(null);
  };

  const closeWorkoutSummary = () => {
    setShowWorkoutSummary(false);
    setLiveWorkout(null);
    setSubTab(null);
  };

  // ---- NUTRITION HELPERS ----
  const addWater = async (ml) => {
    const n = waterIntake + ml;
    setWaterIntake(n);
    await storage.set("water-today", n);
    if (n >= 3000) addXp(20);
  };

  const addMealTracked = async (mealName) => {
    const n = [...todayMeals, mealName];
    setTodayMeals(n);
    await storage.set("meals-today", n);
    addXp(10);
  };

  const addFoodItem = async (food, qty) => {
    const entry = { ...food, qty, date: today, time: new Date().toLocaleTimeString("fr-FR") };
    const newLog = [...nutritionLog, entry];
    setNutritionLog(newLog);
    await storage.set("nutrition-log", newLog);
    setShowFoodSearch(false);
    setFoodSearch("");
  };

  const todayNutrition = useMemo(() => {
    const todayItems = nutritionLog.filter(e => e.date === today);
    return todayItems.reduce((acc, e) => ({
      cal: acc.cal + (e.cal * (e.qty || 1)),
      p: acc.p + (e.p * (e.qty || 1)),
      g: acc.g + (e.g * (e.qty || 1)),
      l: acc.l + (e.l * (e.qty || 1)),
    }), { cal: 0, p: 0, g: 0, l: 0 });
  }, [nutritionLog, today]);

  // ---- WEIGHT LOG ----
  const addWeight = async () => {
    if (!bodyWeight) return;
    const entry = { date: today, weight: parseFloat(bodyWeight) };
    const n = [...weightLog, entry].slice(-365);
    setWeightLog(n);
    await storage.set("weight-log", n);
    setBodyWeight("");
    addXp(10);
    if (n.length >= 30) unlockBadge("weight_30");
  };

  // ---- SKILL TOGGLE ----
  const toggleSkillStep = async (skillName, stepIdx) => {
    const newProg = { ...skillProgress };
    const arr = newProg[skillName] || [];
    if (arr.includes(stepIdx)) {
      newProg[skillName] = arr.filter(i => i !== stepIdx);
    } else {
      newProg[skillName] = [...arr, stepIdx];
      addXp(150);
    }
    setSkillProgress(newProg);
    await storage.set("skill-progress", newProg);
  };

  // ---- TDEE CALCULATOR ----
  const calcTDEE = useMemo(() => {
    if (!calcWeight || !calcHeight || !calcAge) return null;
    const w = parseFloat(calcWeight);
    const h = parseFloat(calcHeight);
    const a = parseInt(calcAge);
    let bmr = calcSex === "homme" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    return Math.round(bmr * calcActivity);
  }, [calcWeight, calcHeight, calcAge, calcSex, calcActivity]);

  const calc1RM = useMemo(() => {
    if (!calcWeight || !calcReps) return null;
    const w = parseFloat(calcWeight);
    const r = parseInt(calcReps);
    if (r <= 0) return null;
    return Math.round(w * (1 + r / 30)); // Epley
  }, [calcWeight, calcReps]);

  const calcBMI = useMemo(() => {
    if (!calcWeight || !calcHeight) return null;
    const w = parseFloat(calcWeight);
    const h = parseFloat(calcHeight) / 100;
    return (w / (h * h)).toFixed(1);
  }, [calcWeight, calcHeight]);

  const calcBodyFat = useMemo(() => {
    if (!calcNeck || !calcWaist || !calcHeight) return null;
    const neck = parseFloat(calcNeck);
    const waist = parseFloat(calcWaist);
    const height = parseFloat(calcHeight);
    if (calcSex === "homme") {
      return (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1);
    } else {
      const hip = parseFloat(calcHip) || 0;
      return (495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450).toFixed(1);
    }
  }, [calcNeck, calcWaist, calcHip, calcHeight, calcSex]);

  // ---- EXPORT DATA ----
  const exportData = async () => {
    const data = {
      profile, workoutLog, nutritionLog, weightLog, skillProgress, achievements, prs,
      gamification: { xp, streak, bestStreak, totalSessions, totalReps },
      settings: { units, theme },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "calisthenics-pro-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // ---- RESET ----
  const resetAll = async () => {
    const keys = ["user-profile", "workout-log", "nutrition-log", "weight-log", "skill-progress", "achievements", "prs", "gamification", "settings", "water-today", "meals-today", "completed-exercises", "weekly-challenge", "week-number"];
    for (const k of keys) await storage.set(k, null);
    window.location.reload();
  };

  // ---- TOGGLE EXERCISE COMPLETE ----
  const toggleExercise = async (dayIdx, exIdx) => {
    const key = `${currentLevel}-${dayIdx}-${exIdx}`;
    const n = { ...completedExercises, [key]: !completedExercises[key] };
    setCompletedExercises(n);
    await storage.set("completed-exercises", n);
  };

  // ---- LOADING ----
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <div style={{ width: 60, height: 60, border: "3px solid #222", borderTop: "3px solid #f97316", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#666", fontSize: 14 }}>Chargement...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ---- ONBOARDING SCREEN ----
  if (!profile) {
    const steps = ["Identité", "Objectif", "Niveau", "Équipement"];
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#e5e5e5", fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px" }}>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: 3, textAlign: "center", background: "linear-gradient(90deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CALISTHENICS PRO</h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: 30, fontSize: 14 }}>Configuration initiale — Étape {onboardingStep + 1}/{steps.length}</p>
          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 30 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i <= onboardingStep ? "#f97316" : "#333", transition: "all .3s" }} />
            ))}
          </div>
          {onboardingStep === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ fontSize: 13, color: "#888" }}>Prénom</label>
              <input value={onboardingData.name} onChange={e => setOnboardingData({ ...onboardingData, name: e.target.value })} placeholder="Ton prénom" style={inputStyle} />
              <label style={{ fontSize: 13, color: "#888" }}>Âge</label>
              <input type="number" value={onboardingData.age} onChange={e => setOnboardingData({ ...onboardingData, age: e.target.value })} placeholder="25" style={inputStyle} />
              <label style={{ fontSize: 13, color: "#888" }}>Sexe</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["homme", "femme"].map(s => (
                  <button key={s} onClick={() => setOnboardingData({ ...onboardingData, sex: s })} style={{ flex: 1, padding: 12, borderRadius: 10, border: onboardingData.sex === s ? "2px solid #f97316" : "1px solid #333", background: onboardingData.sex === s ? "rgba(249,115,22,0.1)" : "#111", color: onboardingData.sex === s ? "#f97316" : "#888", cursor: "pointer", fontSize: 14, textTransform: "capitalize" }}>{s}</button>
                ))}
              </div>
              <label style={{ fontSize: 13, color: "#888" }}>Taille (cm)</label>
              <input type="number" value={onboardingData.height} onChange={e => setOnboardingData({ ...onboardingData, height: e.target.value })} placeholder="175" style={inputStyle} />
              <label style={{ fontSize: 13, color: "#888" }}>Poids (kg)</label>
              <input type="number" value={onboardingData.weight} onChange={e => setOnboardingData({ ...onboardingData, weight: e.target.value })} placeholder="75" style={inputStyle} />
            </div>
          )}
          {onboardingStep === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 14, color: "#aaa", marginBottom: 8 }}>Quel est ton objectif principal ?</label>
              {[
                { id: "force", label: "Force", icon: "💪", desc: "Progresser sur les mouvements de force" },
                { id: "hypertrophie", label: "Hypertrophie", icon: "🦾", desc: "Développer la masse musculaire" },
                { id: "endurance", label: "Endurance", icon: "🏃", desc: "Améliorer l'endurance musculaire" },
                { id: "skills", label: "Skills", icon: "🤸", desc: "Maîtriser les figures de calisthénie" },
                { id: "perte_gras", label: "Perte de gras", icon: "🔥", desc: "Perdre du gras tout en gardant le muscle" },
              ].map(g => (
                <button key={g.id} onClick={() => setOnboardingData({ ...onboardingData, goal: g.id })} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: onboardingData.goal === g.id ? "2px solid #f97316" : "1px solid #222", background: onboardingData.goal === g.id ? "rgba(249,115,22,0.08)" : "#111", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 24 }}>{g.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: onboardingData.goal === g.id ? "#f97316" : "#ddd" }}>{g.label}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {onboardingStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 14, color: "#aaa", marginBottom: 8 }}>Ton niveau actuel ?</label>
              {Object.entries(PROGRAMS).map(([key, val]) => (
                <button key={key} onClick={() => setOnboardingData({ ...onboardingData, level: key })} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: onboardingData.level === key ? "2px solid #f97316" : "1px solid #222", background: onboardingData.level === key ? "rgba(249,115,22,0.08)" : "#111", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 24 }}>{val.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: onboardingData.level === key ? "#f97316" : "#ddd" }}>{val.label}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>Sem. {val.weeks} — {val.criteria}</div>
                  </div>
                </button>
              ))}
              <label style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Jours d'entraînement par semaine</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[3, 4, 5, 6].map(d => (
                  <button key={d} onClick={() => setOnboardingData({ ...onboardingData, daysPerWeek: d })} style={{ flex: 1, padding: 12, borderRadius: 10, border: onboardingData.daysPerWeek === d ? "2px solid #f97316" : "1px solid #333", background: onboardingData.daysPerWeek === d ? "rgba(249,115,22,0.1)" : "#111", color: onboardingData.daysPerWeek === d ? "#f97316" : "#888", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>{d}j</button>
                ))}
              </div>
            </div>
          )}
          {onboardingStep === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 14, color: "#aaa", marginBottom: 8 }}>Équipement disponible</label>
              {["Barre de traction", "Anneaux", "Parallettes", "Lest (gilet/ceinture)", "Bandes élastiques", "Aucun"].map(eq => {
                const sel = onboardingData.equipment.includes(eq);
                return (
                  <button key={eq} onClick={() => { const n = sel ? onboardingData.equipment.filter(e => e !== eq) : [...onboardingData.equipment, eq]; setOnboardingData({ ...onboardingData, equipment: n }); }} style={{ padding: "12px 16px", borderRadius: 10, border: sel ? "2px solid #f97316" : "1px solid #222", background: sel ? "rgba(249,115,22,0.08)" : "#111", color: sel ? "#f97316" : "#aaa", cursor: "pointer", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, border: sel ? "2px solid #f97316" : "2px solid #444", background: sel ? "#f97316" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>{sel ? "✓" : ""}</span>
                    {eq}
                  </button>
                );
              })}
              <label style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Blessures / Limitations (optionnel)</label>
              <textarea value={onboardingData.injuries} onChange={e => setOnboardingData({ ...onboardingData, injuries: e.target.value })} placeholder="Ex: douleur épaule gauche..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            {onboardingStep > 0 && <button onClick={() => setOnboardingStep(onboardingStep - 1)} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #333", background: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>Retour</button>}
            {onboardingStep < 3 ? (
              <button onClick={() => setOnboardingStep(onboardingStep + 1)} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Suivant</button>
            ) : (
              <button onClick={finishOnboarding} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Commencer 🚀</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- LIVE WORKOUT UI ----
  if (subTab === "live" && liveWorkout) {
    if (showWorkoutSummary) {
      const totalR = currentWorkoutData.reduce((s, e) => s + e.reps, 0);
      const totalVol = currentWorkoutData.reduce((s, e) => s + (e.reps * (e.weight || 1)), 0);
      return (
        <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#e5e5e5", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
          <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 10 }}>🎉</div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: "#f97316", letterSpacing: 2 }}>SÉANCE TERMINÉE !</h2>
            <p style={{ color: "#888", marginBottom: 30 }}>{liveWorkout.name} — Semaine {weekNumber}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 30 }}>
              <div style={summaryCard}><div style={{ fontSize: 24, fontWeight: 700, color: "#f97316" }}>{formatTime(workoutTimer)}</div><div style={{ fontSize: 11, color: "#666" }}>Durée</div></div>
              <div style={summaryCard}><div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>{totalR}</div><div style={{ fontSize: 11, color: "#666" }}>Reps totales</div></div>
              <div style={summaryCard}><div style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6" }}>{currentWorkoutData.length}</div><div style={{ fontSize: 11, color: "#666" }}>Sets complétés</div></div>
              <div style={summaryCard}><div style={{ fontSize: 24, fontWeight: 700, color: "#ec4899" }}>+50</div><div style={{ fontSize: 11, color: "#666" }}>XP gagnés</div></div>
            </div>
            <button onClick={closeWorkoutSummary} style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Retour au programme</button>
          </div>
        </div>
      );
    }
    const currentEx = liveWorkout.exercises[liveExIdx];
    const exInfo = EXERCISES[currentEx.id];
    const totalExercises = liveWorkout.exercises.length;
    const progressPct = Math.round(((liveExIdx * currentEx.sets + liveSetIdx) / (totalExercises * currentEx.sets)) * 100);
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#e5e5e5", fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <button onClick={() => { if (confirm("Quitter la séance ?")) { setLiveWorkout(null); setSubTab(null); clearInterval(workoutRef.current); } }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14 }}>✕ Quitter</button>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#f97316" }}>{formatTime(workoutTimer)}</span>
          <span style={{ fontSize: 12, color: "#666" }}>{liveExIdx + 1}/{totalExercises}</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: "#1a1a1a" }}><div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #f97316, #ef4444)", transition: "width .3s" }} /></div>

        <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px 20px 100px" }}>
          {/* Rest timer overlay */}
          {restActive && (
            <div style={{ textAlign: "center", padding: "40px 20px", marginBottom: 20, borderRadius: 16, background: "rgba(249,115,22,0.05)", border: "1px solid #f9731633" }}>
              <div style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: 2 }}>Repos</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 72, color: "#f97316", lineHeight: 1 }}>{restTimer}</div>
              <div style={{ fontSize: 13, color: "#666" }}>secondes</div>
              <button onClick={() => { setRestActive(false); setRestTimer(0); }} style={{ marginTop: 16, padding: "10px 30px", borderRadius: 10, border: "1px solid #333", background: "none", color: "#aaa", cursor: "pointer", fontSize: 13 }}>Skip →</button>
            </div>
          )}

          {!restActive && (
            <>
              {/* Exercise info */}
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{exInfo.emoji}</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{exInfo.name}</h2>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>{exInfo.muscle} · RPE {currentEx.rpe} · Tempo {currentEx.tempo}</p>
                <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>💡 {exInfo.tips}</p>
              </div>
              {/* Set counter */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: "#f97316" }}>SET {liveSetIdx + 1}/{currentEx.sets}</span>
                <div style={{ fontSize: 13, color: "#666" }}>Objectif : {currentEx.reps} reps</div>
              </div>
              {/* Inputs */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 4 }}>Reps effectuées</label>
                  <input type="number" value={liveReps} onChange={e => setLiveReps(e.target.value)} placeholder="0" style={{ ...inputStyle, fontSize: 20, textAlign: "center", fontWeight: 700 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 4 }}>Poids ajouté (kg)</label>
                  <input type="number" value={liveWeight} onChange={e => setLiveWeight(e.target.value)} placeholder="0" style={{ ...inputStyle, fontSize: 20, textAlign: "center", fontWeight: 700 }} />
                </div>
              </div>
              {/* Complete set button */}
              <button onClick={finishSet} style={{ width: "100%", padding: 18, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", letterSpacing: 1 }}>
                SET TERMINÉ ✓
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---- MAIN APP SHELL ----
  const navTabs = [
    { id: "dashboard", label: "Accueil", icon: "🏠" },
    { id: "programme", label: "Programme", icon: "🏋️" },
    { id: "skills", label: "Skills", icon: "🎯" },
    { id: "nutrition", label: "Nutrition", icon: "🍽️" },
    { id: "analytics", label: "Stats", icon: "📊" },
  ];
  const moreTabs = [
    { id: "outils", label: "Outils", icon: "⏱️" },
    { id: "profil", label: "Profil", icon: "⚙️" },
  ];
  const [showMore, setShowMore] = useState(false);

  const meal = MEAL_PLANS[mealPlan];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#e5e5e5", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounceIn { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-100px) rotate(720deg); opacity: 0; } }
        * { box-sizing: border-box; }
        input:focus, textarea:focus { border-color: #f97316 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0b; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>

      {/* Badge popup */}
      {showBadgePopup && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1000, padding: "16px 24px", borderRadius: 16, background: "linear-gradient(135deg, #111 0%, #1a1008 100%)", border: "2px solid #f97316", animation: "bounceIn .5s ease-out", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 10px 40px rgba(249,115,22,0.3)" }}>
          <span style={{ fontSize: 32 }}>{showBadgePopup.icon}</span>
          <div>
            <div style={{ fontSize: 12, color: "#f97316", fontWeight: 700 }}>BADGE DÉBLOQUÉ !</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{showBadgePopup.name}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{showBadgePopup.desc}</div>
          </div>
        </div>
      )}

      {/* Content area */}
      <div style={{ paddingBottom: 80, maxWidth: 600, margin: "0 auto" }}>

        {/* ===== DASHBOARD ===== */}
        {tab === "dashboard" && (
          <div style={{ padding: "20px 16px" }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, margin: 0, color: "#fff" }}>Salut {profile.name || "Athlète"} 👋</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "#f97316" }}>🔥 Streak : {streak} jours</span>
                <span style={{ fontSize: 12, color: "#666" }}>|</span>
                <span style={{ fontSize: 12, color: "#888" }}>Niveau {levelInfo.level} — {levelInfo.title}</span>
              </div>
            </div>

            {/* XP Bar */}
            <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: 14, background: "#111", border: "1px solid #1c1c1c" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: "#f97316", fontWeight: 700 }}>⭐ {xp} XP — {levelInfo.title}</span>
                <span style={{ color: "#666" }}>Niv. {levelInfo.level}</span>
              </div>
              <div style={{ height: 8, background: "#222", borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${levelProgress}%`, background: "linear-gradient(90deg, #f97316, #ef4444)", borderRadius: 4, transition: "width .5s" }} />
              </div>
            </div>

            {/* Today's workout */}
            <div style={{ marginBottom: 16, borderRadius: 14, background: "linear-gradient(135deg, #111 0%, #1a1008 100%)", border: "1px solid #222", padding: "18px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#888" }}>Aujourd'hui — {todaySchedule.day}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: todaySchedule.color, marginTop: 4 }}>{todaySchedule.label}</div>
                </div>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: todaySchedule.color }} />
              </div>
              {todaySchedule.type !== "rest" && (
                <button onClick={() => { const dayIdx = todaySchedule.type === "push" ? 0 : todaySchedule.type === "pull" ? 1 : 2; startWorkout(dayIdx); }} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 1 }}>
                  COMMENCER 🚀
                </button>
              )}
              {todaySchedule.type === "rest" && (
                <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Jour de repos. Fais de la mobilité et récupère ! 🧘</p>
              )}
            </div>

            {/* Quick stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={statCard}><div style={{ fontSize: 20, fontWeight: 700, color: "#f97316" }}>{totalSessions}</div><div style={{ fontSize: 10, color: "#666" }}>Séances</div></div>
              <div style={statCard}><div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>{totalReps}</div><div style={{ fontSize: 10, color: "#666" }}>Reps totales</div></div>
              <div style={statCard}><div style={{ fontSize: 20, fontWeight: 700, color: "#3b82f6" }}>{achievements.length}</div><div style={{ fontSize: 10, color: "#666" }}>Badges</div></div>
            </div>

            {/* Weekly challenge */}
            {weeklyChallenge && (
              <div style={{ marginBottom: 16, borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: "14px 16px" }}>
                <div style={{ fontSize: 12, color: "#f97316", fontWeight: 700, marginBottom: 8 }}>🏆 Défi de la semaine</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{weeklyChallenge.title}</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>{weeklyChallenge.desc}</div>
                <div style={{ height: 6, background: "#222", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (challengeProgress / weeklyChallenge.target) * 100)}%`, background: "linear-gradient(90deg, #f97316, #22c55e)", borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 6, textAlign: "right" }}>{challengeProgress}/{weeklyChallenge.target} {weeklyChallenge.unit}</div>
              </div>
            )}

            {/* Weight sparkline */}
            {weightLog.length > 0 && (
              <div style={{ marginBottom: 16, borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: "14px 16px" }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>⚖️ Poids — 7 derniers jours</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
                  {weightLog.slice(-7).map((e, i) => {
                    const vals = weightLog.slice(-7).map(v => v.weight);
                    const min = Math.min(...vals); const max = Math.max(...vals);
                    const range = max - min || 1;
                    const h = ((e.weight - min) / range) * 35 + 10;
                    return <div key={i} style={{ flex: 1, height: h, background: "linear-gradient(to top, #f97316, #ef4444)", borderRadius: 3 }} />;
                  })}
                </div>
                <div style={{ fontSize: 11, color: "#f97316", fontWeight: 600, marginTop: 6 }}>{weightLog[weightLog.length - 1].weight} kg</div>
              </div>
            )}

            {/* Quote */}
            <div style={{ borderRadius: 14, background: "rgba(249,115,22,0.04)", border: "1px solid #1a1a1a", padding: "16px 18px" }}>
              <div style={{ fontSize: 13, color: "#999", lineHeight: 1.6, fontStyle: "italic" }}>"{quote}"</div>
            </div>

            {/* Recent badges */}
            {achievements.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Badges récents</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {achievements.slice(-6).map(id => {
                    const b = BADGES.find(x => x.id === id);
                    return b ? <div key={id} style={{ padding: "6px 10px", borderRadius: 8, background: "#111", border: "1px solid #222", fontSize: 11 }}>{b.icon} {b.name}</div> : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== PROGRAMME ===== */}
        {tab === "programme" && (
          <div style={{ padding: "20px 16px" }}>
            {/* Level selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {Object.entries(PROGRAMS).map(([key, val]) => (
                <button key={key} onClick={() => { setCurrentLevel(key); setSelectedDay(0); }} style={{ minWidth: 70, padding: "10px 8px", borderRadius: 12, border: currentLevel === key ? "2px solid #f97316" : "1px solid #222", background: currentLevel === key ? "rgba(249,115,22,0.1)" : "#111", color: currentLevel === key ? "#f97316" : "#777", cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ fontSize: 18 }}>{val.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{val.label}</div>
                  <div style={{ fontSize: 9, color: "#555" }}>S.{val.weeks}</div>
                </button>
              ))}
            </div>

            {/* Week selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: "#666" }}>Semaine</span>
              <button onClick={() => { const n = Math.max(1, weekNumber - 1); setWeekNumber(n); storage.set("week-number", n); }} style={{ ...btnS, borderColor: "#333" }}>−</button>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#f97316", minWidth: 24, textAlign: "center" }}>{weekNumber}</span>
              <button onClick={() => { const n = weekNumber + 1; setWeekNumber(n); storage.set("week-number", n); }} style={{ ...btnS, borderColor: "#333" }}>+</button>
              <span style={{ fontSize: 11, color: "#555", marginLeft: "auto" }}>{program.criteria}</span>
            </div>

            {/* Schedule toggle */}
            <button onClick={() => setShowSchedule(!showSchedule)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #222", background: "#111", color: "#aaa", cursor: "pointer", fontSize: 13, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span>📅 Planning semaine</span>
              <span style={{ transform: showSchedule ? "rotate(180deg)" : "", transition: ".2s" }}>▼</span>
            </button>
            {showSchedule && (
              <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", border: "1px solid #222" }}>
                {WEEKLY_SCHEDULE.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 14px", background: i % 2 ? "#0d0d0d" : "#111", gap: 12 }}>
                    <span style={{ width: 70, fontSize: 12, fontWeight: 600, color: "#aaa" }}>{s.day}</span>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                    <span style={{ fontSize: 12, color: s.color }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Day tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {program.days.map((d, i) => {
                const pct = getDayProgress(i);
                return (
                  <button key={i} onClick={() => setSelectedDay(i)} style={{ flex: 1, padding: "12px 6px", borderRadius: 12, border: selectedDay === i ? "2px solid #f97316" : "1px solid #222", background: selectedDay === i ? "#1a1008" : "#111", color: selectedDay === i ? "#f97316" : "#888", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: `${pct}%`, background: "#f97316", borderRadius: 2 }} />
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: 9, color: "#555", marginTop: 3 }}>{pct}%</div>
                  </button>
                );
              })}
            </div>

            {/* Start workout button */}
            <button onClick={() => startWorkout(selectedDay)} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 16, letterSpacing: 1 }}>
              COMMENCER LA SÉANCE 🚀
            </button>

            {/* Warmup */}
            <div style={{ marginBottom: 16, borderRadius: 12, background: "#111", border: "1px solid #1c1c1c", padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f97316", marginBottom: 8 }}>🔥 Échauffement recommandé (10 min)</div>
              {(WARMUPS[program.days[selectedDay].type] || WARMUPS.push).map((w, i) => (
                <div key={i} style={{ fontSize: 12, color: "#888", padding: "4px 0" }}>• {w}</div>
              ))}
            </div>

            {/* Exercises */}
            {program.days[selectedDay].exercises.map((ex, i) => {
              const exInfo = EXERCISES[ex.id];
              if (!exInfo) return null;
              const key = `${currentLevel}-${selectedDay}-${i}`;
              const done = completedExercises[key];
              const expanded = expandedExercise === `${selectedDay}-${i}`;
              return (
                <div key={i} style={{ marginBottom: 8, borderRadius: 14, border: done ? "1px solid #2d5a1e" : "1px solid #1c1c1c", background: done ? "rgba(34,197,94,0.05)" : "#111", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", gap: 10, cursor: "pointer" }} onClick={() => setExpandedExercise(expanded ? null : `${selectedDay}-${i}`)}>
                    <button onClick={(e) => { e.stopPropagation(); toggleExercise(selectedDay, i); }} style={{ width: 26, height: 26, borderRadius: 8, border: done ? "2px solid #22c55e" : "2px solid #333", background: done ? "#22c55e" : "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                      {done ? "✓" : ""}
                    </button>
                    <span style={{ fontSize: 20 }}>{exInfo.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: done ? "#22c55e" : "#ddd", textDecoration: done ? "line-through" : "none" }}>{exInfo.name}</div>
                      <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
                        <span style={{ color: "#f97316" }}>{ex.sets}×{ex.reps}</span> · {ex.rest}s repos · RPE {ex.rpe} · <span style={{ color: "#888" }}>{exInfo.muscle}</span>
                      </div>
                    </div>
                    <span style={{ color: "#444", fontSize: 10, transform: expanded ? "rotate(180deg)" : "", transition: ".2s" }}>▼</span>
                  </div>
                  {expanded && (
                    <div style={{ padding: "0 14px 12px 50px", fontSize: 12, color: "#888", lineHeight: 1.6 }}>
                      <div>💡 {exInfo.tips}</div>
                      <div style={{ marginTop: 6, color: "#666" }}>Tempo : {ex.tempo} · Difficulté : {"⭐".repeat(exInfo.difficulty)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== SKILLS ===== */}
        {tab === "skills" && (
          <div style={{ padding: "20px 16px" }}>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#f97316", letterSpacing: 2, marginBottom: 4 }}>ARBRE DE SKILLS</h2>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Clique sur chaque étape pour suivre ta progression.</p>
            {SKILL_TREES.map((tree) => {
              const completed = (skillProgress[tree.skill] || []).length;
              const total = tree.steps.length;
              const pct = Math.round((completed / total) * 100);
              const isExpanded = expandedSkill === tree.skill;
              return (
                <div key={tree.skill} style={{ marginBottom: 12, borderRadius: 14, border: "1px solid #1c1c1c", background: "#111", overflow: "hidden" }}>
                  <div onClick={() => setExpandedSkill(isExpanded ? null : tree.skill)} style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 12, cursor: "pointer" }}>
                    <span style={{ fontSize: 28 }}>{tree.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{tree.skill}</div>
                      <div style={{ height: 5, background: "#222", borderRadius: 3, marginTop: 6 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #f97316, #ef4444)", borderRadius: 3, transition: "width .3s" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: pct === 100 ? "#22c55e" : "#f97316", fontWeight: 700 }}>{pct}%</span>
                    <span style={{ color: "#444", fontSize: 10, transform: isExpanded ? "rotate(180deg)" : "", transition: ".2s" }}>▼</span>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 16px 14px" }}>
                      {tree.steps.map((step, i) => {
                        const done = (skillProgress[tree.skill] || []).includes(i);
                        const prereqsMet = step.prereq.every(p => (skillProgress[tree.skill] || []).includes(p));
                        const locked = !prereqsMet && !done;
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderTop: i > 0 ? "1px solid #1a1a1a" : "none", opacity: locked ? 0.4 : 1 }}>
                            <button onClick={() => !locked && toggleSkillStep(tree.skill, i)} disabled={locked} style={{ width: 24, height: 24, borderRadius: 6, border: done ? "2px solid #22c55e" : "2px solid #333", background: done ? "#22c55e" : "none", color: "#fff", cursor: locked ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, marginTop: 2 }}>
                              {done ? "✓" : locked ? "🔒" : ""}
                            </button>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: done ? "#22c55e" : "#ddd" }}>{step.name}</div>
                              <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{step.desc}</div>
                              <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>⏱️ ~{step.weeks} semaines</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== NUTRITION ===== */}
        {tab === "nutrition" && (
          <div style={{ padding: "20px 16px" }}>
            {/* Plan selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {Object.entries(MEAL_PLANS).map(([key, val]) => (
                <button key={key} onClick={() => setMealPlan(key)} style={{ flex: 1, padding: "10px 6px", borderRadius: 12, border: mealPlan === key ? "2px solid #f97316" : "1px solid #222", background: mealPlan === key ? "rgba(249,115,22,0.1)" : "#111", color: mealPlan === key ? "#f97316" : "#777", cursor: "pointer" }}>
                  <div style={{ fontSize: 18 }}>{val.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{val.label}</div>
                </button>
              ))}
            </div>

            {/* Macros card */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "linear-gradient(135deg, #111 0%, #1a1008 100%)", padding: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: "#f97316", marginBottom: 12 }}>{meal.calories} KCAL/JOUR</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ label: "Protéines", val: meal.macros.proteines, color: "#ef4444" }, { label: "Glucides", val: meal.macros.glucides, color: "#f97316" }, { label: "Lipides", val: meal.macros.lipides, color: "#eab308" }].map((m, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 6px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: `1px solid ${m.color}22` }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: 9, color: "#888", marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Veg toggle */}
            <button onClick={() => setShowVeg(!showVeg)} style={{ marginBottom: 16, padding: "8px 14px", borderRadius: 8, border: showVeg ? "1px solid #22c55e" : "1px solid #333", background: showVeg ? "rgba(34,197,94,0.1)" : "#111", color: showVeg ? "#22c55e" : "#888", cursor: "pointer", fontSize: 12 }}>
              🌱 {showVeg ? "Version végétarienne" : "Voir alternatives végé"}
            </button>

            {/* Today's tracking */}
            <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f97316", marginBottom: 10 }}>📊 Suivi du jour</div>
              {[
                { label: "Calories", current: Math.round(todayNutrition.cal), target: 2500, color: "#f97316", unit: "kcal" },
                { label: "Protéines", current: Math.round(todayNutrition.p), target: 150, color: "#ef4444", unit: "g" },
                { label: "Glucides", current: Math.round(todayNutrition.g), target: 300, color: "#eab308", unit: "g" },
                { label: "Lipides", current: Math.round(todayNutrition.l), target: 80, color: "#3b82f6", unit: "g" },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#aaa" }}>{m.label}</span>
                    <span style={{ color: m.color }}>{m.current}/{m.target}{m.unit}</span>
                  </div>
                  <div style={{ height: 5, background: "#222", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (m.current / m.target) * 100)}%`, background: m.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Water tracker */}
            <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6" }}>💧 Eau : {(waterIntake / 1000).toFixed(1)}L / 3L</span>
                <span style={{ fontSize: 11, color: "#666" }}>{Math.round((waterIntake / 3000) * 100)}%</span>
              </div>
              <div style={{ height: 8, background: "#222", borderRadius: 4, marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${Math.min(100, (waterIntake / 3000) * 100)}%`, background: "linear-gradient(90deg, #3b82f6, #06b6d4)", borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[250, 500, 750].map(ml => (
                  <button key={ml} onClick={() => addWater(ml)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #222", background: "#0a0a0b", color: "#3b82f6", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+{ml}ml</button>
                ))}
              </div>
            </div>

            {/* Add food */}
            <button onClick={() => setShowFoodSearch(!showFoodSearch)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #222", background: "#111", color: "#f97316", cursor: "pointer", fontSize: 13, marginBottom: 12 }}>
              ➕ Ajouter un aliment
            </button>
            {showFoodSearch && (
              <div style={{ marginBottom: 16, borderRadius: 12, background: "#111", border: "1px solid #222", padding: 14 }}>
                <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)} placeholder="Rechercher un aliment..." style={{ ...inputStyle, marginBottom: 10 }} />
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {FOOD_DB.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())).slice(0, 15).map((f, i) => (
                    <div key={i} onClick={() => addFoodItem(f, 1)} style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px", borderBottom: "1px solid #1a1a1a", cursor: "pointer", fontSize: 12 }}>
                      <span style={{ color: "#ddd" }}>{f.name}</span>
                      <span style={{ color: "#888" }}>{f.cal}kcal · P{f.p} G{f.g} L{f.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meals timeline */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ddd", marginBottom: 10 }}>🍽️ Plan du jour</div>
              {meal.meals.map((m, i) => {
                const tracked = todayMeals.includes(m.name);
                return (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 45 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#f97316", marginBottom: 4 }}>{m.time}</div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: tracked ? "#22c55e" : "#f97316", flexShrink: 0, zIndex: 1 }} />
                      {i < meal.meals.length - 1 && <div style={{ width: 2, flex: 1, background: "#222", marginTop: 2 }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 16 }}>
                      <div style={{ borderRadius: 12, border: tracked ? "1px solid #2d5a1e" : "1px solid #1c1c1c", background: tracked ? "rgba(34,197,94,0.05)" : "#0d0d0d", padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: tracked ? "#22c55e" : "#ddd" }}>{m.name}</span>
                          <span style={{ fontSize: 10, color: "#f97316" }}>{m.cal}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5, marginBottom: 8 }}>{showVeg ? m.veg : m.items}</div>
                        {!tracked && (
                          <button onClick={() => addMealTracked(m.name)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #333", background: "none", color: "#f97316", cursor: "pointer", fontSize: 11 }}>✓ J'ai mangé ce repas</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Supplements */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f97316", marginBottom: 8 }}>💊 Suppléments</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.8 }}>
                • Créatine : 5g / jour<br />• Vitamine D : 2000–4000 UI<br />• Oméga-3 : 2–3g EPA+DHA<br />• Magnésium : 400mg (soir)<br />• Eau : 3–4L / jour
              </div>
            </div>
          </div>
        )}

        {/* ===== ANALYTICS ===== */}
        {tab === "analytics" && (
          <div style={{ padding: "20px 16px" }}>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#f97316", letterSpacing: 2, marginBottom: 16 }}>ANALYTICS</h2>

            {/* Weight tracker */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⚖️ Poids corporel</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <input type="number" step="0.1" placeholder="kg" value={bodyWeight} onChange={e => setBodyWeight(e.target.value)} onKeyDown={e => e.key === "Enter" && addWeight()} style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addWeight} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#f97316", color: "#fff", fontWeight: 700, cursor: "pointer" }}>+</button>
              </div>
              {weightLog.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80, marginBottom: 8 }}>
                    {weightLog.slice(-30).map((entry, i) => {
                      const vals = weightLog.slice(-30).map(e => e.weight);
                      const min = Math.min(...vals); const max = Math.max(...vals);
                      const range = max - min || 1;
                      const h = ((entry.weight - min) / range) * 55 + 15;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                          <div style={{ fontSize: 7, color: "#666", marginBottom: 2 }}>{i === weightLog.slice(-30).length - 1 ? entry.weight : ""}</div>
                          <div style={{ width: "100%", maxWidth: 14, height: h, background: "linear-gradient(to top, #f97316, #ef4444)", borderRadius: 3 }} />
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#555" }}>
                    <span>{weightLog.slice(-30)[0]?.date}</span>
                    <span>{weightLog[weightLog.length - 1]?.date}</span>
                  </div>
                </div>
              )}
              {weightLog.length === 0 && <p style={{ fontSize: 12, color: "#444", textAlign: "center" }}>Aucune entrée</p>}
            </div>

            {/* Session summary */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📈 Sessions — {currentLevel}</div>
              {program.days.map((d, i) => {
                const pct = getDayProgress(i);
                return (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#aaa" }}>{d.name}</span>
                      <span style={{ color: pct === 100 ? "#22c55e" : "#f97316", fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: "#222", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #f97316, #ef4444)", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Training heatmap (last 12 weeks) */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🗓️ Heatmap (12 semaines)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}>
                {Array.from({ length: 84 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (83 - i));
                  const ds = d.toISOString().slice(0, 10);
                  const hasWorkout = workoutLog.some(w => w.date === ds);
                  return (
                    <div key={i} style={{ aspectRatio: "1", borderRadius: 3, background: hasWorkout ? "#f97316" : "#1a1a1a", opacity: hasWorkout ? 1 : 0.5 }} title={ds} />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8, fontSize: 9, color: "#666" }}>
                <span>— Pas de séance</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#f97316" }} /> Séance</span>
              </div>
            </div>

            {/* Stats overview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={summaryCard}><div style={{ fontSize: 22, fontWeight: 700, color: "#f97316" }}>{totalSessions}</div><div style={{ fontSize: 10, color: "#666" }}>Séances totales</div></div>
              <div style={summaryCard}><div style={{ fontSize: 22, fontWeight: 700, color: "#22c55e" }}>{totalReps}</div><div style={{ fontSize: 10, color: "#666" }}>Reps totales</div></div>
              <div style={summaryCard}><div style={{ fontSize: 22, fontWeight: 700, color: "#3b82f6" }}>{streak}</div><div style={{ fontSize: 10, color: "#666" }}>Streak actuel</div></div>
              <div style={summaryCard}><div style={{ fontSize: 22, fontWeight: 700, color: "#ec4899" }}>{bestStreak}</div><div style={{ fontSize: 10, color: "#666" }}>Meilleur streak</div></div>
            </div>

            {/* Workout history */}
            <div style={{ borderRadius: 14, border: "1px solid #222", background: "#111", padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📋 Historique récent</div>
              {workoutLog.length === 0 && <p style={{ fontSize: 12, color: "#555" }}>Aucune séance enregistrée</p>}
              {workoutLog.slice(-10).reverse().map((w, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a", fontSize: 12 }}>
                  <span style={{ color: "#aaa" }}>{w.date}</span>
                  <span style={{ color: "#ddd" }}>{w.day}</span>
                  <span style={{ color: "#f97316" }}>{w.totalReps} reps · {formatTime(w.duration)}</span>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{ borderRadius: 14, border: "1px solid #1c1c1c", background: "linear-gradient(135deg, #111, #0d1117)", padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🧠 Principes clés</div>
              {[
                { t: "Surcharge progressive", d: "Augmenter volume ou difficulté chaque semaine." },
                { t: "Tempo contrôlé", d: "Excentrique lent (3-5s) pour max de gains." },
                { t: "Repos & récupération", d: "8h de sommeil minimum." },
                { t: "Consistance > Intensité", d: "La régularité bat l'intensité ponctuelle." },
                { t: "Mobilité", d: "10-15 min/jour pour les skills avancés." },
              ].map((tip, i) => (
                <div key={i} style={{ marginBottom: 10, padding: "10px 12px", borderRadius: 8, background: "rgba(249,115,22,0.04)", border: "1px solid #1a1a1a" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f97316", marginBottom: 2 }}>{tip.t}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{tip.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== OUTILS ===== */}
        {tab === "outils" && (
          <div style={{ padding: "20px 16px" }}>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#f97316", letterSpacing: 2, marginBottom: 16 }}>OUTILS</h2>

            {/* Sub-tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto" }}>
              {[
                { id: "timer", label: "⏱️ Timers" },
                { id: "calc", label: "🧮 Calculs" },
                { id: "warmup", label: "🔥 Échauffement" },
              ].map(t => (
                <button key={t.id} onClick={() => setToolTab(t.id)} style={{ padding: "10px 16px", borderRadius: 10, border: toolTab === t.id ? "2px solid #f97316" : "1px solid #222", background: toolTab === t.id ? "rgba(249,115,22,0.1)" : "#111", color: toolTab === t.id ? "#f97316" : "#888", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{t.label}</button>
              ))}
            </div>

            {/* TIMERS */}
            {toolTab === "timer" && (
              <div>
                {/* Timer type selector */}
                <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                  {[
                    { id: "rest", label: "Repos" },
                    { id: "emom", label: "EMOM" },
                    { id: "amrap", label: "AMRAP" },
                    { id: "tabata", label: "Tabata" },
                    { id: "custom", label: "Custom" },
                  ].map(t => (
                    <button key={t.id} onClick={() => { setTimerType(t.id); setTimerRunning(false); setTimerValue(0); }} style={{ padding: "8px 14px", borderRadius: 8, border: timerType === t.id ? "1px solid #f97316" : "1px solid #333", background: timerType === t.id ? "rgba(249,115,22,0.1)" : "#0a0a0b", color: timerType === t.id ? "#f97316" : "#888", cursor: "pointer", fontSize: 11 }}>{t.label}</button>
                  ))}
                </div>

                {/* Rest / Custom / AMRAP timer */}
                {(timerType === "rest" || timerType === "custom" || timerType === "amrap") && (
                  <div style={{ textAlign: "center" }}>
                    {/* Duration presets for rest */}
                    {timerType === "rest" && (
                      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                        {[30, 60, 90, 120, 180, 300].map(s => (
                          <button key={s} onClick={() => { setTimerDuration(s); setTimerValue(s); }} style={{ padding: "8px 12px", borderRadius: 8, border: timerDuration === s ? "1px solid #f97316" : "1px solid #333", background: timerDuration === s ? "rgba(249,115,22,0.1)" : "#111", color: timerDuration === s ? "#f97316" : "#888", cursor: "pointer", fontSize: 12 }}>{s < 60 ? `${s}s` : `${s/60}m`}</button>
                        ))}
                      </div>
                    )}
                    {timerType !== "rest" && (
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Durée (secondes)</label>
                        <input type="number" value={timerType === "amrap" ? amrapDuration : timerDuration} onChange={e => { const v = parseInt(e.target.value) || 0; timerType === "amrap" ? setAmrapDuration(v) : setTimerDuration(v); setTimerValue(v); }} style={{ ...inputStyle, width: 120, textAlign: "center", fontSize: 18, margin: "0 auto" }} />
                      </div>
                    )}
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 80, color: timerValue <= 5 && timerRunning ? "#ef4444" : "#f97316", marginBottom: 20, animation: timerValue <= 5 && timerRunning ? "pulse 1s infinite" : "none" }}>
                      {formatTime(timerValue || (timerType === "amrap" ? amrapDuration : timerDuration))}
                    </div>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                      <button onClick={() => { setTimerValue(timerType === "amrap" ? amrapDuration : timerDuration); setTimerRunning(true); }} style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>▶ Start</button>
                      <button onClick={() => setTimerRunning(false)} style={{ padding: "14px 30px", borderRadius: 12, border: "1px solid #333", background: "none", color: "#aaa", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>⏸ Pause</button>
                      <button onClick={() => { setTimerRunning(false); setTimerValue(timerType === "amrap" ? amrapDuration : timerDuration); }} style={{ padding: "14px 30px", borderRadius: 12, border: "1px solid #333", background: "none", color: "#ef4444", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>↺ Reset</button>
                    </div>
                  </div>
                )}

                {/* EMOM */}
                {timerType === "emom" && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Intervalle (s)</label>
                        <input type="number" value={emomDuration} onChange={e => setEmomDuration(parseInt(e.target.value) || 60)} style={{ ...inputStyle, width: 80, textAlign: "center" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Rounds</label>
                        <input type="number" value={emomRounds} onChange={e => setEmomRounds(parseInt(e.target.value) || 10)} style={{ ...inputStyle, width: 80, textAlign: "center" }} />
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 72, color: "#f97316", marginBottom: 8 }}>{formatTime(timerValue || emomDuration)}</div>
                    <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>Total : {formatTime(emomDuration * emomRounds)}</div>
                    <button onClick={() => { setTimerValue(emomDuration * emomRounds); setTimerRunning(true); }} style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>▶ Start EMOM</button>
                  </div>
                )}

                {/* Tabata */}
                {timerType === "tabata" && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Work (s)</label>
                        <input type="number" value={tabataWork} onChange={e => setTabataWork(parseInt(e.target.value) || 20)} style={{ ...inputStyle, width: 70, textAlign: "center" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Rest (s)</label>
                        <input type="number" value={tabataRest} onChange={e => setTabataRest(parseInt(e.target.value) || 10)} style={{ ...inputStyle, width: 70, textAlign: "center" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Rounds</label>
                        <input type="number" value={tabataRounds} onChange={e => setTabataRounds(parseInt(e.target.value) || 8)} style={{ ...inputStyle, width: 70, textAlign: "center" }} />
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 72, color: tabataPhase === "work" ? "#ef4444" : tabataPhase === "rest" ? "#22c55e" : "#f97316", marginBottom: 8 }}>
                      {formatTime(timerValue || tabataWork)}
                    </div>
                    <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>
                      {tabataPhase === "idle" ? `${tabataRounds} rounds · ${formatTime((tabataWork + tabataRest) * tabataRounds)}` : `${tabataPhase.toUpperCase()} — Round ${tabataCurrentRound}/${tabataRounds}`}
                    </div>
                    <button onClick={() => { setTabataPhase("work"); setTabataCurrentRound(1); setTimerValue(tabataWork); setTimerRunning(true); }} style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>▶ Start Tabata</button>
                  </div>
                )}
              </div>
            )}

            {/* CALCULATORS */}
            {toolTab === "calc" && (
              <div>
                {/* 1RM Calculator */}
                <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f97316", marginBottom: 12 }}>💪 1RM Estimé (Epley)</div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Poids (kg)</label>
                      <input type="number" value={calcWeight} onChange={e => setCalcWeight(e.target.value)} style={inputStyle} placeholder="80" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Reps</label>
                      <input type="number" value={calcReps} onChange={e => setCalcReps(e.target.value)} style={inputStyle} placeholder="5" />
                    </div>
                  </div>
                  {calc1RM && <div style={{ fontSize: 18, fontWeight: 700, color: "#f97316" }}>1RM ≈ {calc1RM} kg</div>}
                </div>

                {/* TDEE */}
                <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f97316", marginBottom: 12 }}>🔥 TDEE (Mifflin-St Jeor)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div><label style={labelStyle}>Poids (kg)</label><input type="number" value={calcWeight} onChange={e => setCalcWeight(e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Taille (cm)</label><input type="number" value={calcHeight} onChange={e => setCalcHeight(e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Âge</label><input type="number" value={calcAge} onChange={e => setCalcAge(e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Sexe</label>
                      <select value={calcSex} onChange={e => setCalcSex(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                        <option value="homme">Homme</option><option value="femme">Femme</option>
                      </select>
                    </div>
                  </div>
                  <div><label style={labelStyle}>Activité</label>
                    <select value={calcActivity} onChange={e => setCalcActivity(parseFloat(e.target.value))} style={{ ...inputStyle, cursor: "pointer", marginBottom: 10 }}>
                      <option value={1.2}>Sédentaire</option><option value={1.375}>Légèrement actif</option><option value={1.55}>Modérément actif</option><option value={1.725}>Très actif</option><option value={1.9}>Extrêmement actif</option>
                    </select>
                  </div>
                  {calcTDEE && (
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#f97316" }}>TDEE ≈ {calcTDEE} kcal/jour</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <div style={{ flex: 1, padding: 8, borderRadius: 8, background: "#0a0a0b", textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>{calcTDEE + 400}</div><div style={{ fontSize: 9, color: "#666" }}>Prise</div></div>
                        <div style={{ flex: 1, padding: 8, borderRadius: 8, background: "#0a0a0b", textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#f97316" }}>{calcTDEE}</div><div style={{ fontSize: 9, color: "#666" }}>Maintien</div></div>
                        <div style={{ flex: 1, padding: 8, borderRadius: 8, background: "#0a0a0b", textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>{calcTDEE - 400}</div><div style={{ fontSize: 9, color: "#666" }}>Sèche</div></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* BMI */}
                <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f97316", marginBottom: 12 }}>📏 IMC</div>
                  {calcBMI && <div style={{ fontSize: 18, fontWeight: 700, color: parseFloat(calcBMI) < 18.5 ? "#3b82f6" : parseFloat(calcBMI) < 25 ? "#22c55e" : parseFloat(calcBMI) < 30 ? "#eab308" : "#ef4444" }}>IMC = {calcBMI} {parseFloat(calcBMI) < 18.5 ? "(sous-poids)" : parseFloat(calcBMI) < 25 ? "(normal)" : parseFloat(calcBMI) < 30 ? "(surpoids)" : "(obésité)"}</div>}
                  {!calcBMI && <p style={{ fontSize: 12, color: "#666" }}>Renseigne poids et taille ci-dessus</p>}
                </div>

                {/* Body Fat */}
                <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f97316", marginBottom: 12 }}>📐 % Graisse corporelle (Navy)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div><label style={labelStyle}>Tour de cou (cm)</label><input type="number" value={calcNeck} onChange={e => setCalcNeck(e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Tour de taille (cm)</label><input type="number" value={calcWaist} onChange={e => setCalcWaist(e.target.value)} style={inputStyle} /></div>
                    {calcSex === "femme" && <div><label style={labelStyle}>Tour de hanches (cm)</label><input type="number" value={calcHip} onChange={e => setCalcHip(e.target.value)} style={inputStyle} /></div>}
                  </div>
                  {calcBodyFat && parseFloat(calcBodyFat) > 0 && <div style={{ fontSize: 18, fontWeight: 700, color: "#f97316" }}>≈ {calcBodyFat}% de masse grasse</div>}
                </div>
              </div>
            )}

            {/* WARMUP */}
            {toolTab === "warmup" && (
              <div>
                <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Échauffement adapté à ta séance du jour.</p>
                {Object.entries(WARMUPS).map(([type, exercises]) => (
                  <div key={type} style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: type === "push" ? "#ef4444" : type === "pull" ? "#3b82f6" : "#22c55e", marginBottom: 10, textTransform: "uppercase" }}>
                      {type === "push" ? "🔴 Push" : type === "pull" ? "🔵 Pull" : "🟢 Legs"} — 10 min
                    </div>
                    {exercises.map((e, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#aaa", padding: "5px 0", display: "flex", gap: 8 }}>
                        <span style={{ color: "#555" }}>{i + 1}.</span> {e}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PROFIL & RÉGLAGES ===== */}
        {tab === "profil" && (
          <div style={{ padding: "20px 16px" }}>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#f97316", letterSpacing: 2, marginBottom: 16 }}>PROFIL</h2>

            {/* Profile card */}
            <div style={{ borderRadius: 14, background: "linear-gradient(135deg, #111 0%, #1a1008 100%)", border: "1px solid #222", padding: 20, marginBottom: 16, textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px" }}>
                {(profile.name || "A")[0].toUpperCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.name || "Athlète"}</div>
              <div style={{ fontSize: 13, color: "#f97316", marginTop: 4 }}>Niv. {levelInfo.level} — {levelInfo.title}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>⭐ {xp} XP · 🔥 Streak {streak}j</div>
            </div>

            {/* Edit profile */}
            <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>✏️ Modifier le profil</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><label style={labelStyle}>Prénom</label><input value={profile.name || ""} onChange={e => { const p = { ...profile, name: e.target.value }; setProfile(p); storage.set("user-profile", p); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>Poids (kg)</label><input type="number" value={profile.weight || ""} onChange={e => { const p = { ...profile, weight: e.target.value }; setProfile(p); storage.set("user-profile", p); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>Objectif</label>
                  <select value={profile.goal || "force"} onChange={e => { const p = { ...profile, goal: e.target.value }; setProfile(p); storage.set("user-profile", p); }} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="force">Force</option><option value="hypertrophie">Hypertrophie</option><option value="endurance">Endurance</option><option value="skills">Skills</option><option value="perte_gras">Perte de gras</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Niveau</label>
                  <select value={currentLevel} onChange={e => { setCurrentLevel(e.target.value); const p = { ...profile, level: e.target.value }; setProfile(p); storage.set("user-profile", p); }} style={{ ...inputStyle, cursor: "pointer" }}>
                    {Object.entries(PROGRAMS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Badges grid */}
            <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🏆 Badges ({achievements.length}/{BADGES.length})</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {BADGES.map(b => {
                  const unlocked = achievements.includes(b.id);
                  return (
                    <div key={b.id} style={{ textAlign: "center", padding: 8, borderRadius: 10, background: unlocked ? "rgba(249,115,22,0.08)" : "#0a0a0b", border: unlocked ? "1px solid #f9731633" : "1px solid #1a1a1a", opacity: unlocked ? 1 : 0.3 }} title={`${b.name}: ${b.desc}`}>
                      <div style={{ fontSize: 22 }}>{b.icon}</div>
                      <div style={{ fontSize: 8, color: unlocked ? "#f97316" : "#555", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settings */}
            <div style={{ borderRadius: 14, background: "#111", border: "1px solid #1c1c1c", padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⚙️ Réglages</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ fontSize: 13, color: "#aaa" }}>Unités</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["metric", "imperial"].map(u => (
                    <button key={u} onClick={() => { setUnits(u); storage.set("settings", { units: u, theme }); }} style={{ padding: "6px 12px", borderRadius: 6, border: units === u ? "1px solid #f97316" : "1px solid #333", background: units === u ? "rgba(249,115,22,0.1)" : "none", color: units === u ? "#f97316" : "#888", cursor: "pointer", fontSize: 11 }}>{u === "metric" ? "kg/cm" : "lbs/ft"}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={exportData} style={{ padding: 14, borderRadius: 12, border: "1px solid #222", background: "#111", color: "#3b82f6", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>📥 Exporter les données (JSON)</button>
              <button onClick={() => { if (confirm("⚠️ Supprimer TOUTES les données ? Cette action est irréversible.")) resetAll(); }} style={{ padding: 14, borderRadius: 12, border: "1px solid #ef444444", background: "rgba(239,68,68,0.05)", color: "#ef4444", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>🗑️ Réinitialiser toutes les données</button>
            </div>
          </div>
        )}

      </div>

      {/* ===== BOTTOM NAV ===== */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0d0d0d", borderTop: "1px solid #1a1a1a", display: "flex", zIndex: 50, maxWidth: 600, margin: "0 auto" }}>
        {navTabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSubTab(null); setShowMore(false); }} style={{ flex: 1, padding: "10px 4px", background: "none", border: "none", color: tab === t.id ? "#f97316" : "#555", cursor: "pointer", borderTop: tab === t.id ? "2px solid #f97316" : "2px solid transparent", transition: "all .2s" }}>
            <div style={{ fontSize: 18 }}>{t.icon}</div>
            <div style={{ fontSize: 9, marginTop: 2, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</div>
          </button>
        ))}
        {/* More button */}
        <div style={{ position: "relative", flex: 1 }}>
          <button onClick={() => setShowMore(!showMore)} style={{ width: "100%", padding: "10px 4px", background: "none", border: "none", color: (tab === "outils" || tab === "profil") ? "#f97316" : "#555", cursor: "pointer", borderTop: (tab === "outils" || tab === "profil") ? "2px solid #f97316" : "2px solid transparent" }}>
            <div style={{ fontSize: 18 }}>•••</div>
            <div style={{ fontSize: 9, marginTop: 2 }}>Plus</div>
          </button>
          {showMore && (
            <div style={{ position: "absolute", bottom: "100%", right: 0, background: "#111", border: "1px solid #222", borderRadius: 12, padding: 6, minWidth: 150, marginBottom: 4 }}>
              {moreTabs.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setSubTab(null); setShowMore(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", background: tab === t.id ? "rgba(249,115,22,0.1)" : "none", border: "none", color: tab === t.id ? "#f97316" : "#aaa", cursor: "pointer", borderRadius: 8, fontSize: 13 }}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- SHARED STYLES ----
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#0a0a0b", color: "#eee", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" };
const labelStyle = { fontSize: 11, color: "#888", display: "block", marginBottom: 4 };
const statCard = { padding: "14px 10px", borderRadius: 12, background: "#111", border: "1px solid #1c1c1c", textAlign: "center" };
const summaryCard = { padding: "14px 10px", borderRadius: 12, background: "#111", border: "1px solid #1c1c1c", textAlign: "center" };
const btnS = { width: 30, height: 30, borderRadius: 8, border: "1px solid", background: "none", color: "#aaa", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" };
