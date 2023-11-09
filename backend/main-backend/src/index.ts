import { Http2ServerRequest } from 'http2';
import { AppDataSourceBuilder } from './data-source';
import { User } from './user/user.entity';
import { config } from 'dotenv';

(async () => {
  try {
    const dataSource = AppDataSourceBuilder();
    await dataSource.initialize();

    console.log('Inserting a new user into the database...');

    const user = new User();
    user.username = 'john_doe';
    user.password = 'password123';
    user.email = 'john.doe@example.com';
    user.walletID = '1234567890';

    await dataSource.manager.save(user);

    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await dataSource.manager.find(User);
    console.log('Loaded users: ', users);

    console.log('Here you can setup and run express / fastify / any other framework.');
  } catch (err) {
    console.log(err);
  }
})();
