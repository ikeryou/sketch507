import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Rect } from "../libs/rect";
import { Point } from "../libs/point";
import { Util } from "../libs/util";

// -----------------------------------------
//
// -----------------------------------------
export class Segment extends MyDisplay {

  private _rot:number = 0; // 度数表記
  private _pos:Point = new Point();
  private _size:Rect = new Rect();

  constructor(opt:any) {
    super(opt)
    this._resize();
  }


  public setRot(val:number): void {
    this._rot = val;
  }


  public getRot(): number {
    return this._rot;
  }


  public setPos(x:number, y:number): void {
    this._pos.x = x;
    this._pos.y = y;
  }


  public getPos(): Point {
    return this._pos;
  }


  public getPin(): Point {
    const radian = Util.radian(this._rot);
    const x = this._pos.x + Math.cos(radian) * this._size.width;
    const y = this._pos.y + Math.sin(radian) * this._size.width;

    return new Point(x, y);
  }


  protected _resize(): void {
    super._resize();

    const itemW = 11;
    const itemH = itemW;

    this._size.width = itemW;
    this._size.height = itemH;

    Tween.set(this.el, {
      width: this._size.width,
      height: this._size.height,
    })
  }
}
