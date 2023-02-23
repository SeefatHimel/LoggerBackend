import axios from 'axios';

export class JiraClient {
  constructor(private access_token: string) {}

  async getMyProfile() {
    const resp = await axios.get('https://api.atlassian.com/me', {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    return resp.data;
  }
}
