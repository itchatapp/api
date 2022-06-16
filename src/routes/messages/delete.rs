use crate::extractors::*;
use crate::structures::*;
use crate::utils::*;
use serde::Deserialize;
use validator::Validate;

#[utoipa::path(
    delete,
    path = "/messages/{id}",
    responses((status = 200), (status = 400, body = Error)),
    params(("id" = u64, path))
)]
pub async fn delete(
    Extension(user): Extension<User>,
    Path((channel_id, id)): Path<(u64, u64)>,
) -> Result<()> {
    let msg = id.message().await?;
    let permissions = Permissions::fetch(&user, None, channel_id.into()).await?;

    permissions.has(Permissions::VIEW_CHANNEL)?;

    if msg.author_id != user.id {
        permissions.has(Permissions::MANAGE_MESSAGES)?;
    }

    msg.delete().await;

    Ok(())
}