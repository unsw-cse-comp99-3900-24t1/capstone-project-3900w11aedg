import { Card } from '../src/config/types';

export const mockCard: Card = {
  id: 'uni-degree-id',
  name: 'University Degree',
  description: 'The holder of this credential is a graduate of UNSW.',
  type: 'AlumniCredential',
  credIssuedBy: 'https://www.unsw.edu.au/',
  credNumber: '1',
  claims: { alumniOf: 'University of New South Wales' },
  issuanceDate: '2020-01-01T00:00:00Z',
  expiryDate: '2030-01-01T00:00:00Z',
  originalName: 'University Graduate Credential',
  pinned: null,
};
