use crate::config::*;
use crate::database::DB as db;
use crate::extractors::*;
use crate::structures::*;
use crate::utils::*;
use rbatis::crud::CRUDMut;
use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate, utoipa::Component)]
pub struct CreateServerOptions {
    #[validate(length(min = 1, max = 50))]
    name: String,
}

#[utoipa::path(
    get,
    path = "/servers",
    responses((status = 200, body = [Server]), (status = 400, body = Error))
)]
pub async fn fetch_servers(Extension(user): Extension<User>) -> Json<Vec<Server>> {
    Json(user.fetch_servers().await)
}

#[utoipa::path(
    get,
    path = "/servers/{id}",
    responses((status = 200, body = Server), (status = 400, body = Error)),
    params(("id" = u64, path))
)]
pub async fn fetch_server(Path(server_id): Path<u64>) -> Result<Json<Server>> {
    Ok(Json(server_id.server().await?))
}

#[utoipa::path(
    post,
    path = "/servers",
    request_body = CreateServerOptions,
    responses((status = 200, body = Server), (status = 400, body = Error))
)]
pub async fn create_server(
    Extension(user): Extension<User>,
    ValidatedJson(data): ValidatedJson<CreateServerOptions>,
) -> Result<Json<Server>> {
    let count = Member::count(|q| q.eq("id", user.id)).await;

    if count > *MAX_SERVERS {
        return Err(Error::MaximumServers);
    }

    let server = Server::new(data.name, user.id);
    let member = Member::new(user.id, server.id);
    let category = Channel::new_category("General".into(), server.id);
    let mut chat = Channel::new_text("general".into(), server.id);

    chat.parent_id = Some(category.id);

    let mut tx = db.acquire_begin().await.unwrap();

    tx.save(&server, &[]).await.unwrap();
    tx.save(&category, &[]).await.unwrap();
    tx.save(&chat, &[]).await.unwrap();
    tx.save(&member, &[]).await.unwrap();

    tx.commit().await.unwrap();

    Ok(Json(server))
}

#[utoipa::path(
    delete,
    path = "/servers/{id}",
    responses((status = 400, body = Error)),
    params(("id" = u64, path))
)]
pub async fn delete_server(
    Extension(user): Extension<User>,
    Path(server_id): Path<u64>,
) -> Result<()> {
    let server = server_id.server().await?;

    if server.owner_id != user.id {
        return Err(Error::MissingAccess);
    }

    server.delete().await;

    Ok(())
}

pub fn routes() -> axum::Router {
    use axum::{routing::*, Router};

    Router::new()
        .route("/", post(create_server).get(fetch_servers))
        .route("/:server_id", get(fetch_server).delete(delete_server))
}
