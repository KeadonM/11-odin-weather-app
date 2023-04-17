export function runAddScrollEvents() {
  const scrollableContainers = document.querySelectorAll('.scrollable');

  scrollableContainers.forEach((scrollableContainer) => {
    addScrollEvents(scrollableContainer);
  });

  function addScrollEvents(scrollableContainer) {
    let isMouseDown = false;
    let start;

    const getScrollDirection = () => {
      return scrollableContainer.scrollHeight > scrollableContainer.clientHeight
        ? 'y'
        : 'x';
    };

    const setChildPointerEvents = (value) => {
      const childElements = scrollableContainer.getElementsByTagName('*');
      for (const childElement of childElements) {
        childElement.style.pointerEvents = value;
      }
    };

    scrollableContainer.addEventListener('mousedown', (event) => {
      isMouseDown = true;
      const scrollDirection = getScrollDirection();
      start = scrollDirection === 'y' ? event.clientY : event.clientX;
    });

    scrollableContainer.addEventListener('mousemove', (event) => {
      if (!isMouseDown) return;

      const scrollDirection = getScrollDirection();
      const current = scrollDirection === 'y' ? event.clientY : event.clientX;
      const delta = current - start;

      if (scrollDirection === 'y') {
        scrollableContainer.scrollTop -= delta;
      } else {
        scrollableContainer.scrollLeft -= delta;
      }
      setChildPointerEvents('none');

      start = current;
    });

    scrollableContainer.addEventListener('mouseup', () => {
      isMouseDown = false;
      setChildPointerEvents('');
    });

    scrollableContainer.addEventListener('mouseleave', () => {
      isMouseDown = false;
      setChildPointerEvents('');
    });
  }
}
