import {TINY_BOOK_BASE_BOTTOM, TINY_BOOK_HEIGHT} from './BOOKS';

export const getTinyBookStackTop = (size) => TINY_BOOK_BASE_BOTTOM - size * TINY_BOOK_HEIGHT;

export const calculateBookShadow = (bookClassName) => {
  const $ = (px) => parseFloat(px);
  
  const books = document.querySelectorAll(bookClassName);

  console.log(books);

  let path = `M ${$(books[0].style.left)}, ${$(books[0].style.top) + $(books[0].style.height)}`;
  books.forEach((b, i) => {
    console.log(b.style.left, b.style.top);
    if (i !== 0)
      path += ` L ${$(b.style.left)}, ${$(b.style.top) + $(b.style.height)}`;
    path += ` L ${$(b.style.left)}, ${$(b.style.top)}`;
  });
  books.forEach((_, i) => {
    const b = books[books.length - 1 - i];
    path += ` L ${$(b.style.left) + $(b.style.width)}, ${$(b.style.top)}`;
    path += ` L ${$(b.style.left) + $(b.style.width)}, ${$(b.style.top) + $(b.style.height)}`;
  });

  path += 'Z'; // for closing it, leave out last linedraw

  return path;
}