---
title: Frontend 개발환경의 이해와 웹팩 기본
date: "2020-08-28T17:00:00.000Z"
description: "프론트엔드 개발환경의 이해와 웹팩 기본"
tags: ["개발", "webpack", "nodejs"]
---

# 프론트엔드 개발환경의 이해

- `package.json`의 `"main": "index.js"`는 **node 서버 개발 환경**에서 사용하는 것이므로 무시해도 된다.
- `"react": "^16.13.1"`
  - 유의적 버전(Sementic Version)이다. 버전 번호를 관리하기 위한 규칙 체계
  - 주 버전 / 부 버전 / 수 버전
  - 틸트(~)는 마이너 버전이 명시되어 있으면 패치버전을 변경한다.
    - ~1.2.3 표기는 1.2.3부터 1.3.0미만 까지를 포함한다.
    - ~0 표기는 0.0.0부터 1.0.0미만 까지를 포함한다.
      - 정식 버전 직전까지 설치됨
  - 캐럿(^)은 정식버전에서 마이너와 패치 버전을 변경한다.
    - ^1.2.3 표기는 1.2.3부터 2.0.0 미만 까지를 포함한다.
    - 정식버전 미만인 0.x 버전은 패치만 갱신한다.
    - ^0 표기는 0.0.0부터 0.1.0 미만까지를 포함한다.
      - 이유: 라이브러리 정식 릴리즈 전에는 패키지 버전이 수시로 변하면서 부버전(0.1→0.2)이 변하더라도 하위 호환성을 안 지키고 배포하는 경우가 빈번하므로.
    - ^0.0 으로 설치 시 react의 경우 0.0.3까지 설치된다.
- `npm view <패키지명> versions` 명령어를 통해 패키지의 모든 버전을 볼 수 있다.

---

# 웹팩(기본)

전역 함수 → 전역 스코프 오염

IIFE → 즉시 실행 함수 표현 (독립적인 스코프 생성됨)

```jsx
var math = math || {}

;(function() {
  function sum(a, b) {
    return a + b
  }

  math.sum = sum
})()
```

CommonJS

- 모든 환경이 목표
- `exports function ~`문법 사용

AMD (Asyncronous Module Definition)

- 브라우저처럼 외부에서 비동기적으로 로딩해야 하는 경우 사용

UMD (Universal Module Definition)

- AMD기반으로 CommonJS 방식까지 지원하는 통합 형태다.

→ 각자의 스펙을 제안하다가 ES2015에서 표준 모듈 시스템을 내 놓았다. 지금은 바벨과 웹팩을 이용해 모듈 시스템을 사용하는 것이 일반적이다.

**ES2015**

→ `export function sum(a, b) { }`

- 모듈 생성

→ `import * as math from './math.js';`

- 가져오기

강사님은 간단한 서버를 돌릴 때 `lite-server`를 쓰신다. (`npx lite-server`)

- 이게 괜찮은 게 라이브 핫 리로딩 비스무리한걸 지원해준다. (내용 변하면 새로고침 지원)

---

# 웹팩 (설치 및 실습)

`npm install -D webpack webpack-cli`

`node_modules/.bin/webpack --help`

- [필수] —mode 옵션: 개발환경 (개발모드, 프로덕션모드)
- [필수] —entry 옵션: 모듈의 시작점
- [필수] —output 옵션: 웹팩이 모든 모듈들을 하나로 합치고 저장하는 경로 설정

실습:

`node_modules/.bin/webpack --mode development --entry ./src/app.js --output dist/main.js`

```jsx
// webpack.config.js
const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"), // 절대 경로가 필요하면 다음과 같은 모듈 사용
    filename: "[name].js", // entry가 여러 개일 경우 output 이름을 여러 개 만들려고 동적 지정
    // 여기서는 main.js 생김 (entry의 main key와 매칭됨)
  },
}
```

---

# 로더

