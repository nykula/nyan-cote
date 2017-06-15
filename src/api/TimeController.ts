import { TimeRepository } from "../logic/TimeRepository";
import { Requester } from "../utils/Requester";

export class TimeController {
    public log = console.log;

    public timeRepository = Requester.get(TimeRepository);

    public async componentDidMount() {
        const time = await this.timeRepository.getOne();
        this.log(time);
    }
}
