export default interface Event {
  _id: string;
  title: string;
  creatorId?: string;
  description?: string;
  start: Date;
}
