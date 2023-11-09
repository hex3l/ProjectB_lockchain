import { Http2ServerRequest } from 'http2';
import { AppDataSource } from './data-source';
import { User } from './user/user.entity';
import { config } from 'dotenv';

(async () => {
  try {
    await AppDataSource.initialize();
    
    console.log('Inserting a new user into the database...');

    const user = new User();
    user.username = 'john_doe';
    user.password = 'password123';
    user.email = 'john.doe@example.com';
    user.walletID = '1234567890';

    await AppDataSource.manager.save(user);
    
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await AppDataSource.manager.find(User);
    console.log('Loaded users: ', users);

    console.log('Here you can setup and run express / fastify / any other framework.');
  } catch (err) {
    console.log(err);
  }
})();
