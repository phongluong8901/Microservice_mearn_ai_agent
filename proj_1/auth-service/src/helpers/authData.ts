import { IUser } from "@/models/UserSchema";
import { signAccessToken, signRefreshToken } from "./jwt"

export async function authData(user: IUser) {
    const { password, ...restProps } = user.toObject()
    const [accessToken, refreshToken] = await Promise.all([
        signAccessToken(user?._id),
        signRefreshToken(user?._id)
    ])
    const data = {
        token: {
            accessToken: String(accessToken || ""),
            refreshToken: String(refreshToken || "")
        },
        user: {
            ...restProps,
            _id: user._id.toString(),
            name: restProps.name || ""
        },
        isLoggedIn: true
    }

    console.log('rest props: ', restProps)

    return data
}