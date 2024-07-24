## [6.4.3](https://github.com/bimdata/bcf-components/compare/v6.4.2...v6.4.3) (2024-07-24)


### PATCH

* chore: update dependencies ([128236e](https://github.com/bimdata/bcf-components/commit/128236e80da7eaece84ffe241954a3b305192f8d))

## [6.4.2](https://github.com/bimdata/bcf-components/compare/v6.4.1...v6.4.2) (2024-07-23)


### PATCH

* delete viewpoint (#42) ([675d00c](https://github.com/bimdata/bcf-components/commit/675d00cae4816cc1f029dec3575876f6a3f2b7d3)), closes [#42](https://github.com/bimdata/bcf-components/issues/42)

## [6.4.1](https://github.com/bimdata/bcf-components/compare/v6.4.0...v6.4.1) (2024-07-18)


### PATCH

* fix missing layout on topic update (#41) ([4c8d253](https://github.com/bimdata/bcf-components/commit/4c8d253708c8e74773e77f02d1c48334ffdcf8ee)), closes [#41](https://github.com/bimdata/bcf-components/issues/41)

# [6.4.0](https://github.com/bimdata/bcf-components/compare/v6.3.0...v6.4.0) (2024-07-09)


### MINOR

* Add Topic viewer layout if multi viewpoints (#40) ([9f78694](https://github.com/bimdata/bcf-components/commit/9f786947010f0ef44650aaae840a03bff89e90ad)), closes [#40](https://github.com/bimdata/bcf-components/issues/40)

# [6.3.0](https://github.com/bimdata/bcf-components/compare/v6.2.1...v6.3.0) (2024-06-27)


### feature

* add topics list element warning (#37) ([41cff80](https://github.com/bimdata/bcf-components/commit/41cff802adb4d12d21b7d415f81b5b2dd86dfce9)), closes [#37](https://github.com/bimdata/bcf-components/issues/37)

### MINOR

* add bcf overview warning feature (#38) ([ee5decd](https://github.com/bimdata/bcf-components/commit/ee5decd1d771d4c2d515220af9f3c72cb86acb5b)), closes [#38](https://github.com/bimdata/bcf-components/issues/38)

### PATCH

* fix: handle async getViewpoint method ([4711958](https://github.com/bimdata/bcf-components/commit/4711958563a649eede3c4119a86b8c3cfabcd2b5))
* fix: rename 'panorama' viewpoint type to 'photosphere' ([bd3bce4](https://github.com/bimdata/bcf-components/commit/bd3bce40376c2f330e5366f2c6b8bb4a83426400))

## [6.2.1](https://github.com/bimdata/bcf-components/compare/v6.2.0...v6.2.1) (2024-02-06)


### PATCH

* fix: call getSnapshot on localContext instead of viewer ([035d229](https://github.com/bimdata/bcf-components/commit/035d229191ea2aedb0aa9a67e3a14d59a50dc3e5))
* fix: highlight/unhighlight viewer methods ([0395792](https://github.com/bimdata/bcf-components/commit/03957927033e04086253c1628603b8fb977dd5bb))
* fix: topic comment viewer selector highlight ([5d9bc52](https://github.com/bimdata/bcf-components/commit/5d9bc526b51f7a0ed474462eea8eed2395cec0d6))
* fix: use new viewer apis to handle viewpoints ([1b71111](https://github.com/bimdata/bcf-components/commit/1b711118bc0991e28a476241e8615acd088e6969))
* fix: use viewer.getSnapshot to set viewpoint snapshot ([3d8f7ee](https://github.com/bimdata/bcf-components/commit/3d8f7ee7b311656ca7f9875b85537ec20967ff1f))
* fix(snapshot): access localContext from viewer instance ([c2560e4](https://github.com/bimdata/bcf-components/commit/c2560e45477b5398bec32c992a6d1b1ba757166a))

# [6.2.0](https://github.com/bimdata/bcf-components/compare/v6.1.0...v6.2.0) (2023-12-01)


### MINOR

* rework comment permissions (#36) ([01fb8f3](https://github.com/bimdata/bcf-components/commit/01fb8f3e1e132183c3dd19699994b1355248ad6b)), closes [#36](https://github.com/bimdata/bcf-components/issues/36)

### PATCH

* canEditComment typo ([2e2c07c](https://github.com/bimdata/bcf-components/commit/2e2c07c5572ab9b566275ccee40904a189731a46))
* chore(i18n): update de, en and es translations ([bca487c](https://github.com/bimdata/bcf-components/commit/bca487c656c67e192a94d3e03c94df2c88f4c563))
* fix german trad (#35) ([eef493e](https://github.com/bimdata/bcf-components/commit/eef493e056c4b5331901710dfa619f7b6fb93571)), closes [#35](https://github.com/bimdata/bcf-components/issues/35)
* fix(i18n): Update de.json (POEditor.com) ([365637e](https://github.com/bimdata/bcf-components/commit/365637eb59883534df70c91ee318a9d4ef7329cc))

# [6.1.0](https://github.com/bimdata/bcf-components/compare/v6.0.2...v6.1.0) (2023-11-03)


### MINOR

* feat: use globalContext.getViewers() ([454b006](https://github.com/bimdata/bcf-components/commit/454b0067948c37eef2b14385170f9df03563561f))

### PATCH

* fix: avoid taking snapshot for empty viewers ([d3aac09](https://github.com/bimdata/bcf-components/commit/d3aac0912570571cfa7f121ba318a0b29d2519c0))

## [6.0.2](https://github.com/bimdata/bcf-components/compare/v6.0.1...v6.0.2) (2023-10-26)


### chore

* add some comments in service.js ([4afa9b9](https://github.com/bimdata/bcf-components/commit/4afa9b95968ccb84645da31beab9dfba9447386b))

### PATCH

* fix: add service to package export ([84821e7](https://github.com/bimdata/bcf-components/commit/84821e70ee59fe758bc22018a2bc64d1cc8528b7))
* fix: remove service constructor ([67c20c6](https://github.com/bimdata/bcf-components/commit/67c20c6b08eb3038ea3a075c75453b2c0781eec0))
* fix: service.loadTopicsViewpoints method ([746f0f5](https://github.com/bimdata/bcf-components/commit/746f0f5a965b5d474c1d91a04248beaf839f5dce))
* fix: try to service singleton via constructor + fix getUsers ([e32fdd6](https://github.com/bimdata/bcf-components/commit/e32fdd684c0933ea282d487010d50191bb99846a))
* fix: use es6 class to have a singleton service ([80241c3](https://github.com/bimdata/bcf-components/commit/80241c3f953840ceefbb935f91bc570ffceec85f))
* remove design-system imports ([47d42a1](https://github.com/bimdata/bcf-components/commit/47d42a19ae60dfc41590f8fd0919c8568e7ecf1b))

## [6.0.1](https://github.com/bimdata/bcf-components/compare/v6.0.0...v6.0.1) (2023-10-24)


### PATCH

* fix service injection ([752195e](https://github.com/bimdata/bcf-components/commit/752195ead09003e704de38c07aa45d72375d25cf))

# [6.0.0](https://github.com/bimdata/bcf-components/compare/v5.0.0...v6.0.0) (2023-10-18)


### ci

* fix minor version node ([4762803](https://github.com/bimdata/bcf-components/commit/4762803239b4e5d99c79e151ea39e07b5d892ac2))
* use common runners ([8b9c566](https://github.com/bimdata/bcf-components/commit/8b9c566aeba17259d32fc38b4818ff14dffd98e9))

### MAJOR

* feat: change the way viewpoints are taken ([2a1e746](https://github.com/bimdata/bcf-components/commit/2a1e746aa60e37ffa4f0b9df6ecc73bda85cd1d9))
* refactor: remove build system (#34) ([995b81d](https://github.com/bimdata/bcf-components/commit/995b81dd9d920757dfed93beb76996e475f4d03e)), closes [#34](https://github.com/bimdata/bcf-components/issues/34)

### MINOR

* Add XLSXExport (#25) ([a0f4e0d](https://github.com/bimdata/bcf-components/commit/a0f4e0d1599e498bf917ff9bde5c76f7eb3ed495)), closes [#25](https://github.com/bimdata/bcf-components/issues/25)
* Feature/upload file (#27) ([5e3d820](https://github.com/bimdata/bcf-components/commit/5e3d820addc1b2108edf099984dbc63578977874)), closes [#27](https://github.com/bimdata/bcf-components/issues/27)

### PATCH

* add cursor on upload file btn text (#29) ([1076b72](https://github.com/bimdata/bcf-components/commit/1076b7238eb4e7cd3257c62d209ebed2028f73c3)), closes [#29](https://github.com/bimdata/bcf-components/issues/29)
* add search component into assigned to field of topic (#31) ([3ff58f2](https://github.com/bimdata/bcf-components/commit/3ff58f2fc62480366e1062e64a8a17709acd80a6)), closes [#31](https://github.com/bimdata/bcf-components/issues/31)
* add watcher on initFilters (#28) ([6857a84](https://github.com/bimdata/bcf-components/commit/6857a8459bdf995decc64fc2e90c789bb5d2cb0a)), closes [#28](https://github.com/bimdata/bcf-components/issues/28)
* add z-index for active bimdata-select into bcf form (#26) ([5a02e54](https://github.com/bimdata/bcf-components/commit/5a02e547b1036c2699149a1d902b52ecc45f03fd)), closes [#26](https://github.com/bimdata/bcf-components/issues/26)
* fix bcf xlsx export parameters ([ac5a5f6](https://github.com/bimdata/bcf-components/commit/ac5a5f685557beb2e4449aec6a5df7a4d197f484))
* fix exportXLSX ([31dc4de](https://github.com/bimdata/bcf-components/commit/31dc4deacbea3d582fdda574bc5e9e636b5982ad))
* Fix make multiple snapshots (#30) ([a6b1200](https://github.com/bimdata/bcf-components/commit/a6b120077d172c6cbc2c07180664028903b0e7ff)), closes [#30](https://github.com/bimdata/bcf-components/issues/30)
* fix xlsx download extension ([95bee28](https://github.com/bimdata/bcf-components/commit/95bee28fb7e04e34b8452f9b5ba4291ef740c4e9))
* fix xlsx download extension ([735ea25](https://github.com/bimdata/bcf-components/commit/735ea25f9db8e383143779e313cbe352a1beaed7))
* fix: bcf filter button icon ([e11a1c5](https://github.com/bimdata/bcf-components/commit/e11a1c53251ef1abdb8d2b113a6f5154f93c4b83))
* fix: set topic models properly on topic creation (#32) ([492c0c3](https://github.com/bimdata/bcf-components/commit/492c0c3b329edf519b0876d7f0d901c8f6708026)), closes [#32](https://github.com/bimdata/bcf-components/issues/32)
* fix: use null as default value for  when not injected ([211746d](https://github.com/bimdata/bcf-components/commit/211746de686236d62a2258756e7d489bdc19ae75))
* Fix/add empty props (#33) ([4574cf6](https://github.com/bimdata/bcf-components/commit/4574cf67154b533292033c8341c425ae1861a113)), closes [#33](https://github.com/bimdata/bcf-components/issues/33)
* Fix/use standalone icons (#24) ([3d79bf4](https://github.com/bimdata/bcf-components/commit/3d79bf4755454d3090db18def05c109b3955a735)), closes [#24](https://github.com/bimdata/bcf-components/issues/24)
* update DS version ([0191b80](https://github.com/bimdata/bcf-components/commit/0191b8053dbb6f391813f40dd886c281c378b118))

# [5.0.0](https://github.com/bimdata/bcf-components/compare/v4.1.3...v5.0.0) (2023-07-11)


### MAJOR

* chore: vue3 migration (#20) ([007e76a](https://github.com/bimdata/bcf-components/commit/007e76aff086cb05578b5451a9f72501e0e5d475)), closes [#20](https://github.com/bimdata/bcf-components/issues/20)

## [4.1.3](https://github.com/bimdata/bcf-components/compare/v4.1.2...v4.1.3) (2023-07-11)


### PATCH

* add panorama plugin ([c68c643](https://github.com/bimdata/bcf-components/commit/c68c64335f921685b8925d450a438560b286702a))

## [4.1.2](https://github.com/bimdata/bcf-components/compare/v4.1.1...v4.1.2) (2023-06-16)


### PATCH

* fix: little rewrite + some fixes ([79f8d16](https://github.com/bimdata/bcf-components/commit/79f8d1699d3113624b86be05b96c6c7183c6d09f))
* fix: use updateTopic instead of updateFullTopic api method ([4266e3a](https://github.com/bimdata/bcf-components/commit/4266e3a69bf8f3084cb23b434805e7254abba35d))
* refactor: rewrite parts of bcf-topic-form and add some comments ([b34c354](https://github.com/bimdata/bcf-components/commit/b34c354ef6f2d1cef94bafa64fbe204156c3726b))

## [4.1.1](https://github.com/bimdata/bcf-components/compare/v4.1.0...v4.1.1) (2023-05-10)


### PATCH

* chore(deps): update dependencies ([1c74eff](https://github.com/bimdata/bcf-components/commit/1c74eff2eaa4a5f05d163ec271c110174ed0321c))
* chore(i18n): Update en.json (POEditor.com) ([6ed27f6](https://github.com/bimdata/bcf-components/commit/6ed27f6f42dd9d41a098d3261f87319b35a56b3e))
* rights UI enhancement ab (#22) ([27a9d10](https://github.com/bimdata/bcf-components/commit/27a9d100c8aa27e94bb57447e3c3ff72464d9d89)), closes [#22](https://github.com/bimdata/bcf-components/issues/22)

# [4.1.0](https://github.com/bimdata/bcf-components/compare/v4.0.0...v4.1.0) (2023-04-25)


### MINOR

* add 'view-comment-snapshot' event for open snapshot in modal in Platform project (#17) ([9e7a63b](https://github.com/bimdata/bcf-components/commit/9e7a63bd65dcd68a6552b4a385c161d3c3e64d04)), closes [#17](https://github.com/bimdata/bcf-components/issues/17)
* Feature/add import export bcf (#19) ([5296bd3](https://github.com/bimdata/bcf-components/commit/5296bd3502601b0ba682c11ba92d528ed9976b1b)), closes [#19](https://github.com/bimdata/bcf-components/issues/19)
* Feature/snapshot comment bcf (#15) ([d6f73cb](https://github.com/bimdata/bcf-components/commit/d6f73cbbb4888937c196134664df93471d52111d)), closes [#15](https://github.com/bimdata/bcf-components/issues/15)
* Fix/snapshot comment bcf (#16) ([5077dbe](https://github.com/bimdata/bcf-components/commit/5077dbec3bb155f078d404b2b15d1afe1861c731)), closes [#16](https://github.com/bimdata/bcf-components/issues/16)

### PATCH

* chore: update dependencies ([bab8262](https://github.com/bimdata/bcf-components/commit/bab8262c3d5216f890a1dd37e82105cb40d877e0))
* display carriage return for topic description (#13) ([fab1271](https://github.com/bimdata/bcf-components/commit/fab1271c0c3685e8fc8ecdf247ec3a1977438af8)), closes [#13](https://github.com/bimdata/bcf-components/issues/13)
* fix bcf snapshots into bcf topic comments view (#21) ([9d91643](https://github.com/bimdata/bcf-components/commit/9d91643a2eb1bd049b1fbd3b835b2ccfe436814f)), closes [#21](https://github.com/bimdata/bcf-components/issues/21)
* fix DE translation ([9f5a26a](https://github.com/bimdata/bcf-components/commit/9f5a26aece45dfcd3cd70f2ef42021d964c813a2))
* fix snapshot_type ([962dae8](https://github.com/bimdata/bcf-components/commit/962dae833fd70b7034d6b22994f484bfdbe8d845))
* fix update comment when delete snapshot & update comment (#18) ([8e074e2](https://github.com/bimdata/bcf-components/commit/8e074e2879b4f4e75d9fe5070603d8db26fb4ff5)), closes [#18](https://github.com/bimdata/bcf-components/issues/18)
* fix: bcf-topic-card styles ([eeea00e](https://github.com/bimdata/bcf-components/commit/eeea00e29c4b8a4455bb00b7bf7ed6d0f8336191))
* fix: log error on topic deletion ([a7c4265](https://github.com/bimdata/bcf-components/commit/a7c4265b0f4970510c92859b96082e176a6e1fb2))
* fix(#12): bcf-filters, put close click handler on button instead of icon ([66307bd](https://github.com/bimdata/bcf-components/commit/66307bd0d6584636e910e4007d49b08440df98ff))
* fix(#14): use eachLimit callback form to ensure react/angular compatibility ([e1ad912](https://github.com/bimdata/bcf-components/commit/e1ad91283263e1cfab13480d471dc1497f5398de)), closes [#14](https://github.com/bimdata/bcf-components/issues/14)

# [4.0.0](https://github.com/bimdata/bcf-components/compare/v3.1.0...v4.0.0) (2023-01-25)


### MAJOR

* feat: seperate topics and viewpoints loading ([8c6eab7](https://github.com/bimdata/bcf-components/commit/8c6eab7b0a5a1b10efb3569738ef8435fca3e26f))

### PATCH

* delete "statut" or "priority" before data label (#11) ([4aa013a](https://github.com/bimdata/bcf-components/commit/4aa013aefadc93483e1dc0db96cb90008ae0d0c0)), closes [#11](https://github.com/bimdata/bcf-components/issues/11)
* feat(comments): load/handle comments in lib ([94d7342](https://github.com/bimdata/bcf-components/commit/94d734204353d7786a95e324e1e9cb3db2ab8ed8))
* fix: some style fix/refactoring ([be51cbc](https://github.com/bimdata/bcf-components/commit/be51cbc18b748b782fa2c95bdc3c9de0801e3fb4))
* fix(config): slice extensions array to avoid unwanted mutations ([4bdbd49](https://github.com/bimdata/bcf-components/commit/4bdbd49124f8883843e9093540e4a8e1d856fbc5))
* fix(form): add topicObjects to viewpoint components ([e7cf73d](https://github.com/bimdata/bcf-components/commit/e7cf73d002b2ececf2ded3e6edb5dc44da9781e9))
* Fix/filters and statistics (#10) ([0a9db9a](https://github.com/bimdata/bcf-components/commit/0a9db9a291bdd95442c9b7ac76d9a7d2faf0e532)), closes [#10](https://github.com/bimdata/bcf-components/issues/10)

# [3.1.0](https://github.com/bimdata/bcf-components/compare/v3.0.0...v3.1.0) (2022-12-20)


### MINOR

* Change label to take a picture in mobile or tablet device (#7) ([a947b7a](https://github.com/bimdata/bcf-components/commit/a947b7ae51c355a948d033676d4d852576fac3e9)), closes [#7](https://github.com/bimdata/bcf-components/issues/7)
* Feature/select topic (#8) ([fc324b8](https://github.com/bimdata/bcf-components/commit/fc324b88c799caeea00ccd07299b116a1ddc0771)), closes [#8](https://github.com/bimdata/bcf-components/issues/8)
* Feature/use date picker (#5) ([23931c0](https://github.com/bimdata/bcf-components/commit/23931c0c5e7b8839edeb12bf4fca3f1b61817e49)), closes [#5](https://github.com/bimdata/bcf-components/issues/5)

### PATCH

* delete format date in due date label (#6) ([3630601](https://github.com/bimdata/bcf-components/commit/3630601a07f46f2f05ff6ad747254c9b8792ad27)), closes [#6](https://github.com/bimdata/bcf-components/issues/6)
* feat: add point cloud viewpoint config ([d6646fc](https://github.com/bimdata/bcf-components/commit/d6646fcee5255324317440da063e9aa0edca3b8f))
* fix: rewrite topic selection feature ([07fc512](https://github.com/bimdata/bcf-components/commit/07fc5129c115c57470c3dfde13ef7f474ec69453))
* fix(config): update point cloud viewpoint config ([bbd9642](https://github.com/bimdata/bcf-components/commit/bbd9642cef35db971488e8fd4abfece97f32272f))
* Update en.json (POEditor.com) ([3cf588e](https://github.com/bimdata/bcf-components/commit/3cf588e2351fffa271aa98dd610a78213ee4ae4c))

# [3.0.0](https://github.com/bimdata/bcf-components/compare/v2.0.0...v3.0.0) (2022-10-12)


### MAJOR

* refactor: bcf-filters, change props ([826645f](https://github.com/bimdata/bcf-components/commit/826645fdf48e0028127370a3c0c40b1ab14e0c34))
* refactor: bcf-topic-form, change props and events + style improvements ([80be61d](https://github.com/bimdata/bcf-components/commit/80be61d243d6462355328a7b335dbaf0c121b29f))
* refactor: bcf-topic-overview, change props and events ([66b12fa](https://github.com/bimdata/bcf-components/commit/66b12faa659340eb3beda71f4d30b0dfa5dde3b2))
* refactor: change props and events + other fixes ([f531c50](https://github.com/bimdata/bcf-components/commit/f531c50a198ccbb28f1cdcc74f3a133c08bb34ec))
* refactor: replace api-client injection by service injection + some more improvements ([fef3b21](https://github.com/bimdata/bcf-components/commit/fef3b21b5063e4ddd049d892e69d462a4107d837))

### MINOR

* chore: add nl & no languages + update translation files ([2407776](https://github.com/bimdata/bcf-components/commit/24077767fde644d806d9c4f6fa6b431f8cdc9829))

### PATCH

* chore: change postinstall script into prebuild:vue2 ([dad0687](https://github.com/bimdata/bcf-components/commit/dad06874c2e7d26f47d3a7cbec34597e8f94994a))
* chore: update dependencies (with ncu) ([6c50813](https://github.com/bimdata/bcf-components/commit/6c50813fa081de295d909281b8ebde502485d9da))
* chore: update dependencies + fix dual build ([7f6d3cf](https://github.com/bimdata/bcf-components/commit/7f6d3cf00fbb3b9e2cc319b662f3bd39228f9206))
* chore: update readme and translations ([ab35bc9](https://github.com/bimdata/bcf-components/commit/ab35bc9795fa8cbcbcdf91f2404ce79b6983c8b2))
* chore(build): fix build scripts imports ([f7ab10e](https://github.com/bimdata/bcf-components/commit/f7ab10ee4cfad610095d127a6ed30d483a413ffe))
* fix: bcf-filters & bcf creation ([2ace73c](https://github.com/bimdata/bcf-components/commit/2ace73c456bda7531dfb3a8bfa6a942476f6e323))
* fix: bcf-settings styles ([df3073a](https://github.com/bimdata/bcf-components/commit/df3073a015a8db51daa50eb21040c6419d7fdc66))
* fix: package.json main/module fields + fix BcfSettingCard ([d576d4f](https://github.com/bimdata/bcf-components/commit/d576d4f1a3ca69a291dd6287be4380fa4a4c67ac))
* fix: viewpoints utils ([04b8b03](https://github.com/bimdata/bcf-components/commit/04b8b03e820d772f5b23fe217aed7f1c526e3d98))
* fix(pkg): add useService to exported functions ([e636315](https://github.com/bimdata/bcf-components/commit/e63631553ce42ea30b524818667c435c0fb862d2))
* fix(service): properly use apiClient getters to ensure requests are authenticated ([c97cba7](https://github.com/bimdata/bcf-components/commit/c97cba706ce61ef7b1e8f2ef23d0db9dd76e06d9))

# [2.0.0](https://github.com/bimdata/bcf-components/compare/v1.0.4...v2.0.0) (2022-08-05)


### chore

* update README ([f1dc29f](https://github.com/bimdata/bcf-components/commit/f1dc29f71d46978a65804b1217aa471f0ed20647))

### fix

* some style fixes ([afa1aeb](https://github.com/bimdata/bcf-components/commit/afa1aeb9d37156120e258cfe6908af39bb9e40be))

### MAJOR

* refactor: use snake_case fields instead of camelCase (#2) ([75916ff](https://github.com/bimdata/bcf-components/commit/75916ffef87b37af726327ae51ac01b19dd7c6ae)), closes [#2](https://github.com/bimdata/bcf-components/issues/2)

### MINOR

* chore: remove @vue/composition-api as a peer dependency and enforce vue >= 2.7 ([dd9037a](https://github.com/bimdata/bcf-components/commit/dd9037a43615b1d0182083c09a7356392e1d3c5a))
* feat: add vue2 plugin factory ([0b11aaf](https://github.com/bimdata/bcf-components/commit/0b11aaf9801f294f4327c2a20f75165b2e20907f))
* feat: expose topic utils in index.js ([e90a21d](https://github.com/bimdata/bcf-components/commit/e90a21d0ee5b5adab2f0e3130172d4276a3ecbdc))
* feat(form): use config on viewpoint creation ([3605cdf](https://github.com/bimdata/bcf-components/commit/3605cdfc5f198da0849e6463e00e51ce5e948e72))
* fix: use @vue/composition-api import instead of vuein user-avatar ([03d7db5](https://github.com/bimdata/bcf-components/commit/03d7db5effd78ff1fd7323be5f1d1a792786fe5b))
* refactor: merge BcfTopicCreate into BcfTopicForm ([557298e](https://github.com/bimdata/bcf-components/commit/557298ec6af1805dbbaa7fef4a03c4d735efb84b))
* refactor: rewrite filter, search and sort composables + BcfFilters component ([5f8db38](https://github.com/bimdata/bcf-components/commit/5f8db3801a7833d5ab1e0eb71e407fb9af582e2f))

### PATCH

* chore: export components individually ([34a5010](https://github.com/bimdata/bcf-components/commit/34a50103d983f516cb1ec1200a4b3051af0d2819))
* chore: put desighn-system in dev deps ([f79b8d1](https://github.com/bimdata/bcf-components/commit/f79b8d1a8d0516b2cff785d18d9fac5fb9518f20))
* chore: regenerate package-lock ([04f1030](https://github.com/bimdata/bcf-components/commit/04f10306e9b33dc81954fcd67b00ae0a9b311eb9))
* chore(i18n): update filters translations ([a42eb09](https://github.com/bimdata/bcf-components/commit/a42eb0945cde4eed45d68e6d08a3ed6b2d18b570))
* feat: add viewpoint icons to topic-overview ([a9c52dd](https://github.com/bimdata/bcf-components/commit/a9c52dda5fd66256ddb1ec7aece85c1c98f88bef))
* feat: improve bcf filters api ([daec4de](https://github.com/bimdata/bcf-components/commit/daec4de6bbbb0e73f7416888aefb1ec295d24332))
* feat: update bcf-topics-table ([d66a01a](https://github.com/bimdata/bcf-components/commit/d66a01a316b3aa5e791f5b719ac8be440743bfd2))
* feat: update topic overview and fix topics table translations ([6ae241e](https://github.com/bimdata/bcf-components/commit/6ae241ebb6123748a4984f50da6fa1b5e7a2bde4))
* feat(form): add models field to topic data ([60bb5c2](https://github.com/bimdata/bcf-components/commit/60bb5c2a505c2fc03cc127f89ca4671a57cfc6a6))
* feat(form): add viewer snapshots feature ([534c870](https://github.com/bimdata/bcf-components/commit/534c87011fc7ffdbc74c3c176b0472d3b6851161))
* feat(form): disable annotation button if no viewpoints ([cfaf51a](https://github.com/bimdata/bcf-components/commit/cfaf51ae96faa50f78203c4f6bb723179f87c810))
* feat(form): handle topic objects on create/update ([fde1fd1](https://github.com/bimdata/bcf-components/commit/fde1fd18d9dbbd6ada74a7ccc56e014718d7cd32))
* feat(form): standardize getViewpoint methods in BcfTopicSnapshots ([422432c](https://github.com/bimdata/bcf-components/commit/422432cf1dff3d07fb897a63f56bf59feec74323))
* feat(i18n): add de, es and it translations ([c525c56](https://github.com/bimdata/bcf-components/commit/c525c56d69780f955c04128edaa44b709cf79996))
* feat(table): make topics table customizable ([343b4cd](https://github.com/bimdata/bcf-components/commit/343b4cd966d485d2e7523ea676ec757ecfc95892))
* feat(table): show creation author when hovering avatar ([d559098](https://github.com/bimdata/bcf-components/commit/d5590989a6c89f48da95fdcc0b91e4c23d81f8b0))
* fix bcf-stats styles ([a616baa](https://github.com/bimdata/bcf-components/commit/a616baaed9209c98f9f9d15ed4ca100611c13e63))
* fix bcf-topic-form and bcf-topic-overview to handle objects properly ([6601fad](https://github.com/bimdata/bcf-components/commit/6601fad3fb65c38421cab85d391f1e35c4e4988e))
* fix some styles and translations ([6fd9bdc](https://github.com/bimdata/bcf-components/commit/6fd9bdccce8e84ce7240351061851d2b808939d0))
* fix: add es, de, it translations in i18n/index.js ([71dd20d](https://github.com/bimdata/bcf-components/commit/71dd20d4521a0eea719e24cbec3dd89d19525b06))
* fix: bcf views (#1) ([3f83f34](https://github.com/bimdata/bcf-components/commit/3f83f34e4a39a938b8ae00becc997dbe93053b18)), closes [#1](https://github.com/bimdata/bcf-components/issues/1)
* fix: bcf-topics-table date column ([5d8f2c8](https://github.com/bimdata/bcf-components/commit/5d8f2c84c10264fd8ebc76c8b4a069ea0a5a2f06))
* fix: display number of objects on topic card ([e915666](https://github.com/bimdata/bcf-components/commit/e915666f4a4eca51d56f823a482a33e4c506ad27))
* fix: remove 'Open in Viewer' button in viewer mode ([7e5f161](https://github.com/bimdata/bcf-components/commit/7e5f161bcce45cf54cf28a8c96df05e6dbc245c5))
* fix: reset viewpoints after creating topic ([85d7313](https://github.com/bimdata/bcf-components/commit/85d7313c49d5c0e1453b71fdace305af84929151))
* fix: update DS version to fix carousel ([b13f62f](https://github.com/bimdata/bcf-components/commit/b13f62f77189a97ee3914035e25849edfca943b7))
* fix: update DS version to fix select z-index ([1f0030c](https://github.com/bimdata/bcf-components/commit/1f0030cc68a8ef4f7186731e7f50dc9f0d97a621))
* fix(bcf-form): avoid errors due to snapshot update ([33cce0a](https://github.com/bimdata/bcf-components/commit/33cce0a05b45b435f3eb92162e3135a4e0bdfb41))
* fix(comment): reset comment on cancel ([90e4f3a](https://github.com/bimdata/bcf-components/commit/90e4f3ae0006fe03ae8a3849e19ec58187aae8eb))
* fix(filters): use 'nullLabel' prop on filter selector ([41aeb26](https://github.com/bimdata/bcf-components/commit/41aeb26d47037f97476faef2e056deaad3fb028b))
* fix(form): add objects/annotations count + remove date example + increase index cell size ([7b50fd3](https://github.com/bimdata/bcf-components/commit/7b50fd381fb0fc218028cdd778a5ee6abafbe31e))
* fix(form): annotation tooltip display ([30b1af5](https://github.com/bimdata/bcf-components/commit/30b1af526eae8fb9fae99c0827633867927da784))
* fix(form): avoid errors due to viewpoints without snapshot ([b48455f](https://github.com/bimdata/bcf-components/commit/b48455f5ea7c9b891d37d9a27748e3f88ee5e626))
* fix(form): disable annotation button if no viewpoints ([0a3e118](https://github.com/bimdata/bcf-components/commit/0a3e118f0023a0fc635012efa8ecaf3036d5347b))
* fix(form): edit objects / annotations events ([08e30ba](https://github.com/bimdata/bcf-components/commit/08e30ba7075f0e2f8892546b6d47f8693edc21de))
* fix(form): fix topic creation/update ([ca7f0a3](https://github.com/bimdata/bcf-components/commit/ca7f0a34f842a450025c4e957b45806fcc182f25))
* fix(form): make sure image viewpoints are always comes last ([eaf6a46](https://github.com/bimdata/bcf-components/commit/eaf6a4654f1aa8771085d8791ce04021f0ce4839))
* fix(form): preserve viewpoint objects visibility ([c46ac21](https://github.com/bimdata/bcf-components/commit/c46ac21af54afe4476277336a5b42a557e189b46))
* fix(form): remove snapshot of viewpoints to delete ([5ca32ad](https://github.com/bimdata/bcf-components/commit/5ca32ad944827316a50269c02c47d701bffc3bb4))
* fix(overview): colored priority name ([bbfaa5b](https://github.com/bimdata/bcf-components/commit/bbfaa5b18f776967830195fab67015cb993513e3))
* fix(snapshots): handle multiple viewers of the same type ([fee1286](https://github.com/bimdata/bcf-components/commit/fee1286a989a3bfb7d5de005985a712f29667d05))
* fix(styles): use (deprecated) ::v-deep selector to make it work with both vue2 and vue3 ([358ad12](https://github.com/bimdata/bcf-components/commit/358ad12331b81211c5ab81e4ded9fdd32a1c21f0))
* fix(table): handle long titles ([1b58cb2](https://github.com/bimdata/bcf-components/commit/1b58cb2e30909c91598e889aaf629245e5f67ca7))
* fix(table): use icon button for action cell ([38b7bda](https://github.com/bimdata/bcf-components/commit/38b7bda33b3fe8a238898120158bf4162271c197))
* fix(utils): use color functions from DS ([31b5194](https://github.com/bimdata/bcf-components/commit/31b51946909cff895b4d6c7e6ffe8e056df2355d))
* refactor comments, consider users as prefetched ([dc8b3ca](https://github.com/bimdata/bcf-components/commit/dc8b3ca70bc2a2999bc485372e2c942b5bc89c48))
* refactor: bcf-topic-form props/events rewording + sort viewpoints with 3D first ([ad50dd4](https://github.com/bimdata/bcf-components/commit/ad50dd45385c2e4618355642179904b0d77f142f))
* refactor: createtopic utils to get priority/status colors ([8dfcac0](https://github.com/bimdata/bcf-components/commit/8dfcac095da227e070e06afee7f2bf5bbaee3e1d))
* refactor(config): centralize viewpoint type definition + add some utils methods ([a3ba3fa](https://github.com/bimdata/bcf-components/commit/a3ba3fa394078dca4653b8dd160d1411fde698d1))

## [1.0.4](https://github.com/bimdata/bcf-components/compare/v1.0.3...v1.0.4) (2022-05-05)


### PATCH

* update doc + peerDeps + plugin config ([735251e](https://github.com/bimdata/bcf-components/commit/735251e417940c2154b185371c03868b176ff815))

## [1.0.3](https://github.com/bimdata/bcf-components/compare/v1.0.2...v1.0.3) (2022-05-05)


### PATCH

* try to fix release workflow ([87bae6a](https://github.com/bimdata/bcf-components/commit/87bae6ac12db7f33461d6f7525b00bc105277a1c))

## [1.0.2](https://github.com/bimdata/bcf-components/compare/v1.0.1...v1.0.2) (2022-05-05)


### PATCH

* align version ([a59c520](https://github.com/bimdata/bcf-components/commit/a59c5207c08a1c1ce62eb2e302dd17740a731603))

## [1.0.1](https://github.com/bimdata/bcf-components/compare/v1.0.0...v1.0.1) (2022-05-05)


### PATCH

* [test] update semantic-release config ([6af6383](https://github.com/bimdata/bcf-components/commit/6af6383d67aff00d8cbf62bd0ff77e0a674df929))

# 1.0.0 (2022-05-05)


### feat

* add api-client injection mechanism + some refacto ([cf1a071](https://github.com/bimdata/bcf-components/commit/cf1a07136da9a26a8d90a9b837de794a8255827c))
* add bcf state composable ([e9cdc39](https://github.com/bimdata/bcf-components/commit/e9cdc390c3f67a47a00d4a34bd6b056f3298e71c))
* add missing components and remove remaining state deps ([7a9b266](https://github.com/bimdata/bcf-components/commit/7a9b2660d4ee4aad80dc8d5d35b222a0955a8480))
* add vue3 plugin + handle i18n at lib level ([b127103](https://github.com/bimdata/bcf-components/commit/b1271031b7f803de99444f063bac0eea596d66b3))
* extract bcf components from platform ([9878753](https://github.com/bimdata/bcf-components/commit/9878753157db4ad03d3eb08e551fa921e1c3347d))
* rearrange bcf-topic-create and comment feature ([ba58f97](https://github.com/bimdata/bcf-components/commit/ba58f97f47d7ebda77cd014b1703e506a615031b))
* reduce component state coupling + some fix ([d66082f](https://github.com/bimdata/bcf-components/commit/d66082fb5d47f0d6b88438a704b92d706ea91f9b))
* test & fix bcf topic create/update/delete ([7d66669](https://github.com/bimdata/bcf-components/commit/7d66669837a110e0e29670ee77d4550e81fe0562))
* test & fix create/update/delete extensions ([26d64de](https://github.com/bimdata/bcf-components/commit/26d64de58fab9ea75644953aefdde2f11cd5324b))
* update/refactor components with latest features ([2caaaaa](https://github.com/bimdata/bcf-components/commit/2caaaaa1507bb3353a808ee319f389fa822d57b5))

### fix

* add latest mofifications ([de8b426](https://github.com/bimdata/bcf-components/commit/de8b426f065d9ee65ec631288c5f8ff1cea1a12f))
* bcf stats ([157eb49](https://github.com/bimdata/bcf-components/commit/157eb4989584762c813d22eae8a3ebddf58262c3))
* bcf-topics-table and cells ([22d04bc](https://github.com/bimdata/bcf-components/commit/22d04bc5817b0f933994756bff0b7663ecf28141))
* remove useless tag-input component ([470b245](https://github.com/bimdata/bcf-components/commit/470b245b049166d5778bfb09c73c8330023d8c8e))
* remove usless dependencies ([a2ddf1b](https://github.com/bimdata/bcf-components/commit/a2ddf1bd0a389ef55a2858f60933c4a42f170547))

### PATCH

* ci: add semantic release workflow (wip) ([36acf1f](https://github.com/bimdata/bcf-components/commit/36acf1f273572d5e54f2e6ed21ef5cbb3d875fd7))
