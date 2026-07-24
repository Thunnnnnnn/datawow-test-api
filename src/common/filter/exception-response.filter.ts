import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        if (status === 422) {
            return response.status(status).json({
                code: status,
                status: false,
                message:
                    typeof errorResponse === 'string'
                        ? errorResponse
                        : (errorResponse as any).message,
                errors: (errorResponse as any).errors.map((error) => ({
                    field: error.property,
                    message: Object.values(error.constraints ?? {})[0],
                })),
            });
        }

        response.status(status).json({
            code: status,
            status: false,
            message:
                typeof errorResponse === 'string'
                    ? errorResponse
                    : (errorResponse as any).message,
        });
    }
}
