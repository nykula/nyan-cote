import { Responder } from "../utils/Responder";

@Responder()
export class TimeRepository {
    public getOne(req?: any) {
        return new Date();
    }
}
