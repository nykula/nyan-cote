import * as cote from "cote";

const client = new cote.Requester({ name: "Client" });
const log = console.log;

client.send({ type: "time" }, (time) => {
    log(time);
});
