# Core3 electron publisher action

1. Generate electron packages with custom features and custom configurations
2. Publish generated packages to shared locations ,locally and in ci
3. Build wcs-electron with specific version (distTag) of component studio npm package
4. Name packages differently.
5. Where do i get names of features

Ask why next is disabled


npx @wxiplosives/publish-electron publish --feature feature1 --featureCfg featureCfg --buildTag 8.0.0-beta1 --publish s3 


npx @wxiplosives/publish-electron build --feature feature1 --featureCfg featureCfg --buildTag 8.0.0-beta1 

npx @wxiplosives/publish-electron  --feature feature1 --featureCfg featureCfg --buildTag 8.0.0-beta1 