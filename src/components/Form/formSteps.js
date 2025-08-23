// Конфигурация шагов формы
// Содержит весь текстовый контент для разных этапов формы

export const STEP1_ITEMS = [
  { prefix: "[0]", text: "On this page, you can upload your images and fill out a short form." },
  { prefix: "[0.1]", text: "The images you share will be used to generate a sequence of AI-created visuals, guided by the prompts listed in the [text] section. Your photographs will help shape a visual journey—from before life to afterlife." },
  { prefix: "[0.2]", text: "Submit personal images already captured in everyday life. The images should form a coherent set through a recurring object, shape, or motif, a visual pattern, or a consistent photographic style—the connection can be thematic or aesthetic, but it must emerge naturally across the collection. For example: meals photographed across different days, views from the same window in changing light, or street scenes showing subtle variations over time." },
  { prefix: "[0.3]", text: "Do not take new photos just for this project. Send images that naturally reflect how you photograph your surroundings." },
];

export const STEP3_ITEMS = [
  { prefix: "[2]", text: "Fill any information you feel comfortable sharing." },
  { prefix: "", text: "Fields marked with * are required, and answering question 2.4 is encouraged.", isItalic: true },
  { prefix: "[2.1]", text: "YOUR NAME OR NICKNAME" },
  { prefix: "[2.2]", text: "YOUR E-MAIL" },
  { prefix: "", text: "(for very rare updates)", isItalic: true },
  { prefix: "[2.3]", text: "PLACE OF ORIGIN" },
  { prefix: "[2.4]", text: "YOUR OWN PROMPT" },
  { prefix: "", text: "(a phrase or sentence you'd like to see influence the generated images)", isItalic: true },
  { prefix: "[2.5]", text: "Would you like to receive $1 for participating?" },
  { prefix: "", text: "(If so, you'll be contacted by provided e-mail)", isItalic: true },
  { prefix: "[2.6*]", text: "Do you agree to your images being used to train AI?" },
  { prefix: "[2.7*]", text: "Do you agree to your images potentially shown publicly?" }
];

export const STEP4_ITEMS = [
  { prefix: "[✓]", text: "Thank you! Your contribution is priceless." },
  { prefix: "", text: "Your dataset will be transformed into 45 images tracing your speculative lifespan—from [before life] to [after life]." },
  { prefix: "", text: "It may take anywhere from 1 to 365 business days to process your data. If you get impatient, don't hesitate to drop us a line at [beforelife@yahoo.com]" },
  { prefix: "", text: "We may feature selected results on this page (and beyond). If so, we'll make sure to ask for your permission first." },
  { prefix: "", text: "Bisou-bisou! Talk to you soon :)" },
]; 