import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { encryptPassword } from 'src/utils/password-util';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(e: InsertEvent<User>) {
    if (e.entity.password) {
      e.entity.password = await encryptPassword(e.entity.password);
    }
  }
}
