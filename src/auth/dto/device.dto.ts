type Params = {
    browser: string;
    browserMajor: string;
    imei: string;
    userAgent: string;
}

export class DeviceDto {
    osName: string;
    osMajor: string;
    params: Params;
}
