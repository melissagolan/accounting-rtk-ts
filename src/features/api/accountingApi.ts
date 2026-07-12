import type {UserProfile, UserRegister, UserUpdate} from "../../utils/types";
import {BASE_URL} from "../../utils/constants.ts";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const accountingApi = createApi({
    reducerPath: "accountingApi",
    tagTypes : ['profile'],
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: builder => ({
        registerUser: builder.mutation<UserProfile, UserRegister>({
            query: user => ({
                url: '/account/register',
                method: 'POST',
                body: user
            })
        }),
        fetchUser: builder.query<UserProfile, string>({
            query: token => ({
                url: '/account/login',
                method: 'POST',
                headers: {
                    Authorization: token
                }
            }),
            providesTags:['profile'],
        }),
        updateUser: builder.mutation<UserProfile, { user: UserUpdate, login: string, token: string }>({
            query: ({user, login, token}) => ({
                url: `/account/user/${login}`,
                method: 'PATCH',
                body: user,
                headers: {
                    Authorization: token
                }
            }),
            invalidatesTags: ['profile'],
        }),
        changePassword: builder.mutation<void, { newPassword: string, token: string }>({
            query: ({newPassword, token}) => ({
                url: '/account/password',
                method: 'PATCH',
                body: {password: newPassword},
                headers: {
                    Authorization: token
                }
            })
        })
    })
})

export const {useRegisterUserMutation, useLazyFetchUserQuery , useFetchUserQuery, useChangePasswordMutation, useUpdateUserMutation} = accountingApi

// export const registerUser = createAsyncThunk(
//     'user/register',
//     async (user: UserRegister) => {
//         const response = await fetch(`${BASE_URL}/account/register`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(user)
//         })
//         if (response.status === 409) {
//             throw new Error(`User with login ${user.login} already exists`)
//         }
//         if (!response.ok) {
//             throw new Error(`Error registering user: ${response.statusText}`)
//         }
//         const data = await response.json();
//         const token = createToken(user.login, user.password);
//         return {
//             token,
//             user: data
//         }
//     }
// )
//
// export const fetchUser = createAsyncThunk
// (
//     'user/fetch',
//     async (token: string) => {
//         const response = await fetch(`${BASE_URL}/account/login`, {
//             method: 'POST',
//             headers: {
//                 Authorization: token
//             }
//         })
//         if (response.status === 401) {
//             throw new Error(`Invalid credentials`)
//         }
//         if (!response.ok) {
//             throw new Error(`Something went wrong`);
//         }
//         const user = await response.json();
//         return {user, token};
//     }
// )
//
// export const updateUser = createAsyncThunk<UserUpdate, UserUpdate, { state: RootState }>(
//     'user/update', async (user, {getState}) => {
//         const response = await fetch(`${BASE_URL}/account/user/${getState().user.login}`, {
//             method: "PATCH",
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: getState().token
//             },
//             body: JSON.stringify(user)
//         })
//         if (response.status === 401) {
//             throw new Error(`Invalid credentials`)
//         }
//         if (!response.ok) {
//             throw new Error(`Something went wrong`);
//         }
//         const data = await response.json();
//         return {firstName: data.firstName, lastName: data.lastName};
//     }
// )
//
// export const changePassword = createAsyncThunk<string, { newPassword: string, oldPassword: string }, {
//     state: RootState
// }>
// ('user/password', async ({newPassword, oldPassword}, {getState}) => {
//     const response = await fetch(`${BASE_URL}/account/password`, {
//         method: "PATCH",
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: createToken(getState().user.login, oldPassword)
//         },
//         body: JSON.stringify({password: newPassword})
//     })
//     if (response.status === 401) {
//         throw new Error(`Invalid credentials`)
//     }
//     if (!response.ok) {
//         throw new Error(`Something went wrong`);
//     }
//     return createToken(getState().user.login, newPassword);
//
// })