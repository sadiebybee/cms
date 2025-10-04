export class Message {
  public id: string;
  public subject: string;
  public msgText: string;
  public sender: string;

  constructor(id: string, subject: string, msgText: string, sender: string) {
    this.id = id;
    this.subject = subject;
    this.msgText = msgText;
    this.sender = sender;
  }
}

// id—the id of the message

// subject—the subject of the message

// msgText—the text of the message

// sender—the sender of the message
