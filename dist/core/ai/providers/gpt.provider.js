"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GptProvider = void 0;
const openai_1 = require("openai");
class GptProvider {
    configService;
    openai;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is missing');
        }
        this.openai = new openai_1.OpenAI({ apiKey });
    }
    async generateResponse(content, retries = 5) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await this.openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content }],
                });
                console.log('GPT response:', response);
                return response.choices[0].message.content ?? '';
            }
            catch (err) {
                if (err.status === 429) {
                    const wait = Math.pow(2, attempt) * 1000;
                    console.log(`Limite atingido. Tentando novamente em ${wait / 1000}s...`);
                    await new Promise((r) => setTimeout(r, wait));
                }
                else {
                    throw err;
                }
            }
        }
        throw new Error('Número máximo de tentativas excedido');
    }
}
exports.GptProvider = GptProvider;
//# sourceMappingURL=gpt.provider.js.map