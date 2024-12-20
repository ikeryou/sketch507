import { MyDisplay } from '../core/myDisplay';
import { Parts } from './parts';
import './style.css'

export class Main extends MyDisplay {
  constructor(opt: any) {
    super(opt);

    const org = this.qs('.l-main-item');
    org.remove();

    const num = 10
    for (let i = 0; i < num; i++) {
      const el = org.cloneNode(true) as HTMLElement;
      this.el.appendChild(el);
      new Parts({
        el: el,
        dispId: i,
      });
    }
  }
}


document.querySelectorAll('.l-main').forEach((el) => {
  new Main({
    el: el,
  })
})
