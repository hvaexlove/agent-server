export default class BusinessException extends Error {

    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }

    getMessage() :string {
        return this.message;
    }

    getCode() :number {
        return this.code;
    }

}