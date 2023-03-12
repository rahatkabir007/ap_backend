// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
export class LoginUserDto {
    fullName: string
    email: string
    token: string
    tokenType: "facebook" | "google"
    avatar?: string
    slug?: string
}
