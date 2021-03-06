use crate::extractors::*;
use crate::gateway::*;
use crate::structures::*;
use crate::utils::*;
use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate, OpgModel)]
pub struct EditMemberOptions {
    #[validate(length(min = 1, max = 32))]
    nickname: Option<String>,
    roles: Option<Vec<i64>>,
}

pub async fn edit(
    Extension(user): Extension<User>,
    Path((server_id, id)): Path<(i64, i64)>,
    ValidatedJson(data): ValidatedJson<EditMemberOptions>,
) -> Result<Json<Member>> {
    let mut member = id.member(server_id).await?;
    let p = Permissions::fetch(&user, server_id.into(), None).await?;

    if let Some(nickname) = &data.nickname {
        p.has(bits![CHANGE_NICKNAME, MANAGE_NICKNAMES])?;

        member.nickname = if nickname.is_empty() {
            None
        } else {
            Some(nickname.into())
        };
    }

    if let Some(ids) = &data.roles {
        p.has(bits![MANAGE_ROLES])?;

        let mut roles = Role::select()
            .filter("server_id = $1")
            .bind(server_id)
            .fetch_all(pool())
            .await?
            .into_iter();

        member.roles = vec![];

        for &id in ids {
            if !roles.any(|r| r.id == id) {
                return Err(Error::UnknownRole);
            }
            member.roles.push(id);
        }
    }

    let member = member.update_all_fields(pool()).await?;

    Payload::ServerMemberUpdate(member.clone())
        .to(server_id)
        .await;

    Ok(Json(member))
}
