export function lockPageScroll() {
  const html = document.documentElement;
  const body = document.body;
  const scrollY = window.scrollY;

  const previous = {
    bodyLeft: body.style.left,
    bodyMaxWidth: body.style.maxWidth,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyRight: body.style.right,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    htmlOverflow: html.style.overflow,
  };

  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.maxWidth = "100%";

  return () => {
    html.style.overflow = previous.htmlOverflow;
    body.style.overflow = previous.bodyOverflow;
    body.style.position = previous.bodyPosition;
    body.style.top = previous.bodyTop;
    body.style.left = previous.bodyLeft;
    body.style.right = previous.bodyRight;
    body.style.width = previous.bodyWidth;
    body.style.maxWidth = previous.bodyMaxWidth;

    window.scrollTo(0, scrollY);
  };
}
