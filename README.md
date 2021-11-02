## 소개
[프리온보딩 백엔드 코스](https://www.wanted.co.kr/events/pre_onboarding_course_4) 1주차 과제 입니다.

## **팀 구성원**

### 이현준(팀장)

- 개발 환경 셋팅
- 개발 일정 관리
- 회원가입
- 로그인
- 로그아웃
- 댓글 - 조회, 등록, 삭제
- 대댓글 - 조회, 등록, 삭제
- 배포

### 박상현

-

### 정진산

- 게시글 조회, 등록, 수정, 삭제,검
- mongoDB세팅
- schema 정의
- 미들웨어(jwt) 인증 구현
- 배포

### 김태련

- 게시글 조회 및 검색
- 게시글 조회수

#### 공통

- 디비설계, READNE.md 작성

## **디비 설계**
![](https://github.com/lhj0621/imagetemp/blob/master/2021-11-03%2004;10;50.PNG?raw=true)

## **과제 내용**

- 유저 생성, 인증, 인가 처리 (게시글 수정, 삭제 부분은 인가된 사용자만 가능)
- 게시글 카테고리
- 게시글 검색
- 대댓글(1 depth)
  - 대댓글 pagination
- 게시글 읽힘 수
  - 같은 User가 게시글을 읽는 경우 count 수 증가하면 안 됨
- Rest API 설계
- Unit Test
- 1000만건 이상의 데이터를 넣고 성능테스트 진행 결과 필요

## **기술스택**

- node.js, typescript, express, mongoDB

## **배포주소**

- https://nodeswork-boards-server.herokuapp.com/

## **기능구현**

- 유저 생성, 인증, 인가 처리 (게시글 수정, 삭제 부분은 인가된 사용자만 가능) - _완료_
- 게시글 카테고리 - _완료_
- 게시글 검색 - _완료_
- 대댓글(1 depth) - _완료_
  - 대댓글 pagination - _완료_
- 게시글 읽힘 수 - _완료_
  - 같은 User가 게시글을 읽는 경우 count 수 증가하면 안 됨 - _완료_
- Rest API 설계 - _완료_
- Unit Test - _미완료_
- 1000만건 이상의 데이터를 넣고 성능테스트 진행 결과 필요 - _미완료_

## **설치 및 실행 방법**

```
// 레포지토리 클론
git clone https://github.com/lhj0621/nodeswork_boards_server.git
// 디렉토리 변경
cd nodeswork_boards_server
// 종속성 설치
npm install
// 실행
npm start
```

## <mark>API 테스트 방법

### 포스트맨 doc
#### [링크](https://documenter.getpostman.com/view/15323948/UV5ddEGU)
  
### USERS

회원가입, 로그인, 로그아웃을 담당합니다.

#### 1. POST /users

##### request

```javascript
{
  email: "kimcheol@g.com",
  password: "testpassword",
  name: "김철"
}
```

##### response

```javascript
{
  "message": "가입이 완료되었습니다.",
  "data": {
    "email": "kimcheol@g.com",
    "password": "$2b$10$3s8hAR.DcJnaYD1EbBum9usL/GJxlO3DXgOiyRS8yMF9jBnjjvjqi",
    "name": "김철",
    "deleted_at": null,
    "_id": "6181692768f70d7bcec5de04",
    "created_at": "2021-11-02T16:36:55.995Z",
    "updated_at": "2021-11-02T16:36:55.995Z",
    "__v": 0
  }
}
```

#### 2. POST /users/signin

##### request

```javascript
{
  email: "kimcheol@g.com",
  password: "testpassword",
}
```

##### response

```javascript
{
  "message": "로그인이 완료되었습니다."
}
```

#### 3. DELETE /users/signout

요청, 응답이 없습니다.

### BOARDS

게시글 목록 조회, 게시글 조회, 생성, 수정, 삭제를 담당합니다.

#### 1. GET /boards

##### request

입력은 쿼리로 수행합니다.

- limit: 한 번에 출력할 게시글의 최대 개수
- page: 조회할 페이지 장
- title(선택): 게시글의 제목
- contents(선택): 게시글의 내용

##### response

```javascript
{
  "count": 1,
  "data": [
    {
      "_id": "6180dd79c31866817d323fcc",
      "title": "test11",
      "contents": "zz",
      "created_at": "2021-11-02T06:40:57.451Z",
      "view_cnt": 0,
      "comments_cnt": 0,
      "user_name": "김철"
    }
  ]
}
```

#### 2. GET /boards/:board_id

##### request

입력은 게시글의 `_id`를 board_id 파라미터로 작성하여 요청합니다.

##### response

```javascript
{
  "_id": "6180a767248e314deac39bec",
  "title": "board@a.com",
  "contents": "test",
  "created_at": "2021-11-02T02:50:15.887Z",
  "comments_array": [
    "61814e0f0cdc3f8d91edccd8",
    "6181600765fca41f325bf453"
  ],
  "view_cnt": 5,
  "comments_cnt": 2,
  "user_name": "김철",
  "comments": [
    {
      "_id": "61814e0f0cdc3f8d91edccd8",
      "contents": "댓글 1",
      "answers_array": [],
      "created_at": "2021-11-02T14:41:19.303Z",
      "user_name": "원티드"
    },
    {
      "_id": "6181600765fca41f325bf453",
      "contents": "댓글 2",
      "answers_array": [],
      "created_at": "2021-11-02T15:57:59.096Z",
      "user_name": "원티드"
    }
  ]
}
```

#### 3. POST /boards

##### request

```javascript
{
	"title": "공지사항입니다.",
	"contents": "공지사항 내용",
	"category": "공지"
}
```

##### response

```javascript
{
  "message": "게시글을 생성했습니다.",
  "data": {
    "user_id": "6181692768f70d7bcec5de04",
    "title": "공지사항입니다.",
    "contents": "공지사항 내용",
    "category": "공지",
    "comments_array": [],
    "_id": "61816bb468f70d7bcec5de0d",
    "view_cnt": [],
    "created_at": "2021-11-02T16:47:48.841Z",
    "updated_at": "2021-11-02T16:47:48.841Z",
    "__v": 0
  }
}
```

#### 4. PATCH /boards/:board_id

##### request

게시글의 `_id`를 board_id 파라미터, body 에 제목, 내용 또는 카테고리 중 하나를 작성하여 요청합니다.

```javascript
{
	"title": "두 번째 공지사항입니다.",
	"contents": "공지사항 내용2",
	"category": "공지"
}
```

##### response

```javascript
{
  "message": "수정을 완료했습니다."
}
```

#### 5. DELETE /boards/:board_id

##### request

입력은 게시글의 `_id`를 board_id 파라미터로 작성하여 요청합니다.

##### response

```javascript
{
  "message": "삭제를 완료했습니다."
}
```
  
### comments

댓글 작성 / 삭제 / 리스트

#### 1. POST /boards/:board_id/comments
  
board_id : 게시글의 `_id`

##### request

```javascript
{
    "contents": "댓글 내용"
}
```

##### response

```javascript
{
    "message": "댓글을 생성했습니다."
}
```
#### 2. DELETE /boards/:board_id/comments/:comment_id
board_id : 게시글의 `_id`
comment_id : 댓글의 `_id`
 
##### request



##### response

```javascript
{
    "message": "댓글을 삭제했습니다."
}
```
  
#### 3. GET /boards/:board_id/comments
board_id : 게시글의 `_id`


##### request



##### response

```javascript
{
    "count": 4,
    "data": [
        {
            "_id": "61814e0f0cdc3f8d91edccd8",
            "board_id": "6180a767248e314deac39bec",
            "contents": "내용 내용 내용 내용 내용 내용 내용 내용",
            "created_at": "2021-11-02T14:41:19.303Z",
            "answers_cnt": 0,
            "user_name": "원티드"
        },
        .
        .
        .
    ]
}
```
  
### answer

대댓글 작성 / 삭제 / 리스트

#### 1. POST /boards/:board_id/comments/:comment_id/answers
  
board_id : 게시글의 `_id`
comment_id : 댓글의 `_id`
  
##### request

```javascript
{
    "contents": "대댓글 내용"
}
```

##### response

```javascript
{
    "message": "댓글을 생성했습니다."
}
```
#### 2. DELETE /boards/:board_id/comments/:comment_id/answers/:answer_id
  
board_id : 게시글의 `_id`
comment_id : 댓글의 `_id`
answer_id : 대댓글의 `_id`  
##### request



##### response

```javascript
{
    "message": "댓글을 삭제했습니다."
}
```
  
#### 3. GET /boards/:board_id/comments/:comment_id/answers
board_id : 게시글의 `_id`
comment_id : 댓글의 `_id`
  
##### request



##### response

```javascript
{
    "count": 2,
    "data": [
        {
            "_id": "618171ebe6138977a731749c",
            "comment_id": "6181478e812f0f65694ab75c",
            "contents": "내용 내용 내용 내용 내용 내용 내용 내용",
            "created_at": "2021-11-02T17:14:19.948Z",
            "user_name": "원티드"
        },
        .
        .
        .
    ]
}
```


### **TIL 블로그 주소**

- [이현준] (https://supiz.tistory.com/)
- [박상현]
- [정진산] (https://chinsanchung.github.io/)
- [김태련] (https://velog.io/@code-link)