로더의 역할 : 웹팩은 모든 파일을 모듈로 바라본다. 스타일시트, 이미지, 폰트까지...

- 그래서 `import` 구문을 사용해서 자바스크립트 코드 안으로 가져올 수 있다.

커스텀 로더 만들기

```jsx
/**
 * @param content test에 걸린 파일의 내용물
 */
module.exports = function myWebpackLoader(content) {
  console.log("** 마이로더 동작")
  return content
}
```

```jsx
const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 로더가 처리해야 할 파일의 패턴 (js확장자를 가진 모든 것)
        use: [path.resolve("./my-webpack-loader.js")],
      },
    ],
  },
}
```

## 자주 사용되는 로더

css-loader

- css파일을 모듈로 바꿔버린다.
- `npm install css-loader`
- 그러나 이거만 쓰면 브라우저에 적용이 안 된다!
  - html이 dom으로 변해야 브라우저에서 보이듯이,
  - css코드도 css-om 형태로 바뀌어야 보인다.
  - 그래서 html에서 css를 불러오려면 css코드를 직접 불러오거나 인라인 처리를 해야 한다.

style-loader

- javascript로 변환된 style코드를 html에 넣어준다.

```jsx
const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 로더가 처리해야 할 파일의 패턴
        use: ["style-loader", "css-loader"], // 해석 순서는 뒤에서부터 앞이다!! 주의
      },
    ],
  },
}
```

file-loader

- css뿐만 아니라 소스코드에서 사용하는 모든 파일을 모듈로 사용하게끔 할 수 있다. 파일을 모듈 형태로 지원하고, 웹팩 아웃풋에 파일을 옮겨주는 것이 file-loader가 하는 일이다. 가령 CSS에서 url() 함수에 이미지 파일 경로를 지정할 수 있는데 웹팩은 file-loader를 이용해서 이 파일을 처리한다.

```jsx
{
        test: /\.png$/,
        loader: "file-loader",
        options: {
          publicPath: "./dist/", // 파일 로더가 처리하는 파일을 모듈로 사용했을 때 경로 앞에 추가되는 문자열
          name: "[name].[ext]?[hash]", // 원본 파일명과 확장자, 해쉬 무력화를 위해 hash를 쿼리에 붙임
        },
        // use: ["file-loader"],
      },
```

url-loader

- 사용하는 이미지 갯수가 많다면 네트웤 리소스를 사용하는 부담이 있고 사이트 성능에 영향을 줄 수 있음.
- 한 페이지에서 작은 이미지가 여러 번 사용된다면 Data URI Scheme을 이용하는 방법이 더 낫다. 이미지를 Base64로 인코딩하여 문자열 형태로 소스코드에 넣는 형식이다. url-loader는 이러한 처리를 자동화해 준다.

```jsx
{
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: "url-loader",
        options: {
          publicPath: "./dist/",
          name: "[name].[ext]?[hash]",
          limit: 20000,
        },
      },
```

---

# 플러그인

플러그인의 역할

- 로더가 파일 단위로 처리하는 반면 플러그인은 번들된 결과물을 처리한다. 번들된 자바스크립트를 난독화한다거나 특정 텍스트를 추출하는 용도로 사용한다.

커스텀 플러그인 만들기

- 웹팩 문서의 writing-a-plugin 문서를 보자
- 클래스로 정의됨

```jsx
class MyPlugin {
  // 웹팩은 compiler라는 객체를 주입해 준다.
  apply(compiler) {
    compiler.hooks.done.tap("My Plugin", stats => {
      console.log("MyPlugin: done")
    })
  }
}

module.exports = MyPlugin
```

그러면 어떻게 번들 결과에 접근할 수 있을까? 웹팩 내장 플러그인 BannerPlugin 코드를 참고하자.

