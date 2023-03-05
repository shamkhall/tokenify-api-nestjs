import { DatabaseMessages } from './database-messages';

export function getErrorMessage(error): string {
  // Original message: 'Key (username)=(<value>) already exists.'

  const arrOfTableChar = error.table?.split('');
  arrOfTableChar?.pop();
  const table = arrOfTableChar
    ?.join('')
    ?.replace(arrOfTableChar[0], arrOfTableChar[0]?.toUpperCase());
  let message = error.detail?.replace(/\)=\(/g, ' = ')?.replace('Key', table);

  if (!message) message = 'Already exists';

  // Edited message: 'User (username = <value>) already exists'
  return message;
}

export function getColumns (error) {

  const columns = error?.detail?.match(/\([a-zA-Z_0-9]+\)/);

  if (!Array.isArray(columns)) {
    return [];
  }
  const column = columns[0]?.replace(/\(/g, '')?.replace(/\)/, '')

  return [column]
}

export function getErrorMessageByCode (code: string) {
  let message = DatabaseMessages[code];
  if(!message) message = 'Error';

  return message;
}
