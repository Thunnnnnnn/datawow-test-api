export class ApiResponseDto<T> {
    status: boolean;
    message?: string;
    data: T;
    code: number;

    constructor(data: T, code: number,) {
        this.status = true;
        this.code = code;
        this.data = data;
    }
}