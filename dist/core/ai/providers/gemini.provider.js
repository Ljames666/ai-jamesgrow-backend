"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const genai_1 = require("@google/genai");
class GeminiProvider {
    configService;
    genAi;
    model;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is missing');
        }
        this.genAi = new genai_1.GoogleGenAI({ apiKey });
        this.model = 'gemini-2.5-flash-lite';
    }
    async generateResponse(contents) {
        try {
            const result = await this.genAi.models.generateContent({
                model: this.model,
                contents,
            });
            return result.text ?? '';
        }
        catch (error) {
            console.error('Gemini error:', error);
            throw new Error('Failed to get response from Gemini');
        }
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=gemini.provider.js.map