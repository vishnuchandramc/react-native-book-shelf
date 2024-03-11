/**
 * Fetches a list of books based on the search criteria.
 * @param searchCriteria - The criteria used for searching books.
 * @param signal - The AbortSignal to allow cancellation of the request.
 * @returns A Promise that resolves to the response data or rejects with an error.
 */
import {ERRORMESSAGES} from '../constants/AppConstants';
import {isConnected} from '../helpers/NetworkUtils';
import ResponseType from '../models/ResponseType';
import {BASE_URL, DETAILS_URL} from '../constants/Endpoints';
import * as ApiServices from '../services/Api';

export const getBooksList = async (
  searchCriteria: string,
  signal: any,
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check network connectivity
      const connectionStatus: any = await isConnected();
      if (connectionStatus) {
        // Make API request to fetch books list
        const response = await ApiServices.get(
          `${BASE_URL}${searchCriteria}`,
          signal,
        );
        console.log('data---', response);

        if (response && typeof response === 'object' && 'docs' in response) {
          const {docs}: any = response;
          const newBooks = docs.slice(0, 20).map((book: any) => {
            const {
              key,
              author_name,
              cover_i,
              edition_count,
              first_publish_year,
              title,
            } = book;

            return {
              id: key.replace('/works/', ''),
              author: author_name,
              cover_id: cover_i,
              edition_count: edition_count,
              first_publish_year: first_publish_year,
              title: title,
              cover_img: cover_i
                ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`
                : null,
            };
          });
          console.log('New book---', newBooks);

          let success: ResponseType = {
            isError: false,
            response: {data: newBooks, message: 'Success'},
            message: 'Data fetched successfully',
          };
          resolve(success);
        } else {
          let failed: ResponseType = {
            isError: true,
            response: {data: null, message: ''},
            message: 'Unexpected Error occured',
          };
          reject(failed);
        }
      } else {
        // No network connectivity
        let failed: ResponseType = {
          isError: true,
          response: {data: null, message: ''},
          message: ERRORMESSAGES.CHECK_NETWORK,
        };
        reject(failed);
      }
    } catch (error: any) {
      console.log('errror---', error);

      let failed: ResponseType = {
        isError: true,
        response: {data: null, message: ''},
        message: ERRORMESSAGES.SOMETHING_WENT_WRONG,
      };
      reject(failed);
    }
  });
};

export const getBookDetails = async (id: string, signal: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const connectionStatus: any = isConnected();
      if (connectionStatus) {
        const response = await ApiServices.get(
          `${DETAILS_URL}${id}.json`,
          signal,
        );
        console.log('data---', response);
        if (response && typeof response === 'object') {
          const {
            description,
            title,
            covers,
            subject_places,
            subject_times,
            subjects,
          }: any = response;
          const bookData = {
            description: description
              ? description.value
              : 'No description found',
            title: title,
            cover_img: covers
              ? `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg`
              : null,
            subject_places: subject_places
              ? subject_places.join(', ')
              : 'No subject places found',
            subject_times: subject_times
              ? subject_times.join(', ')
              : 'No subject times found',
            subjects: subjects ? subjects.join(', ') : 'No subjects found',
          };
          let success: ResponseType = {
            isError: false,
            response: {data: bookData, message: 'Success'},
            message: 'Data fetched successfully',
          };
          resolve(success);
        } else {
          let failed: ResponseType = {
            isError: true,
            response: {data: null, message: ''},
            message: 'Unexpected Error occured',
          };
          reject(failed);
        }
      } else {
        let failed: ResponseType = {
          isError: true,
          response: {data: null, message: ''},
          message: ERRORMESSAGES.CHECK_NETWORK,
        };
        reject(failed);
      }
    } catch (error: any) {
      console.log('errror---', error);

      let failed: ResponseType = {
        isError: true,
        response: {data: null, message: ''},
        message: ERRORMESSAGES.SOMETHING_WENT_WRONG,
      };
      reject(failed);
    }
  });
};
