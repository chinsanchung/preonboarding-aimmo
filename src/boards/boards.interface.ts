export interface ICreateBoardDto {
  readonly user_id: string;
  readonly title: string;
  readonly contents: string;
  readonly category: string;
}
