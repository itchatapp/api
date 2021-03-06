use crate::extractors::*;
use crate::gateway::*;
use crate::structures::*;
use crate::utils::*;

pub async fn kick(
    Extension(user): Extension<User>,
    Path((group_id, target_id)): Path<(i64, i64)>,
) -> Result<()> {
    let target = target_id.user().await?;
    let mut group = group_id.channel(user.id.into()).await?;

    Permissions::fetch_cached(&user, None, Some(&group))
        .await?
        .has(bits![KICK_MEMBERS])?;

    if let Some(recipients) = group.recipients.as_mut() {
        let exists = recipients
            .iter()
            .position(|&id| id == target.id)
            .map(|i| recipients.remove(i))
            .is_some();

        if !exists {
            return Err(Error::UnknownMember);
        }
    }

    let group = group.update_all_fields(pool()).await?;

    Payload::ChannelUpdate(group).to(group_id).await;

    Ok(())
}
