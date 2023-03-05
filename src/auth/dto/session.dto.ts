import {Expose} from "class-transformer";

export class SessionDto {
    @Expose({name: 'session_id'})
    sessionId: number;
    @Expose({name: 'device_id'})
    deviceId: number;
    @Expose({name: 'user_id'})
    userId: number;
    @Expose({name: 'refresh_token'})
    refreshToken: string;
    @Expose({name: 'ip_address'})
    ipAddress: string;
    @Expose({name: 'created_at'})
    createdAt: Date;
}
