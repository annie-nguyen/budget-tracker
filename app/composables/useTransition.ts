export function useTransition() {
  function onEnter(el: Element, done: () => void) {
    const element = el as HTMLElement
    const height = element.scrollHeight

    element.style.height = '0px'

    element.animate(
      [{ height: '0px' }, { height: height + 'px' }],
      { duration: 300, easing: 'ease', fill: 'forwards' }
    ).onfinish = () => {
      element.style.height = height + 'px'
      done()
    }
  }

  function onLeave(el: Element, done: () => void) {
    const element = el as HTMLElement
    const height = element.offsetHeight

    element.animate(
      [{ height: height + 'px' }, { height: '0px' }],
      { duration: 300, easing: 'ease', fill: 'forwards' }
    ).onfinish = () => {
      element.style.height = '0px'
      done()
    }
  }

  return {
    onEnter,
    onLeave
  }
}