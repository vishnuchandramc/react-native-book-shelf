/**
 * ResponseType Interface
 *
 * Represents the structure of a response object containing data and error-related information.
 *
 * @interface
 */
export default interface ResponseType {
  isError: boolean;
  response: IData;
  message: any;
}

/**
 * IData Interface
 *
 * Represents the structure of the data object within the ResponseType.
 *
 * @interface
 */
type IData = {
  data: any;
  message: string;
};

type Author = string[];

export type Book = {
  author: Author;
  cover_id?: number;
  edition_count: number;
  first_publish_year: number;
  id: string;
  title: string;
  cover_img: string | null;
};
export type BookDetails = {
  author: Author;
  cover_id?: number;
  edition_count: number;
  first_publish_year: number;
  id: string;
  title: string;
  cover_img: string | null;
  description: string | null;
  subjects: string | null;
  subject_places: string | null;
};
