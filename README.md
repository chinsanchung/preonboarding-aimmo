## 프리온보딩 백엔드 과정 1번째 과제: 에이모

[에이모](https://aimmo.co.kr)에서 제공해주신 API 설계 과제입니다. 헤로쿠를 이용해 배포했으며, 주소는 [ https://nodeswork-boards-server.herokuapp.com](https://nodeswork-boards-server.herokuapp.com)입니다.

## 과제에 대한 안내

게시판 API 를 만드는 과제입니다.

- 유저 생성, 인증, 인가 처리 (게시글 수정, 삭제 부분은 인가된 사용자만 가능)
- 게시글 카테고리
- 게시글 검색
- 대댓글(1 depth)
  - 대댓글 pagination
- 게시글 읽힘 수
  - 같은 User가 게시글을 읽는 경우 count 수가 증가하면 안됩니다.
- Rest API 설계
- Unit Test
- 1000만건 이상의 데이터를 넣고 성능테스트 진행 결과가 필요합니다.
- 데이터베이스는 MongoDB 를 필수로 사용합니다.

## 데이터베이스 ERD

![에이모 API ERD](https://github.com/lhj0621/imagetemp/blob/master/2021-11-03%2004;10;50.PNG?raw=true)

## 개발 환경

- 언어: TypeScript
- 데이터베이스: MongoDB
- 사용 도구: Express, mongoose, jsonwebtoken, joi

## API 문서

포스트맨으로 작성한 [API 문서](https://documenter.getpostman.com/view/15323948/UV5ddEGU)에서 상세한 내용을 확인하실 수 있습니다.

## 실행 방법

**in-memory 가 아닌, 실제 Mongo Atlas 데이터베이스를 연결했기 때문에 로컬에서의 실행을 권장하지 않습니다.**

1. `git clone` 으로 프로젝트를 가져온 후, `npm install` 으로 필요한 패키지를 설치합니다.
2. 루트 디렉토리에 .env 파일을 생성하고, `MONGO_URI`에 Mongo Atlas 데이터베이스의 connection string 을 기입합니다.
3. 개발 환경일 때는`npm run dev`으로, 배포 환경일 때는 `npm run build`으로 빌드한 후 `npm start`을 입력하시면 로컬에서 테스트하실 수 있습니다.

## 수행한 작업

### 데이터베이스 연결 및 스키마 작성

애플리케이션과 MongoDB Atlas 를 연결하고, ERD 를 참고하여 유저, 게시글, 댓글, 대댓글 스키마를 작성했습니다.

### jwt 토큰으로 로그인 여부를 인증하는 미들웨어 작성

jsonwebtoken 쿠키 `access_token`을 해석하여 로그인한 유저의 정보를 request 에 포함시키는 `getUserInfoFromToken`, `verifyUser` 미들웨어를 작성했습니다.

`getUserInfoFromToken` 메소드는 토큰이 없더라도 `next()`를 통해 다음 기능을 수행하지만, `verifyUser` 메소드는 토큰이 없으면 403 상태 코드를 응답으로 보냅니다.

```typescript
const getUserInfoFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['access_token'];
  if (!token) {
    next();
  } else {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as unknown;

    // @ts-ignore
    const email = data.email;
    const user = await UserModel.findOne({ email }).select('_id').lean();
    // console.log("USER: ", user);
    // @ts-ignore
    req.user = user;
    next();
  }
};

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['access_token'];
  if (!token) {
    return res.status(403).json({ message: '로그인이 필요합니다.' });
  } else {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as unknown;

    // @ts-ignore
    const email = data.email;
    const user = await UserModel.findOne({ email }).select('_id').lean();
    // console.log("USER: ", user);
    // @ts-ignore
    req.user = user;
    next();
  }
};
```

### 게시글 CRUD

1. 게시글 등록: title, contents, category 을 입력하여 게시글을 등록 또는 수정합니다. 로그인을 통해 얻은 `access_token`을 쿠키에 저장해야 등록이 가능합니다. [joi](https://www.npmjs.com/package/joi)를 이용해 request body 프로퍼티를 검증합니다.

2. 게시글 수정 및 삭제

- `checkAuthToBoard` 메소드를 통해 실제로 존재하는 글인지, 이미 삭제한 글인지, 또는 로그인한 유저가 글의 작성자인지를 확인하는 과정을 거칩니다.

```typescript
interface ICheckAuthToBoardInput {
  user_id: string;
  board_id: string;
}
interface ICheckAuthToBoardOutput {
  ok: boolean;
  error?: string;
}

async function checkAuthToBoard({
  user_id,
  board_id,
}: ICheckAuthToBoardInput): Promise<ICheckAuthToBoardOutput> {
  try {
    const board = await BoardModel.findOne({ _id: board_id })
      .select('user_id deleted_at')
      .lean();
    if (!board) return { ok: false, error: '일치하는 글이 없습니다.' };
    if (Object.prototype.hasOwnProperty.call(board, 'deleted_at')) {
      return { ok: false, error: '이미 삭제한 게시글입니다.' };
    }
    if (board?.user_id.equals(user_id)) {
      return { ok: true };
    } else {
      return { ok: false, error: '오직 작성자만 글에 접근할 수 있습니다.' };
    }
  } catch (error) {
    Log.error('인증 실패');
    return { ok: false, error: '인증 실패' };
  }
}
```

3. 게시글 목록 및 특정 게시글의 상세 조회

- aggregate 메소드의 `$lookup`을 이용해 작성한 유저의 이메일과 이름을 가져옵니다. 이 쿼리문은 writerInfoQuery 라는 변수에 담아 게시글 목록 및 상세 조회에서 활용하여 재사용성을 높였습니다.

```typescript
const writerInfoQuery = [
  {
    $lookup: {
      from: 'users',
      let: { user_id: '$user_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
        {
          $project: {
            _id: 0,
            email: '$email',
            name: '$name',
          },
        },
      ],
      as: 'userInfo',
    },
  },
  { $unwind: '$userInfo' },
];
```

- 목록 조회: `$skip`, `$limit`으로 pagination 을 구현했습니다. 또한 `RegExp` 객체, `$match`와 `$and`를 이용해 제목, 내용 또는 제목 + 내용을 검색한 결과를 출력합니다.

```typescript
const andOption: any[] = [{ deleted_at: { $eq: null } }];
if (title) {
  const regexTitle = new RegExp(title, 'i');
  andOption.push({ title: regexTitle });
}
if (contents) {
  const regexContents = new RegExp(contents, 'i');
  andOption.push({ contents: regexContents });
}
const count = await BoardModel.find({
  $and: andOption,
}).countDocuments();
const response = await BoardModel.aggregate([
  { $match: { $and: andOption } },
  { $skip: offset },
  { $limit: limit },
  ...this.writerInfoQuery,
  {
    $project: {
      _id: 1,
      title: 1,
      contents: 1,
      view_cnt: { $size: '$view_cnt' },
      created_at: 1,
      comments_cnt: { $size: '$comments_array' },
      user_name: '$userInfo.name',
    },
  },
]);

return { count, data: response };
```

- 상세 조회: URI 파리미터에 입력한 게시글의 ObjectId 으로 특정 게시글과 댓글 목록을 조회합니다. 조회를 하기 전, 우선 `findOne` 메소드로 게시글의 조회 항목을 불러와 조회수 증가 로직을 수행합니다. 같은 유저가 이전에 조회했던 게시글에 대해 조회수를 중복으로 늘리지 않도록 조건문을 추가했습니다.

```typescript
const post = await BoardModel.findOne({ _id: board_id });
if (!post?.view_cnt.find((obj) => obj.user_id.equals(user_id))) {
  await BoardModel.updateOne(
    { _id: board_id },
    {
      $push: { view_cnt: { user_id: user_id, view_date: new Date() } },
    }
  );
}
```

### 코드 리펙토링

### 유저 컨트롤러, 서비스 수정

1. 요청과 응답 외 수행하고 있던 기능을 유저 서비스로 이전했습니다.

유저 컨트롤러는 요청과 응답만을 관리해야 한다고 생각합니다. 기존에는 계정 존재 여부, 이메일 검증, 비밀번호 검증 등 많은 기능이 컨트롤러에 담겨있는데 그것을 전부 유저 서비스로 이전했습니다.

이제 컨트롤러는 요청에서 들어온 값을 검증해 서비스로 보내고, 서비스에서 얻은 결과를 응답으로 보내는 기능만을 수행합니다.

2. 서비스의 리턴 타입을 수정해 컨트롤러에서 성공과 에러 관리를 하도록 설정했습니다.

common/interface/output.interface.ts 에 아래와 같은 인터페이스를 선언했습니다. 회원 가입은 `IOutput`, 로그인은 토큰을 data 로 하는 `IOutputWithData`를 리턴 타입으로 가집니다.

```typescript
export interface IOutput {
  ok: boolean;
  httpStatus?: number;
  error?: string;
}

export interface IOutputWithData<DataType> extends IOutput {
  data?: DataType;
}
```

회원 가입을 에시로 들자면, 이메일이 중복이거나 에러가 발생했을 때 `ok: false`를, 가입에 성공했을 때 `ok: true`를 보내며 컨트롤러에서 이 결과를 받아 응답으로 보내는 형식입니다. 성공과 실패 그리고 오류를 제 손으로 직접 관리할 수 있다는 이점이 있어 이 방식을 택했습니다.

```typescript
// users.service.ts 의 signup 메소드
try {
  const existUser = await UserModel.findOne({ email }).lean();
  if (existUser) {
    return {
      ok: false,
      httpStatus: 400,
      error: '이미 가입되어 있는 이메일 입니다.',
    };
  }
  const hashPassword = await bcrypt.hash(password, 10);
  await UserModel.create({
    email,
    password: hashPassword,
    name,
    created_at: Date.now(),
  });

  return { ok: true };
} catch (error) {
  return {
    ok: false,
    httpStatus: 500,
    error: '회원 가입 과정에서 에러가 발생했습니다.',
  };
}
```

```typescript
// users.controller.ts signup 메소드에서 위의 결과를 받아 처리합니다.
const result = await this.userService.signup({ email, password, name });
if (result.ok) {
  return res.status(201).send({ message: '가입이 완료되었습니다.' });
}

const error = createError(result.httpStatus!, result.error!);
next(error);
return;
```

### jsonwebtoken 의 secretKey 를 가져오는 방식 수정

기존에는 깃허브 레포지토리에 공개되어 있는 config/config.ts 에서 secretKey 를 가져오고 있었는데, 토큰 발급과 해석에 활용하는 이 키를 외부에 공개해서는 안된다고 생각했습니다. 그래서 .env 의 `JWT_SECRET`에 임의의 문자열을 추가하고, [dotenv](https://www.npmjs.com/package/dotenv)으로 sercretKey 를 가져오도록 했습니다.

이제 유저 서비스 `signin` 메소드의 토큰 발급, 그리고 `getUserInfoFromToken`, `verifyUser` 미들웨어에서 토큰을 입증할 때 `process.env.JWT_SECRET`으로 키를 가져와 작업을 진행합니다.

## 폴더 구조

```
.
├── README.md
├── package-lock.json
├── package.json
├── src
│   ├── @types
│   │   └── index.ts
│   ├── answers
│   │   ├── answers.controller.ts
│   │   └── answers.service.ts
│   ├── boards
│   │   ├── boards.controller.ts
│   │   ├── boards.interface.ts
│   │   └── boards.service.ts
│   ├── comments
│   │   ├── comments.controller.ts
│   │   └── comments.service.ts
│   ├── config
│   │   └── config.ts
│   ├── core
│   │   ├── app.ts
│   │   └── database.ts
│   ├── index.ts
│   ├── middlewares
│   │   ├── getUserInfoFromToken.ts
│   │   └── verifyUser.ts
│   ├── model
│   │   ├── answers.model.ts
│   │   ├── boards.model.ts
│   │   ├── comments.model.ts
│   │   └── users.model.ts
│   ├── routes
│   │   ├── answers.routers.ts
│   │   ├── boards.routers.ts
│   │   ├── comments.routers.ts
│   │   ├── index.ts
│   │   └── users.routers.ts
│   ├── users
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   └── utils
│       ├── createError.ts
│       ├── debugger.ts
│       └── joiValidate.ts
└── tsconfig.json
```
