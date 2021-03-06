pub mod create;
pub mod delete;
pub mod edit;
pub mod fetch;

pub fn routes() -> axum::Router {
    use crate::middlewares::*;
    use axum::{middleware, routing::*, Router};

    Router::new()
        .route("/", get(fetch::fetch_many).post(create::create))
        .route(
            "/:id",
            get(fetch::fetch_one)
                .patch(edit::edit)
                .delete(delete::delete),
        )
        .layer(middleware::from_fn(member::handle))
}
