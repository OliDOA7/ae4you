export const BOT_NAME = "AE4You Study Assistant";
export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export const USER_PLACEHOLDER_AVATAR = "https://picsum.photos/seed/user/40/40";
export const BOT_PLACEHOLDER_AVATAR = "https://picsum.photos/seed/bot/40/40";

export const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Español",
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export const INITIAL_BOT_MESSAGES: Record<LanguageCode, string> = {
  en: "Hello! I'm AE4You, your friendly study assistant. How can I help you learn today? You can ask me about a school subject, a specific topic, or for practice activities!",
  es: "¡Hola! Soy AE4You, tu amigable asistente de estudio. ¿Cómo puedo ayudarte a aprender hoy? ¡Puedes preguntarme sobre una materia escolar, un tema específico o pedir actividades de práctica!",
};

export const UI_TEXT: Record<LanguageCode, {
  headerTitle: string;
  errorTitle: string;
  configErrorApiKeyMissingUserFriendly: string;
  configErrorBotMessage: string;
  chatInitializationErrorUserFriendly: (errorMessage: string) => string;
  chatInitializationErrorBotMessage: (errorMessage: string) => string;
  sendMessageErrorBotMessage: string;
  botErrorProcessingMessage: (errorMessage: string) => string;
  typingIndicator: (botName: string) => string;
  chatPlaceholder: string;
  languageSwitchButtonLabel: (currentLang: LanguageCode) => string;
}> = {
  en: {
    headerTitle: BOT_NAME,
    errorTitle: "Error",
    configErrorApiKeyMissingUserFriendly: "Configuration error: API Key is missing. Please contact support or check setup instructions.",
    configErrorBotMessage: "I'm having trouble starting up due to a configuration issue (API Key missing). Please ensure the API key is correctly set up.",
    chatInitializationErrorUserFriendly: (errorMessage: string) => `Failed to initialize chat: ${errorMessage}`,
    chatInitializationErrorBotMessage: (errorMessage: string) => `I couldn't start our chat session due to an error: ${errorMessage}. Please try refreshing the page.`,
    sendMessageErrorBotMessage: "Sorry, I can't send messages right now. The chat isn't ready.",
    botErrorProcessingMessage: (errorMessage: string) => `Sorry, I ran into a little trouble: ${errorMessage}. Could you try asking again?`,
    typingIndicator: (botName) => `${botName} is typing...`,
    chatPlaceholder: "Type your question here...",
    languageSwitchButtonLabel: (currentLang) => currentLang === 'en' ? SUPPORTED_LANGUAGES.es : SUPPORTED_LANGUAGES.en,
  },
  es: {
    headerTitle: BOT_NAME, // Assuming BOT_NAME is language-neutral
    errorTitle: "Error",
    configErrorApiKeyMissingUserFriendly: "Error de configuración: Falta la Clave API. Por favor contacte a soporte o revise las instrucciones.",
    configErrorBotMessage: "Estoy teniendo problemas para iniciar debido a un problema de configuración (falta la Clave API). Por favor, asegúrese de que la clave API esté configurada correctamente.",
    chatInitializationErrorUserFriendly: (errorMessage: string) => `Error al inicializar el chat: ${errorMessage}`,
    chatInitializationErrorBotMessage: (errorMessage: string) => `No pude iniciar nuestra sesión de chat debido a un error: ${errorMessage}. Por favor, intente refrescar la página.`,
    sendMessageErrorBotMessage: "Lo siento, no puedo enviar mensajes ahora mismo. El chat no está listo.",
    botErrorProcessingMessage: (errorMessage: string) => `Lo siento, tuve un pequeño problema: ${errorMessage}. ¿Podrías intentar preguntar de nuevo?`,
    typingIndicator: (botName) => `${botName} está escribiendo...`,
    chatPlaceholder: "Escribe tu pregunta aquí...",
    languageSwitchButtonLabel: (currentLang) => currentLang === 'es' ? SUPPORTED_LANGUAGES.en : SUPPORTED_LANGUAGES.es,
  },
};

// Re-export INITIAL_BOT_MESSAGE for compatibility, but prefer INITIAL_BOT_MESSAGES.en or .es
export const INITIAL_BOT_MESSAGE = INITIAL_BOT_MESSAGES.en;