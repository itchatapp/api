## [1.0.1](https://github.com/itchatapp/api/compare/v1.0.0...v1.0.1) (2022-06-03)


### Bug Fixes

* Run json parser when we need it ([5cb2973](https://github.com/itchatapp/api/commit/5cb29738594b48c50727ed90775f3a1774c86527))

# 1.0.0 (2022-06-03)


### Bug Fixes

* **AccountController:** Currect url response ([f1d841c](https://github.com/itchatapp/api/commit/f1d841c2127e2111874bff8ed86a4c98111e99dc))
* Add public:true to options ([ed362c6](https://github.com/itchatapp/api/commit/ed362c6c9eaa71817728a42b4de29e54b1b24cc8))
* **Base#count:** the method wasn't working ([15b4a6f](https://github.com/itchatapp/api/commit/15b4a6f5b12add78ab5767dfd386cc185b66fff6))
* bind onMessage ([6e9ee05](https://github.com/itchatapp/api/commit/6e9ee05338d2589efb40e9daba6ad93425b2ff1c))
* **Channel:** disable eslint rule ([c118482](https://github.com/itchatapp/api/commit/c1184820d57e1421f32156ae44b61d93329102d0))
* **controler:** Use is#snowflake ([0044e19](https://github.com/itchatapp/api/commit/0044e1949e4c12a2e5eff6f1d8f9503db959c46f))
* **controller:** "[@me](https://github.com/me)" as id now not allowed ([1779920](https://github.com/itchatapp/api/commit/17799200bc0322e87e8c02965b5dbfead05abc86))
* **getaway:** Get items first. ([9c75aef](https://github.com/itchatapp/api/commit/9c75aef013d04667d9550072826aeb853e54674f))
* Import missing module crypto ([85c1e3e](https://github.com/itchatapp/api/commit/85c1e3ec79855a91c15fb7c514ebc28a96100038))
* **Message:** Make content length more strictly ([a9df27f](https://github.com/itchatapp/api/commit/a9df27fb062c8f8e9c5dc30f170d26fa2b74ff3b))
* **middlewares:valid-id:** req.params may be undefined ([af18f9b](https://github.com/itchatapp/api/commit/af18f9b43172bb9f9dddf1c63790dfadbd7a7756))
* Remove non-needed [@decorator](https://github.com/decorator) ([d752429](https://github.com/itchatapp/api/commit/d75242915c85333d2a97d0289b98953d785622af))
* Some bug fixes ([2ccec38](https://github.com/itchatapp/api/commit/2ccec38aa9bc1f2723563056b0fa506191772abf))
* some fixes & security checks ([3bf7ebe](https://github.com/itchatapp/api/commit/3bf7ebe91a11663fc237b5ea1ebc9c416a5a9ff4))
* Spell check ([98c12fa](https://github.com/itchatapp/api/commit/98c12fa0b52cb1b57069ba77fb34288f45bdc252))
* **sql:** members table wasn't typed right ([a9333fa](https://github.com/itchatapp/api/commit/a9333fad1510ad509a3c48c0f1fc596b3e98ec20))
* **structures:** Use sql#unsafe to dynamic table operation ([9aa88f0](https://github.com/itchatapp/api/commit/9aa88f05859ff14aa70b5430ce4418a9b57e221b))
* Use native method ([0114690](https://github.com/itchatapp/api/commit/0114690c07f290c8e1c3479e012a265577a7c1a8))
* **User#fetchRelations:** Hide private fields ([77e177c](https://github.com/itchatapp/api/commit/77e177c88de6f8c05e60f5cc7fcb8e014a8976ab))
* **UserController#fetchOne:** Hide private fields ([296ba4a](https://github.com/itchatapp/api/commit/296ba4af9a3c266c0b1d63d6a5a1cde2cc96eb09))


### Features

* "is.ts" ([bef858e](https://github.com/itchatapp/api/commit/bef858e5b48ee32ef19ec6a0b1ca23fb5f937ee0))
* A lot of things are updated.. (can't explain them.. i'm lazy xd) ([240b1ed](https://github.com/itchatapp/api/commit/240b1edac4da9501f068a570fb8038ad4e4a5251))
* Add @itchatt/controllers & @itchat/utils lib ([d9df524](https://github.com/itchatapp/api/commit/d9df5242fe2d0778f90bd79998e72ff2d77a3d14))
* Add BitField and Badges ([a6a8644](https://github.com/itchatapp/api/commit/a6a86442143dd8e07c0a94a7820ecbcecbf21fe6))
* Add logger instead of regular console#log ([c9aa3f7](https://github.com/itchatapp/api/commit/c9aa3f7236d62e1f92d57126407177ae3386e77f))
* Add migrate file ([fcd1423](https://github.com/itchatapp/api/commit/fcd14233e664aa5ef6938eecfed49b2432158fa5))
* Add more errors ([47582ad](https://github.com/itchatapp/api/commit/47582ad9a7dc299c49cb620fddba873ce594400a))
* add more types to Request ([a040289](https://github.com/itchatapp/api/commit/a04028925fe9f5203a10317e2c4e751e8e8fb676))
* Add test command ([d329b6c](https://github.com/itchatapp/api/commit/d329b6c10679de6fa5d9796ace1929da0702a9a4))
* Add WithID type helper ([630b705](https://github.com/itchatapp/api/commit/630b705b64e246d645132bdb50f9567242634dc0))
* **Channel:** Define #find type ([064b560](https://github.com/itchatapp/api/commit/064b560d641653d258b5974267daf6650a17aa9b))
* **Controllers:** Add /accounts & /sessions routes ([3f83a5d](https://github.com/itchatapp/api/commit/3f83a5d58c49422fdc26754c163ee12dfcb3f7ea))
* **Controllers:** Add InviteController ([cf26b11](https://github.com/itchatapp/api/commit/cf26b11e2ed7b04fe5858856d829ab27b314bf8f))
* **controllers:** controllers is okie ([16f6cd1](https://github.com/itchatapp/api/commit/16f6cd1b1b40b6f364fb15e025efe603b6a7311d))
* Fixes & add more methods ([9455eab](https://github.com/itchatapp/api/commit/9455eab8ce5dd86e723710b7dd37ca71474181c7))
* **is:** Check for undefined values ([a0cc390](https://github.com/itchatapp/api/commit/a0cc3901ef682a9856cee3eeafe7d29b80da8414))
* **is:** Faster empty object check ([70cd9dc](https://github.com/itchatapp/api/commit/70cd9dc4556bc17b0ac467d3af062fc9bf919d67))
* **Logger:** Add colors ([8a55dd0](https://github.com/itchatapp/api/commit/8a55dd084afadb4896e396e46b31d9af5188a40f))
* **Logger:** Add logging ([ab2cabb](https://github.com/itchatapp/api/commit/ab2cabb393b503bd4bf8221dbcf72c6541584cd3))
* Major update ([e04396c](https://github.com/itchatapp/api/commit/e04396c27e5c2fdb96791f062266c1aa62c457ec))
* **middlewares:auth:** user-id not needed. ([4f77f8d](https://github.com/itchatapp/api/commit/4f77f8dd325ea21209e2690d79ff1d9fa88f0a5a))
* **middlewares:** Add cors ([28b30c9](https://github.com/itchatapp/api/commit/28b30c94b649c4b101f2592d8802a7f400fe6b2d))
* **middlewares:** Add json options ([9538711](https://github.com/itchatapp/api/commit/953871142c2f57da2171fc896a620dac442237bb))
* **middlewares:** Add some options ([02f9e28](https://github.com/itchatapp/api/commit/02f9e2826d74b2c600770b371b599ea90c3476d0))
* Move config to src folder ([f7d8c4a](https://github.com/itchatapp/api/commit/f7d8c4a16121f9c999d0c7db2244bfbec7f81640))
* No need to "subscribers" anymore.. ([f843358](https://github.com/itchatapp/api/commit/f843358a804ba80a72ff089a16836cdc545f37a1))
* Remove non-needed try/catch ([1451f68](https://github.com/itchatapp/api/commit/1451f6819d6401d18b6cb6b4e411f656cc6cf46b))
* **sql:** Add color field for role ([8c1e331](https://github.com/itchatapp/api/commit/8c1e331f547b4e1cb961e2fac2e8726636e5408b))
* **structures:** Add #from method ([3ac4ad2](https://github.com/itchatapp/api/commit/3ac4ad2d9d90db2334c07d51770ca975270b3292))
* **structures:** Sqlizy the structures ([409345a](https://github.com/itchatapp/api/commit/409345abe94d7c19914850051663a1f7a681f1dc))
* **types:** Response#ok allow to specify status code ([9bb8531](https://github.com/itchatapp/api/commit/9bb85312263daf0d4432bf9633f630298413fa70))
* Use clusters ([2bd17af](https://github.com/itchatapp/api/commit/2bd17aff15092011ed07ad111ceb0388e3e7a680))
