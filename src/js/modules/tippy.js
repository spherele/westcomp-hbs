import tippy from 'tippy.js';

/* Vars */
// let tippyClickHandler = null;

/* Templates */
// const template = (a) => `
// <div> ${a} </div>
// `;

/* Functions */
const setPos = (instance) => {
  const placement = instance.reference.dataset.tippyPlacement || 'top';

  instance.setProps({ placement });
};

/* Tippies */
// default
const initDefaultTippy = () => {
  const $tippies = document.querySelectorAll('[data-tippy]');

  $tippies.forEach(($tippy) => $tippy._tippy && $tippy._tippy.destroy());

  tippy('[data-tippy]', {
    content: (ref) => ref.dataset.tippy,

    allowHTML: true,
    interactive: true,
    appendTo: document.body,

    onShow(instance) {
      setPos(instance);
    },
  });
};

/* Example */
// const initOtherTippy = () => {
//   const $tippies = document.querySelectorAll('[data-tippy-custom]');
//   tippy('[data-tippy-custom]', {...});
// };

const initAllTippy = () => {
  initDefaultTippy();
  // initOtherTippy();
};

window.initAllTippy = initAllTippy;

initAllTippy();
