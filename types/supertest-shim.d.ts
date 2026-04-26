declare module 'supertest' {
  type TestResponse = {
    status: number;
    body: any;
    text: string;
  };

  type TestRequest = {
    send(body: unknown): Promise<TestResponse>;
  };

  type SupertestAgent = {
    post(path: string): TestRequest;
    get(path: string): TestRequest;
  };

  export default function request(server: unknown): SupertestAgent;
}
