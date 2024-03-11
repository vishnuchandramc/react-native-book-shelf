import db from './Database';

// insertion of user data into the table
export const insertFavorites = (bookInfo: any): Promise<any> => {
  //console.log(request, '--res');
  return new Promise(async (resolve, reject) => {
    const INSERT_APP_SETTINGS = `REPLACE INTO favorites(book_item) VALUES(?)`;

    db.transaction((txn: any) => {
      txn.executeSql(
        INSERT_APP_SETTINGS,
        [bookInfo.BookInfo],
        (_: any, success: any) => {
          resolve({
            isError: false,
            message: 'Successfully inserted',
            success: success,
          });
        },
        (error: any) => {
          console.log(error, '--error');
          reject({
            isError: true,
            error,
            message: 'Error on insertion',
          });
        },
      );
    });
  });
};
