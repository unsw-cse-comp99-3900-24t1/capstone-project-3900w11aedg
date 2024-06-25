import { UUID } from 'crypto';

export function constructRequest(challenge: UUID, domain: string, claims: any, serviceProviderDID: string) {  
    const presentationURL = `https://${domain}/claims/verify`;
  
    return {
      "query": [
        {
          challenge,
          domain,
          "did": serviceProviderDID,
          claims,
          "url": presentationURL
        }
      ]
    };
  }