use crate::structures::*;
use axum::extract::ws;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Empty {
    pub id: u64,
}

#[derive(Serialize, Deserialize)]
pub struct EmptyChannel {
    pub r#type: ChannelTypes,
    pub id: u64,
    pub server_id: Option<u64>,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "event")]
pub enum Payload {
    Authenticate {
        token: String,
    },
    Ping,
    Authenticated,
    Ready {
        user: User,
        servers: Vec<Server>,
        channels: Vec<Channel>,
    },
    Pong,
    ChannelCreate(Channel),
    ChannelDelete(EmptyChannel),
    ChannelUpdate(Channel),
    GroupUserJoin(User),
    GroupUserLeave(User),
    MessageCreate(Message),
    MessageDelete(Empty),
    MessageUpdate(Message),
    RoleCreate(Role),
    RoleDelete(Empty),
    RoleUpdate(Role),
    ServerCreate(Server),
    ServerDelete(Empty),
    ServerMemberJoin(Member),
    ServerMemberLeave(Empty),
    ServerMemberUpdate(Member),
    ServerUpdate(Server),
    UserUpdate(User),
}

impl From<Payload> for ws::Message {
    fn from(payload: Payload) -> ws::Message {
        ws::Message::Text(serde_json::to_string(&payload).unwrap())
    }
}