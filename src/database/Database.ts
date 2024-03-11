// @ts-ignore
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'book.sqlite',
    location: 'default',
    createFromLocation: 1,
  },
  (res: unknown) => {
    console.log('Successfully populated the database => ', res);
  },
  (error: unknown) => {
    console.log('Unable to populate database ', error);
  },
);

export default db;
