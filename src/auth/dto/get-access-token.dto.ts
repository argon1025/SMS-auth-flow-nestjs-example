export class GetAccessTokenResponseDto {
  accessToken: string;

  constructor(required: Required<GetAccessTokenResponseDto>) {
    Object.assign(this, required);
  }
}
