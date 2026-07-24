const TRANSLATIONS = {
  hello: { es: "Hola", fr: "Bonjour", de: "Hallo", it: "Ciao", pt: "Olá" },
  "how are you": { es: "¿Cómo estás?", fr: "Comment allez-vous?", de: "Wie geht es Ihnen?", it: "Come stai?", pt: "Como você está?" },
  goodbye: { es: "Adiós", fr: "Au revoir", de: "Auf Wiedersehen", it: "Arrivederci", pt: "Adeus" },
  thanks: { es: "Gracias", fr: "Merci", de: "Danke", it: "Grazie", pt: "Obrigado" },
  yes: { es: "Sí", fr: "Oui", de: "Ja", it: "Sì", pt: "Sim" },
  no: { es: "No", fr: "Non", de: "Nein", it: "No", pt: "Não" },
  please: { es: "Por favor", fr: "S'il vous plaît", de: "Bitte", it: "Per favore", pt: "Por favor" },
  sorry: { es: "Lo siento", fr: "Désolé", de: "Es tut mir leid", it: "Mi dispiace", pt: "Desculpe" },
  "good morning": { es: "Buenos días", fr: "Bonjour", de: "Guten Morgen", it: "Buongiorno", pt: "Bom dia" },
  "good night": { es: "Buenas noches", fr: "Bonne nuit", de: "Gute Nacht", it: "Buona notte", pt: "Boa noite" },
};

const LANGUAGES = { es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese" };

export const translateText = (text, targetLang) => {
  const lower = text.toLowerCase().trim();
  const entry = TRANSLATIONS[lower];
  if (entry && entry[targetLang]) {
    return entry[targetLang];
  }
  return `[${LANGUAGES[targetLang] || targetLang}]: ${text}`;
};

export const getSupportedLanguages = () => {
  return Object.entries(LANGUAGES).map(([code, name]) => ({ code, name }));
};
