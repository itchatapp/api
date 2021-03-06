use crate::extractors::*;
use crate::gateway::*;
use crate::structures::*;
use crate::utils::*;
use inter_struct::prelude::*;
use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate, OpgModel, StructMerge)]
#[struct_merge("crate::structures::server::Server")]
pub struct EditServerOptions {
    #[validate(length(min = 1, max = 50))]
    name: Option<String>,
}

pub async fn edit(
    Extension(user): Extension<User>,
    Path(id): Path<i64>,
    ValidatedJson(data): ValidatedJson<EditServerOptions>,
) -> Result<Json<Server>> {
    let mut server = id.server(user.id.into()).await?;

    Permissions::fetch_cached(&user, Some(&server), None)
        .await?
        .has(bits![MANAGE_SERVER])?;

    server.merge(data);

    let server = server.update_all_fields(pool()).await?;

    Payload::ServerUpdate(server.clone()).to(server.id).await;

    Ok(Json(server))
}