```jsx
const { compilation } = require("webpack")

class MyWebpackPlugin {
  // 웹팩은 compiler라는 객체를 주입해 준다.
  apply(compiler) {
    // 플러그인이 종료되었을 때 실행
    compiler.hooks.done.tap("My Plugin", stats => {
      console.log("MyPlugin: done")
    })

    // 웹팩이 번들링한 결과물을 가져올 수 있다.
    compiler.plugin("emit", (compilation, callback) => {
      const source = compilation.assets["main.js"].source()
      // console.log(source);
      // 번들한 결과물에 내용을 추가
      compilation.assets["main.js"].source = () => {
        const banner = [
          "/**",
          " * 웹팩으로 빌드했습니다. ",
          " * Built Date: " + new Date().toLocaleDateString(),
          " */",
        ].join("\n")
        return banner + "\n\n" + source
      }
      callback()
    })
  }
}

module.exports = MyWebpackPlugin

// 이렇게 하면 빌드 결과물 상단에 주석이 추가된다.
```

---

# 자주 사용하는 플러그인

BannerPlugin

- 아까 만든거랑 비슷한거

```jsx
const webpack = require("webpack")

module.exports = {
  // ...
  plugins: [new webpack.BannerPlugin({ banner: "이것은 배너입니다." })],
}
```

DefinePlugin

- 어플리케이션은 개발환경과 운영환경으로 나눠서 운영한다. 환경에 따라 api가 다를 수 있다든지, 환경 의존적인 정보를 소스가 아닌 곳에서 관리하는 것이 좋다.

```jsx
const webpack = require("webpack")

module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({}), // 빈 객체를 전달해도 기본적으로 넣어주는 값이 있다.
    // process.env.NODE_ENV이다. 웹팩 설정의 mode에 설정한 값이 여기에 들어간다.
    // development를 설정했기 때문에, 코드에서 process.env.NODE_ENV 변수로 접근하면
    // "development" 값을 얻을 수 있다.
  ],
}
```

```jsx
new webpack.DefinePlugin({
      TWO: "1+1", // 1+1 이라는 코드 조각이 들어간다. eval같은거네?
			THREE: JSON.stringify("1+1+1") // 문자열로 들어감
    }),
```

HtmlTemplatePlugin

- HTML파일을 후처리하는데 사용한다. 빌드 타임의 값을 넣거나 코드를 압축할 수 있다.

```bash
$ npm install -D html-webpack-plugin
```

이 플러그인으로 빌드하면 HTML파일로 아웃풋에 생성될 것이다. index.html → src/index.html로 옮긴 뒤 다음과 같이 작성.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>타이틀</title>
  </head>
  <body>
    <!-- 로딩 스크립트 제거 -->
  </body>
</html>
```

```jsx
new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? " (개발)" : " (프로덕션)",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
```

하고

```bash
$ NODE_ENV=development npm run build
```

로 환경변수 지정 후 실행하기

CleanWebpackPlugin

- 빌드 이전 결과물 제거하는 플러그인

MiniCssExtractPlugin

- 스타일시트가 점점 많아지면 하나의 자바스크립트 결과물로 만드는 것이 부담일 수 있다. 번들 결과에서 스타일시트 코드만 뽑아서 별도의 CSS파일로 만들어 역할에 따라 파일을 분리하는 것이 좋다. 브라우져에서큰 파일 하나를 내려받는 것보다, 여러 개의 작은 파일을 동시에 다운로드하는 것이 더 빠르다.
- 개발 환경에서는 css를 하나의모듈로 처리해도 상관없지만, 프로덕션 환경에서는 분리하는 것이 효과적이다. MiniCssExtractPlugin은 CSS별로 파일로 뽑아내는 플러그인이다.

```bash
{
        test: /\.css$/, // 로더가 처리해야 할 파일의 패턴
        use: [
          process.env.NODE_ENV === "production" // 미니 css익스트랙트를 사용해야할땐 스타일로더 대신 자체 제공된 로더 씀
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },

...

new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: "[name].css" })]
      : []), // 얘는 로더 설정도 추가해야 한다.
```
