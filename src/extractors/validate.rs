use crate::utils::error::Error;
use axum::{
    body::HttpBody,
    extract::{FromRequest, Json, RequestParts},
    BoxError,
};
use serde::de::DeserializeOwned;
use validator::Validate;

#[derive(Debug, Clone, Copy, Default)]
pub struct ValidatedJson<T>(pub T);

#[async_trait]
impl<T, B> FromRequest<B> for ValidatedJson<T>
where
    T: DeserializeOwned + Validate,
    B: HttpBody + Send,
    B::Data: Send,
    B::Error: Into<BoxError>,
{
    type Rejection = Error;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        let data: Json<T> = Json::from_request(req).await?;

        data.validate().map_err(|_| Error::InvalidBody)?;

        Ok(Self(data.0))
    }
}
