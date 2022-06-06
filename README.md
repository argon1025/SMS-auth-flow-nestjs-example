# SMS Auth-Flow Nestjs Example

## TOC

- [프로젝트 소개](#프로젝트-소개)
  - [프로젝트에 녹여낸 가치](#프로젝트에-녹여낸-가치)
  - [폴더 구조](#폴더-구조)
  - [최종 구현 사항](#최종-구현)
  - [개발 스택](#개발-스택)
  - [코드 컨벤션](#코드-컨벤션)
- [프로젝트 시작 방법](#프로젝트-시작-방법)
  - [1. Docker-compose 로컬 개발환경 시작](#1-프로젝트-폴더-이동-docker-compose-컨테이너-실행-redis-mysql)
  - [2. 패키지 설치](#2-패키지-설치)
  - [3. 환경설정 파일 구성](#3-환경설정-파일-구성)
  - [4. Prisma 동기화, Client 생성](#4-마이그레이션-동기화-및-prisma-client-생성)
  - [5. 앱 실행, Swagger 접속](#5-nestjs-앱-실행-및-swagger-document)
- [엔드포인트 및 로직 소개](#엔드포인트-소개-로직)
  - [POST : /auth/sms](#post--authsms)
  - [POST : /auth/sms/verification](#post--authsmsverification)
  - [PUT : /auth](#put--auth)
  - [PATCH : /auth/password](#patch--authpassword)
  - [POST : /auth/login](#post--authlogin)
  - [GET : /auth/access-token](#get--authaccess-token)
  - [GET : /customers/me](#get--customersme)
- [유효성 검사](#유효성-검사)
- [스키마 마이그레이션 기록](https://github.com/argon1025/SMS-assignment-nestjs/tree/main/prisma)

## 프로젝트 소개

### 프로젝트에 녹여낸 가치

- `좋은 코드`는 `읽기 쉬운 코드`라고 생각합니다
- 좋은 코드에 왕도는 없습니다
- 나의 시야를 다른 사람과 공유하기위해 노력합니다
- 객체 간 역할별로 폴더를 구성하고 객체 간 역할에 맞는 책임을 부여해야합니다

### 폴더 구조

```
.
├── library
│   ├── constant
│   ├── cookie
│   ├── crypto
│   ├── date
│   ├── decorator
│   ├── exception
│   ├── guard
│   ├── jwt
│   ├── prisma
│   ├── redis
│   ├── sms
│   └── swagger
├── prisma
├── src
│   ├── aurh
│   └── customers
└── ...
```

`library` -> 공유 가능한 객체들  
`prisma` -> prisma 기본 파일, migration 기록 저장  
`src` -> 도메인 로직

### 최종 구현

- SMS 인증 번호 요청
- SMS 인증
- 회원 가입
- 비밀번호 찾기(변경)
- 로그인
- 액세스 토큰 발급
- 내 정보 조회

[엔드포인트 및 로직 소개](#엔드포인트-소개-로직)에서 자세히 보실 수 있습니다

### 개발 스택

다음 기술 스택을 사용했습니다

- TypeScript/NestJS(Express)
- MySQL/Prisma
- Redis
- Docker-compose
- Swagger(OpenAPI 3.0)
- JWT

### 코드 컨벤션

아래 코드 컨벤션을 정하고 지켜나갔습니다

- 패키지 매니저는 `Yarn`을 사용합니다
  - `Package.json`, `lock` 내 패키지 정보는 절대로 직접 수정하지 않습니다
  - 패키지를 추가할 때 단일 커밋으로 커밋합니다
- 커밋 관리
  - [conventionalcommits](https://www.conventionalcommits.org/ko/v1.0.0-beta.4/)을 준수합니다
  - Linear History -> `Squash Merge`를 사용해서 커밋 히스토리를 관리했습니다
- 네이밍 컨벤션
  - 폴더 컨벤션은 `NestJS(angular)`에서 정한 케밥 케이스를 준수합니다
  - 클래스, 인터페이스는 `PascalCase`, 메서드는 `camelCase`를 준수합니다
- ESLint
  - `Airbnb Rule`을 준수합니다
- tsConfig.ts
  - `Strict` 모드를 준수합니다
  - 각 객체 레이어 사이에는 반드시 `typeSafe` 해야합니다
- DTO
  - 요청, 응답에 대해서 `DTO`를 사용하고 알맞은 `Validation` 및 `직렬화`, `역직렬화` 프로세스를 거쳐야 합니다
  - 서비스, 레포지토리 레이어에서는 `DTO` 대신 객체 리터럴로 타입을 명시합니다
- Exception
  - 익셉션에는 국가별 정의 메시지를 구성해야 합니다
  - 사전 정의되지않은 에러에 대해 사용자에게 에러에 대한 상세 정보를 노출하지 않고 내부 로깅(모니터링) 하도록 합니다
- Swagger
  - 모든 엔드포인트를 Swagger 문서에서 볼 수 있도록 Controller, DTO를 구성합니다
  - 요청, 응답에 대해서 `정확한 타입`을 명시합니다
    - openapi generator를 사용해서 SDK를 생성할 수 있게 구성합니다
- Import는 다음과 같이 정리합니다

```
{Module} -> NestJS 또는 패키지 모듈
// -> Enter!
{library} -> 프로젝트에서 생성한 라이브러리
// -> Enter!
{DTO, Type} -> 프로젝트에서 구성한 DTO, Type
```

## 프로젝트 시작 방법

프로젝트를 로컬 환경에서 시작하는 방법에 관해서 설명합니다

### 1. 프로젝트 폴더 이동, Docker-compose 컨테이너 실행 (Redis. MySQL)

프로젝트를 시작하기 위해서는 개발 환경이 명시되어 있는 Docker를 통해서 로컬 개발환경을 시작할 수 있습니다  
이 프로젝트에서는 MySQL, Redis가 `Docker-compose`로 구성되어 있습니다

```
$ cd ./ably-assignment-nestjs
$ docker-compose up
```

컨테이너가 정상적으로 실행되었을 경우 다음으로 넘어갑니다

> MySQL 데이터는 프로젝트 폴더 `./docker/mysql/mysql-data`에 저장됩니다

### 2. 패키지 설치

```
$ yarn install
```

### 3. 환경설정 파일 구성

프로젝트 루트 폴더에 `.local.env` 파일을 열어 요구사항에 맞게 수정합니다

> 프로젝트 루트 폴더에 이미 구성된 파일이 있기 때문에 해당 섹션을 생략해도 무방합니다

> 실제 배포할 때 AUTH_COOKIE_SECURE 옵션을 반드시 활성화해야 합니다

```
# ##########################################
# App & Database
# NestJS앱, 데이터베이스 설정
# ##########################################
DATABASE_URL="mysql://root:root@localhost:3306/ably?connect_timeout=100&pool_timeout=100&socket_timeout=100"
SERVER_PORT=80

# ##########################################
# Redis
# 레디스 스토리지 설정
# ##########################################
REDIS_HOST=localhost
REDIS_PORT=6379

# ##########################################
# crypto
# 암호화 설정
# ##########################################
SALT_ROUND=10

# ##########################################
# AuthToken
# 회원 가입, 수정에만 사용할 수 있는 토큰
# ##########################################
# 토큰 설정
JWT_AUTH_SECRET_KEY=1q2w3e4r
JWT_AUTH_EXPIRES_IN=30m
# 쿠키 설정
AUTH_COOKIE_HTTP_ONLY=true
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_PATH=/
AUTH_COOKIE_DOMAIN=localhost
AUTH_COOKIE_MAX_AGE=1800000
AUTH_COOKIE_SAME_SITE=strict

# ##########################################
# RefreshToken
# 리프래시 토큰 발급에 사용할 수 있는 토큰
# ##########################################
# 토큰 설정
JWT_REFRESH_SECRET_KEY=4r3e2w1q
JWT_REFRESH_EXPIRES_IN=1d
# 쿠키 설정
REFRESH_COOKIE_HTTP_ONLY=true
REFRESH_COOKIE_SECURE=false
REFRESH_COOKIE_PATH=/
REFRESH_COOKIE_DOMAIN=localhost
REFRESH_COOKIE_MAX_AGE=86400000
REFRESH_COOKIE_SAME_SITE=strict

# ##########################################
# AccessToken
# 액세스 토큰 발급에 사용할 수 있는 토큰
# ##########################################
# 토큰 설정
JWT_ACCESS_SECRET_KEY=1a2s3d4f
JWT_ACCESS_EXPIRES_IN=10m


# ##########################################
# SMS Verification
# 문자 인증 설정
# ##########################################
REDIS_VERIFICATION_KEY=VERIFICATION
REDIS_VERIFICATION_TTL=180
```

### 4. 마이그레이션 동기화 및 Prisma Client 생성

```
$ yarn prisma:migrate:local
```

`Prisma` 스키마 및 마이그레이션 기록을 로컬 환경과 Sync 합니다
이 과정에서 Prisma Client도 함께 생성됩니다

### 5. NestJS 앱 실행 및 Swagger Document

```
$ yarn start:local
$ yarn start:local:watch
$ yarn start:local:degub
```

<img width="474" alt="image" src="https://user-images.githubusercontent.com/55491354/165271241-8fd803fd-e496-4567-877e-36635f8d4140.png">

[localhost/api](http://localhost/api) 에서 엔드포인트 및 DTO를 확인할 수 있습니다

## 엔드포인트 소개, 로직

### POST : /auth/sms

<img width="443" alt="image" src="https://user-images.githubusercontent.com/55491354/165262364-93d6de58-ee84-41e0-86b8-e1a0433de7e6.png">

회원가입 및 비밀번호 찾기(변경)를 위해 휴대폰 SMS 인증을 요청합니다

- `Redis`에서 인증번호와 만료 시간을 관리합니다
- `SMS` 전송은 `./library/sms` 서비스에서 담당하며 실제로 SMS를 전송하지 않고 Logger를 통해서 인증번호를 확인할 수 있습니다
- <img width="662" alt="image" src="https://user-images.githubusercontent.com/55491354/165282785-47d5b93a-9c70-4b3a-a3ea-60502446a0c5.png">

### POST : /auth/sms/verification

<img width="642" alt="image" src="https://user-images.githubusercontent.com/55491354/165263164-767bb78b-92e1-424c-9373-55814ec67c5b.png">

SMS 인증번호를 검증하고 성공 시 `AuthToken`을 `httpOnly` 쿠키로 받습니다

### PUT : /auth

<img width="490" alt="image" src="https://user-images.githubusercontent.com/55491354/165263388-86789045-11cc-4446-af0c-6224e2303e09.png">

`AuthToken`의 유효성을 검증한 후 회원가입을 진행합니다

### PATCH : /auth/password

<img width="483" alt="image" src="https://user-images.githubusercontent.com/55491354/165263587-76e7249c-754a-42fc-8808-2f8f503e3b67.png">

`AuthToken`의 유효성을 검증한 후 비밀번호를 변경합니다

### POST : /auth/login

<img width="536" alt="image" src="https://user-images.githubusercontent.com/55491354/165263732-661e06ea-8c89-4bef-aca8-b583261c2df3.png">

유니크 데이터(`nickname`, `email`, `phone`)로 로그인을 시도할 수 있습니다

로그인 성공 시 `RefreshToken`을 `httpOnly` 쿠키로 받습니다

### GET : /auth/access-token

<img width="445" alt="image" src="https://user-images.githubusercontent.com/55491354/165264365-6fb483fe-172e-4865-8d45-32b459aebe7d.png">

`RefreshToken`을 검증 후 `AccessToken`을 Body응답으로 수신합니다

<img width="174" alt="image" src="https://user-images.githubusercontent.com/55491354/165264586-a9dc8ef8-c43f-45ec-a6f6-108b83538a24.png">

받은 `AccessToken`을 `Swagger`에서 테스트하기 위해서는 `Swagger` 문서 상단 `Authorize` 에서 토큰을 등록해야 합니다

AccessToken은 Bearer인증방식을 사용하고 `Authorization: Bearer ${accessToken}` 형태로 전달합니다 [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750)

### GET : /customers/me

<img width="466" alt="image" src="https://user-images.githubusercontent.com/55491354/165264830-2b5412f5-6593-4c84-95ed-71012c2f695a.png">

`AccessToken`을 검증 후 유저 정보를 반환합니다

# 유효성 검사

데이터 유효성 검사는 `Class-validation`으로 진행하며 각 정책에 대해서는  
`Swagger DTO` 또는 소스코드 `DTO`를 열람하셔야합니다

- phone
  - 000-0000-0000 형식만 가능합니다
  - 유니크 합니다
- nickname
  - 영어 또는 한국어 텍스트만 가능합니다
  - 유니크 합니다
- email
  - 이메일 형식만 가능합니다
  - 유니크합니다
- name
  - 문자열만 가능합니다
  - 중복을 허용합니다

# 스키마 마이그레이션 기록

이 프로젝트에서는 Prisma migration으로 스키마를 업데이트, 관리합니다  
[이곳](https://github.com/argon1025/SMS-assignment-nestjs/tree/main/prisma) 에서 마이그레이션 기록을 열람할 수 있습니다
