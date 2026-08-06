export declare class AppController {
    getHealthCheck(): {
        message: string;
        services: string[];
    };
    getHealth(): {
        status: string;
        service: string;
    };
}
