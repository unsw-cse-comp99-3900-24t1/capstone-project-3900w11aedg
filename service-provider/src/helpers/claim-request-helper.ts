
export function constructRequest(domain: string, claims: any, serviceProviderDID: string) {  
    const presentationURL = `https://${domain}/claims/verify`;
  
    return {
      "query": [
        {
          domain,
          "did": serviceProviderDID,
          claims,
          "url": presentationURL
        }
      ]
    };
  }