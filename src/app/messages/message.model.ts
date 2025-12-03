export class Message {
  public id: string;
  public subject: string;
  public msgText: string;
  public sender: string;
  public _id?: string;

  constructor(
    id: string,
    subject: string,
    msgText: string,
    sender: string,
    _id?: string
  ) {
    this.id = id;
    this.subject = subject;
    this.msgText = msgText;
    this.sender = sender;
    this._id = _id;
  }
}
