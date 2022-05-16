import 'dotenv';

const config = {
  port: Deno.env.get('PORT')!,
  databaseUri: Deno.env.get('DATABASE_URI')!,
  captcha: {
    enabled: false,
    key: '',
    token: '',
  },
  limits: {
    user: {
      username: 32,
      servers: 100,
      groups: 50,
      friends: 1_000,
      blocked: 1_000,
      bots: 10
    },
    server: {
      name: 50,
      description: 1_000,
      roles: 200,
      channels: 200,
      emojis: 50,
      members: 10_000
    },
    member: {
      nickname: 32
    },
    message: {
      length: 2_000,
      attachments: 5,
      replies: 5,
      embeds: 1
    },
    group: {
      name: 50,
      members: 100,
      description: 1_000
    },
    channel: {
      name: 50,
      topic: 1000
    }
  },
};

export default config;
