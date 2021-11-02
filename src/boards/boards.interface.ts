export interface ICreateBoardDto {
  readonly user_id: string;
  readonly title: string;
  readonly contents: string;
  readonly category: string;
}

export interface IUpdateBoardDto {
  readonly user_id: string;
  readonly board_id: string;
  readonly updateQuery: {
    readonly title?: string;
    readonly contents?: string;
    readonly category?: string;
  };
}

export interface ICheckAuthToBoardInput {
  user_id: string;
  board_id: string;
}
export interface ICheckAuthToBoardOutput {
  ok: boolean;
  error?: string;
}
