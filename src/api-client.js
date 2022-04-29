let apiClient = null;

function setApiClient(client) {
  apiClient = client;
}

function useApiClient() {
  return apiClient;
}

export { setApiClient, useApiClient };
