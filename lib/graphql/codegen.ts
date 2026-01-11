import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://shopify.dev/storefront-graphql-direct-proxy/2026-01",
  //documents: "src/graphql/**/*.graphql",
  ignoreNoDocuments: true,
  generates: {
    "./lib/graphql/shopify.schema.graphql": {
      plugins: ["schema-ast"],
    },
    "./lib/graphql/shopify.schema.ts": {
      plugins: ["typescript"],
      config: {
        rawRequest: true,
      },
    },
    "./lib/graphql/": {
      preset: "near-operation-file",
      documents: "./lib/graphql/**/*.graphql",
      presetConfig: {
        extension: ".graphql.ts", // output file will be "somefile.interface.ts" when it finds `somefile.interface.graphql`
        baseTypesPath: "shopify.schema.ts",
      },
      plugins: ["typescript-operations", "typescript-graphql-request"],
    },
    // "lib/graphql/": {
    //   preset: "near-operation-file",
    //   documents: "lib/graphql/**/*.graphql",
    //   presetConfig: {
    //     extension: ".generated.ts", // 쿼리 옆에 생성될 파일 확장자
    //     baseTypesPath: "../schema.generated.ts", // 스키마 타입 참조 경로
    //     allowPartialOutput: true
    //   },
    //   plugins: [
    //     "typescript-operations",
    //     "typescript-graphql-request",
    //   ],
    //   config: {
    //     rawRequest: true,
    //     // 👇 .graphql 파일에서 DocumentNode를 직접 가져옴
    //     documentMode: "external",
    //     importDocumentNodeExternallyFrom: "near-operation-file",
    //     allowPartialOutput: true
    //   },
  },
};

export default config;
