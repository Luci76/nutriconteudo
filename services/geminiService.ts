
import { GoogleGenAI, Type } from "@google/genai";
import { PostInput, HypeTrend } from "../types";

const SYSTEM_INSTRUCTION = `Você é o NutriConteúdo IA, um assistente especialista em marketing de conteúdo para nutricionistas que atuam no Instagram.
Sua função é gerar conteúdos prontos para postagem, com foco em: Engajamento, Autoridade profissional e Conversão para consultas.

REGRAS CRÍTICAS:
- Use linguagem clara, ética e profissional.
- JAMAIS faça promessas de cura.
- JAMAIS prescreva dietas específicas.
- NÃO utilize termos sensacionalistas (ex: "seque 10kg", "milagre", "veneno").
- Sempre incentive o acompanhamento profissional individualizado.
- O conteúdo deve ser humanizado e gerar conexão.

Você deve retornar obrigatoriamente um objeto JSON.`;

export const generateNutriContent = async (input: PostInput): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Gere um conteúdo de Instagram com os seguintes parâmetros:
    - Nicho da Nutricionista: ${input.niche}
    - Público-alvo: ${input.targetAudience}
    - Objetivo do conteúdo: ${input.goal}
    - Tipo de conteúdo desejado: ${input.contentType}
    - Tom da comunicação: ${input.tone}

    Lembre-se de seguir rigorosamente as regras éticas e o formato de saída JSON.
    Formato: { "title": string, "type": string, "structure": string, "legend": string, "cta": string }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            type: { type: Type.STRING },
            structure: { type: Type.STRING },
            legend: { type: Type.STRING },
            cta: { type: Type.STRING },
          },
          required: ["title", "type", "structure", "legend", "cta"]
        }
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
};

export const fetchHypeTrends = async (niche: string): Promise<HypeTrend[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Quais são as notícias, tendências, polêmicas ou novos estudos mais buscados e comentados nas últimas 48 horas relacionados ao nicho de nutrição: "${niche}"? 
  Forneça 3 tendências reais. Para cada uma, sugira um 'ângulo' de postagem estratégica para o Instagram.
  Retorne em JSON: { "trends": [ { "topic": string, "summary": string, "angle": string } ] }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  angle: { type: Type.STRING },
                },
                required: ["topic", "summary", "angle"]
              }
            }
          }
        }
      },
    });

    const result = JSON.parse(response.text || '{"trends":[]}');
    
    // Extract grounding URLs
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({ title: chunk.web.title, uri: chunk.web.uri }));

    return result.trends.map((t: any) => ({
      ...t,
      sources: sources.slice(0, 2) // Attach a few relevant sources to each for authority
    }));
  } catch (error) {
    console.error("Erro ao buscar hype:", error);
    return [];
  }
};
