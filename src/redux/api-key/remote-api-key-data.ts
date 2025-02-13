import { isArray } from 'lodash';
import { pick } from 'lodash/fp';
import { addDataToStore, DEFAULT_CACHE_STRATEGY, getJsonResponse } from '../fetch-and-add-to-store';
import { ApiKeyValue } from './api-key-reducer';
import { API_KEY_LOADED_EVENT, WEB_API_TEMP_KEY_ENDPOINT } from './constants';

declare global {
  interface Window {
    ably: {
      docs: {
        DOCS_API_KEY: boolean | string;
        randomChannelName: string;
        onApiKeyRetrieved: () => void;
      };
    };
  }
}

const safelyInvokeApiKeyRetrievalTrigger = () => {
  try {
    window.ably.docs.onApiKeyRetrieved();
  } catch (e) {
    console.error(e);
  }
};

const retrieveApiKeyDataFromApiKeyUrl = async (payload: Record<string, unknown>) => {
  if (payload.error || !payload.data || !isArray(payload.data)) {
    console.warn('No data array on API Key payload object returned from endpoint');
    const tempApiKeyResponse = await fetch(WEB_API_TEMP_KEY_ENDPOINT, { cache: DEFAULT_CACHE_STRATEGY });
    const tempApiKey = await tempApiKeyResponse.text();

    if (window.ably?.docs && !window.ably.docs.DOCS_API_KEY) {
      window.ably.docs.DOCS_API_KEY = tempApiKey;
      safelyInvokeApiKeyRetrievalTrigger();
    }
    return {
      data: [
        {
          name: 'Demo Only',
          url: WEB_API_TEMP_KEY_ENDPOINT,
          apiKeys: [
            {
              name: 'Demo Only',
              whole_key: tempApiKey,
            },
          ],
        },
      ],
    };
  }
  const apiKeyData = await Promise.all(
    payload.data.map(async (value: ApiKeyValue) => {
      const apiKeysRaw = await getJsonResponse(value.url, 'api-key-retrieval');
      const apiKeys = apiKeysRaw.map(pick(['name', 'whole_key']));
      return { ...value, apiKeys };
    }),
  );
  /**
   * Supporting ad hoc scripts; the following lines can be removed when ad hoc scripts are.
   */
  if (window.ably?.docs) {
    window.ably.docs.DOCS_API_KEY = apiKeyData[0].apiKeys[0].whole_key;
    safelyInvokeApiKeyRetrievalTrigger();
  }
  /**
   * Supporting ad hoc scripts; the preceding lines can be removed when ad hoc scripts are.
   */
  return {
    ...payload,
    data: apiKeyData,
  };
};

export const fetchApiKeyData = async (store: Store, apiKeyUrl: string): Promise<void> =>
  addDataToStore(store, apiKeyUrl, API_KEY_LOADED_EVENT, retrieveApiKeyDataFromApiKeyUrl);
