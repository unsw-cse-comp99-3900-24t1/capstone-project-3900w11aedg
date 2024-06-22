import request from 'supertest';
import app from '../src/index';
import {server} from '../src/index';
import { describe, it, expect, afterEach } from '@jest/globals';

const claims: Record<string, string | string[]> = {"Driver License" : ["age", "name"]}
const serviceProviderDID = 'did:web:example.com';

describe('POST /credential/request', () => {
  afterEach(async () => {
    await server.close();
  });

  it('should respond with a valid status and a QR code URL', async () => {       
    const response = await request(app)
                    .post('/credential/request')
                    .send({ claims, serviceProviderDID});

    expect(response.status).toBe(200);
    expect(response.body.qrCode).toMatch(/^data:image\/png;base64,/);
  });

  it('should respond with status 404 when DID is invalid', async () => {        
    const response = await request(app)
                    .post('/credential/request')
                    .send({ claims, serviceProviderDID: 'did:example:invalid' });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Service Provider DID not found!');
  });

  it('should respond with status 400 when claims are not provided', async () => {        
    const response = await request(app)
                    .post('/credential/request')
                    .send({ claims: {}, serviceProviderDID });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid parameters');
  });

});