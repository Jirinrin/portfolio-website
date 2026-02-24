import React, { forwardRef, useEffect, useState } from 'react';

import * as C from '../constants';
import { fetchProjectDescriptions } from '../store/projectsSlice';
import { changePage } from '../store/currentPageSlice';
import { useAppDispatch, useAppSelector } from '../store';

import boxDarkSmall from '../assets/box-dark-small.png';
import landscape2Img from '../assets/landscape/landscape-2.png';

interface Landscape2Props {
  scaleFactor: number;
  zoomInCanvas: (scroll?: number) => void;
  zoomOutCanvas: () => void;
  zoomIn: boolean;
  bottom: number;
  scrollDown: (smooth?: boolean, callback?: () => void) => void;
}

interface OpenedBook {
  book: HTMLElement;
  title: string;
  style: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
  imageFilter: string;
}

const Landscape2 = forwardRef<HTMLDivElement, Landscape2Props>(function Landscape2({ scaleFactor, zoomInCanvas, zoomIn, bottom, scrollDown }: Landscape2Props, ref) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(state => state.projects);

  const [bookHeight] = useState(C.LARGE_BASE_BOOK_HEIGHT);
  const [openedBook, setOpenedBook] = useState<OpenedBook | null>(null);
  const [bookShadow, setBookShadow] = useState<string | null>(null);

  useEffect(() => {
    if (!projects[0].description)
      dispatch(fetchProjectDescriptions());
    setBookShadow(C.calculateBookShadow('.book--large'));
    scrollDown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openedBook) zoomInCanvas(window.pageYOffset);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedBook]);

  useEffect(() => {
    if (openedBook && zoomIn) {
      zoomInBook();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomIn]);

  useEffect(() => {
    if (!zoomIn) setOpenedBook(null);
  }, [zoomIn]);

  const getPadding = () => bookHeight * C.LARGE_BOOK_PADDING_PART;
  const getCoverFontSize = () => bookHeight - getPadding() * 2;
  const getTextWidth = (baseWidth: number) => baseWidth * getCoverFontSize() + getPadding() * 2;

  const getStackWidthRange = (): [number, number] => {
    const range: [number, number] = [0, 0];
    projects.forEach(p => {
      if (p.book.xOffset < range[0]) range[0] = p.book.xOffset;
      if (p.book.xOffset + p.book.width > range[1]) range[1] = p.book.xOffset + p.book.width;
    });
    return range;
  };

  const getStackWidth = () => {
    const range = getStackWidthRange();
    return getTextWidth(range[1] - range[0]);
  };

  const setupBookZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    setOpenedBook({
      book: el,
      title: el.getElementsByTagName('p')[0].innerHTML,
      style: {
        left: el.style.left,
        top: el.style.top,
        width: el.style.width,
        height: el.style.height,
      },
      imageFilter: (el.getElementsByTagName('img')[0] as HTMLImageElement).style.filter,
    });
  };

  const zoomInBook = () => {
    const zoomBook = document.querySelector<HTMLElement>('#zooming-book');
    if (!zoomBook) return;
    const bookStack = zoomBook.parentNode?.parentNode as HTMLElement;
    if (!bookStack) return;

    const small = window.innerWidth <= 1400;
    zoomBook.style.left   = `calc(-1 * ${bookStack.style.left} + 2.5vw / ${scaleFactor})`;
    zoomBook.style.top    = `calc(-1 * ${bookStack.style.top.split('calc')[1]} + ${C.CANVAS_HEIGHT}px - (100vh - ${small ? 7.5 : 2.5}vw) / ${scaleFactor} - ${bottom / scaleFactor}px)`;
    zoomBook.style.width  = `calc(95vw / ${scaleFactor})`;
    zoomBook.style.height = `calc((100vh - ${small ? 15 : 5}vw) / ${scaleFactor})`;
    zoomBook.className += ' book--large__zoomed';

    const project = projects.find(p => openedBook && p.id === openedBook.book.id);
    if (!project) return;

    dispatch(changePage({
      popup: { type: 'project', project }
    }));
  };

  return (
    <div
      ref={ref}
      id="landscape-variant-container--2"
      className="bottom-container landscape-variant-container landscape--2"
      style={{
        transform: `scale(${scaleFactor}, ${scaleFactor})`,
        height: C.CANVAS_HEIGHT, width: C.CANVAS_WIDTH,
        bottom: -bottom
      }}
    >
      <div className="rel-container">
        <h2 className="landscape-name"> PROJECTS </h2>
        <img src={landscape2Img} className="landscape" id="landscape-2" alt="landscape 2" />

        <div
          id="book-stack--large"
          style={{
            left: C.LARGE_BOOK_BASE_LEFT,
            top: `calc(${C.LARGE_BOOK_BASE_BOTTOM}px - ${projects.length * bookHeight}rem)`,
            width: getStackWidth() + 'rem',
            height: bookHeight * projects.length + 'rem'
          }}
        >
          <div className="rel-container">
            {projects.map((p, i) =>
              <div
                className="book--large"
                key={`book--large-${i}`}
                id={p.id}
                style={{
                  height: bookHeight * 1.01 + 'rem',
                  width: getTextWidth(p.book.width) + 'rem',
                  top: p.book.yOffset * bookHeight + 'rem',
                  left: getTextWidth(p.book.xOffset) + 'rem'
                }}
                onClick={setupBookZoom}
              >
                <div className="rel-container">
                  <img
                    src={boxDarkSmall}
                    alt="book"
                    className="book--large__background"
                    style={{ filter: `brightness(${p.book.tintDeviation})` }}
                  />
                  <p
                    className="book--large__title"
                    style={{
                      fontSize: getCoverFontSize() + 'rem',
                      lineHeight: getCoverFontSize() * 1.2 + 'rem',
                    }}
                  >
                    <span className={`${p.book.tintDeviation < 1.5 ? 'dark-background' : (p.book.tintDeviation > 2.5 ? 'white-background' : '')}`}>
                      {p.title}
                    </span>
                  </p>
                </div>
              </div>
            )}
            {openedBook &&
              <div
                id="zooming-book"
                className="book--large book--large__zoomed"
                style={{
                  ...openedBook.style,
                  height: bookHeight * 1.01 + 'rem',
                }}
              >
                <div className="rel-container">
                  <img
                    src={boxDarkSmall}
                    alt="book"
                    className="book--large__background"
                    style={{ filter: openedBook.imageFilter }}
                  />
                </div>
              </div>
            }
            <div id="shadow-wrapper">
              <svg
                viewBox={`0 0 ${getStackWidth()} ${bookHeight * projects.length}`}
                width={getStackWidth() + 'rem'}
                height={bookHeight * projects.length + 'rem'}
                id="book-stack-svg">
                <path d={bookShadow ?? undefined} className="shadow book-stack-shadow--2" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Landscape2;
