use crate::config::*;
use axum::{
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};
use serde::Deserialize;

#[derive(Deserialize)]
struct CaptchaResponse {
    success: bool,
}

pub async fn handle<B>(req: Request<B>, next: Next<B>) -> Result<Response, StatusCode> {
    let key = req.headers().get("X-Captcha-Key");

    if key.is_none() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let client = reqwest::Client::new();
    let body = serde_json::json!({
        "response": key.unwrap().to_str().unwrap(),
        "secret": *CAPTCHA_TOKEN,
        "sitekey": *CAPTCHA_KEY
    });

    let res = client
        .post("https://hcaptcha.com/siteverify")
        .body(body.to_string())
        .send()
        .await;

    if let Ok(res) = res {
        if let Ok(captcha) = res.json::<CaptchaResponse>().await {
            if captcha.success {
                return Ok(next.run(req).await);
            }
        }
    }

    Err(StatusCode::BAD_REQUEST)
}
