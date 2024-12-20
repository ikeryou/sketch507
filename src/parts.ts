import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';
import { MyDisplay } from '../core/myDisplay';
import { DisplayConstructor } from '../libs/display';
import { Util } from '../libs/util';
import { Func } from '../core/func';
import { Tween } from '../core/tween';
import { Segment } from './segment';

export class Parts extends MyDisplay {

  private _t: HTMLElement
  private _segment:Array<Segment> = [];
  private _route: Array<Vector3> = []
  private _now: number = 0
  private _wait: number = 30 + Util.randomInt(30, 40)

  constructor(opt: DisplayConstructor) {
    super(opt);

    this._t = this.qs('.l-main-item-text')
    this._t.textContent = ''

    const t = ['namename', 'companycompany', 'addressaddress', 'teltel', 'mailmail', 'namename', 'companycompany', 'addressaddress', 'teltel', 'mailmail'][opt.dispId || 0]

    // spanで区切る
    const tList = t.split('')
    tList.forEach((t) => {
      const el = document.createElement('span');
      el.textContent = t;

      const seg = new Segment({
        el: el,
      })
      this._segment.push(seg);

      this._t.appendChild(el);
    })
    this._segment.reverse()

    this._makeRoute()
  }

  protected _makeRoute(): void {
    const arr: Vector3[] = []
    
    const sw = Func.sw()
    const sh = Func.sh()
    const fontSize = 11

    const defX = fontSize * this._segment.length

    arr.push(new Vector3(defX, 0, 0))
    arr.push(new Vector3(defX, 0, 0))
    arr.push(new Vector3(defX, 0, 0))
    arr.push(new Vector3(defX, 0, 0))
    arr.push(new Vector3(defX, 0, 0))
    arr.push(new Vector3(defX, 0, 0))

    if(Util.hit(2)) {
      const xRange = sw * Util.random(0.1, 0.25) * (Util.hit(2) ? 1 : -1)
      const yIt = sh * 0.25 * (Util.hit(2) ? 1 : -1)

      arr.push(new Vector3(defX + 0, yIt, 0))
      arr.push(new Vector3(defX + xRange, yIt * 2, 0))
      arr.push(new Vector3(defX + 0, yIt * 3, 0))
      arr.push(new Vector3(defX + sw * 0.25, yIt * 5, 0))
    } else {
      const yRange = sw * Util.random(0.01, 0.05) * (Util.hit(2) ? 1 : -1)
      const xIt = sw * 0.25

      arr.push(new Vector3(defX + xIt, yRange, 0))
      arr.push(new Vector3(defX + xIt * 2, -yRange, 0))
      arr.push(new Vector3(defX + xIt * 3, yRange * 2, 0))
      arr.push(new Vector3(defX + xIt * 5, -yRange, 0))
    }

    const curve:CatmullRomCurve3 = new CatmullRomCurve3(arr, false);
    const tube = new TubeGeometry(curve, 128, 1, 3, false);
    this._route = tube.parameters.path.getPoints(128 * 3)
  }


  // 更新
  protected _update(): void {
    super._update();

    if(this._now == -1) return

    const tgPos = this._route[this._now]

    this._segment.forEach((val,i) => {
      let x = 0;
      let y = 0;
      let dx;
      let dy;
      let prev;

      if(i == 0) {
        dx = tgPos.x - val.getPos().x;
        dy = tgPos.y - val.getPos().y;
      } else {
        prev = this._segment[i - 1];
        dx = prev.getPos().x - val.getPos().x;
        dy = prev.getPos().y - val.getPos().y;
      }

      const radian = Math.atan2(dy, dx); // ラジアン
      val.setRot(Util.degree(radian)); // 度に変換

      const w = val.getPin().x - val.getPos().x
      const h = val.getPin().y - val.getPos().y

      if(i == 0) {
        x = tgPos.x - w;
        y = tgPos.y - h;
      } else {
        if(prev != undefined) {
          x = prev.getPos().x - w;
          y = prev.getPos().y - h;
        }
      }

      // 要素に反映
      Tween.set(val.el, {
        x:x,
        y:y,
        rotationZ:val.getRot()
      })

      val.setPos(x, y);
    })

    if(this._c > this._wait) this._now += 2
    if(this._now >= this._route.length) {
      this._now = -1
      Tween.set(this._t, {
        display: 'none'
      })
    }
  }
}

