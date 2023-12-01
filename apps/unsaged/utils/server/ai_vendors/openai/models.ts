import {
  DEBUG_MODE,
  OPENAI_API_TYPE,
  OPENAI_MODEL_NAME,
  OPENAI_DEPLOYMENT_ID,
} from '@/utils/app/const';

import { AiModel, GetAvailableOpenAIModelResponse, PossibleAiModels } from '@/types/ai-models';
import { getOpenAi } from './openai';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(key: string): Promise<GetAvailableOpenAIModelResponse> {
  if (!key) {
    return { data: [] };
  }

  const openai = await getOpenAi(key);

  const list = (OPENAI_API_TYPE === 'azure') ? {data:[{model:OPENAI_MODEL_NAME, id:OPENAI_DEPLOYMENT_ID}]}:(await openai.models.list());//TODO FIXME
  // In AZURE case, I think there isn't a "models" API path, so maybe need to implement this https://learn.microsoft.com/en-us/rest/api/cognitiveservices/accountmanagement/deployments/list?view=rest-cognitiveservices-accountmanagement-2023-05-01&tabs=HTTP 

  const models: (AiModel | null)[] = list.data
    .map((openaiModel: any) => {
      const model_name =
        OPENAI_API_TYPE === 'azure' ? openaiModel.model : openaiModel.id;

      if (!PossibleAiModels[model_name]) {
        if (DEBUG_MODE)
          console.warn('OpenAI model not implemented:', model_name);

        return null;
      }

      const model = PossibleAiModels[model_name];

      if (OPENAI_API_TYPE === 'azure') {
        model.id = openaiModel.id;
      }

      return model;
    });

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
