import { ClientOptions, OpenAI } from "openai";
import {
    OPENAI_API_KEY,
    OPENAI_API_TYPE,
    OPENAI_API_URL,
    OPENAI_API_VERSION,
    OPENAI_DEPLOYMENT_ID,
    OPENAI_ORGANIZATION,
} from '@/utils/app/const';

export function getOpenAi(apiKey: string, modelId?: string) {
    if (OPENAI_API_TYPE === 'azure') {
        modelId = modelId ? modelId : OPENAI_DEPLOYMENT_ID;/*Deployment needed for azure*/
        const configuration: ClientOptions = {
            apiKey: apiKey ? apiKey : OPENAI_API_KEY,
            organization: OPENAI_ORGANIZATION,
            baseURL: `${OPENAI_API_URL}/openai/deployments/${modelId}`,
            defaultHeaders: {"api-key": apiKey ? apiKey : OPENAI_API_KEY},
            defaultQuery: {"api-version": OPENAI_API_VERSION}
        };
        return new OpenAI(configuration);
    } else {/*OpenAI*/
        const configuration: ClientOptions = {
            apiKey: apiKey ? apiKey : OPENAI_API_KEY,
            organization: OPENAI_ORGANIZATION
        };
        return new OpenAI(configuration);
    }
}